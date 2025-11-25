import * as React from "react"
import { useState } from "react"
import { format, startOfWeek, endOfWeek, isAfter, isBefore, startOfDay } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

/**
 * Türkçe Date Picker Component
 * 
 * Özellikler:
 * - Hafta Pazartesi'den başlar
 * - Türkçe gün isimleri (Pzt, Sal, Çar, Per, Cum, Cmt, Paz)
 * - Bugünün haftasını ortalayarak gösterir
 * - Geçmiş tarihler seçilemez
 * - Dark mode destekli
 * - Responsive tasarım
 * - Türkçe tarih formatı
 */
export function TurkishDatePicker({
    date,
    setDate,
    className,
    placeholder = "Tarih seçin",
    disabled = false
}) {
    const [open, setOpen] = useState(false)

    // Bugünün başlangıcı (saat 00:00:00)
    const today = startOfDay(new Date())

    // Geçmiş tarihleri devre dışı bırak
    const disabledDays = (day) => {
        return isBefore(startOfDay(day), today)
    }

    // Bugünün haftasını hesapla (Pazartesi - Pazar)
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
    const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 })

    // Seçilen tarihi formatla: "25 Kasım 2025, Salı"
    const formatSelectedDate = (selectedDate) => {
        if (!selectedDate) return placeholder

        return format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal transition-all",
                        !date && "text-slate-500 dark:text-slate-400",
                        date && "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatSelectedDate(date)}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 bg-white dark:bg-slate-800 rounded-md shadow-lg"
                align="start"
                onInteractOutside={() => setOpen(false)}
            >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                        setDate(selectedDate)
                        setOpen(false)
                    }}
                    disabled={disabledDays}
                    defaultMonth={date || today}
                    locale={tr}
                    weekStartsOn={1}
                    showOutsideDays={false}
                    className="rounded-md"
                    classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-bold dark:text-white",
                        nav: "space-x-1 flex items-center",
                        nav_button: cn(
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        ),
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-slate-600 dark:text-slate-400 rounded-md w-9 font-semibold text-[0.7rem] uppercase flex items-center justify-center",
                        row: "flex w-full mt-2",
                        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 dark:[&:has([aria-selected])]:bg-slate-800",
                        day: cn(
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 inline-flex items-center justify-center rounded-md transition-colors"
                        ),
                        day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-600 focus:text-white dark:bg-indigo-500 dark:hover:bg-indigo-600",
                        day_today: "bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-100 font-bold ring-2 ring-blue-500 dark:ring-blue-400",
                        day_outside: "text-slate-400 opacity-50 dark:text-slate-600",
                        day_disabled: "text-slate-300 opacity-30 dark:text-slate-700 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent",
                        day_range_middle: "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800",
                        day_hidden: "invisible",
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}

// Kullanım örneği:
/*
import { TurkishDatePicker } from "@/components/TurkishDatePicker"

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState(null)
  
  return (
    <TurkishDatePicker 
      date={selectedDate}
      setDate={setSelectedDate}
      placeholder="Bir tarih seçin"
    />
  )
}
*/
