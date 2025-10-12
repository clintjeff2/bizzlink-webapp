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
import { useAuth } from "./auth-provider-redux"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

// Common logo component
const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <Image src="/images/bizzlink-icon.png" alt="Bizzlink" width={32} height={32} className="w-8 h-8" />
    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
      Bizzlink
    </span>
  </Link>
)

// Navigation for unauthenticated users
const UnauthenticatedNav = () => {
  const pathname = usePathname()
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Logo />
            <div className="hidden md:flex space-x-6">
              <Link
                href="/projects"
                className={`transition-colors ${
                  pathname === '/projects' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Find Work
              </Link>
              <Link
                href="/freelancers"
                className={`transition-colors ${
                  pathname === '/freelancers' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Find Talent
              </Link>
              <Link
                href="/how-it-works"
                className={`transition-colors ${
                  pathname === '/how-it-works' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
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

// Helper function for safely getting user initials
const getUserInitials = (user: any) => {
  const first = user?.firstname?.charAt(0) || '';
  const last = user?.lastname?.charAt(0) || '';
  return first + last || 'U';
};

const OnboardingNav = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Handle setup button click with loading indicator
  const handleSetupClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent immediate navigation
    setIsLoading(true)
    
    // Keep dropdown open to show the loading indicator
    setTimeout(() => {
      window.location.href = '/freelancer/onboarding/specialty'
    }, 800) // Show loading state for 800ms before navigating
  }
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Logo />
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/projects"
                className={`transition-colors ${
                  pathname === '/projects' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Find Work
              </Link>
              <Link
                href="/freelancers"
                className={`transition-colors ${
                  pathname === '/freelancers' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Find Talent
              </Link>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {user.role === 'freelancer' ? 'Setting up profile' : 'Getting started'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu open={isLoading ? true : undefined} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user?.displayName || 'User'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
                      {getUserInitials(user)}
                    </div>
                  )}
                  <span className="hidden md:block">{user?.firstName || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.displayName || user?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Onboarding
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                {user.role === 'freelancer' && (
                  <DropdownMenuItem disabled={isLoading}>
                    <Link 
                      href="/freelancer/onboarding/specialty" 
                      className="flex items-center w-full" 
                      onClick={handleSetupClick}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <Settings className="w-4 h-4 mr-2" />
                          Continue Setup
                        </>
                      )}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => {
                    setIsLoading(true);
                    onLogout();
                  }} 
                  disabled={isLoading}
                  className="text-red-600"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      Signing Out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Navigation for fully authenticated users
const AuthenticatedNav = ({ user, logout }: { user: any, logout: () => void }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()

  const getNavLinks = () => {
    switch (user.role) {
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
          { href: "/client/contracts", label: "Contracts", icon: DollarSign },
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
            <Logo />
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors flex items-center space-x-1 ${
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Messages */}
            <Link href="/messages">
              <Button variant="ghost" size="sm" className="relative">
                <MessageSquare className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 hover:bg-red-500">3</Badge>
              </Button>
            </Link>

            {/* Notifications */}
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

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  {(user?.photoURL || user?.about?.profileUrl) ? (
                    <Image
                      src={user?.photoURL || user?.about?.profileUrl}
                      alt={user?.displayName || 'User'}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
                      {getUserInitials(user)}
                    </div>
                  )}
                  <span className="hidden md:block">{user?.firstname || 'User'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.displayName || user?.email || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  <Badge variant="outline" className="mt-1 text-xs capitalize">
                    {user.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={
                    user.role === 'client' ? '/client/profile' : 
                    user.role === 'freelancer' ? '/freelancer/profile' : 
                    '/profile'
                  } className="flex items-center">
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
                {user.role === "freelancer" && (
                  <DropdownMenuItem asChild>
                    <Link href="/freelancer/earnings" className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Earnings
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
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

export function Navigation() {
  const { user, logout } = useAuth()
  const [onboardingUser, setOnboardingUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before checking localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for onboarding user - runs on every render to ensure state is current
  useEffect(() => {
    if (!mounted) return // Don't run until component is mounted

    const checkForOnboardingUser = () => {
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
              return
            }
          } catch (error) {
            // Error parsing onboarding data
          }
        }
        
        if (signupData) {
          try {
            const data = JSON.parse(signupData)
            if (data.isComplete || data.email) { // Check for either complete or just email existence
              setOnboardingUser({
                userId: data.fullUserId || data.tempUserId || '',
                email: data.email,
                firstName: data.firstname || 'User',
                lastName: data.lastname || '',
                displayName: `${data.firstname || 'User'} ${data.lastname || ''}`.trim(),
                role: data.userType,
                photoURL: data.photoURL,
                isOnboarding: true
              })
              return
            }
          } catch (error) {
            // Error parsing signup data
          }
        }
        
        // If no onboarding data found, clear onboarding user
        setOnboardingUser(null)
      } else {
        // If user is authenticated, clear onboarding user
        setOnboardingUser(null)
      }
    }

    checkForOnboardingUser()

    // Also listen for storage changes to update navigation when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bizzlink_user_onboarding' || e.key === 'bizzlink_signup_progress') {
        checkForOnboardingUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [user, mounted])

  const handleOnboardingLogout = () => {
    localStorage.removeItem('bizzlink_signup_progress')
    localStorage.removeItem('bizzlink_user_onboarding')
    localStorage.removeItem('bizzlink_user')
    window.location.href = '/'
  }

  // Determine which navigation to show based on user state

  // Don't render navigation until mounted to prevent hydration mismatches
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (user) {
    // User is fully authenticated
    return <AuthenticatedNav user={user} logout={logout} />
  } else if (onboardingUser) {
    // User is in onboarding process
    return <OnboardingNav user={onboardingUser} onLogout={handleOnboardingLogout} />
  } else {
    // User is not authenticated
    return <UnauthenticatedNav />
  }
}
