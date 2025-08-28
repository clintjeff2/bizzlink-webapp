"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Download,
  Edit,
  MessageSquare,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  Upload,
  Eye,
  Trash2,
  Award,
  TrendingUp,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

// Mock data - in real app, this would come from API
const projectDetails = {
  id: 1,
  title: "E-commerce Website Development with React & Node.js",
  description:
    "Complete e-commerce platform with user authentication, payment integration, inventory management, and admin dashboard. The project includes modern UI/UX design, responsive layout, secure payment processing, and comprehensive admin features for managing products, orders, and customers.",
  status: "in_progress",
  budget: { type: "fixed", amount: 5000 },
  postedDate: "2024-01-01",
  deadline: "2024-02-15",
  startDate: "2024-01-10",
  category: "Web Development",
  experienceLevel: "Expert",
  skills: ["React", "Node.js", "MongoDB", "Stripe", "JavaScript", "Express.js", "CSS", "HTML"],
  proposalCount: 34,
  hired: {
    freelancer: {
      id: 1,
      name: "Sarah Chen",
      avatar: "/professional-asian-woman-developer.png",
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 85,
      completedJobs: 89,
      location: "San Francisco, CA",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
      website: "https://sarahchen.dev",
      verified: true,
      topRated: true,
    },
    startDate: "2024-01-10",
    contractAmount: 5000,
  },
  milestones: [
    {
      id: 1,
      name: "Project Setup & Planning",
      description: "Initial project setup, requirements analysis, database design, and technical architecture planning",
      amount: 1500,
      completed: true,
      completedDate: "2024-01-15",
      approvedDate: "2024-01-16",
      dueDate: "2024-01-20",
      deliverables: [
        "Project structure",
        "Database schema",
        "Technical documentation",
        "Development environment setup",
      ],
    },
    {
      id: 2,
      name: "Frontend Development",
      description:
        "Complete frontend development with React, responsive design, user interface components, and user experience optimization",
      amount: 2000,
      completed: true,
      completedDate: "2024-01-28",
      approvedDate: "2024-01-30",
      dueDate: "2024-02-05",
      deliverables: [
        "React components",
        "Responsive design",
        "User authentication UI",
        "Product catalog interface",
        "Shopping cart functionality",
      ],
    },
    {
      id: 3,
      name: "Backend Integration & API Development",
      description: "Backend API development, database integration, payment processing, and comprehensive testing",
      amount: 1500,
      completed: false,
      completedDate: null,
      approvedDate: null,
      dueDate: "2024-02-15",
      deliverables: [
        "REST API endpoints",
        "Database integration",
        "Payment gateway integration",
        "User authentication system",
        "Admin dashboard backend",
      ],
      progress: 75,
    },
  ],
  progress: 65,
  totalSpent: 3500,
  messagesCount: 23,
  files: [
    {
      id: 1,
      name: "Project Requirements.pdf",
      size: "2.4 MB",
      uploadedBy: "client",
      uploadedDate: "2024-01-01",
      type: "document",
    },
    {
      id: 2,
      name: "Brand Guidelines.pdf",
      size: "1.8 MB",
      uploadedBy: "client",
      uploadedDate: "2024-01-02",
      type: "document",
    },
    {
      id: 3,
      name: "Database Schema.sql",
      size: "45 KB",
      uploadedBy: "freelancer",
      uploadedDate: "2024-01-15",
      type: "code",
    },
    {
      id: 4,
      name: "Frontend Mockups.fig",
      size: "12.3 MB",
      uploadedBy: "freelancer",
      uploadedDate: "2024-01-20",
      type: "design",
    },
    {
      id: 5,
      name: "Progress Screenshots.zip",
      size: "8.7 MB",
      uploadedBy: "freelancer",
      uploadedDate: "2024-01-28",
      type: "image",
    },
  ],
  timeline: [
    {
      date: "2024-01-01",
      event: "Project Posted",
      description: "Project was posted and opened for proposals",
      type: "project",
      user: "client",
    },
    {
      date: "2024-01-08",
      event: "Freelancer Hired",
      description: "Sarah Chen was hired for this project",
      type: "hire",
      user: "client",
    },
    {
      date: "2024-01-10",
      event: "Project Started",
      description: "Contract signed and project officially started",
      type: "start",
      user: "freelancer",
    },
    {
      date: "2024-01-15",
      event: "Milestone 1 Completed",
      description: "Project setup and planning phase completed",
      type: "milestone",
      user: "freelancer",
    },
    {
      date: "2024-01-16",
      event: "Milestone 1 Approved",
      description: "Client approved milestone 1 deliverables",
      type: "approval",
      user: "client",
    },
    {
      date: "2024-01-28",
      event: "Milestone 2 Completed",
      description: "Frontend development phase completed",
      type: "milestone",
      user: "freelancer",
    },
    {
      date: "2024-01-30",
      event: "Milestone 2 Approved",
      description: "Client approved milestone 2 deliverables",
      type: "approval",
      user: "client",
    },
  ],
  proposals: [
    {
      id: 1,
      freelancer: {
        name: "Sarah Chen",
        avatar: "/professional-asian-woman-developer.png",
        rating: 4.9,
        reviewCount: 127,
        location: "San Francisco, CA",
        verified: true,
        topRated: true,
      },
      bidAmount: 5000,
      deliveryTime: "6 weeks",
      coverLetter:
        "I'm excited to work on your e-commerce project. With 8+ years of experience in React and Node.js, I've built similar platforms for startups and enterprises. I'll ensure clean code, responsive design, and secure payment integration.",
      submittedDate: "2024-01-03",
      status: "hired",
    },
    {
      id: 2,
      freelancer: {
        name: "Marcus Johnson",
        avatar: "/professional-black-designer.png",
        rating: 5.0,
        reviewCount: 94,
        location: "New York, NY",
        verified: true,
        topRated: true,
      },
      bidAmount: 4500,
      deliveryTime: "7 weeks",
      coverLetter:
        "Hello! I specialize in full-stack development with React and Node.js. I can deliver a modern, scalable e-commerce solution with all the features you need.",
      submittedDate: "2024-01-04",
      status: "declined",
    },
    {
      id: 3,
      freelancer: {
        name: "Elena Rodriguez",
        avatar: "/latina-marketer.png",
        rating: 4.8,
        reviewCount: 203,
        location: "Austin, TX",
        verified: true,
        topRated: false,
      },
      bidAmount: 5500,
      deliveryTime: "5 weeks",
      coverLetter:
        "I'm a senior full-stack developer with expertise in e-commerce platforms. I can build a robust, secure solution that meets all your requirements.",
      submittedDate: "2024-01-05",
      status: "pending",
    },
  ],
}

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

