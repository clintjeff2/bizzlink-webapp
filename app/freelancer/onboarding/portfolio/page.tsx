"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Plus, X, Upload, ExternalLink, ImageIcon, FileText, Code, Palette, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useOnboardingData } from "@/lib/redux/useOnboardingData"
import { useToast } from "@/hooks/use-toast"
import type { UserPortfolio } from "@/lib/redux/types/firebaseTypes"

const technologies = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "iOS",
  "Android",
  "Flutter",
  "React Native",
  "Swift",
  "Kotlin",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Photoshop",
  "Illustrator",
  "WordPress",
  "Shopify",
  "Magento",
  "WooCommerce",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
]

export default function PortfolioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { 
    onboardingData, 
    savePortfolio, 
    isLoading, 
    error,
    hasData 
  } = useOnboardingData()
  
  const [portfolioItems, setPortfolioItems] = useState<UserPortfolio[]>([
    {
      id: "1",
      title: "",
      description: "",
      imageLink: "",
      projectUrl: "",
      role: "",
      completionDate: "",
      skills: [],
    },
  ])
  const [isSaving, setIsSaving] = useState(false)

  // Load existing data when component mounts
  useEffect(() => {
    if (hasData && onboardingData.portfolio.length > 0) {
      setPortfolioItems(onboardingData.portfolio)
    }
  }, [hasData, onboardingData])

  const addPortfolioItem = () => {
    const newItem: UserPortfolio = {
      id: Date.now().toString(),
      title: "",
      description: "",
      imageLink: "",
      projectUrl: "",
      role: "",
      completionDate: "",
      skills: [],
    }
    setPortfolioItems([...portfolioItems, newItem])
  }

  const removePortfolioItem = (id: string) => {
    if (portfolioItems.length > 1) {
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
    }
  }

  const updatePortfolioItem = (id: string, field: keyof UserPortfolio, value: any) => {
    setPortfolioItems(portfolioItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addTechnologyToItem = (itemId: string, tech: string) => {
    const item = portfolioItems.find((item) => item.id === itemId)
    if (item && !item.skills.some(skill => skill.text === tech)) {
      const newSkill = { id: Date.now().toString(), text: tech }
      updatePortfolioItem(itemId, "skills", [...item.skills, newSkill])
    }
  }

  const removeTechnologyFromItem = (itemId: string, tech: string) => {
    const item = portfolioItems.find((item) => item.id === itemId)
    if (item) {
      updatePortfolioItem(
        itemId,
        "skills",
        item.skills.filter((skill) => skill.text !== tech),
      )
    }
  }

  const handleNext = async () => {
    const hasValidItem = portfolioItems.some((item) => item.title && item.description && item.role)

    if (!hasValidItem) {
      toast({
        title: "Please add portfolio information",
        description: "Add at least one portfolio item to continue.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Filter out empty portfolio entries
      const validPortfolio = portfolioItems.filter(item => 
        item.title.trim() && item.description.trim() && item.role.trim()
      )

      const success = await savePortfolio(validPortfolio)
      
      if (success) {
        toast({
          title: "Portfolio saved!",
          description: "Your portfolio has been saved successfully."
        })
        router.push("/freelancer/onboarding/experience")
      } else {
        throw new Error("Failed to save portfolio data")
      }
    } catch (err: any) {
      toast({
        title: "Error saving portfolio",
        description: err.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkip = async () => {
    try {
      setIsSaving(true)
      
      // Save empty array to indicate user chose to skip
      const success = await savePortfolio([])
      
      if (success) {
        router.push("/freelancer/onboarding/experience")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to skip portfolio step. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
              <p className="text-gray-600">Showcase your best work</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">Step 3 of 7</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "42.8%" }}></div>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Portfolio Projects</CardTitle>
              <p className="text-gray-600 mt-1">Add your best work to demonstrate your skills and expertise</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {portfolioItems.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Project {index + 1}</h3>
                </div>
                {portfolioItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePortfolioItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`title-${item.id}`} className="text-sm font-medium text-gray-700">
                    Project Title *
                  </Label>
                  <Input
                    id={`title-${item.id}`}
                    placeholder="e.g., E-commerce Website Redesign"
                    value={item.title}
                    onChange={(e) => updatePortfolioItem(item.id, "title", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`role-${item.id}`} className="text-sm font-medium text-gray-700">
                    Your Role *
                  </Label>
                  <Input
                    id={`role-${item.id}`}
                    placeholder="e.g., Full-stack Developer"
                    value={item.role}
                    onChange={(e) => updatePortfolioItem(item.id, "role", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`url-${item.id}`} className="text-sm font-medium text-gray-700">
                    Project URL
                  </Label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id={`url-${item.id}`}
                      placeholder="https://example.com"
                      value={item.projectUrl}
                      onChange={(e) => updatePortfolioItem(item.id, "projectUrl", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`completion-${item.id}`} className="text-sm font-medium text-gray-700">
                    Completion Date
                  </Label>
                  <Input
                    id={`completion-${item.id}`}
                    type="date"
                    value={item.completionDate}
                    onChange={(e) => updatePortfolioItem(item.id, "completionDate", e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${item.id}`} className="text-sm font-medium text-gray-700">
                  Project Description *
                </Label>
                <Textarea
                  id={`description-${item.id}`}
                  placeholder="Describe the project goals, your contributions, and the impact/results..."
                  value={item.description}
                  onChange={(e) => updatePortfolioItem(item.id, "description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">Technologies Used</Label>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill.text}
                      <button
                        onClick={() => removeTechnologyFromItem(item.id, skill.text)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select
                  onValueChange={(value) => addTechnologyToItem(item.id, value)}
                  value=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologies
                      .filter((tech) => !item.skills.some(skill => skill.text === tech))
                      .map((tech) => (
                        <SelectItem key={tech} value={tech}>
                          {tech}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`image-${item.id}`} className="text-sm font-medium text-gray-700">
                  Project Image URL
                </Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id={`image-${item.id}`}
                    placeholder="https://example.com/image.jpg"
                    value={item.imageLink}
                    onChange={(e) => updatePortfolioItem(item.id, "imageLink", e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addPortfolioItem}
            className="w-full h-12 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Project
          </Button>

          <div className="flex justify-between pt-6">
            <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Link href="/freelancer/onboarding/education">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
            </Button>

            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                onClick={handleSkip} 
                disabled={isSaving || isLoading}
                className="text-gray-600 hover:text-gray-900"
              >
                {(isSaving || isLoading) ? "Saving..." : "Skip for now"}
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSaving || isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
              >
                {(isSaving || isLoading) ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
