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
} from 'lucide-react';
import confetti from 'canvas-confetti';


import { TaskCard } from './components/TaskCard';
import { PrioritySelector } from './components/PrioritySelector';
import { Sidebar } from './components/Sidebar';
import { Button } from './components/ui/button';
import { EditTaskDialog } from './components/EditTaskDialog';

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

export default function App() {
  // Theme - Dark mode as default
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true; // Default to dark
    }
    return true;
  });

  // Data
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('todos-v3');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Form States
  const [inputValue, setInputValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [selectedPriority, setSelectedPriority] = useState('low');
  const [isDescOpen, setIsDescOpen] = useState(true);

  // UI States
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('todos-v3', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Functions
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      description: descValue.trim(),
      completed: false,
      category: selectedCategory,
      priority: selectedPriority,
      createdAt: new Date().toISOString()
    };

    setTodos([newTodo, ...todos]);

    // Reset Form
    setInputValue('');
    setDescValue('');
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo.completed) {
      // Enhanced confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981']
      });
    }
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const updateTodo = (id, updates) => {
    setTodos(todos.map(t => t.id === id ? { ...t, ...updates } : t));
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
  const filteredTodos = todos.filter(t => {
    if (filter === 'active' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    return true;
  });

  // Clock Component
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

      {/* Sidebar - Desktop */}
      <div className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300`}>
        {sidebarOpen && (
          <Sidebar
            selectedCategory={categoryFilter}
            onSelectCategory={setCategoryFilter}
            todos={todos}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">

          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div>
                <h1 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  TaskFlow
                </h1>
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Gününün hakimi ol.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
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
                  placeholder="Bugün ne başarmak istiyorsun?"
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


                {/* Description Toggle */}
                <button
                  type="button"
                  onClick={() => setIsDescOpen(!isDescOpen)}
                  className={`ml-auto p-2 rounded-lg transition-colors ${isDescOpen
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <AlignLeft className="w-5 h-5" />
                </button>
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
      </div>

      <EditTaskDialog
        todo={todos.find(t => t.id === editingId)}
        open={!!editingId}
        onOpenChange={(open) => !open && setEditingId(null)}
        onSave={updateTodo}
      />
    </div >
  );
}