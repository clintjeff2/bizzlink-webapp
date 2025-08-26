"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, LogOut, HelpCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface OnboardingUser {
  userId: string
  email: string
  firstname: string
  lastname: string
  role: 'freelancer' | 'client'
  displayName: string
  photoURL?: string
}

export function OnboardingNavigation() {
  const [user, setUser] = useState<OnboardingUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for onboarding user data
    const onboardingData = localStorage.getItem('bizzlink_user_onboarding')
    const signupData = localStorage.getItem('bizzlink_signup_progress')
    
    if (onboardingData) {
      try {
        const data = JSON.parse(onboardingData)
        if (data.signupData) {
          setUser({
            userId: data.userId,
            email: data.signupData.email,
            firstname: data.signupData.firstname,
            lastname: data.signupData.lastname,
            role: data.role,
            displayName: `${data.signupData.firstname} ${data.signupData.lastname}`,
            photoURL: data.signupData.photoURL
          })
        }
      } catch (error) {
        console.error('Error parsing onboarding data:', error)
      }
    } else if (signupData) {
      try {
        const data = JSON.parse(signupData)
        if (data.isComplete) {
          setUser({
            userId: data.fullUserId || data.tempUserId || '',
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            role: data.userType as 'freelancer' | 'client',
            displayName: `${data.firstname} ${data.lastname}`,
            photoURL: data.photoURL
          })
        }
      } catch (error) {
        console.error('Error parsing signup data:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('bizzlink_signup_progress')
    localStorage.removeItem('bizzlink_user_onboarding')
    localStorage.removeItem('bizzlink_user')
    
    // Redirect to home
    router.push('/')
  }

  const getOnboardingLinks = () => {
    if (!user) return []

    switch (user.role) {
      case "freelancer":
        return [
          { href: "/freelancer/onboarding/specialty", label: "Setup Profile" },
          { href: "/help", label: "Get Help" },
          { href: "/how-it-works", label: "How It Works" },
        ]
      case "client":
        return [
          { href: "/client/dashboard", label: "Dashboard" },
          { href: "/help", label: "Get Help" },
          { href: "/how-it-works", label: "How It Works" },
        ]
      default:
        return []
    }
  }

  const onboardingLinks = getOnboardingLinks()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/bizzlink-icon.png" alt="Bizzlink" width={32} height={32} className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Bizzlink
              </span>
            </Link>
            
            {/* Onboarding Progress Indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {user?.role === 'freelancer' ? 'Setting up your freelancer profile' : 'Setting up your client profile'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Links for Onboarding */}
            <div className="hidden md:flex space-x-4">
              {onboardingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                    </div>
                    <span className="hidden md:block text-sm">{user.firstname}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <Badge variant="outline" className="mt-1 text-xs capitalize">
                      {user.role}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/how-it-works" className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      How It Works
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'freelancer' && (
                    <DropdownMenuItem asChild>
                      <Link href="/freelancer/onboarding/specialty" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Continue Setup
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
