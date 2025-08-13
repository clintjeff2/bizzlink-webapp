"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  MessageSquare,
  Upload,
  Star,
  MapPin,
  Globe,
  Mail,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - in real app, this would come from API based on contract ID
const contractData = {
  id: "CNT-001",
  title: "E-commerce Website Development",
  client: {
    name: "TechStart Inc.",
    avatar: "/business-client.png",
    rating: 4.8,
    reviewsCount: 127,
    location: "San Francisco, CA",
    memberSince: "2022",
    email: "contact@techstart.com",
    phone: "+1 (555) 123-4567",
    website: "https://techstart.com",
    description:
      "Innovative tech startup focused on creating cutting-edge e-commerce solutions for small and medium businesses.",
    totalSpent: 45000,
    projectsCompleted: 12,
    hireRate: 85,
  },
  status: "active",
  type: "fixed",
  budget: 5500,
  earned: 2750,
  progress: 50,
  startDate: "2024-01-15",
  endDate: "2024-03-15",
  description:
    "Complete e-commerce platform with payment integration, inventory management, and admin dashboard. The project includes responsive design, user authentication, shopping cart functionality, and comprehensive admin panel.",
  requirements: [
    "Responsive web design compatible with all devices",
    "User registration and authentication system",
    "Product catalog with search and filtering",
    "Shopping cart and checkout process",
    "Payment gateway integration (Stripe/PayPal)",
    "Inventory management system",
    "Admin dashboard with analytics",
    "Order tracking and management",
    "Email notifications system",
    "SEO optimization",
  ],
  milestones: [
    {
      id: 1,
      name: "UI/UX Design & Wireframes",
      status: "completed",
      amount: 1375,
      dueDate: "2024-01-30",
      completedDate: "2024-01-28",
      description: "Complete UI/UX design including wireframes, mockups, and design system",
      deliverables: ["Wireframes", "High-fidelity mockups", "Design system", "Interactive prototype"],
    },
    {
      id: 2,
      name: "Frontend Development",
      status: "in_progress",
      amount: 1375,
      dueDate: "2024-02-15",
      description: "Frontend implementation using React and modern CSS frameworks",
      deliverables: ["Responsive homepage", "Product pages", "Shopping cart", "User authentication"],
    },
    {
      id: 3,
      name: "Backend & Integration",
      status: "pending",
      amount: 1375,
      dueDate: "2024-02-28",
      description: "Backend API development and third-party integrations",
      deliverables: ["REST API", "Database setup", "Payment integration", "Admin panel backend"],
    },
    {
      id: 4,
      name: "Testing & Deployment",
      status: "pending",
      amount: 1375,
      dueDate: "2024-03-15",
      description: "Comprehensive testing and production deployment",
      deliverables: ["Unit tests", "Integration tests", "Production deployment", "Documentation"],
    },
  ],
  communications: [
    {
      id: 1,
      type: "message",
      sender: "client",
      content: "Great progress on the design! The mockups look exactly what we envisioned.",
      timestamp: "2024-01-29T10:30:00Z",
    },
    {
      id: 2,
      type: "milestone_completed",
      content: "Milestone 1: UI/UX Design & Wireframes completed",
      timestamp: "2024-01-28T16:45:00Z",
    },
    {
      id: 3,
      type: "message",
      sender: "freelancer",
      content:
        "Thank you! I've started working on the frontend implementation. The responsive design is coming along nicely.",
      timestamp: "2024-01-30T09:15:00Z",
    },
  ],
  files: [
    { name: "Design_System.pdf", size: "2.4 MB", uploadDate: "2024-01-28", type: "pdf" },
    { name: "Wireframes_v2.fig", size: "15.7 MB", uploadDate: "2024-01-25", type: "figma" },
    { name: "Homepage_Mockup.png", size: "3.2 MB", uploadDate: "2024-01-28", type: "image" },
    { name: "Contract_Agreement.pdf", size: "1.1 MB", uploadDate: "2024-01-15", type: "pdf" },
  ],
}

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [newMessage, setNewMessage] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "disputed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "in_progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "disputed":
        return <AlertCircle className="w-4 h-4" />
      case "pending":
        return <Calendar className="w-4 h-4" />
      case "in_progress":
        return <Clock className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/freelancer/contracts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Contracts
              </Button>
            </Link>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{contractData.title}</h1>
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(contractData.status)}>
                  {getStatusIcon(contractData.status)}
                  <span className="ml-1 capitalize">{contractData.status}</span>
                </Badge>
                <Badge variant="outline">{contractData.type === "fixed" ? "Fixed Price" : "Hourly"}</Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">Contract ID: {contractData.id}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Contract
              </Button>
              <Button size="sm" asChild>
                <Link href={`/messages?contract=${contractData.id}`}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Client
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{contractData.progress}%</span>
                  </div>
                  <Progress value={contractData.progress} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${contractData.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Earned So Far</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${contractData.earned.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${(contractData.budget - contractData.earned).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {["overview", "milestones", "files", "communications"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{contractData.description}</p>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {contractData.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Start Date:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(contractData.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">End Date:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(contractData.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "milestones" && (
              <div className="space-y-4">
                {contractData.milestones.map((milestone) => (
                  <Card key={milestone.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{milestone.name}</h3>
                            <Badge className={getStatusColor(milestone.status)}>
                              {getStatusIcon(milestone.status)}
                              <span className="ml-1 capitalize">{milestone.status.replace("_", " ")}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{milestone.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Amount: </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                ${milestone.amount.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Due Date: </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(milestone.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {milestone.completedDate && (
                            <div className="mt-2 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Completed: </span>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                {new Date(milestone.completedDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Deliverables</h4>
                        <ul className="space-y-1">
                          {milestone.deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle
                                className={`w-4 h-4 ${milestone.status === "completed" ? "text-green-500" : "text-gray-300"}`}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "files" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Project Files</CardTitle>
                    <Button size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contractData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {file.size} • Uploaded {new Date(file.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "communications" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Communications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {contractData.communications.map((comm) => (
                      <div key={comm.id} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            comm.type === "message" ? "bg-blue-500" : "bg-green-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">{comm.content}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(comm.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <Textarea
                      placeholder="Add a note or update..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="mb-3"
                    />
                    <Button size="sm">Post Update</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src={contractData.client.avatar || "/placeholder.svg"}
                    alt={contractData.client.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{contractData.client.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {contractData.client.rating} ({contractData.client.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{contractData.client.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Member since {contractData.client.memberSince}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{contractData.client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={contractData.client.website} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {contractData.client.website}
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Total Spent</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${contractData.client.totalSpent.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Projects</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {contractData.client.projectsCompleted}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/messages?contract=${contractData.id}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Deliverable
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Request Milestone Payment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
