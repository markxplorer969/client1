'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('light', savedTheme === 'light')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light'
    setTheme(newTheme)

    // Update DOM
    document.documentElement.classList.toggle('light', newTheme === 'light')
    document.documentElement.classList.toggle('dark', newTheme === 'dark')

    // Save to localStorage
    localStorage.setItem('theme', newTheme)
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Sun className="w-4 h-4 text-slate-600 dark:text-slate-400" />
      <Switch
        id="themeSwitch"
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
    </div>
  )
}

export default function Theme() {
  return (
    <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Tema
      </span>
      <ThemeSwitcher />
    </div>
  )
}
