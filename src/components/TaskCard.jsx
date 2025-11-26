import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Check, Trash2, Edit2, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react'
import * as icons from 'lucide-react'

const CATEGORIES = [
    { id: 'personal', label: 'Kişisel', color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', bgLight: 'bg-blue-50' },
    { id: 'work', label: 'İş', color: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', bgLight: 'bg-purple-50' },
    { id: 'shopping', label: 'Alışveriş', color: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200', bgLight: 'bg-pink-50' },
    { id: 'health', label: 'Sağlık', color: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', bgLight: 'bg-emerald-50' },
]

const PRIORITIES = {
    low: { label: 'Düşük', color: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-200 dark:bg-slate-700' },
    medium: { label: 'Orta', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    high: { label: 'Yüksek', color: 'text-red-700 dark:text-red-100', bg: 'bg-red-200 dark:bg-red-800' },
}

export function TaskCard({ todo, onToggle, onDelete, onUpdate, darkMode, isEditing, setEditingId }) {
    const [showSubtasks, setShowSubtasks] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id })

    const handleSubtaskToggle = (subtaskId) => {
        const updatedSubtasks = todo.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
        onUpdate(todo.id, { ...todo, subtasks: updatedSubtasks })
    }

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    const category = CATEGORIES.find(c => c.id === todo.category) || CATEGORIES[0]
    const TaskIcon = todo.icon && icons[todo.icon] ? icons[todo.icon] : null
    const isHeart = todo.icon === 'Heart'

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative p-5 rounded-2xl border transition-colors duration-200 ${darkMode
                ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:bg-slate-800/80'
                : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50'
                } ${todo.completed ? 'opacity-60' : ''} ${isDragging ? 'shadow-2xl scale-105 rotate-2 z-50' : ''}`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="w-5 h-5 text-slate-400" />
            </div>

            <div className="flex items-start gap-4 pl-6">
                {/* Checkbox */}
                <button
                    onClick={() => onToggle(todo.id)}
                    className={`flex-shrink-0 w-7 h-7 mt-1 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed
                        ? 'bg-green-500 border-green-500 text-white scale-110'
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 hover:scale-110'
                        }`}
                >
                    <Check className="w-4 h-4 stroke-[3]" />
                </button>

                {/* Content */}
                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3
                        onClick={() => setEditingId(todo.id)}
                        className={`text-xl font-bold tracking-tight leading-snug cursor-pointer hover:text-indigo-500 transition-colors mb-2 ${todo.completed ? 'line-through decoration-2 decoration-slate-400' : ''
                            } ${darkMode ? 'text-white' : 'text-slate-800'}`}
                    >
                        {todo.text}
                    </h3>
                    {todo.description && (
                        <div className={`text-sm pl-3 py-1 border-l-2 ${darkMode ? 'border-indigo-900/50 text-slate-400' : 'border-indigo-100 text-slate-500'}`}>
                            <p className="line-clamp-2">
                                {todo.description}
                            </p>
                        </div>
                    )}

                    {/* Subtasks List */}
                    {showSubtasks && todo.subtasks && todo.subtasks.length > 0 && (
                        <div className="mt-3 space-y-1.5 pl-1" onClick={(e) => e.stopPropagation()}>
                            {todo.subtasks.map(st => (
                                <div key={st.id} className="flex items-center gap-2 group">
                                    <input
                                        type="checkbox"
                                        checked={st.completed}
                                        onChange={() => handleSubtaskToggle(st.id)}
                                        className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                                    />
                                    <span className={`text-xs leading-tight ${st.completed ? 'line-through text-slate-400' : darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {st.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Badges & Meta */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                        {TaskIcon && (
                            <div className={`p-1.5 rounded-lg bg-white ${isHeart ? 'text-red-500' : category.text}`}>
                                <TaskIcon className="w-4 h-4" />
                            </div>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wide bg-white ${category.text}`}>
                            {category.label}
                        </span>
                        {todo.subtasks && todo.subtasks.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowSubtasks(!showSubtasks)
                                }}
                                className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                <span className={todo.subtasks.every(st => st.completed) ? 'text-green-600 dark:text-green-400' : ''}>
                                    {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
                                </span>
                                {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${PRIORITIES[todo.priority].bg} ${PRIORITIES[todo.priority].color}`}>
                            {PRIORITIES[todo.priority].label}
                        </span>
                        {todo.date && (
                            <div className={`flex items-center gap-1.5 text-xs font-medium ml-auto ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                <CalendarIcon className="w-3.5 h-3.5" />
                                {todo.date.split('-').reverse().join('.')}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setEditingId(todo.id)}
                        className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(todo.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
