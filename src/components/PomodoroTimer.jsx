import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Coffee, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25)
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [mode, setMode] = useState('work') // 'work' | 'break'

    useEffect(() => {
        let interval = null

        if (isActive) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        setIsActive(false)
                        // Optional: Play sound here
                        return
                    }
                    setMinutes(minutes - 1)
                    setSeconds(59)
                } else {
                    setSeconds(seconds - 1)
                }
            }, 1000)
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [isActive, minutes, seconds])

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const resetTimer = () => {
        setIsActive(false)
        if (mode === 'work') {
            setMinutes(25)
        } else {
            setMinutes(5)
        }
        setSeconds(0)
    }

    const toggleMode = () => {
        const newMode = mode === 'work' ? 'break' : 'work'
        setMode(newMode)
        setIsActive(false)
        setMinutes(newMode === 'work' ? 25 : 5)
        setSeconds(0)
    }

    return (
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center min-w-[80px]">
                <span className={`text-2xl font-bold font-mono leading-none ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {mode === 'work' ? 'Çalışma' : 'Mola'}
                </span>
            </div>

            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTimer}
                    className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                >
                    {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetTimer}
                    className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMode}
                    className={`h-8 w-8 ${mode === 'work'
                        ? 'text-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/30'
                        : 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30'
                        }`}
                    title={mode === 'work' ? 'Molaya Geç' : 'Çalışmaya Geç'}
                >
                    {mode === 'work' ? <Coffee className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}
