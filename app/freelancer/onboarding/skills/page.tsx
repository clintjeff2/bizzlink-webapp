"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
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
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Skill {
  id: string
  name: string
  level: "beginner" | "intermediate" | "expert"
  category: string
}

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
      "HTML5",
      "CSS3",
      "SASS",
      "Bootstrap",
      "Tailwind CSS",
    ],
  },
  "Mobile Development": {
    icon: <Code className="w-5 h-5" />,
    skills: ["React Native", "Flutter", "iOS Development", "Android Development", "Xamarin", "Ionic", "Cordova"],
  },
  "Design Tools": {
    icon: <Palette className="w-5 h-5" />,
    skills: [
      "Figma",
      "Adobe XD",
      "Sketch",
      "Photoshop",
      "Illustrator",
      "InDesign",
      "After Effects",
      "Premiere Pro",
      "Canva",
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
      "Tableau",
      "Power BI",
      "Google Analytics",
      "R",
      "MATLAB",
    ],
  },
  "Marketing & SEO": {
    icon: <Megaphone className="w-5 h-5" />,
    skills: [
      "Google Ads",
      "Facebook Ads",
      "SEO",
      "SEM",
      "Content Marketing",
      "Email Marketing",
      "Social Media Marketing",
      "Google Analytics",
      "HubSpot",
    ],
  },
  "Cloud & DevOps": {
    icon: <Shield className="w-5 h-5" />,
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "Git",
      "GitHub",
      "GitLab",
      "CI/CD",
      "Terraform",
    ],
  },
  "Content & Writing": {
    icon: <PenTool className="w-5 h-5" />,
    skills: [
      "Copywriting",
      "Technical Writing",
      "Content Strategy",
      "Blog Writing",
      "SEO Writing",
      "Creative Writing",
      "Proofreading",
      "Editing",
    ],
  },
  "Photography & Video": {
    icon: <Camera className="w-5 h-5" />,
    skills: [
      "Photography",
      "Video Editing",
      "Motion Graphics",
      "3D Modeling",
      "Animation",
      "Lightroom",
      "Final Cut Pro",
      "DaVinci Resolve",
    ],
  },
  "Soft Skills": {
    icon: <Star className="w-5 h-5" />,
    skills: [
      "Communication",
      "Project Management",
      "Leadership",
      "Problem Solving",
      "Time Management",
      "Client Relations",
      "Presentation",
      "Negotiation",
    ],
  },
}

const skillLevels = [
  { value: "beginner", label: "Beginner", description: "Learning the basics", color: "bg-yellow-100 text-yellow-800" },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Comfortable with most tasks",
    color: "bg-blue-100 text-blue-800",
  },
  { value: "expert", label: "Expert", description: "Advanced knowledge", color: "bg-green-100 text-green-800" },
]

export default function SkillsPage() {
  const router = useRouter()
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [customSkill, setCustomSkill] = useState("")
  const [customSkillLevel, setCustomSkillLevel] = useState<"beginner" | "intermediate" | "expert">("intermediate")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const addSkill = (
    skillName: string,
    category: string,
    level: "beginner" | "intermediate" | "expert" = "intermediate",
  ) => {
    if (!selectedSkills.find((skill) => skill.name.toLowerCase() === skillName.toLowerCase())) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: skillName,
        level,
        category,
      }
      setSelectedSkills([...selectedSkills, newSkill])
    }
  }

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill.id !== skillId))
  }

  const updateSkillLevel = (skillId: string, level: "beginner" | "intermediate" | "expert") => {
    setSelectedSkills(selectedSkills.map((skill) => (skill.id === skillId ? { ...skill, level } : skill)))
  }

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim(), "Custom", customSkillLevel)
      setCustomSkill("")
      setCustomSkillLevel("intermediate")
    }
  }

  const getFilteredSkills = () => {
    const allSkills = Object.entries(skillCategories).flatMap(([category, data]) =>
      data.skills.map((skill) => ({ skill, category })),
    )

    return allSkills.filter(({ skill, category }) => {
      const matchesSearch = skill.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || category === selectedCategory
      const notAlreadySelected = !selectedSkills.find((s) => s.name.toLowerCase() === skill.toLowerCase())
      return matchesSearch && matchesCategory && notAlreadySelected
    })
  }

  const getLevelColor = (level: string) => {
    const levelData = skillLevels.find((l) => l.value === level)
    return levelData?.color || "bg-gray-100 text-gray-800"
  }

  const handleNext = () => {
    if (selectedSkills.length >= 3) {
      router.push("/freelancer/onboarding/location")
    }
  }

  const handleSkip = () => {
    router.push("/freelancer/onboarding/location")
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
                6
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Skills & Expertise</h1>
                <p className="text-gray-600">Add your technical and soft skills</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Step 6 of 7</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85.7%" }}></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Selected Skills */}
          {selectedSkills.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-gray-900">Your Skills ({selectedSkills.length})</CardTitle>
                <p className="text-gray-600">Manage your skill levels and expertise</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {skillCategories[skill.category as keyof typeof skillCategories]?.icon || (
                            <Star className="w-5 h-5" />
                          )}
                          <span className="font-medium text-gray-900">{skill.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{skill.category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Select
                          value={skill.level}
                          onValueChange={(value: "beginner" | "intermediate" | "expert") =>
                            updateSkillLevel(skill.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {skillLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                          {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
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

          {/* Add Skills */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-gray-900">Add Skills</CardTitle>
              <p className="text-gray-600">Select from popular skills or add your own (minimum 3 skills required)</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                    Search Skills
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search for skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Filter by Category
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.keys(skillCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Skill Categories */}
              {selectedCategory === "all" ? (
                <div className="space-y-6">
                  {Object.entries(skillCategories).map(([category, data]) => (
                    <div key={category}>
                      <div className="flex items-center space-x-2 mb-3">
                        {data.icon}
                        <h3 className="font-semibold text-gray-900">{category}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {data.skills
                          .filter(
                            (skill) =>
                              skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              !selectedSkills.find((s) => s.name.toLowerCase() === skill.toLowerCase()),
                          )
                          .map((skill) => (
                            <Button
                              key={skill}
                              variant="outline"
                              size="sm"
                              onClick={() => addSkill(skill, category)}
                              className="justify-start text-sm h-10 hover:bg-blue-50 hover:border-blue-300"
                            >
                              + {skill}
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    {skillCategories[selectedCategory as keyof typeof skillCategories]?.icon}
                    <h3 className="font-semibold text-gray-900">{selectedCategory}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {getFilteredSkills().map(({ skill, category }) => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        onClick={() => addSkill(skill, category)}
                        className="justify-start text-sm h-10 hover:bg-blue-50 hover:border-blue-300"
                      >
                        + {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Skill */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Add Custom Skill</h3>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter custom skill..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    className="flex-1 h-12"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addCustomSkill()
                      }
                    }}
                  />
                  <Select value={customSkillLevel} onValueChange={setCustomSkillLevel}>
                    <SelectTrigger className="w-32 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addCustomSkill} disabled={!customSkill.trim()} className="h-12 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-6">
            <Button asChild variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Link href="/freelancer/onboarding/rates">
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
                disabled={selectedSkills.length < 3}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
