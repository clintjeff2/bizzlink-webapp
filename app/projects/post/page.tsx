"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { ArrowRight, ArrowLeft, Upload, X, DollarSign, Calendar, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

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

const skills = [
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
  "SEO",
  "Google Ads",
  "Facebook Ads",
  "Content Marketing",
  "Email Marketing",
  "WordPress",
  "Shopify",
  "Magento",
  "WooCommerce",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "DevOps",
]

export default function PostProjectPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [projectData, setProjectData] = useState({
    title: "",
    category: "",
    description: "",
    requirements: "",
    skills: [] as string[],
    budgetType: "",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
    experienceLevel: "",
    projectType: "",
    attachments: [] as File[],
    milestones: [{ title: "", description: "", amount: "" }],
  })

  const handleInputChange = (field: string, value: any) => {
    setProjectData((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = (skill: string) => {
    if (!projectData.skills.includes(skill)) {
      handleInputChange("skills", [...projectData.skills, skill])
    }
  }

  const removeSkill = (skill: string) => {
    handleInputChange(
      "skills",
      projectData.skills.filter((s) => s !== skill),
    )
  }

  const addMilestone = () => {
    handleInputChange("milestones", [...projectData.milestones, { title: "", description: "", amount: "" }])
  }

  const removeMilestone = (index: number) => {
    const newMilestones = projectData.milestones.filter((_, i) => i !== index)
    handleInputChange("milestones", newMilestones)
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = projectData.milestones.map((milestone, i) =>
      i === index ? { ...milestone, [field]: value } : milestone,
    )
    handleInputChange("milestones", newMilestones)
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push("/client/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Project</h1>
          <p className="text-gray-600">Find the perfect freelancer for your project</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {["Project Details", "Requirements", "Budget & Timeline", "Review & Post"].map((stepName, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index + 1 <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${index + 1 <= step ? "text-blue-600" : "text-gray-500"}`}>
                  {stepName}
                </span>
                {index < 3 && <div className={`w-16 h-1 mx-4 ${index + 1 < step ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-base font-medium text-gray-900 mb-2 block">
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Build a responsive e-commerce website"
                    value={projectData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="h-12 text-base"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Write a clear, descriptive title that explains what you need done
                  </p>
                </div>

                <div>
                  <Label htmlFor="category" className="text-base font-medium text-gray-900 mb-2 block">
                    Category
                  </Label>
                  <Select value={projectData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a category" />
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

                <div>
                  <Label htmlFor="description" className="text-base font-medium text-gray-900 mb-2 block">
                    Project Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail. What are you looking to accomplish?"
                    value={projectData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={6}
                    className="text-base"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 100 characters. Be specific about what you want to achieve.
                  </p>
                </div>

                <div>
                  <Label htmlFor="projectType" className="text-base font-medium text-gray-900 mb-2 block">
                    Project Type
                  </Label>
                  <Select
                    value={projectData.projectType}
                    onValueChange={(value) => handleInputChange("projectType", value)}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time project</SelectItem>
                      <SelectItem value="ongoing">Ongoing work</SelectItem>
                      <SelectItem value="contract">Contract to hire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="requirements" className="text-base font-medium text-gray-900 mb-2 block">
                    Detailed Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder="List specific requirements, deliverables, and any technical specifications..."
                    value={projectData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    rows={6}
                    className="text-base"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium text-gray-900 mb-2 block">Required Skills</Label>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {projectData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-2 text-gray-500 hover:text-gray-700">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {skills
                        .filter((skill) => !projectData.skills.includes(skill))
                        .slice(0, 12)
                        .map((skill) => (
                          <Button
                            key={skill}
                            variant="outline"
                            size="sm"
                            onClick={() => addSkill(skill)}
                            className="justify-start text-sm"
                          >
                            + {skill}
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="experienceLevel" className="text-base font-medium text-gray-900 mb-2 block">
                    Experience Level Required
                  </Label>
                  <Select
                    value={projectData.experienceLevel}
                    onValueChange={(value) => handleInputChange("experienceLevel", value)}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">
                        Entry Level - Looking for someone relatively new to this field
                      </SelectItem>
                      <SelectItem value="intermediate">
                        Intermediate - Looking for substantial experience in this field
                      </SelectItem>
                      <SelectItem value="expert">
                        Expert - Looking for comprehensive and deep expertise in this field
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium text-gray-900 mb-2 block">Attachments (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload any files that will help freelancers understand your project better
                    </p>
                    <Button variant="outline" size="sm">
                      Choose Files
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF (Max 25MB each)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium text-gray-900 mb-4 block">Budget Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => handleInputChange("budgetType", "fixed")}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        projectData.budgetType === "fixed"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Fixed Price</h3>
                          <p className="text-sm text-gray-600">Pay a fixed amount for the entire project</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => handleInputChange("budgetType", "hourly")}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        projectData.budgetType === "hourly"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">Hourly Rate</h3>
                          <p className="text-sm text-gray-600">Pay based on hours worked</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {projectData.budgetType && (
                  <div>
                    <Label className="text-base font-medium text-gray-900 mb-2 block">
                      {projectData.budgetType === "fixed" ? "Project Budget" : "Hourly Rate Range"}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budgetMin" className="text-sm text-gray-600 mb-1 block">
                          Minimum ($)
                        </Label>
                        <Input
                          id="budgetMin"
                          type="number"
                          placeholder="500"
                          value={projectData.budgetMin}
                          onChange={(e) => handleInputChange("budgetMin", e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budgetMax" className="text-sm text-gray-600 mb-1 block">
                          Maximum ($)
                        </Label>
                        <Input
                          id="budgetMax"
                          type="number"
                          placeholder="1500"
                          value={projectData.budgetMax}
                          onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="timeline" className="text-base font-medium text-gray-900 mb-2 block">
                    Project Timeline
                  </Label>
                  <Select value={projectData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1-month">Less than 1 month</SelectItem>
                      <SelectItem value="1-3-months">1 to 3 months</SelectItem>
                      <SelectItem value="3-6-months">3 to 6 months</SelectItem>
                      <SelectItem value="more-than-6-months">More than 6 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {projectData.budgetType === "fixed" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-medium text-gray-900">Project Milestones (Optional)</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                        Add Milestone
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {projectData.milestones.map((milestone, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Milestone {index + 1}</h4>
                            {projectData.milestones.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeMilestone(index)}>
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              placeholder="Milestone title"
                              value={milestone.title}
                              onChange={(e) => updateMilestone(index, "title", e.target.value)}
                            />
                            <Input
                              placeholder="Description"
                              value={milestone.description}
                              onChange={(e) => updateMilestone(index, "description", e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Amount ($)"
                              value={milestone.amount}
                              onChange={(e) => updateMilestone(index, "amount", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{projectData.title}</h4>
                      <p className="text-sm text-gray-600">{projectData.category}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-sm text-gray-700">{projectData.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {projectData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Budget</h4>
                        <p className="text-sm text-gray-700">
                          ${projectData.budgetMin} - ${projectData.budgetMax}
                          {projectData.budgetType === "hourly" ? "/hour" : " total"}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Timeline</h4>
                        <p className="text-sm text-gray-700">{projectData.timeline?.replace("-", " ")}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Experience Level</h4>
                        <p className="text-sm text-gray-700 capitalize">{projectData.experienceLevel}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your project will be posted and visible to freelancers</li>
                    <li>• You'll start receiving proposals within hours</li>
                    <li>• Review proposals and interview your favorite freelancers</li>
                    <li>• Hire the best freelancer and start your project</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              )}

              <div className="ml-auto">
                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center space-x-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Posting Project...</span>
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-4 h-4" />
                        <span>Post Project</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
