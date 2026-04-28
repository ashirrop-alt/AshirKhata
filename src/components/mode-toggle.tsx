"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="p-2.5 rounded-xl bg-transparent text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90 relative flex items-center justify-center border-none outline-none"
>
  <Sun 
    className="w-[22px] h-[22px] stroke-[2.2] drop-shadow-sm rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
  />
  <Moon 
    className="absolute w-[22px] h-[22px] stroke-[2.2] drop-shadow-sm rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
  />
</button>
  )
}