import * as React from "react"
import { useState, useMemo } from "react"
import * as LucideIcons from "lucide-react"
import { Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Görev yönetimi için alakalı ikonları filtrele
const relevantIcons = [
    'Heart', 'Star', 'Check', 'CheckCircle', 'Circle', 'Square',
    'Home', 'User', 'Users', 'Briefcase', 'ShoppingCart', 'ShoppingBag',
    'Coffee', 'Book', 'BookOpen', 'Bookmark', 'Calendar', 'Clock',
    'Bell', 'Mail', 'Phone', 'MessageCircle', 'Send', 'Inbox',
    'FileText', 'File', 'Folder', 'Archive', 'Trash', 'Edit',
    'Pencil', 'Settings', 'Tool', 'Wrench', 'Package', 'Gift',
    'Trophy', 'Award', 'Target', 'Flag', 'MapPin', 'Navigation',
    'Zap', 'Flame', 'Sun', 'Moon', 'Cloud', 'Umbrella',
    'Music', 'Headphones', 'Camera', 'Image', 'Video', 'Film',
    'Tv', 'Monitor', 'Smartphone', 'Tablet', 'Laptop', 'Watch',
    'Wifi', 'Battery', 'Power', 'Plug', 'Download', 'Upload',
    'Save', 'Trash2', 'AlertCircle', 'Info', 'HelpCircle', 'XCircle',
    'Plus', 'Minus', 'X', 'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown',
    'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'CornerDownRight', 'CornerUpRight',
    'Activity', 'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart', 'DollarSign',
    'CreditCard', 'Wallet', 'Tag', 'Tags', 'Percent', 'Hash',
    'Smile', 'Frown', 'Meh', 'ThumbsUp', 'ThumbsDown', 'Eye',
    'EyeOff', 'Lock', 'Unlock', 'Key', 'Shield', 'AlertTriangle',
    'Lightbulb', 'Sparkles', 'Rocket', 'Plane', 'Car', 'Bike',
    'Train', 'Bus', 'Ship', 'Anchor', 'Globe', 'Map'
]

const iconNames = Object.keys(LucideIcons).filter(
    key => relevantIcons.includes(key) && typeof LucideIcons[key] === 'object'
)

export function IconPicker({ selectedIcon, onSelectIcon, className }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    // Arama ile filtreleme
    const filteredIcons = useMemo(() => {
        const searchTerm = search.trim().toLowerCase()
        if (!searchTerm) {
            return iconNames // Tüm alakalı ikonları göster
        }
        return iconNames.filter(name => name.toLowerCase().includes(searchTerm))
    }, [search])

    const SelectedIconComponent = selectedIcon && LucideIcons[selectedIcon] ? LucideIcons[selectedIcon] : Sparkles

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start text-left font-medium transition-all",
                        selectedIcon && "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
                        className
                    )}
                >
                    <SelectedIconComponent className="mr-2 h-4 w-4" />
                    {selectedIcon || "İkon seç"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>İkon Seç</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="İkon ara... (örn: Heart, Star, Check)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="overflow-y-auto flex-1 pr-2">
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mt-4">
                        {filteredIcons.map((iconName) => {
                            const IconComponent = LucideIcons[iconName]
                            const isSelected = selectedIcon === iconName

                            if (!IconComponent) return null

                            return (
                                <button
                                    key={iconName}
                                    onClick={() => {
                                        onSelectIcon(iconName)
                                        setOpen(false)
                                        setSearch("")
                                    }}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-lg transition-all hover:scale-110 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 group",
                                        isSelected && "bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500"
                                    )}
                                    title={iconName}
                                >
                                    <IconComponent className={cn(
                                        "h-6 w-6 transition-colors",
                                        isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                    )} />
                                </button>
                            )
                        })}
                    </div>

                    {filteredIcons.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p>İkon bulunamadı</p>
                        </div>
                    )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t dark:border-slate-700">
                    {filteredIcons.length} ikon gösteriliyor
                </div>
            </DialogContent>
        </Dialog>
    )
}
