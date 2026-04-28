"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="p-2 rounded-lg bg-transparent text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 relative flex items-center justify-center"
>
  <Sun 
    className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
    strokeWidth={1.8} 
  />
  <Moon 
    className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
    strokeWidth={1.8} 
  />
</button>
  )
}