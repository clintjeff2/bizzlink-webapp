"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
  MessageSquare,
  Calendar,
  Users,
  Plus,
  ArrowRight,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"

const dashboardStats = {
  totalSpent: 45600,
  activeProjects: 5,
  completedProjects: 23,
  averageRating: 4.8,
  totalFreelancers: 12,
  responseRate: 95,
}

const activeProjects = [
  {
    id: 1,
    title: "E-commerce Website Development",
    freelancer: "Sarah Chen",
    freelancerAvatar: "/professional-woman-developer.png",
    budget: 5500,
    progress: 75,
    deadline: "2024-02-15",
    status: "In Progress",
    lastUpdate: "2 hours ago",
    proposals: 34,
    hired: true,
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design",
    freelancer: "Marcus Johnson",
    freelancerAvatar: "/professional-man-designer.png",
    budget: 3200,
    progress: 45,
    deadline: "2024-02-28",
    status: "In Progress",
    lastUpdate: "1 day ago",
    proposals: 28,
    hired: true,
  },
  {
    id: 3,
    title: "Brand Identity Package",
    freelancer: null,
    freelancerAvatar: null,
    budget: 1800,
    progress: 0,
    deadline: "2024-03-10",
    status: "Accepting Proposals",
    lastUpdate: "3 hours ago",
    proposals: 15,
    hired: false,
  },
]

const recentMessages = [
  {
    id: 1,
    freelancer: "Sarah Chen",
    avatar: "/professional-woman-developer.png",
    message: "I've completed the homepage design. Please review and let me know your feedback.",
    time: "10 minutes ago",
    unread: true,
    project: "E-commerce Website",
  },
  {
    id: 2,
    freelancer: "Marcus Johnson",
    avatar: "/professional-man-designer.png",
    message: "The wireframes are ready for your review. I've incorporated all your feedback.",
    time: "2 hours ago",
    unread: false,
    project: "Mobile App Design",
  },
  {
    id: 3,
    freelancer: "Elena Rodriguez",
    avatar: "/professional-woman-marketer.png",
    message: "Thank you for choosing me for your SEO project. When can we schedule a kickoff call?",
    time: "1 day ago",
    unread: false,
    project: "SEO Campaign",
  },
]

const recentProposals = [
  {
    id: 1,
    project: "Brand Identity Package",
    freelancer: "Lisa Wang",
    avatar: "/placeholder.svg?height=32&width=32",
    bid: "$1,200",
    timeline: "2 weeks",
    rating: 4.9,
    completedJobs: 67,
    submittedAt: "2 hours ago",
  },
  {
    id: 2,
    project: "Brand Identity Package",
    freelancer: "David Kim",
    avatar: "/placeholder.svg?height=32&width=32",
    bid: "$1,500",
    timeline: "3 weeks",
    rating: 4.7,
    completedJobs: 45,
    submittedAt: "4 hours ago",
  },
  {
    id: 3,
    project: "Brand Identity Package",
    freelancer: "Anna Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    bid: "$1,800",
    timeline: "2 weeks",
    rating: 5.0,
    completedJobs: 89,
    submittedAt: "6 hours ago",
  },
]

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your projects and find the perfect freelancers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${dashboardStats.totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeProjects}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {dashboardStats.completedProjects} completed
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.averageRating}</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    From freelancers
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-2xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Freelancers Hired</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalFreelancers}</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    Across all projects
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Active Projects</CardTitle>
                  <Link href="/client/projects">
                    <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {project.freelancerAvatar ? (
                          <Image
                            src={project.freelancerAvatar || "/placeholder.svg"}
                            alt={project.freelancer || ""}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600">
                            {project.freelancer || `${project.proposals} proposals received`}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={project.status === "Accepting Proposals" ? "secondary" : "default"}
                        className={project.status === "Accepting Proposals" ? "bg-blue-100 text-blue-800" : ""}
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {project.hired && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                          <DollarSign className="w-4 h-4 inline mr-1" />${project.budget.toLocaleString()}
                        </span>
                        <span className="text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Due {new Date(project.deadline).toLocaleDateString()}
                        </span>
                        {!project.hired && (
                          <span className="text-gray-600">
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            {project.proposals} proposals
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">Updated {project.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Messages */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Messages</CardTitle>
                  <Link href="/messages">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <Image
                      src={message.avatar || "/placeholder.svg"}
                      alt={message.freelancer}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">{message.freelancer}</p>
                        {message.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{message.project}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Proposals */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Recent Proposals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProposals.map((proposal) => (
                  <div key={proposal.id} className="border border-gray-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Image
                          src={proposal.avatar || "/placeholder.svg"}
                          alt={proposal.freelancer}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{proposal.freelancer}</h4>
                          <div className="flex items-center text-xs text-gray-600">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span>{proposal.rating}</span>
                            <span className="mx-1">•</span>
                            <span>{proposal.completedJobs} jobs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-medium">{proposal.bid}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {proposal.timeline}
                        </span>
                      </div>
                      <span className="text-gray-500">{proposal.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/projects/post">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Project
                  </Button>
                </Link>
                <Link href="/freelancers">
                  <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                    <Users className="w-4 h-4 mr-2" />
                    Browse Freelancers
                  </Button>
                </Link>
                <Link href="/client/payments">
                  <Button variant="outline" className="w-full justify-start rounded-xl bg-transparent">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payment History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
