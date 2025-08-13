"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Star,
  MapPin,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import Image from "next/image"

const projects = [
  {
    id: 1,
    title: "E-commerce Website Development with React & Node.js",
    description:
      "Complete e-commerce platform with user authentication, payment integration, inventory management, and admin dashboard. Must have experience with React, Node.js, MongoDB, and Stripe integration.",
    status: "in_progress",
    budget: { type: "fixed", amount: 5000 },
    postedDate: "2024-01-01",
    deadline: "2024-02-15",
    category: "Web Development",
    skills: ["React", "Node.js", "MongoDB", "Stripe", "JavaScript"],
    proposals: 34,
    hired: {
      freelancer: {
        name: "Sarah Chen",
        avatar: "/professional-asian-woman-developer.png",
        rating: 4.9,
        hourlyRate: 85,
      },
      startDate: "2024-01-10",
    },
    milestones: [
      { name: "Project Setup", completed: true, amount: 1500 },
      { name: "Frontend Development", completed: true, amount: 2000 },
      { name: "Backend Integration", completed: false, amount: 1500 },
    ],
    progress: 65,
    totalSpent: 3500,
    messagesCount: 23,
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design for Fitness Platform",
    description:
      "Need a talented UI/UX designer to create a modern, intuitive design for our fitness tracking mobile app. The design should include onboarding screens, workout tracking, progress analytics, and social features.",
    status: "completed",
    budget: { type: "fixed", amount: 3500 },
    postedDate: "2023-12-15",
    deadline: "2024-01-20",
    category: "Design",
    skills: ["UI/UX Design", "Figma", "Mobile Design", "Prototyping"],
    proposals: 28,
    hired: {
      freelancer: {
        name: "Marcus Johnson",
        avatar: "/professional-black-designer.png",
        rating: 5.0,
        hourlyRate: 75,
      },
      startDate: "2023-12-20",
      completedDate: "2024-01-18",
    },
    milestones: [
      { name: "Wireframes", completed: true, amount: 1000 },
      { name: "UI Design", completed: true, amount: 1500 },
      { name: "Prototyping", completed: true, amount: 1000 },
    ],
    progress: 100,
    totalSpent: 3500,
    messagesCount: 15,
    rating: 5,
    feedback: "Exceptional work! Marcus delivered exactly what we needed.",
  },
  {
    id: 3,
    title: "SEO & Content Marketing Strategy for SaaS Platform",
    description:
      "Seeking an experienced SEO specialist and content marketer to develop and execute a comprehensive strategy for our B2B SaaS platform. Need someone who can create high-quality content, optimize for search engines, and drive organic traffic growth.",
    status: "active",
    budget: { type: "hourly", min: 50, max: 80 },
    postedDate: "2024-01-05",
    deadline: "2024-04-05",
    category: "Digital Marketing",
    skills: ["SEO", "Content Marketing", "Google Analytics", "Keyword Research"],
    proposals: 19,
    hired: null,
    milestones: [],
    progress: 0,
    totalSpent: 0,
    messagesCount: 0,
  },
  {
    id: 4,
    title: "Brand Identity & Logo Design for Tech Startup",
    description:
      "New tech startup needs a complete brand identity package including logo design, color palette, typography, and brand guidelines. Looking for a creative designer who can capture our innovative and modern vision.",
    status: "draft",
    budget: { type: "fixed", amount: 2000 },
    postedDate: null,
    deadline: "2024-02-28",
    category: "Design",
    skills: ["Logo Design", "Brand Identity", "Adobe Illustrator", "Typography"],
    proposals: 0,
    hired: null,
    milestones: [],
    progress: 0,
    totalSpent: 0,
    messagesCount: 0,
  },
  {
    id: 5,
    title: "WordPress Website Development & Customization",
    description:
      "Need a WordPress developer to create a custom business website with advanced functionality. Requirements include custom theme development, plugin integration, SEO optimization, and responsive design.",
    status: "paused",
    budget: { type: "fixed", amount: 2750 },
    postedDate: "2023-12-01",
    deadline: "2024-01-30",
    category: "Web Development",
    skills: ["WordPress", "PHP", "CSS", "JavaScript", "MySQL"],
    proposals: 31,
    hired: {
      freelancer: {
        name: "David Kim",
        avatar: "/asian-mobile-developer.png",
        rating: 4.7,
        hourlyRate: 65,
      },
      startDate: "2023-12-10",
    },
    milestones: [
      { name: "Theme Setup", completed: true, amount: 750 },
      { name: "Content Migration", completed: false, amount: 1000 },
      { name: "Customization", completed: false, amount: 1000 },
    ],
    progress: 25,
    totalSpent: 750,
    messagesCount: 8,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "in_progress":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "paused":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Clock className="w-4 h-4" />
    case "in_progress":
      return <Clock className="w-4 h-4" />
    case "completed":
      return <CheckCircle className="w-4 h-4" />
    case "paused":
      return <AlertCircle className="w-4 h-4" />
    case "draft":
      return <Clock className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function ClientProjectsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && (project.status === "active" || project.status === "in_progress")) ||
      (activeTab === "completed" && project.status === "completed") ||
      (activeTab === "draft" && project.status === "draft")

    return matchesSearch && matchesStatus && matchesCategory && matchesTab
  })

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active" || p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
    totalSpent: projects.reduce((sum, p) => sum + p.totalSpent, 0),
  }

  if (!user || user.role !== "client") {
    return <div>Please log in as a client to view your projects.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Projects</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage and track all your posted projects</p>
            </div>
            <Link href="/projects/post">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Post New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-blue-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+2 this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Projects</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-purple-100">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">{stats.active} in progress</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-green-100">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">4.8 avg rating</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-orange-100">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+15% this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <TabsList className="grid w-full lg:w-auto grid-cols-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredProjects.length === 0 ? (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by posting your first project"}
                  </p>
                  {!searchQuery && statusFilter === "all" && categoryFilter === "all" && (
                    <Link href="/projects/post">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Project
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1 lg:mr-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer">
                                  {project.title}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={`${getStatusColor(project.status)} flex items-center space-x-1`}
                                >
                                  {getStatusIcon(project.status)}
                                  <span className="capitalize">{project.status.replace("_", " ")}</span>
                                </Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {project.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.skills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {project.skills.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.skills.length - 5} more
                              </Badge>
                            )}
                          </div>

                          {project.hired && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Image
                                    src={project.hired.freelancer.avatar || "/placeholder.svg"}
                                    alt={project.hired.freelancer.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">{project.hired.freelancer.name}</p>
                                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      <span>{project.hired.freelancer.rating}</span>
                                      <span>•</span>
                                      <span>${project.hired.freelancer.hourlyRate}/hr</span>
                                    </div>
                                  </div>
                                </div>
                                {project.status === "in_progress" && (
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {project.progress}% Complete
                                    </div>
                                    <Progress value={project.progress} className="w-24 mt-1" />
                                  </div>
                                )}
                              </div>
                              {project.status === "completed" && project.rating && (
                                <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < project.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm font-medium">{project.rating}/5</span>
                                  </div>
                                  {project.feedback && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                                      "{project.feedback}"
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-medium">
                                {project.budget.type === "fixed"
                                  ? `$${project.budget.amount.toLocaleString()} Fixed`
                                  : `$${project.budget.min}-${project.budget.max}/hr`}
                              </span>
                            </div>
                            {project.proposals > 0 && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{project.proposals} proposals</span>
                              </div>
                            )}
                            {project.messagesCount > 0 && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="w-4 h-4" />
                                <span>{project.messagesCount} messages</span>
                              </div>
                            )}
                            {project.postedDate && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Posted {project.postedDate}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{project.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-3 lg:w-48">
                          {project.totalSpent > 0 && (
                            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="text-lg font-bold text-green-600">
                                ${project.totalSpent.toLocaleString()}
                              </div>
                              <div className="text-xs text-green-700 dark:text-green-300">Total Spent</div>
                            </div>
                          )}

                          <div className="flex flex-col space-y-2">
                            <Link href={`/client/projects/${project.id}`}>
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>

                            {project.hired && (
                              <Link href={`/messages?user=${project.hired.freelancer.name}`}>
                                <Button variant="outline" className="w-full bg-transparent">
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Message
                                </Button>
                              </Link>
                            )}

                            {project.status === "draft" && (
                              <Button variant="outline" className="w-full bg-transparent">
                                Edit Draft
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
