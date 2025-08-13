"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { CheckCircle, Star, Trophy, Zap, ArrowRight, SnowflakeIcon as Confetti } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CompletePage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleGoToDashboard = () => {
    router.push("/freelancer/dashboard")
  }

  const profileCompletionItems = [
    { label: "Professional Specialty", completed: true },
    { label: "Education Background", completed: true },
    { label: "Portfolio Projects", completed: true },
    { label: "Work Experience", completed: true },
    { label: "Rates & Pricing", completed: true },
    { label: "Skills & Expertise", completed: true },
    { label: "Location & Personal Info", completed: true },
  ]

  const nextSteps = [
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      title: "Complete Your Profile",
      description: "Add a professional photo and verify your email",
      action: "Complete Now",
    },
    {
      icon: <Trophy className="w-6 h-6 text-blue-500" />,
      title: "Take Skill Tests",
      description: "Showcase your expertise with verified skill assessments",
      action: "Browse Tests",
    },
    {
      icon: <Zap className="w-6 h-6 text-green-500" />,
      title: "Apply to Projects",
      description: "Start browsing and applying to projects that match your skills",
      action: "Find Work",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <Navigation />

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 animate-bounce">
            <Confetti className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="absolute top-32 right-1/4 animate-bounce delay-100">
            <Confetti className="w-6 h-6 text-blue-400" />
          </div>
          <div className="absolute top-40 left-1/3 animate-bounce delay-200">
            <Confetti className="w-7 h-7 text-green-400" />
          </div>
          <div className="absolute top-28 right-1/3 animate-bounce delay-300">
            <Confetti className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎉 Congratulations!</h1>
          <p className="text-xl text-gray-600 mb-2">Your freelancer profile is now set up and ready to go!</p>
          <p className="text-gray-500">You're all set to start your freelancing journey on Bizzlink</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Completion Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Profile Setup Complete</span>
              </CardTitle>
              <p className="text-gray-600">All sections have been completed successfully</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileCompletionItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Profile Completion</span>
                  <span className="text-green-800 font-bold">100%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Your Profile Summary</CardTitle>
              <p className="text-gray-600">Here's what clients will see</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">SC</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
                    <p className="text-gray-600 text-sm">Full-stack Developer</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialties:</span>
                    <span className="text-gray-900">Web Development, UI/UX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="text-gray-900">5+ years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="text-gray-900">$75/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">San Francisco, CA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Languages:</span>
                    <span className="text-gray-900">English, Mandarin</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500 italic">
                    "Experienced full-stack developer specializing in React and Node.js..."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-gray-900">Recommended Next Steps</CardTitle>
            <p className="text-gray-600">Complete these actions to maximize your success on Bizzlink</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nextSteps.map((step, index) => (
                <div
                  key={index}
                  className="text-center p-6 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {step.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoToDashboard}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold flex items-center space-x-2"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Button>

          <Button asChild variant="outline" className="px-8 py-3 text-lg font-semibold bg-transparent">
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>

        {/* Welcome Message */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Bizzlink! 🚀</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            You're now part of a community of talented freelancers. Start exploring projects, connect with clients, and
            build your reputation. We're here to support your success every step of the way.
          </p>
        </div>
      </div>
    </div>
  )
}
