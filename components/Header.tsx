'use client'

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"

interface NavItem {
  href: string;
  text: string;
}

interface HeaderProps {
  navItems: any[];
  userName: string | undefined;
  membershipStatus?: string | undefined;
}

export default function Header({ navItems, userName, membershipStatus }: HeaderProps) {
  const { data: session } = useSession()
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const lang = pathname.startsWith("/kn") ? "kn" : "en"
    setCurrentLanguage(lang)
  }, [pathname])

  const switchLocale = (locale: "en" | "kn") => {
    const currentPath = window.location.pathname
    const currentSearch = window.location.search
    const storedPath = currentPath.substring(3)
    const newPath = `/${locale}${storedPath}${currentSearch}`
    setCurrentLanguage(locale)
    router.replace(newPath)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const membershipColor = membershipStatus === "active" ? "bg-green-500" : "bg-red-500"
  const membershipLabel = membershipStatus === "active" ? "Active" : "Expired"

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-black">Booksphere</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === `/${currentLanguage}${item.href}`
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.text}
              </Link>
            ))}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Select onValueChange={switchLocale} value={currentLanguage}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
              </SelectContent>
            </Select>
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3 flex items-center gap-2" aria-label="User menu">
                    <Avatar className="h-8 w-8 border border-black">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex flex-col items-start">
                    <span className="font-medium">{userName}</span>
                    {membershipStatus && (
                      <span className={`mt-1 px-2 py-0.5 text-xs font-semibold text-white rounded-full ${membershipColor}`}>
                        {membershipLabel}
                      </span>
                    )}
                  </DropdownMenuItem>
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>{item.text}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === `/${currentLanguage}${item.href}`
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={toggleMobileMenu}
              >
                {item.text}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 border border-black">
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{userName}</div>
                {membershipStatus && (
                  <div className={`text-sm font-medium ${membershipColor} text-white px-2 py-0.5 rounded-full mt-1`}>
                    {membershipLabel}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Select onValueChange={switchLocale} value={currentLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="kn">ಕನ್ನಡ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}