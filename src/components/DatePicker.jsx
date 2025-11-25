import * as React from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ date, setDate }) {
    const [open, setOpen] = React.useState(false)

    // Bugünün gün indeksini al (0: Pazar, 1: Pazartesi, ...)
    const today = new Date()
    const currentDayIndex = today.getDay()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(new Date(date), "PPP", { locale: tr })
                    ) : (
                        <span>Tarih seç</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(selectedDate) => {
                        if (selectedDate) {
                            const year = selectedDate.getFullYear()
                            const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
                            const day = String(selectedDate.getDate()).padStart(2, '0')
                            setDate(`${year}-${month}-${day}`)
                        } else {
                            setDate('')
                        }
                        setOpen(false)
                    }}
                    initialFocus
                    locale={tr}
                    // Mevcut günden başla (bugün en solda olsun)
                    weekStartsOn={currentDayIndex}
                    // Geçmiş günleri gösterme/seçtirme
                    fromDate={today}
                    // Gün isimlerini gizle
                    classNames={{
                        head_row: "hidden"
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
