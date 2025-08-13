"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/components/auth-provider"
import { Mail, Phone, MapPin, Globe, Camera, Plus, X, Star, DollarSign, Award } from "lucide-react"
import Image from "next/image"

const skillsList = [
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

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    title: "Full-Stack Developer & UI/UX Designer",
    bio: "Passionate full-stack developer with 5+ years of experience creating beautiful, functional web applications. I specialize in React, Node.js, and modern design principles. I love turning complex problems into simple, beautiful solutions.",
    hourlyRate: "75",
    availability: "available",
    skills: ["React", "Node.js", "TypeScript", "Figma", "Python", "AWS"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Mandarin", proficiency: "Fluent" },
      { language: "Spanish", proficiency: "Conversational" },
    ],
    education: [
      {
        degree: "Bachelor of Computer Science",
        school: "Stanford University",
        year: "2019",
        description: "Graduated Magna Cum Laude with focus on Software Engineering and Human-Computer Interaction",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        year: "2023",
        credentialId: "AWS-CSA-2023-001",
      },
      {
        name: "Google UX Design Certificate",
        issuer: "Google",
        year: "2022",
        credentialId: "GOOGLE-UX-2022-456",
      },
    ],
    portfolio: [
      {
        title: "E-commerce Platform",
        description: "Full-stack e-commerce solution built with React and Node.js",
        image: "/ecommerce-website-homepage.png",
        url: "https://example-ecommerce.com",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      },
      {
        title: "Mobile Banking App",
        description: "iOS and Android banking app with modern UI/UX",
        image: "/mobile-banking-app.png",
        url: "https://example-banking-app.com",
        technologies: ["React Native", "Firebase", "Figma"],
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time analytics dashboard for SaaS companies",
        image: "/general-dashboard-interface.png",
        url: "https://example-dashboard.com",
        technologies: ["Vue.js", "D3.js", "Python", "PostgreSQL"],
      },
    ],
  })

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const addSkill = (skill: string) => {
    if (!profileData.skills.includes(skill)) {
      handleInputChange("skills", [...profileData.skills, skill])
    }
  }

  const removeSkill = (skill: string) => {
    handleInputChange(
      "skills",
      profileData.skills.filter((s) => s !== skill),
    )
  }

  const saveProfile = () => {
    // Save profile logic here
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your professional profile and showcase your skills</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Image
                    src={user?.photoURL || "/placeholder.svg"}
                    alt={user?.displayName || "Profile"}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full mx-auto"
                  />
                  {isEditing && (
                    <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="First Name"
                    />
                    <Input
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Last Name"
                    />
                    <Input
                      value={profileData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Professional Title"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-gray-600 mb-4">{profileData.title}</p>
                  </>
                )}

                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.9</span>
                  </div>
                  <div className="text-sm text-gray-600">47 reviews</div>
                </div>

                <Badge
                  variant={profileData.availability === "available" ? "default" : "secondary"}
                  className={profileData.availability === "available" ? "bg-green-100 text-green-800" : ""}
                >
                  {profileData.availability === "available" ? "Available for work" : "Busy"}
                </Badge>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <Input
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <Input
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <Input
                        value={profileData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Location"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <Input
                        value={profileData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="Website"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{profileData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{profileData.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a href={profileData.website} className="text-sm text-blue-600 hover:text-blue-700">
                        {profileData.website}
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Hourly Rate */}
            {user?.role === "freelancer" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Hourly Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">$</span>
                      <Input
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                        placeholder="75"
                      />
                      <span className="text-gray-600">/hour</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-green-600">${profileData.hourlyRate}/hour</div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {["overview", "portfolio", "education"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* About */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        rows={4}
                        placeholder="Tell clients about yourself..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {profileData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-3 py-1">
                            {skill}
                            {isEditing && (
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {skillsList
                            .filter((skill) => !profileData.skills.includes(skill))
                            .slice(0, 9)
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
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profileData.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{lang.language}</span>
                          <Badge variant="outline">{lang.proficiency}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profileData.portfolio.map((project, index) => (
                    <Card key={index} className="border-0 shadow-lg overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          View Project →
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                {/* Education */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Education
                      </CardTitle>
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-blue-200 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                            <span className="text-sm text-gray-500">{edu.year}</span>
                          </div>
                          <p className="text-blue-600 font-medium mb-2">{edu.school}</p>
                          <p className="text-sm text-gray-600">{edu.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Certifications
                      </CardTitle>
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Certification
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                            <span className="text-sm text-gray-500">{cert.year}</span>
                          </div>
                          <p className="text-blue-600 font-medium mb-1">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">Credential ID: {cert.credentialId}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
