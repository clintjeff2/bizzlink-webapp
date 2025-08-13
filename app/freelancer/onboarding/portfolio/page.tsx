"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, Plus, X, Upload, ExternalLink, ImageIcon, FileText, Code, Palette } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  url: string
  image: string
  technologies: string[]
  completionDate: string
}

const categories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Data Science",
  "DevOps",
  "Blockchain",
  "AI/Machine Learning",
]

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
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: "1",
      title: "",
      description: "",
      category: "",
      url: "",
      image: "",
      technologies: [],
      completionDate: "",
    },
  ])

  const addPortfolioItem = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
      category: "",
      url: "",
      image: "",
      technologies: [],
      completionDate: "",
    }
    setPortfolioItems([...portfolioItems, newItem])
  }

  const removePortfolioItem = (id: string) => {
    if (portfolioItems.length > 1) {
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id))
    }
  }

  const updatePortfolioItem = (id: string, field: keyof PortfolioItem, value: any) => {
    setPortfolioItems(portfolioItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addTechnology = (itemId: string, tech: string) => {
    const item = portfolioItems.find((p) => p.id === itemId)
    if (item && !item.technologies.includes(tech)) {
      updatePortfolioItem(itemId, "technologies", [...item.technologies, tech])
    }
  }

  const removeTechnology = (itemId: string, tech: string) => {
    const item = portfolioItems.find((p) => p.id === itemId)
    if (item) {
      updatePortfolioItem(
        itemId,
        "technologies",
        item.technologies.filter((t) => t !== tech),
      )
    }
  }

  const handleNext = () => {
    // Validate at least one portfolio item
    const hasValidItem = portfolioItems.some((item) => item.title && item.description && item.category)

    if (hasValidItem) {
      router.push("/freelancer/onboarding/experience")
    }
  }

  const handleSkip = () => {
    router.push("/freelancer/onboarding/experience")
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Web Development":
      case "Mobile Development":
        return <Code className="w-5 h-5" />
      case "UI/UX Design":
      case "Graphic Design":
        return <Palette className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
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
                    <div className="p-2 bg-gray-100 rounded-lg">{getCategoryIcon(item.category)}</div>
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
                    <Label htmlFor={`category-${item.id}`} className="text-sm font-medium text-gray-700">
                      Category *
                    </Label>
                    <Select
                      value={item.category}
                      onValueChange={(value) => updatePortfolioItem(item.id, "category", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        value={item.url}
                        onChange={(e) => updatePortfolioItem(item.id, "url", e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`date-${item.id}`} className="text-sm font-medium text-gray-700">
                      Completion Date
                    </Label>
                    <Input
                      id={`date-${item.id}`}
                      type="month"
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
                    placeholder="Describe the project, your role, challenges faced, and results achieved..."
                    value={item.description}
                    onChange={(e) => updatePortfolioItem(item.id, "description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Technologies Used</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(item.id, tech)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {technologies
                      .filter((tech) => !item.technologies.includes(tech))
                      .slice(0, 8)
                      .map((tech) => (
                        <Button
                          key={tech}
                          variant="outline"
                          size="sm"
                          onClick={() => addTechnology(item.id, tech)}
                          className="justify-start text-sm h-8"
                        >
                          + {tech}
                        </Button>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Project Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload project screenshots or images</p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF (Max 5MB each)</p>
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
                <Button variant="ghost" onClick={handleSkip} className="text-gray-600 hover:text-gray-900">
                  Skip for now
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
