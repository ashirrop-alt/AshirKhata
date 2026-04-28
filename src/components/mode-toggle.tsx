"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="p-2 rounded-lg bg-transparent text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90 relative group"
>
  <Sun 
    className="w-[22px] h-[22px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
    strokeWidth={2.2} 
  />
  <Moon 
    className="absolute top-2 left-2 w-[22px] h-[22px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
    strokeWidth={2.2} 
  />
</button>
  )
}