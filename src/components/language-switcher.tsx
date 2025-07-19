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
    if (!pathName) return '/'
    const segments = pathName.split('/')
    
    // Check if the first segment is a locale and remove it
    if (i18n.locales.includes(segments[1] as Locale)) {
      segments.splice(1, 1)
    }

    if (locale === i18n.defaultLocale) {
      return segments.join('/') || '/'
    }

    return `/${locale}${segments.join('/')}`
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
