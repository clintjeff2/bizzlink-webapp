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
import { MessageSquare, Bell, User, Settings, LogOut, DollarSign, Briefcase, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./auth-provider"
import { useState, useEffect } from "react"

export function Navigation() {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [onboardingUser, setOnboardingUser] = useState<any>(null)

  // Check for onboarding user if no authenticated user
  useEffect(() => {
    if (!user) {
      const onboardingData = localStorage.getItem('bizzlink_user_onboarding')
      const signupData = localStorage.getItem('bizzlink_signup_progress')
      
      if (onboardingData) {
        try {
          const data = JSON.parse(onboardingData)
          if (data.signupData) {
            setOnboardingUser({
              userId: data.userId,
              email: data.signupData.email,
              firstName: data.signupData.firstname,
              lastName: data.signupData.lastname,
              displayName: `${data.signupData.firstname} ${data.signupData.lastname}`,
              role: data.role,
              photoURL: data.signupData.photoURL,
              isOnboarding: true
            })
          }
        } catch (error) {
          console.error('Error parsing onboarding data:', error)
        }
      } else if (signupData) {
        try {
          const data = JSON.parse(signupData)
          if (data.isComplete) {
            setOnboardingUser({
              userId: data.fullUserId || data.tempUserId || '',
              email: data.email,
              firstName: data.firstname,
              lastName: data.lastname,
              displayName: `${data.firstname} ${data.lastname}`,
              role: data.userType,
              photoURL: data.photoURL,
              isOnboarding: true
            })
          }
        } catch (error) {
          console.error('Error parsing signup data:', error)
        }
      }
    }
  }, [user])

  const handleOnboardingLogout = () => {
    localStorage.removeItem('bizzlink_signup_progress')
    localStorage.removeItem('bizzlink_user_onboarding')
    localStorage.removeItem('bizzlink_user')
    window.location.href = '/'
  }

  // Use onboarding user if no regular user is authenticated
  const currentUser = user || onboardingUser

  if (!currentUser) {
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
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/projects"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Find Work
                </Link>
                <Link
                  href="/freelancers"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Find Talent
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  How it Works
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const getNavLinks = () => {
    switch (currentUser.role) {
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: BarChart3 },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/projects", label: "Projects", icon: Briefcase },
          { href: "/admin/disputes", label: "Disputes", icon: MessageSquare },
        ]
      case "client":
        return [
          { href: "/client/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/projects/post", label: "Post Project", icon: Briefcase },
          { href: "/client/projects", label: "My Projects", icon: Briefcase },
          { href: "/freelancers", label: "Find Talent", icon: Users },
        ]
      case "freelancer":
        return [
          { href: "/freelancer/dashboard", label: "Dashboard", icon: BarChart3 },
          { href: "/projects", label: "Find Work", icon: Briefcase },
          { href: "/freelancer/proposals", label: "My Proposals", icon: MessageSquare },
          { href: "/freelancer/contracts", label: "Contracts", icon: DollarSign },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

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
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Messages - always show for authenticated users */}
            <Link href="/messages">
              <Button variant="ghost" size="sm" className="relative">
                <MessageSquare className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 hover:bg-red-500">3</Badge>
              </Button>
            </Link>

            {/* Only show notifications for fully authenticated users, not onboarding users */}
            {!onboardingUser && (
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 hover:bg-red-500">5</Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="px-3 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <DropdownMenuItem className="flex items-start space-x-3 p-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New project proposal</p>
                        <p className="text-xs text-gray-500">Sarah Chen sent you a proposal for "E-commerce Website"</p>
                        <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start space-x-3 p-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment received</p>
                        <p className="text-xs text-gray-500">$2,500 payment for Mobile App Design project</p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-start space-x-3 p-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Project milestone</p>
                        <p className="text-xs text-gray-500">Milestone 2 completed for SEO Campaign</p>
                        <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <div className="border-t p-2">
                    <Link href="/notifications">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Onboarding indicator for users in onboarding */}
            {onboardingUser && (
              <div className="hidden md:flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {onboardingUser.role === 'freelancer' ? 'Setting up profile' : 'Getting started'}
                </Badge>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {currentUser.photoURL ? (
                    <Image
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
                      {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                    </div>
                  )}
                  <span className="hidden md:block">{currentUser.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUser.displayName}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                  <Badge variant="outline" className="mt-1 text-xs capitalize">
                    {currentUser.role}
                  </Badge>
                  {onboardingUser && (
                    <Badge variant="outline" className="mt-1 ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Onboarding
                    </Badge>
                  )}
                </div>
                <DropdownMenuSeparator />
                
                {/* Conditional menu items based on user type */}
                {onboardingUser ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                    {onboardingUser.role === 'freelancer' && (
                      <DropdownMenuItem asChild>
                        <Link href="/freelancer/onboarding/specialty" className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Continue Setup
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {currentUser.role === "freelancer" && (
                      <DropdownMenuItem asChild>
                        <Link href="/freelancer/earnings" className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Earnings
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onboardingUser ? handleOnboardingLogout : logout} 
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
