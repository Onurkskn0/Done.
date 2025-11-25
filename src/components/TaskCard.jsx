import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Check, Trash2, Edit2, Calendar as CalendarIcon } from 'lucide-react'
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
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id })

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
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        {TaskIcon && (
                            <div className={`p-1.5 rounded-lg bg-white ${isHeart ? 'text-red-500' : category.text}`}>
                                <TaskIcon className="w-4 h-4" />
                            </div>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wide bg-white ${category.text}`}>
                            {category.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${PRIORITIES[todo.priority].bg} ${PRIORITIES[todo.priority].color}`}>
                            {PRIORITIES[todo.priority].label}
                        </span>
                    </div>
                    <h3
                        onClick={() => setEditingId(todo.id)}
                        className={`text-lg font-bold leading-snug cursor-pointer hover:text-indigo-500 transition-colors ${todo.completed ? 'line-through decoration-2 decoration-slate-400' : ''
                            } ${darkMode ? 'text-white' : 'text-slate-800'}`}
                    >
                        {todo.text}
                    </h3>
                    {todo.description && (
                        <p className={`text-sm mt-2 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {todo.description}
                        </p>
                    )}
                    {todo.date && (
                        <div className={`flex items-center gap-1.5 mt-3 text-xs font-medium ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {todo.date.split('-').reverse().join('.')}
                        </div>
                    )}
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
