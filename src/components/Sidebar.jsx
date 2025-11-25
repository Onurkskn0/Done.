import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
    { id: 'personal', label: 'Kişisel', color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', bgLight: 'bg-blue-50' },
    { id: 'work', label: 'İş', color: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', bgLight: 'bg-purple-50' },
    { id: 'shopping', label: 'Alışveriş', color: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200', bgLight: 'bg-pink-50' },
    { id: 'health', label: 'Sağlık', color: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', bgLight: 'bg-emerald-50' },
]

export function Sidebar({ selectedCategory, onSelectCategory, todos, darkMode }) {
    const getCategoryCount = (categoryId) => {
        return todos.filter(t => t.category === categoryId && !t.completed).length
    }

    const totalActive = todos.filter(t => !t.completed).length

    return (
        <aside className={cn(
            "w-64 flex-shrink-0 p-6 border-r transition-colors",
            darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"
        )}>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className={cn(
                        "text-sm font-bold uppercase tracking-wider mb-4",
                        darkMode ? "text-slate-400" : "text-slate-500"
                    )}>
                        Kategoriler
                    </h2>

                    {/* All Tasks */}
                    <button
                        onClick={() => onSelectCategory('all')}
                        className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-all mb-2",
                            selectedCategory === 'all'
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                : darkMode
                                    ? "hover:bg-slate-800 text-slate-300"
                                    : "hover:bg-white text-slate-700"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-1.5 rounded-lg",
                                selectedCategory === 'all' ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700"
                            )}>
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="font-semibold">Tüm Görevler</span>
                        </div>
                        <span className={cn(
                            "text-xs font-bold px-2 py-1 rounded-full",
                            selectedCategory === 'all'
                                ? "bg-white/20"
                                : "bg-slate-200 dark:bg-slate-700"
                        )}>
                            {totalActive}
                        </span>
                    </button>
                </div>

                {/* Categories */}
                <div className="space-y-1">
                    {CATEGORIES.map(category => {
                        const count = getCategoryCount(category.id)
                        const isSelected = selectedCategory === category.id

                        return (
                            <button
                                key={category.id}
                                onClick={() => onSelectCategory(category.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                                    isSelected
                                        ? `${category.bgLight} ${category.text} ${category.border} border-2 shadow-sm`
                                        : darkMode
                                            ? "hover:bg-slate-800 text-slate-300"
                                            : "hover:bg-white text-slate-700"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                    <span className="font-semibold">{category.label}</span>
                                </div>
                                {count > 0 && (
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-1 rounded-full",
                                        isSelected
                                            ? `${category.color} text-white`
                                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Stats */}
                <div className={cn(
                    "pt-6 border-t space-y-2",
                    darkMode ? "border-slate-700" : "border-slate-200"
                )}>
                    <div className="flex justify-between text-sm">
                        <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Toplam Görev</span>
                        <span className={cn("font-bold", darkMode ? "text-white" : "text-slate-800")}>
                            {todos.length}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Tamamlanan</span>
                        <span className="font-bold text-green-500">
                            {todos.filter(t => t.completed).length}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Aktif</span>
                        <span className="font-bold text-indigo-500">
                            {totalActive}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
