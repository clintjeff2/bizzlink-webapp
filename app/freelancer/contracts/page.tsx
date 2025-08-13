"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import {
  Search,
  Calendar,
  DollarSign,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const contracts = [
  {
    id: "CNT-001",
    title: "E-commerce Website Development",
    client: {
      name: "TechStart Inc.",
      avatar: "/business-client.png",
      rating: 4.8,
    },
    status: "active",
    type: "fixed",
    budget: 5500,
    earned: 2750,
    progress: 50,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    description: "Complete e-commerce platform with payment integration, inventory management, and admin dashboard.",
    milestones: [
      { name: "UI/UX Design", status: "completed", amount: 1375, dueDate: "2024-01-30" },
      { name: "Frontend Development", status: "in_progress", amount: 1375, dueDate: "2024-02-15" },
      { name: "Backend & Integration", status: "pending", amount: 1375, dueDate: "2024-02-28" },
      { name: "Testing & Deployment", status: "pending", amount: 1375, dueDate: "2024-03-15" },
    ],
    lastActivity: "2 hours ago",
  },
  {
    id: "CNT-002",
    title: "Mobile Banking App UI/UX",
    client: {
      name: "FinanceFlow Solutions",
      avatar: "/fitness-company.png",
      rating: 4.9,
    },
    status: "completed",
    type: "hourly",
    budget: 3200,
    earned: 3200,
    progress: 100,
    startDate: "2023-11-01",
    endDate: "2023-12-20",
    description:
      "Complete UI/UX design for mobile banking application with modern interface and seamless user experience.",
    milestones: [
      { name: "User Research & Wireframes", status: "completed", amount: 800, dueDate: "2023-11-15" },
      { name: "UI Design System", status: "completed", amount: 800, dueDate: "2023-11-30" },
      { name: "High-Fidelity Mockups", status: "completed", amount: 800, dueDate: "2023-12-10" },
      { name: "Prototype & Handoff", status: "completed", amount: 800, dueDate: "2023-12-20" },
    ],
    lastActivity: "1 week ago",
  },
  {
    id: "CNT-003",
    title: "SEO Optimization Campaign",
    client: {
      name: "Digital Growth Agency",
      avatar: "/modern-saas-office.png",
      rating: 4.7,
    },
    status: "disputed",
    type: "fixed",
    budget: 2800,
    earned: 1400,
    progress: 60,
    startDate: "2024-01-01",
    endDate: "2024-02-29",
    description: "Comprehensive SEO optimization including keyword research, content optimization, and link building.",
    milestones: [
      { name: "SEO Audit & Strategy", status: "completed", amount: 700, dueDate: "2024-01-10" },
      { name: "On-Page Optimization", status: "completed", amount: 700, dueDate: "2024-01-25" },
      { name: "Content Creation", status: "disputed", amount: 700, dueDate: "2024-02-10" },
      { name: "Link Building & Reporting", status: "pending", amount: 700, dueDate: "2024-02-29" },
    ],
    lastActivity: "3 days ago",
  },
  {
    id: "CNT-004",
    title: "React Native Food Delivery App",
    client: {
      name: "FoodieHub Startup",
      avatar: "/tech-startup-office.png",
      rating: 4.6,
    },
    status: "pending",
    type: "hourly",
    budget: 4500,
    earned: 0,
    progress: 0,
    startDate: "2024-02-01",
    endDate: "2024-04-01",
    description: "Cross-platform mobile app for food delivery with real-time tracking and payment integration.",
    milestones: [
      { name: "App Architecture Setup", status: "pending", amount: 1125, dueDate: "2024-02-15" },
      { name: "Core Features Development", status: "pending", amount: 1125, dueDate: "2024-03-01" },
      { name: "Payment & Tracking Integration", status: "pending", amount: 1125, dueDate: "2024-03-15" },
      { name: "Testing & App Store Submission", status: "pending", amount: 1125, dueDate: "2024-04-01" },
    ],
    lastActivity: "Not started",
  },
]

export default function FreelancerContractsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.client.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    const matchesType = typeFilter === "all" || contract.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

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
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const totalEarnings = contracts.reduce((sum, contract) => sum + contract.earned, 0)
  const activeContracts = contracts.filter((c) => c.status === "active").length
  const completedContracts = contracts.filter((c) => c.status === "completed").length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Contracts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your active and completed contracts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalEarnings.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Contracts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeContracts}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedContracts}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-6">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={contract.client.avatar || "/placeholder.svg"}
                      alt={contract.client.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{contract.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{contract.client.name}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-yellow-500">★</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{contract.client.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">{contract.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(contract.status)}>
                      {getStatusIcon(contract.status)}
                      <span className="ml-1 capitalize">{contract.status}</span>
                    </Badge>
                    <Badge variant="outline">{contract.type === "fixed" ? "Fixed Price" : "Hourly"}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${contract.budget.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Earned</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ${contract.earned.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Progress</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${contract.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{contract.progress}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Activity</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contract.lastActivity}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(contract.startDate).toLocaleDateString()} -{" "}
                      {new Date(contract.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/messages?contract=${contract.id}`}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Invoice
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/freelancer/contracts/${contract.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No contracts found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any contracts yet. Start by browsing available projects."}
              </p>
              <Button asChild>
                <Link href="/projects">Browse Projects</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
