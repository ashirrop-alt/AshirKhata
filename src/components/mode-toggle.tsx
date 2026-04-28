"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="p-2.5 rounded-xl bg-transparent text-slate-500/80 dark:text-slate-400/80 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all active:scale-95 relative flex items-center justify-center"
>
  <Sun 
    className="w-[19px] h-[19px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
    strokeWidth={1.5} 
  />
  <Moon 
    className="absolute w-[19px] h-[19px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
    strokeWidth={1.5} 
  />
</button>
  )
}