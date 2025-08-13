"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  BarChart3,
  Activity,
  Settings,
  Bell,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const adminStats = {
  totalUsers: 52847,
  activeFreelancers: 23456,
  activeClients: 18234,
  totalProjects: 125678,
  activeProjects: 3456,
  completedProjects: 118234,
  totalRevenue: 45678900,
  monthlyRevenue: 3456789,
  platformFee: 456789,
  disputesOpen: 23,
  disputesResolved: 1234,
  averageProjectValue: 2850,
  userGrowthRate: 15.6,
  projectSuccessRate: 94.2,
}

const recentUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    role: "freelancer",
    joinDate: "2024-01-15",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    completedJobs: 12,
    rating: 4.8,
    earnings: 15600,
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@company.com",
    role: "client",
    joinDate: "2024-01-14",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    projectsPosted: 8,
    totalSpent: 23400,
  },
  {
    id: 3,
    name: "David Chen",
    email: "david.chen@email.com",
    role: "freelancer",
    joinDate: "2024-01-13",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    completedJobs: 0,
    rating: 0,
    earnings: 0,
  },
]

const recentProjects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    client: "TechStart Inc.",
    freelancer: "Sarah Chen",
    budget: 5500,
    status: "in_progress",
    progress: 75,
    createdAt: "2024-01-10",
    category: "Web Development",
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    client: "FitLife Solutions",
    freelancer: "Marcus Johnson",
    budget: 3200,
    status: "completed",
    progress: 100,
    createdAt: "2024-01-08",
    category: "Design",
  },
  {
    id: 3,
    title: "SEO Optimization Campaign",
    client: "Digital Agency Pro",
    freelancer: "Elena Rodriguez",
    budget: 2800,
    status: "disputed",
    progress: 60,
    createdAt: "2024-01-05",
    category: "Digital Marketing",
  },
]

const disputes = [
  {
    id: 1,
    project: "WordPress Website Development",
    client: "Local Business Hub",
    freelancer: "John Smith",
    amount: 2500,
    reason: "Quality of work",
    status: "open",
    createdAt: "2024-01-12",
    priority: "high",
  },
  {
    id: 2,
    project: "Logo Design Package",
    client: "StartupXYZ",
    freelancer: "Lisa Wang",
    amount: 800,
    reason: "Missed deadline",
    status: "investigating",
    createdAt: "2024-01-11",
    priority: "medium",
  },
]

const platformMetrics = [
  { label: "User Retention Rate", value: "87.3%", change: "+2.1%", trend: "up" },
  { label: "Project Success Rate", value: "94.2%", change: "+1.8%", trend: "up" },
  { label: "Average Response Time", value: "2.4 hrs", change: "-0.3 hrs", trend: "up" },
  { label: "Platform Uptime", value: "99.9%", change: "0%", trend: "stable" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/images/bizzlink-icon.png" alt="Bizzlink" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  Bizzlink Admin
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`${activeTab === "overview" ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"} transition-colors`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`${activeTab === "users" ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"} transition-colors`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`${activeTab === "projects" ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"} transition-colors`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab("disputes")}
                  className={`${activeTab === "disputes" ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600"} transition-colors`}
                >
                  Disputes
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage the Bizzlink platform</p>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+{adminStats.userGrowthRate}% this month
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-2xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.activeProjects.toLocaleString()}</p>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {adminStats.totalProjects.toLocaleString()} total
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-2xl">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(adminStats.monthlyRevenue / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <DollarSign className="w-3 h-3 mr-1" />${(adminStats.totalRevenue / 1000000).toFixed(1)}M total
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-2xl">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Open Disputes</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.disputesOpen}</p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Needs attention
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-2xl">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Platform Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platformMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                        <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                      </div>
                      <div
                        className={`flex items-center text-sm ${
                          metric.trend === "up"
                            ? "text-green-600"
                            : metric.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {metric.trend === "up" && <TrendingUp className="w-4 h-4 mr-1" />}
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New user registration spike</p>
                      <p className="text-xs text-gray-600">+127 new users in the last hour</p>
                    </div>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">High-value project completed</p>
                      <p className="text-xs text-gray-600">$15,000 project successfully delivered</p>
                    </div>
                    <span className="text-xs text-gray-500">15 min ago</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Dispute escalated</p>
                      <p className="text-xs text-gray-600">Project #12847 requires admin review</p>
                    </div>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects and Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Projects</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("projects")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentProjects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-xl"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{project.title}</h4>
                        <p className="text-xs text-gray-600">
                          {project.client} → {project.freelancer}
                        </p>
                        <p className="text-xs text-gray-500">{project.category}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            project.status === "completed"
                              ? "default"
                              : project.status === "disputed"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs mb-1"
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                        <p className="text-sm font-medium text-gray-900">${project.budget.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Users</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("users")}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === "disputes" && (
          <div className="space-y-6">
            {/* Disputes Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dispute Management</h2>
                <p className="text-gray-600">Review and resolve platform disputes</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="rounded-xl bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Disputes</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Disputes List */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{dispute.project}</h4>
                          <p className="text-sm text-gray-600">
                            {dispute.client} vs {dispute.freelancer}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={dispute.priority === "high" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {dispute.priority} priority
                          </Badge>
                          <Badge variant={dispute.status === "open" ? "destructive" : "secondary"} className="text-xs">
                            {dispute.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Dispute Amount</p>
                          <p className="text-lg font-semibold text-gray-900">${dispute.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Reason</p>
                          <p className="text-sm text-gray-700">{dispute.reason}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Created</p>
                          <p className="text-sm text-gray-700">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Parties
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