const getTimelineIcon = (type: string) => {
  switch (type) {
    case "project":
      return <FileText className="w-4 h-4 text-blue-500" />
    case "hire":
      return <User className="w-4 h-4 text-green-500" />
    case "start":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "milestone":
      return <Star className="w-4 h-4 text-purple-500" />
    case "approval":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    default:
      return <Clock className="w-4 h-4 text-gray-500" />
  }
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "document":
      return <FileText className="w-4 h-4 text-red-500" />
    case "code":
      return <FileText className="w-4 h-4 text-green-500" />
    case "design":
      return <FileText className="w-4 h-4 text-purple-500" />
    case "image":
      return <FileText className="w-4 h-4 text-blue-500" />
    default:
      return <FileText className="w-4 h-4 text-gray-500" />
  }
}

export default function ClientProjectDetailPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user || user.role !== "client") {
    return <div>Please log in as a client to view project details.</div>
  }

  const completedMilestones = projectDetails.milestones.filter((m) => m.completed).length
  const totalMilestones = projectDetails.milestones.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/client/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{projectDetails.title}</h1>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(projectDetails.status)} flex items-center space-x-1`}
                >
                  {getStatusIcon(projectDetails.status)}
                  <span className="capitalize">{projectDetails.status.replace("_", " ")}</span>
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Posted {projectDetails.postedDate}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${projectDetails.budget.amount.toLocaleString()} Fixed Price</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Due {projectDetails.deadline}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span>{projectDetails.category}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Project
              </Button>
              {projectDetails.hired && (
                <Link href={`/messages?user=${projectDetails.hired.freelancer.name}`}>
                  <Button>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Freelancer
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            {projectDetails.hired && (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Project Progress</span>
                    <span className="text-2xl font-bold text-blue-600">{projectDetails.progress}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={projectDetails.progress} className="mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{completedMilestones}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{totalMilestones - completedMilestones}</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">
                        ${projectDetails.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">Spent</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="proposals">Proposals</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{projectDetails.description}</p>

                    <div>
                      <h4 className="font-semibold mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {projectDetails.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Project Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Experience Level:</span>
                            <span className="font-medium">{projectDetails.experienceLevel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Project Type:</span>
                            <span className="font-medium">
                              {projectDetails.budget.type === "fixed" ? "Fixed Price" : "Hourly"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Budget:</span>
                            <span className="font-medium">${projectDetails.budget.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Proposals Received:</span>
                            <span className="font-medium">{projectDetails.proposalCount}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Posted:</span>
                            <span className="font-medium">{projectDetails.postedDate}</span>
                          </div>
                          {projectDetails.startDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Started:</span>
                              <span className="font-medium">{projectDetails.startDate}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Deadline:</span>
                            <span className="font-medium">{projectDetails.deadline}</span>
                          </div>
                          {projectDetails.hired && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                              <span className="font-medium">36 days</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Milestones Tab */}
              <TabsContent value="milestones" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Project Milestones</CardTitle>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {completedMilestones} of {totalMilestones} completed
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {projectDetails.milestones.map((milestone, index) => (
                        <div key={milestone.id} className="relative">
                          {index < projectDetails.milestones.length - 1 && (
                            <div className="absolute left-4 top-12 w-0.5 h-24 bg-gray-200 dark:bg-gray-700"></div>
                          )}
                          <div className="flex items-start space-x-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                milestone.completed
                                  ? "bg-green-100 dark:bg-green-900/50"
                                  : "bg-gray-100 dark:bg-gray-700"
                              }`}
                            >
                              {milestone.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{milestone.name}</h4>
                                  <div className="text-right">
                                    <div className="font-semibold text-green-600">
                                      ${milestone.amount.toLocaleString()}
                                    </div>
                                    {milestone.progress && !milestone.completed && (
                                      <div className="text-xs text-gray-500 mt-1">{milestone.progress}% complete</div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{milestone.description}</p>

                                {milestone.deliverables && (
                                  <div className="mb-3">
                                    <h5 className="text-sm font-medium mb-2">Deliverables:</h5>
                                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                      {milestone.deliverables.map((deliverable, i) => (
                                        <li key={i} className="flex items-center space-x-2">
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                          <span>{deliverable}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {milestone.progress && !milestone.completed && (
                                  <div className="mb-3">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                      <span>Progress</span>
                                      <span>{milestone.progress}%</span>
                                    </div>
                                    <Progress value={milestone.progress} className="h-2" />
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>Due: {milestone.dueDate}</span>
                                  </div>
                                  {milestone.completed && (
                                    <>
                                      <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Completed: {milestone.completedDate}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Award className="w-3 h-3" />
                                        <span>Approved: {milestone.approvedDate}</span>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {milestone.completed && (
                                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline">
                                        <Download className="w-3 h-3 mr-1" />
                                        Download
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        <Eye className="w-3 h-3 mr-1" />
                                        Review
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Proposals Tab */}
              <TabsContent value="proposals" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Received Proposals ({projectDetails.proposalCount})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {projectDetails.proposals.map((proposal) => (
                        <div
                          key={proposal.id}
                          className={`p-4 rounded-lg border-2 ${
                            proposal.status === "hired"
                              ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={proposal.freelancer.avatar || "/placeholder.svg"}
                                alt={proposal.freelancer.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold">{proposal.freelancer.name}</h4>
                                  {proposal.freelancer.verified && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                  )}
                                  {proposal.freelancer.topRated && <Award className="w-4 h-4 text-yellow-500" />}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span>{proposal.freelancer.rating}</span>
                                    <span>({proposal.freelancer.reviewCount})</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{proposal.freelancer.location}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ${proposal.bidAmount.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">in {proposal.deliveryTime}</div>
                              <Badge
                                variant="outline"
                                className={`mt-2 ${
                                  proposal.status === "hired"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : proposal.status === "declined"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                }`}
                              >
                                {proposal.status}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-4">{proposal.coverLetter}</p>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Submitted {proposal.submittedDate}</span>
                            {proposal.status === "pending" && (
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  Message
                                </Button>
                                <Button size="sm">Hire</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Project Files</CardTitle>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Uploaded By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projectDetails.files.map((file) => (
                            <TableRow key={file.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {getFileIcon(file.type)}
                                  <span className="font-medium">{file.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{file.size}</TableCell>
                              <TableCell className="capitalize">{file.uploadedBy}</TableCell>
                              <TableCell>{file.uploadedDate}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  {file.uploadedBy === "client" && (
                                    <Button size="sm" variant="ghost" className="text-red-600">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {projectDetails.timeline.map((event, index) => (
                        <div key={index} className="relative">
                          {index < projectDetails.timeline.length - 1 && (
                            <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
                          )}
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                              {getTimelineIcon(event.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">{event.event}</h4>
                                <span className="text-sm text-gray-500">{event.date}</span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{event.description}</p>
                              <span className="text-xs text-gray-500 capitalize">by {event.user}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hired Freelancer */}
            {projectDetails.hired && (
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Hired Freelancer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={projectDetails.hired.freelancer.avatar || "/placeholder.svg"}
                      alt={projectDetails.hired.freelancer.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{projectDetails.hired.freelancer.name}</h4>
                        {projectDetails.hired.freelancer.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                        {projectDetails.hired.freelancer.topRated && <Award className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span>{projectDetails.hired.freelancer.rating}</span>
                        <span>•</span>
                        <span>{projectDetails.hired.freelancer.completedJobs} jobs</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{projectDetails.hired.freelancer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{projectDetails.hired.freelancer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {projectDetails.hired.freelancer.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <a
                        href={projectDetails.hired.freelancer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {projectDetails.hired.freelancer.website}
                      </a>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Contract Amount:</span>
                      <span className="font-semibold">${projectDetails.hired.contractAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Started:</span>
                      <span className="font-medium">{projectDetails.hired.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Hourly Rate:</span>
                      <span className="font-medium">${projectDetails.hired.freelancer.hourlyRate}/hr</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex space-x-2">
                    <Link href={`/messages?user=${projectDetails.hired.freelancer.name}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Stats */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total Budget</span>
                  <span className="font-semibold">${projectDetails.budget.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Amount Spent</span>
                  <span className="font-semibold text-green-600">${projectDetails.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Remaining</span>
                  <span className="font-semibold">
                    ${(projectDetails.budget.amount - projectDetails.totalSpent).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Proposals</span>
                  <span className="font-semibold">{projectDetails.proposalCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Messages</span>
                  <span className="font-semibold">{projectDetails.messagesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Files</span>
                  <span className="font-semibold">{projectDetails.files.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
