"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  userId: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  role: "freelancer" | "client" | "admin"
  photoURL?: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("bizzlink_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("bizzlink_user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock user data based on email
      let mockUser: User
      if (email === "admin@bizzlink.com") {
        mockUser = {
          userId: "admin-1",
          email,
          firstName: "Admin",
          lastName: "User",
          displayName: "Admin User",
          role: "admin",
          photoURL: "/placeholder.svg?height=40&width=40",
          isVerified: true,
        }
      } else if (email.includes("client")) {
        mockUser = {
          userId: "client-1",
          email,
          firstName: "John",
          lastName: "Client",
          displayName: "John Client",
          role: "client",
          photoURL: "/placeholder.svg?height=40&width=40",
          isVerified: true,
        }
      } else {
        mockUser = {
          userId: "freelancer-1",
          email,
          firstName: "Sarah",
          lastName: "Chen",
          displayName: "Sarah Chen",
          role: "freelancer",
          photoURL: "/placeholder.svg?height=40&width=40",
          isVerified: true,
        }
      }

      setUser(mockUser)
      localStorage.setItem("bizzlink_user", JSON.stringify(mockUser))

      // Redirect based on role
      switch (mockUser.role) {
        case "admin":
          router.push("/admin")
          break
        case "client":
          router.push("/client/dashboard")
          break
        case "freelancer":
          router.push("/freelancer/dashboard")
          break
        default:
          router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData: any) => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newUser: User = {
        userId: `${userData.userType}-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: `${userData.firstName} ${userData.lastName}`,
        role: userData.userType,
        photoURL: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      }

      setUser(newUser)
      localStorage.setItem("bizzlink_user", JSON.stringify(newUser))

      // Redirect based on role - freelancers go to onboarding flow
      switch (newUser.role) {
        case "admin":
          router.push("/admin")
          break
        case "client":
          router.push("/client/dashboard")
          break
        case "freelancer":
          router.push("/freelancer/onboarding/specialty")
          break
        default:
          router.push("/dashboard")
      }
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bizzlink_user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
