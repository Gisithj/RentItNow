// app/components/ThemeSwitcher.tsx
"use client";

import { Button } from "@nextui-org/react";
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = ()=>{
    if(theme === 'light'){
        setTheme('dark')
    }else{
        setTheme('light')
    }
  }
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if(!mounted) return null

  return (
    <div>
      <Button isIconOnly size="sm" onClick={toggleTheme}>
        {theme==='light'?
        <MdDarkMode size={20} />
        :
        <MdLightMode size={20} />
        }
      </Button>
    </div>
  )
};