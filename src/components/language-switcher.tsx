"use client"

import { usePathname, useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import { i18n, type Locale } from '@/i18n.config'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const pathName = usePathname()
  const router = useRouter()

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return `/${locale}`
    const segments = pathName.split('/')
    
    // Replace the current locale with the new one
    segments[1] = locale
    
    return segments.join('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(redirectedPathName('th'))}>
          ไทย
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(redirectedPathName('en'))}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
