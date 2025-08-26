"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Plus, X, Briefcase, Calendar, MapPin, Building, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useOnboardingData } from "@/lib/redux/useOnboardingData"
import { useToast } from "@/hooks/use-toast"
import type { UserEmployment } from "@/lib/redux/types/firebaseTypes"

export default function ExperiencePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { 
    onboardingData, 
    saveEmployment, 
    isLoading, 
    error,
    hasData 
  } = useOnboardingData()
  
  const [experiences, setExperiences] = useState<UserEmployment[]>([
    {
      id: 1,
      companyName: "",
      jobTitle: "",
      city: "",
      country: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ])
  const [isSaving, setIsSaving] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load existing data when component mounts
  useEffect(() => {
    if (hasData && onboardingData.employment && onboardingData.employment.length > 0 && !dataLoaded) {
      setExperiences(onboardingData.employment)
      setDataLoaded(true)
    }
  }, [hasData, dataLoaded])

  const addExperience = () => {
    const newExperience: UserEmployment = {
      id: Date.now(),
      companyName: "",
      jobTitle: "",
      city: "",
      country: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    setExperiences([...experiences, newExperience])
  }

  const removeExperience = (id: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id))
    }
  }

  const updateExperience = (id: number, field: keyof UserEmployment, value: any) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const handleNext = async () => {
    // Validate at least one experience entry
    const hasValidExperience = experiences.some((exp) => exp.companyName && exp.jobTitle && exp.description)

    if (!hasValidExperience) {
      toast({
        title: "Please add your work experience",
        description: "Add at least one work experience to continue.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Filter out empty experience entries
      const validExperiences = experiences.filter(exp => 
        exp.companyName.trim() && exp.jobTitle.trim() && exp.description.trim()
      )

      const success = await saveEmployment(validExperiences)
      
      if (success) {
        toast({
          title: "Experience saved!",
          description: "Your work experience has been saved successfully."
        })
        router.push("/freelancer/onboarding/skills")
      } else {
        throw new Error("Failed to save experience data")
      }
    } catch (err: any) {
      toast({
        title: "Error saving experience",
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
      const success = await saveEmployment([])
      
      if (success) {
        router.push("/freelancer/onboarding/skills")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to skip experience step. Please try again.",
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
                      value={experience.companyName || ""}
                      onChange={(e) => updateExperience(experience.id, "companyName", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`position-${experience.id}`} className="text-sm font-medium text-gray-700">
                    Job Title *
                  </Label>
                  <Input
                    id={`position-${experience.id}`}
                    placeholder="e.g., Senior Software Engineer"
                    value={experience.jobTitle || ""}
                    onChange={(e) => updateExperience(experience.id, "jobTitle", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`city-${experience.id}`} className="text-sm font-medium text-gray-700">
                    City
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id={`city-${experience.id}`}
                      placeholder="e.g., San Francisco"
                      value={experience.city || ""}
                      onChange={(e) => updateExperience(experience.id, "city", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`country-${experience.id}`} className="text-sm font-medium text-gray-700">
                    Country
                  </Label>
                  <Input
                    id={`country-${experience.id}`}
                    placeholder="e.g., United States"
                    value={experience.country || ""}
                    onChange={(e) => updateExperience(experience.id, "country", e.target.value)}
                    className="h-12"
                  />
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
                      value={experience.startDate || ""}
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
                      value={experience.endDate || ""}
                      onChange={(e) => updateExperience(experience.id, "endDate", e.target.value)}
                      className="pl-10 h-12"
                      placeholder="Leave empty if current position"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${experience.id}`} className="text-sm font-medium text-gray-700">
                  Job Description *
                </Label>
                <Textarea
                  id={`description-${experience.id}`}
                  placeholder="Describe your responsibilities, achievements, and key contributions..."
                  value={experience.description || ""}
                  onChange={(e) => updateExperience(experience.id, "description", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Highlight your key achievements and responsibilities in this role
                </p>
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
              <Button 
                variant="ghost" 
                onClick={handleSkip} 
                disabled={isSaving}
                className="text-gray-600 hover:text-gray-900"
              >
                {isSaving ? "Saving..." : "Skip for now"}
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
              >
                {isSaving ? (
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
