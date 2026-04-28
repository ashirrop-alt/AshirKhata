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
    style={{ strokeWidth: "2.5px" }} 
    className="w-[20px] h-[20px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
  />
  <Moon 
    style={{ strokeWidth: "2.5px" }} 
    className="absolute top-2 left-2 w-[20px] h-[20px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
  />
</button>
  )
}