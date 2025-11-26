import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Plus,
  Sun,
  Moon,
  ListFilter,
  LayoutGrid,
  List,
  Tag,
  AlignLeft,
  Menu,
  X,
  ListTodo,
} from 'lucide-react';
import confetti from 'canvas-confetti';


import { TaskCard } from './components/TaskCard';
import { PrioritySelector } from './components/PrioritySelector';
import { Sidebar } from './components/Sidebar';
import { Button } from './components/ui/button';
import { EditTaskDialog } from './components/EditTaskDialog';
import { PomodoroTimer } from './components/PomodoroTimer';
import { SupportDialog } from './components/SupportDialog';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { supabase } from './lib/supabase';
import { LogIn, LogOut } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const CATEGORIES = [
  { id: 'personal', label: 'Kişisel', color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', bgLight: 'bg-blue-50' },
  { id: 'work', label: 'İş', color: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', bgLight: 'bg-purple-50' },
  { id: 'shopping', label: 'Alışveriş', color: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200', bgLight: 'bg-pink-50' },
  { id: 'health', label: 'Sağlık', color: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', bgLight: 'bg-emerald-50' },
];

const PRIORITIES = {
  low: { label: 'Düşük', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-200 dark:bg-slate-700' },
  medium: { label: 'Orta', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
  high: { label: 'Yüksek', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-200 dark:bg-red-900/50' }
};

function MainApp({ setShowAuth }) {
  const { user, logout } = useAuth();
  // Theme - Dark mode as default
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  // Data
  const [todos, setTodos] = useState([]);

  // Form States
  const [inputValue, setInputValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // UI States
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [editingId, setEditingId] = useState(null);

  // Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load todos
  useEffect(() => {
    const loadTodos = async () => {
      if (user) {
        // Load from Supabase
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) setTodos(data);
      } else {
        // Load from LocalStorage (Guest)
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
          setTodos(JSON.parse(savedTodos));
        } else {
          setTodos([]);
        }
      }
    };
    loadTodos();
  }, [user]);

  // Save todos (Only for Guest)
  // For Supabase users, we will save on each action (add, update, delete)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, user]);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Drag and Drop Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Functions
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: Date.now(), text: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(), // Temporary ID for optimistic UI
      text: inputValue.trim(),
      description: descValue.trim(),
      completed: false,
      category: selectedCategory,
      priority: selectedPriority,
      subtasks: subtasks,
      created_at: new Date().toISOString()
    };

    // Optimistic UI update
    setTodos([newTodo, ...todos]);

    // Reset Form
    setInputValue('');
    setDescValue('');
    setSubtasks([]);
    setNewSubtask('');
    setIsSubtasksOpen(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (user) {
      // Save to Supabase
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          user_id: user.id,
          text: newTodo.text,
          description: newTodo.description,
          completed: newTodo.completed,
          category: newTodo.category,
          priority: newTodo.priority,
          subtasks: newTodo.subtasks
        }])
        .select();

      if (data) {
        // Update with real ID from DB
        setTodos(prev => prev.map(t => t.id === newTodo.id ? { ...t, id: data[0].id } : t));
      }
    }
  };

  const toggleTodo = async (id) => {
    const todoToToggle = todos.find(t => t.id === id);
    if (!todoToToggle) return;

    const newCompleted = !todoToToggle.completed;

    // Optimistic UI
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        if (newCompleted) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10B981', '#34D399']
          });
        }
        return { ...todo, completed: newCompleted };
      }
      return todo;
    }));

    if (user) {
      await supabase
        .from('todos')
        .update({ completed: newCompleted })
        .eq('id', id);
    }
  };

  const deleteTodo = async (id) => {
    // Optimistic UI
    setTodos(todos.filter(todo => todo.id !== id));

    if (user) {
      await supabase
        .from('todos')
        .delete()
        .eq('id', id);
    }
  };

  const updateTodo = async (id, updatedData) => {
    // Optimistic UI
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updatedData } : todo
    ));
    setEditingId(null);

    if (user) {
      await supabase
        .from('todos')
        .update(updatedData)
        .eq('id', id);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Filtered Todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false;
    return true;
  });

  // Clock Component
  const time = currentTime.getHours();
  const DigitalClock = () => {
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const dateStr = currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
      <div className="flex flex-col items-end">
        <div className={`text-4xl font-black tracking-tighter leading-none ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          {hours}:{minutes}
        </div>
        <div className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {dateStr}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:w-0 lg:translate-x-0'}
        bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent
        border-r lg:border-r-0 border-slate-200 dark:border-slate-800
      `}>
        <div className={`h-full overflow-y-auto ${!sidebarOpen && 'lg:hidden'}`}>
          <Sidebar
            selectedCategory={categoryFilter}
            onSelectCategory={(cat) => {
              setCategoryFilter(cat);
              if (window.innerWidth < 1024) setSidebarOpen(false);
            }}
            todos={todos}
            darkMode={darkMode}
            onOpenSupport={() => setIsSupportOpen(true)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div>
                <h1 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  Merhaba, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Misafir'}
                </h1>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Bugün {todos.filter(t => !t.completed).length} görevin var
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:block">
                <PomodoroTimer />
              </div>
              <div className="hidden sm:block">
                <DigitalClock />
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-full transition-all duration-300 ${darkMode
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                  : 'bg-white text-slate-600 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    toast.success('Başarıyla çıkış yapıldı.');
                  }}
                  className="p-3 rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 transition-colors"
                  title="Giriş Yap / Kayıt Ol"
                >
                  <LogIn className="w-5 h-5" />
                </button>
              )}
            </div>
          </header>

          {/* Input Area */}
          <div className={`relative z-20 mb-8 rounded-3xl p-1 transition-all duration-300 ${darkMode ? 'bg-slate-800/50 shadow-2xl shadow-black/20' : 'bg-white shadow-xl shadow-indigo-100/50'
            }`}>
            <form onSubmit={handleAddTodo} className="flex flex-col">

              <div className="flex items-center p-2 gap-2">
                <input
                  id="new-task-input"
                  name="newTask"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Bugün ne yapacaksın?"
                  className={`flex-1 bg-transparent px-4 py-3 text-lg font-medium placeholder:text-slate-400 focus:outline-none ${darkMode ? 'text-white' : 'text-slate-800'
                    }`}
                />

                <Button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex-shrink-0"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </div>

              {/* Toolbar */}
              <div className={`flex flex-wrap items-center gap-2 px-4 pb-4 pt-2 border-t ${darkMode ? 'border-slate-700/50' : 'border-slate-100'
                }`}>

                {/* Category Selector */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${selectedCategory === cat.id
                        ? 'bg-white dark:bg-slate-700 shadow-sm scale-110'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      title={cat.label}
                    >
                      <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    </button>
                  ))}
                </div>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />


                {/* Priority Selector */}
                {/* Priority Selector */}
                <PrioritySelector value={selectedPriority} onChange={setSelectedPriority} />


                {/* Subtasks Toggle */}
                <button
                  type="button"
                  onClick={() => setIsSubtasksOpen(!isSubtasksOpen)}
                  className={`ml-auto p-2 rounded-lg transition-colors ${isSubtasksOpen
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <ListTodo className="w-5 h-5" />
                </button>

                {/* Description Toggle */}
                <button
                  type="button"
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className={`p-2 rounded-lg transition-colors ${isDescOpen
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <AlignLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Subtasks Area */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSubtasksOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className={`p-4 border-t ${darkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                  <div className="flex gap-2 mb-2">
                    <input
                      id="new-subtask-input"
                      name="newSubtask"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask(e))}
                      placeholder="Alt görev ekle..."
                      className={`flex-1 h-9 rounded-md border bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode
                        ? 'border-slate-700 text-white placeholder:text-slate-500'
                        : 'border-slate-200 text-slate-800 placeholder:text-slate-400'
                        }`}
                    />
                    <Button type="button" onClick={handleAddSubtask} size="sm" variant="secondary">
                      Ekle
                    </Button>
                  </div>

                  <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto">
                    {subtasks.map(st => (
                      <div key={st.id} className="flex items-center gap-2 group p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className={`flex-1 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {st.text}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(st.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Area */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDescOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <textarea
                  id="new-task-desc"
                  name="newDesc"
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  placeholder="Notlar ekle..."
                  className={`w-full p-4 bg-slate-50 dark:bg-slate-900/30 text-sm resize-none focus:outline-none border-t ${darkMode ? 'border-slate-700/50 text-slate-300' : 'border-slate-100 text-slate-600'
                    }`}
                  rows={3}
                />
              </div>
            </form>
          </div>

          {/* Control Panel */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl">
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all capitalize ${filter === f
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                  {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : 'Biten'}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Task List */}
          {filteredTodos.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <div className="inline-block p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <ListFilter className="w-12 h-12 text-slate-400" />
              </div>
              <p className={`text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Görev bulunamadı.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTodos.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'flex flex-col gap-3'}>
                  {filteredTodos.map(todo => (
                    <TaskCard
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onUpdate={updateTodo}
                      darkMode={darkMode}
                      isEditing={editingId === todo.id}
                      setEditingId={setEditingId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        <footer className="mt-12 py-6 text-center text-sm font-medium text-slate-400 dark:text-slate-600">
          Developed by Onur Keskin
        </footer>
      </div>


      <EditTaskDialog
        todo={todos.find(t => t.id === editingId)}
        open={!!editingId}
        onOpenChange={(open) => !open && setEditingId(null)}
        onSave={updateTodo}
      />

      <SupportDialog
        open={isSupportOpen}
        onOpenChange={setIsSupportOpen}
      />
    </div >
  );
}

function AppWrapper() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Close auth screen when user logs in
  useEffect(() => {
    if (user) {
      setShowAuth(false);
    }
  }, [user]);

  if (loading) return null;

  return (
    <>
      {showAuth && !user ? (
        <div className="relative">
          <button
            onClick={() => setShowAuth(false)}
            className="absolute top-4 right-4 z-50 p-2 text-slate-500 hover:text-slate-700 dark:text-white dark:hover:text-slate-200 bg-white/50 dark:bg-slate-800/50 rounded-full"
          >
            ✕ Kapat
          </button>
          {authMode === 'login' ? (
            <LoginScreen onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterScreen onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      ) : (
        <MainApp setShowAuth={setShowAuth} />
      )}
      <Toaster position="bottom-center" richColors />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}