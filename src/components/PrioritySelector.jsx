import * as React from "react"
import { Check, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const PRIORITIES = {
    low: { label: 'Düşük', color: 'text-slate-700 dark:text-slate-200', bg: 'bg-slate-200 dark:bg-slate-700' },
    medium: { label: 'Orta', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/50' },
    high: { label: 'Yüksek', color: 'text-red-700 dark:text-red-100', bg: 'bg-red-200 dark:bg-red-800' }
}

export function PrioritySelector({ value, onChange }) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between border-0 h-auto py-2 px-3 text-sm font-medium transition-colors",
                        value === 'high'
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
                            : value === 'medium'
                                ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800'
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        {PRIORITIES[value]?.label || 'Öncelik'}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[140px] p-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" align="start">
                <div className="flex flex-col gap-1">
                    {Object.entries(PRIORITIES).map(([key, priority]) => (
                        <button
                            key={key}
                            onClick={() => {
                                onChange(key)
                                setOpen(false)
                            }}
                            className={cn(
                                "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors",
                                "hover:bg-slate-100 dark:hover:bg-slate-700",
                                value === key ? "bg-slate-100 dark:bg-slate-700 font-medium" : "text-slate-600 dark:text-slate-300"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full",
                                    key === 'low' ? 'bg-slate-400' :
                                        key === 'medium' ? 'bg-yellow-500' : 'bg-red-400'
                                )} />
                                {priority.label}
                            </div>
                            {value === key && <Check className="w-3 h-3 opacity-50" />}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
