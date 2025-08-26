"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Star,
  Code,
  Palette,
  BarChart3,
  Megaphone,
  PenTool,
  Camera,
  Shield,
  Globe,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useOnboardingData } from "@/lib/redux/useOnboardingData"
import { useToast } from "@/hooks/use-toast"
import type { UserSkill } from "@/lib/redux/types/firebaseTypes"

const skillCategories = {
  "Programming Languages": {
    icon: <Code className="w-5 h-5" />,
    skills: ["JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Swift", "Kotlin", "TypeScript", "Rust"],
  },
  "Web Technologies": {
    icon: <Globe className="w-5 h-5" />,
    skills: [
      "React",
      "Vue.js",
      "Angular",
      "Node.js",
      "Express.js",
      "Next.js",
      "Nuxt.js",
      "Django",
      "Flask",
      "Laravel",
      "Spring Boot",
      "ASP.NET"
    ],
  },
  "Design Tools": {
    icon: <Palette className="w-5 h-5" />,
    skills: [
      "Figma",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Sketch",
      "Adobe XD",
      "InVision",
      "Principle",
      "Framer",
      "Canva",
      "Adobe After Effects"
    ],
  },
  "Data & Analytics": {
    icon: <BarChart3 className="w-5 h-5" />,
    skills: [
      "SQL",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Elasticsearch",
      "Power BI",
      "Tableau",
      "Google Analytics",
      "Excel"
    ],
  },
  "Marketing & Content": {
    icon: <Megaphone className="w-5 h-5" />,
    skills: [
      "SEO",
      "Google Ads",
      "Facebook Ads",
      "Content Writing",
      "Copywriting",
      "Email Marketing",
      "Social Media Marketing",
      "Content Strategy",
      "Brand Strategy",
      "Market Research"
    ],
  },
  "Creative": {
    icon: <Camera className="w-5 h-5" />,
    skills: [
      "Photography",
      "Video Editing",
      "Motion Graphics",
      "3D Modeling",
      "Animation",
      "Illustration",
      "Logo Design",
      "Print Design",
      "Web Design",
      "UI Design"
    ],
  },
}

const experienceLevels = [
  { value: "beginner", label: "Beginner", description: "Learning or just started" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "expert", label: "Expert", description: "Very experienced" },
]

export default function SkillsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { 
    onboardingData, 
    saveSkills, 
    isLoading, 
    error,
    hasData 
  } = useOnboardingData()
  
  const [selectedSkills, setSelectedSkills] = useState<UserSkill[]>([])
  const [customSkill, setCustomSkill] = useState("")
  const [customLevel, setCustomLevel] = useState<"beginner" | "intermediate" | "expert">("intermediate")
  const [isSaving, setIsSaving] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load existing data when component mounts
  useEffect(() => {
    if (hasData && onboardingData.skills && onboardingData.skills.length > 0 && !dataLoaded) {
      setSelectedSkills(onboardingData.skills)
      setDataLoaded(true)
    }
  }, [hasData, dataLoaded])

  const addSkill = (skillText: string, level: "beginner" | "intermediate" | "expert") => {
    if (selectedSkills.some(skill => skill.text === skillText)) {
      return
    }

    const newSkill: UserSkill = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: skillText,
      level: level,
      yearsOfExperience: level === "beginner" ? 1 : level === "intermediate" ? 3 : 5
    }

    setSelectedSkills([...selectedSkills, newSkill])
  }

  const removeSkill = (skillText: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill.text !== skillText))
  }

  const updateSkillLevel = (skillText: string, level: "beginner" | "intermediate" | "expert") => {
    setSelectedSkills(selectedSkills.map(skill => 
      skill.text === skillText 
        ? { 
            ...skill, 
            level, 
            yearsOfExperience: level === "beginner" ? 1 : level === "intermediate" ? 3 : 5 
          }
        : skill
    ))
  }

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim(), customLevel)
      setCustomSkill("")
      setCustomLevel("intermediate")
    }
  }

  const handleNext = async () => {
    if (selectedSkills.length === 0) {
      toast({
        title: "Please add at least one skill",
        description: "Add your skills to help clients find you.",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      
      const success = await saveSkills(selectedSkills)
      
      if (success) {
        toast({
          title: "Skills saved!",
          description: "Your skills have been saved successfully."
        })
        router.push("/freelancer/onboarding/rates")
      } else {
        throw new Error("Failed to save skills data")
      }
    } catch (err: any) {
      toast({
        title: "Error saving skills",
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
      
      // Save empty array to skip this step
      const success = await saveSkills([])
      
      if (success) {
        toast({
          title: "Skills skipped",
          description: "You can add skills later in your profile."
        })
        router.push("/freelancer/onboarding/rates")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Please try again.",
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
              5
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Skills & Expertise</h1>
              <p className="text-gray-600">Add your technical and soft skills</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">Step 5 of 7</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "71.4%" }}></div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Selected Skills */}
        {selectedSkills.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Your Skills</CardTitle>
              <p className="text-gray-600">Review and adjust your skill levels</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedSkills.map((skill) => (
                  <div key={skill.text} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{skill.text}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Select
                        value={skill.level}
                        onValueChange={(value: "beginner" | "intermediate" | "expert") => 
                          updateSkillLevel(skill.text, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.text)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skill Categories */}
        <div className="space-y-6">
          {Object.entries(skillCategories).map(([category, data]) => (
            <Card key={category} className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    {data.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {data.skills.map((skill) => {
                    const isSelected = selectedSkills.some(s => s.text === skill)
                    return (
                      <Button
                        key={skill}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => isSelected ? removeSkill(skill) : addSkill(skill, "intermediate")}
                        className="justify-start text-sm h-10"
                      >
                        {skill}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Skill */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-gray-900">Add Custom Skill</CardTitle>
            <p className="text-gray-600">Don't see your skill listed? Add it here</p>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter a skill..."
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addCustomSkill()
                    }
                  }}
                  className="h-12"
                />
              </div>
              <Select value={customLevel} onValueChange={(value) => setCustomLevel(value as "beginner" | "intermediate" | "expert")}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addCustomSkill} className="h-12 px-6">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6">
          <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
            <Link href="/freelancer/onboarding/experience">
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
      </div>
    </div>
  )
}
