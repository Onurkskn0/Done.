import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PrioritySelector } from './PrioritySelector'

const CATEGORIES = [
    { id: 'personal', label: 'Kişisel', color: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200', bgLight: 'bg-blue-50' },
    { id: 'work', label: 'İş', color: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200', bgLight: 'bg-purple-50' },
    { id: 'shopping', label: 'Alışveriş', color: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200', bgLight: 'bg-pink-50' },
    { id: 'health', label: 'Sağlık', color: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', bgLight: 'bg-emerald-50' },
]

export function EditTaskDialog({ todo, open, onOpenChange, onSave }) {
    const [text, setText] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('personal')
    const [priority, setPriority] = useState('low')
    const [subtasks, setSubtasks] = useState([])
    const [newSubtask, setNewSubtask] = useState('')

    useEffect(() => {
        if (todo) {
            setText(todo.text)
            setDescription(todo.description || '')
            setCategory(todo.category)
            setPriority(todo.priority)
            setSubtasks(todo.subtasks || [])
        }
    }, [todo])

    const addSubtask = (e) => {
        e.preventDefault()
        if (!newSubtask.trim()) return
        setSubtasks([...subtasks, { id: Date.now(), text: newSubtask.trim(), completed: false }])
        setNewSubtask('')
    }

    const toggleSubtask = (id) => {
        setSubtasks(subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st))
    }

    const removeSubtask = (id) => {
        setSubtasks(subtasks.filter(st => st.id !== id))
    }

    const handleSave = (e) => {
        e.preventDefault()
        if (!text.trim()) return

        onSave(todo.id, {
            text,
            description,
            category,
            priority,
            subtasks
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Görevi Düzenle</DialogTitle>
                    <DialogDescription>
                        Görevin detaylarını aşağıdan düzenleyebilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="flex flex-col gap-4 mt-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="edit-title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Başlık
                        </label>
                        <input
                            id="edit-title"
                            name="title"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-indigo-800"
                            placeholder="Görev başlığı"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="edit-description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Açıklama
                        </label>
                        <textarea
                            id="edit-description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-indigo-800 resize-none"
                            placeholder="Açıklama (isteğe bağlı)"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Alt Görevler
                        </label>
                        <div className="flex gap-2">
                            <input
                                value={newSubtask}
                                onChange={(e) => setNewSubtask(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask(e))}
                                className="flex-1 h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                                placeholder="Yeni alt görev ekle..."
                            />
                            <Button type="button" onClick={addSubtask} size="sm" variant="secondary">
                                Ekle
                            </Button>
                        </div>

                        <div className="flex flex-col gap-1 mt-1 max-h-[150px] overflow-y-auto pr-1">
                            {subtasks.map(st => (
                                <div key={st.id} className="flex items-center gap-2 group p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <input
                                        type="checkbox"
                                        checked={st.completed}
                                        onChange={() => toggleSubtask(st.id)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                    <span className={`flex-1 text-sm ${st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {st.text}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeSubtask(st.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Kategori
                            </label>
                            <div className="flex gap-1">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${category === cat.id
                                            ? 'bg-slate-100 dark:bg-slate-800 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        title={cat.label}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Öncelik
                            </label>
                            <PrioritySelector value={priority} onChange={setPriority} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            İptal
                        </Button>
                        <Button type="submit">
                            Kaydet
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
