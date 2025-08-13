"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import {
  ArrowRight,
  ArrowLeft,
  Code,
  Palette,
  PenTool,
  BarChart3,
  Camera,
  Megaphone,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const specialties = [
  {
    id: "web-development",
    title: "Web Development",
    description: "Frontend, Backend, Full-stack development",
    icon: <Code className="w-6 h-6" />,
    color: "bg-blue-100 text-blue-600",
    subcategories: [
      "Frontend Development",
      "Backend Development",
      "Full-stack Development",
      "E-commerce Development",
      "CMS Development",
    ],
  },
  {
    id: "mobile-development",
    title: "Mobile Development",
    description: "iOS, Android, Cross-platform apps",
    icon: <Smartphone className="w-6 h-6" />,
    color: "bg-green-100 text-green-600",
    subcategories: ["iOS Development", "Android Development", "React Native", "Flutter", "Ionic"],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "User interface and experience design",
    icon: <Palette className="w-6 h-6" />,
    color: "bg-purple-100 text-purple-600",
    subcategories: ["UI Design", "UX Research", "Prototyping", "Wireframing", "User Testing"],
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    description: "Visual design, branding, illustrations",
    icon: <PenTool className="w-6 h-6" />,
    color: "bg-pink-100 text-pink-600",
    subcategories: ["Logo Design", "Brand Identity", "Print Design", "Illustration", "Packaging Design"],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "SEO, SEM, social media marketing",
    icon: <Megaphone className="w-6 h-6" />,
    color: "bg-orange-100 text-orange-600",
    subcategories: ["SEO", "PPC Advertising", "Social Media Marketing", "Email Marketing", "Content Marketing"],
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Analytics, machine learning, AI",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-indigo-100 text-indigo-600",
    subcategories: [
      "Data Analysis",
      "Machine Learning",
      "Data Visualization",
      "Statistical Analysis",
      "Predictive Modeling",
    ],
  },
  {
    id: "content-writing",
    title: "Content Writing",
    description: "Copywriting, blogging, technical writing",
    icon: <PenTool className="w-6 h-6" />,
    color: "bg-teal-100 text-teal-600",
    subcategories: ["Blog Writing", "Copywriting", "Technical Writing", "Content Strategy", "SEO Writing"],
  },
  {
    id: "photography",
    title: "Photography",
    description: "Product, portrait, event photography",
    icon: <Camera className="w-6 h-6" />,
    color: "bg-yellow-100 text-yellow-600",
    subcategories: [
      "Product Photography",
      "Portrait Photography",
      "Event Photography",
      "Photo Editing",
      "Commercial Photography",
    ],
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    description: "Infrastructure, deployment, cloud services",
    icon: <Shield className="w-6 h-6" />,
    color: "bg-gray-100 text-gray-600",
    subcategories: ["AWS", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
  },
  {
    id: "blockchain",
    title: "Blockchain",
    description: "Smart contracts, DeFi, Web3",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-amber-100 text-amber-600",
    subcategories: ["Smart Contracts", "DeFi Development", "NFT Development", "Web3 Integration", "Cryptocurrency"],
  },
]

export default function SpecialtyPage() {
  const router = useRouter()
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [customSpecialty, setCustomSpecialty] = useState("")
  const [professionalTitle, setProfessionalTitle] = useState("")
  const [overview, setOverview] = useState("")

  const toggleSpecialty = (specialtyId: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialtyId) ? prev.filter((id) => id !== specialtyId) : [...prev, specialtyId],
    )
  }

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((sub) => sub !== subcategory) : [...prev, subcategory],
    )
  }

  const getSelectedSpecialtySubcategories = () => {
    return specialties
      .filter((specialty) => selectedSpecialties.includes(specialty.id))
      .flatMap((specialty) => specialty.subcategories)
  }

  const handleNext = () => {
    if (selectedSpecialties.length > 0 && professionalTitle) {
      router.push("/freelancer/onboarding/education")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Specialty</h1>
                <p className="text-gray-600">What services do you offer?</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Step 1 of 7</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "14.3%" }}></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Professional Title */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Professional Title</CardTitle>
              <p className="text-gray-600">How would you like to be introduced to clients?</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Professional Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Full-stack Developer, UI/UX Designer, Digital Marketing Specialist"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="h-12 text-lg"
                />
                <p className="text-xs text-gray-500">This will appear as your headline on your profile</p>
              </div>
            </CardContent>
          </Card>

          {/* Specialty Selection */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Select Your Specialties</CardTitle>
              <p className="text-gray-600">Choose the areas where you have expertise (select up to 3)</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialties.map((specialty) => (
                  <div
                    key={specialty.id}
                    onClick={() => toggleSpecialty(specialty.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedSpecialties.includes(specialty.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    } ${selectedSpecialties.length >= 3 && !selectedSpecialties.includes(specialty.id) ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${specialty.color}`}>{specialty.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{specialty.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{specialty.description}</p>
                      </div>
                      {selectedSpecialties.includes(specialty.id) && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedSpecialties.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-blue-900 mb-3">Selected Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSpecialties.map((specialtyId) => {
                      const specialty = specialties.find((s) => s.id === specialtyId)
                      return (
                        <div key={specialtyId} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                          {specialty?.title}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subcategories */}
          {selectedSpecialties.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-gray-900">Specific Skills</CardTitle>
                <p className="text-gray-600">Select specific skills within your chosen specialties</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {getSelectedSpecialtySubcategories().map((subcategory) => (
                    <Button
                      key={subcategory}
                      variant={selectedSubcategories.includes(subcategory) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSubcategory(subcategory)}
                      className="justify-start text-sm h-10"
                    >
                      {subcategory}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Specialty */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Custom Specialty</CardTitle>
              <p className="text-gray-600">Don't see your specialty? Add it here</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="custom" className="text-sm font-medium text-gray-700">
                  Custom Specialty (Optional)
                </Label>
                <Input
                  id="custom"
                  placeholder="e.g., Voice Over Artist, 3D Modeling, Game Development"
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  className="h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Overview */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Professional Overview</CardTitle>
              <p className="text-gray-600">Write a brief overview of your expertise and what makes you unique</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="overview" className="text-sm font-medium text-gray-700">
                  Professional Overview (Optional)
                </Label>
                <Textarea
                  id="overview"
                  placeholder="Describe your expertise, experience, and what sets you apart from other freelancers..."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>This will appear at the top of your profile</span>
                  <span>{overview.length}/500</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-6">
            <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Link href="/freelancer/dashboard">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedSpecialties.length === 0 || !professionalTitle}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
