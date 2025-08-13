"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, Plus, X, Briefcase, Calendar, MapPin, Building } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
  employmentType: string
}

const employmentTypes = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Temporary"]

export default function ExperiencePage() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
      employmentType: "",
    },
  ])

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
      employmentType: "",
    }
    setExperiences([...experiences, newExperience])
  }

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id))
    }
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const addAchievement = (expId: string, achievement: string) => {
    if (achievement.trim()) {
      const exp = experiences.find((e) => e.id === expId)
      if (exp) {
        updateExperience(expId, "achievements", [...exp.achievements, achievement.trim()])
      }
    }
  }

  const removeAchievement = (expId: string, index: number) => {
    const exp = experiences.find((e) => e.id === expId)
    if (exp) {
      const newAchievements = exp.achievements.filter((_, i) => i !== index)
      updateExperience(expId, "achievements", newAchievements)
    }
  }

  const handleNext = () => {
    // Validate at least one experience entry
    const hasValidExperience = experiences.some((exp) => exp.company && exp.position && exp.description)

    if (hasValidExperience) {
      router.push("/freelancer/onboarding/rates")
    }
  }

  const handleSkip = () => {
    router.push("/freelancer/onboarding/rates")
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
                4
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Work Experience</h1>
                <p className="text-gray-600">Share your professional background</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Step 4 of 7</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "57.1%" }}></div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Professional Experience</CardTitle>
                <p className="text-gray-600 mt-1">Add your work history to showcase your professional journey</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {experiences.map((experience, index) => (
              <div key={experience.id} className="border border-gray-200 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Building className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Experience {index + 1}</h3>
                  </div>
                  {experiences.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(experience.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`company-${experience.id}`} className="text-sm font-medium text-gray-700">
                      Company *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id={`company-${experience.id}`}
                        placeholder="e.g., Google Inc."
                        value={experience.company}
                        onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`position-${experience.id}`} className="text-sm font-medium text-gray-700">
                      Position *
                    </Label>
                    <Input
                      id={`position-${experience.id}`}
                      placeholder="e.g., Senior Software Engineer"
                      value={experience.position}
                      onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${experience.id}`} className="text-sm font-medium text-gray-700">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id={`location-${experience.id}`}
                        placeholder="e.g., San Francisco, CA"
                        value={experience.location}
                        onChange={(e) => updateExperience(experience.id, "location", e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`type-${experience.id}`} className="text-sm font-medium text-gray-700">
                      Employment Type
                    </Label>
                    <Select
                      value={experience.employmentType}
                      onValueChange={(value) => updateExperience(experience.id, "employmentType", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`start-${experience.id}`} className="text-sm font-medium text-gray-700">
                      Start Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id={`start-${experience.id}`}
                        type="month"
                        value={experience.startDate}
                        onChange={(e) => updateExperience(experience.id, "startDate", e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`end-${experience.id}`} className="text-sm font-medium text-gray-700">
                      End Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id={`end-${experience.id}`}
                        type="month"
                        value={experience.endDate}
                        onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                        className="pl-10 h-12"
                        disabled={experience.current}
                        placeholder={experience.current ? "Present" : ""}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id={`current-${experience.id}`}
                        checked={experience.current}
                        onChange={(e) => {
                          updateExperience(experience.id, "current", e.target.checked)
                          if (e.target.checked) {
                            updateExperience(experience.id, "endDate", "")
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`current-${experience.id}`} className="text-sm text-gray-600">
                        I currently work here
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${experience.id}`} className="text-sm font-medium text-gray-700">
                    Job Description *
                  </Label>
                  <Textarea
                    id={`description-${experience.id}`}
                    placeholder="Describe your role, responsibilities, and key contributions..."
                    value={experience.description}
                    onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Key Achievements</Label>
                  <div className="space-y-2">
                    {experience.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                        <span className="flex-1 text-sm">{achievement}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(experience.id, achIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a key achievement..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const target = e.target as HTMLInputElement
                            addAchievement(experience.id, target.value)
                            target.value = ""
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addAchievement(experience.id, input.value)
                          input.value = ""
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addExperience}
              className="w-full h-12 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Experience
            </Button>

            <div className="flex justify-between pt-6">
              <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Link href="/freelancer/onboarding/portfolio">
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
