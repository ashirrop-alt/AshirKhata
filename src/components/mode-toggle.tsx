"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-10 h-10 border dark:border-slate-800" // Border add kiya taake nazar aaye
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {/* Sun Icon: Light mode mein dikhega */}
      <Sun className="h-[1.2rem] w-[1.2rem] block dark:hidden text-amber-500" />
      
      {/* Moon Icon: Dark mode mein dikhega */}
      <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block text-blue-400" />
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}