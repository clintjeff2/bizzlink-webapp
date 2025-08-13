"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, Plus, X, GraduationCap, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Education {
  id: string
  school: string
  degree: string
  field: string
  startYear: string
  endYear: string
  current: boolean
  description: string
  location: string
}

const degreeTypes = [
  "High School Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
  "Professional Certificate",
  "Bootcamp Certificate",
  "Online Course Certificate",
]

export default function EducationPage() {
  const router = useRouter()
  const [educations, setEducations] = useState<Education[]>([
    {
      id: "1",
      school: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      current: false,
      description: "",
      location: "",
    },
  ])

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      current: false,
      description: "",
      location: "",
    }
    setEducations([...educations, newEducation])
  }

  const removeEducation = (id: string) => {
    if (educations.length > 1) {
      setEducations(educations.filter((edu) => edu.id !== id))
    }
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEducations(educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const handleNext = () => {
    // Validate at least one education entry
    const hasValidEducation = educations.some((edu) => edu.school && edu.degree && edu.field)

    if (hasValidEducation) {
      router.push("/freelancer/onboarding/portfolio")
    }
  }

  const handleSkip = () => {
    router.push("/freelancer/onboarding/portfolio")
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
                2
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Education</h1>
                <p className="text-gray-600">Add your educational background</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Step 2 of 7</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "28.5%" }}></div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Educational Background</CardTitle>
                <p className="text-gray-600 mt-1">
                  Share your educational qualifications to build credibility with clients
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {educations.map((education, index) => (
              <div key={education.id} className="border border-gray-200 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Education {index + 1}</h3>
                  {educations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(education.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor={`school-${education.id}`} className="text-sm font-medium text-gray-700">
                      School/Institution *
                    </Label>
                    <Input
                      id={`school-${education.id}`}
                      placeholder="e.g., Stanford University"
                      value={education.school}
                      onChange={(e) => updateEducation(education.id, "school", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${education.id}`} className="text-sm font-medium text-gray-700">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id={`location-${education.id}`}
                        placeholder="e.g., Stanford, CA"
                        value={education.location}
                        onChange={(e) => updateEducation(education.id, "location", e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`degree-${education.id}`} className="text-sm font-medium text-gray-700">
                      Degree/Certification *
                    </Label>
                    <Select
                      value={education.degree}
                      onValueChange={(value) => updateEducation(education.id, "degree", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select degree type" />
                      </SelectTrigger>
                      <SelectContent>
                        {degreeTypes.map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`field-${education.id}`} className="text-sm font-medium text-gray-700">
                      Field of Study *
                    </Label>
                    <Input
                      id={`field-${education.id}`}
                      placeholder="e.g., Computer Science"
                      value={education.field}
                      onChange={(e) => updateEducation(education.id, "field", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`start-${education.id}`} className="text-sm font-medium text-gray-700">
                      Start Year
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Select
                        value={education.startYear}
                        onValueChange={(value) => updateEducation(education.id, "startYear", value)}
                      >
                        <SelectTrigger className="pl-10 h-12">
                          <SelectValue placeholder="Start year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => {
                            const year = new Date().getFullYear() - i
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`end-${education.id}`} className="text-sm font-medium text-gray-700">
                      End Year
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Select
                        value={education.endYear}
                        onValueChange={(value) => updateEducation(education.id, "endYear", value)}
                        disabled={education.current}
                      >
                        <SelectTrigger className="pl-10 h-12">
                          <SelectValue placeholder={education.current ? "Present" : "End year"} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 35 }, (_, i) => {
                            const year = new Date().getFullYear() + 5 - i
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id={`current-${education.id}`}
                        checked={education.current}
                        onChange={(e) => {
                          updateEducation(education.id, "current", e.target.checked)
                          if (e.target.checked) {
                            updateEducation(education.id, "endYear", "")
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`current-${education.id}`} className="text-sm text-gray-600">
                        I'm currently studying here
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${education.id}`} className="text-sm font-medium text-gray-700">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id={`description-${education.id}`}
                    placeholder="Describe your achievements, relevant coursework, or activities..."
                    value={education.description}
                    onChange={(e) => updateEducation(education.id, "description", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addEducation}
              className="w-full h-12 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Education
            </Button>

            <div className="flex justify-between pt-6">
              <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Link href="/freelancer/onboarding/specialty">
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
