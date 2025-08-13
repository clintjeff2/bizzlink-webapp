"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Search, Calendar, Clock, User, FileText, CheckCircle, XCircle, Eye, MessageSquare, Send } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const proposals = [
  {
    id: "PROP-001",
    projectTitle: "Modern Restaurant Website",
    client: {
      name: "Bella Vista Restaurant",
      avatar: "/local-business.png",
      rating: 4.6,
      location: "New York, NY",
    },
    status: "pending",
    submittedDate: "2024-01-20",
    budget: 3500,
    proposedAmount: 3200,
    timeline: "6 weeks",
    coverLetter:
      "I'm excited to help create a stunning website for Bella Vista Restaurant. With my 5+ years of experience in restaurant web design, I understand the importance of showcasing your menu, atmosphere, and making online reservations seamless...",
    projectDescription:
      "Looking for a modern, responsive website for our upscale Italian restaurant. Need online reservation system, menu display, photo gallery, and contact information.",
    skills: ["React", "Node.js", "Restaurant Design", "Reservation Systems"],
    clientBudget: "$3,000 - $5,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Intermediate",
    proposalsCount: 12,
    lastActivity: "2 days ago",
  },
  {
    id: "PROP-002",
    projectTitle: "Mobile Fitness App Development",
    client: {
      name: "FitLife Solutions",
      avatar: "/fitness-company.png",
      rating: 4.9,
      location: "Los Angeles, CA",
    },
    status: "accepted",
    submittedDate: "2024-01-15",
    acceptedDate: "2024-01-18",
    budget: 8500,
    proposedAmount: 8000,
    timeline: "10 weeks",
    coverLetter:
      "Your fitness app project aligns perfectly with my expertise in React Native and health app development. I've successfully delivered 8 fitness apps with features like workout tracking, nutrition logging, and social features...",
    projectDescription:
      "Develop a comprehensive fitness tracking app with workout plans, nutrition tracking, progress analytics, and social features for iOS and Android.",
    skills: ["React Native", "Firebase", "Health APIs", "UI/UX Design"],
    clientBudget: "$7,000 - $10,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Expert",
    proposalsCount: 8,
    lastActivity: "Contract started",
  },
  {
    id: "PROP-003",
    projectTitle: "E-learning Platform Backend",
    client: {
      name: "EduTech Innovations",
      avatar: "/tech-startup-office.png",
      rating: 4.7,
      location: "Austin, TX",
    },
    status: "rejected",
    submittedDate: "2024-01-10",
    rejectedDate: "2024-01-14",
    budget: 6000,
    proposedAmount: 5800,
    timeline: "8 weeks",
    coverLetter:
      "I'm passionate about educational technology and would love to contribute to your e-learning platform. My experience with scalable backend systems and educational content management makes me a great fit...",
    projectDescription:
      "Build a robust backend system for an e-learning platform with user management, course content delivery, progress tracking, and payment processing.",
    skills: ["Node.js", "PostgreSQL", "AWS", "Payment Integration"],
    clientBudget: "$5,000 - $8,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Expert",
    proposalsCount: 15,
    lastActivity: "Proposal declined",
    rejectionReason: "Client chose a different freelancer with more e-learning experience",
  },
  {
    id: "PROP-004",
    projectTitle: "Brand Identity & Logo Design",
    client: {
      name: "StartupXYZ",
      avatar: "/data-company.png",
      rating: 4.5,
      location: "Seattle, WA",
    },
    status: "interviewing",
    submittedDate: "2024-01-22",
    budget: 2500,
    proposedAmount: 2300,
    timeline: "4 weeks",
    coverLetter:
      "I specialize in creating memorable brand identities for startups. My design process focuses on understanding your target audience and creating a visual identity that resonates with your brand values...",
    projectDescription:
      "Create a complete brand identity package including logo design, color palette, typography, business cards, and brand guidelines for a tech startup.",
    skills: ["Logo Design", "Brand Identity", "Adobe Creative Suite", "Brand Strategy"],
    clientBudget: "$2,000 - $3,500",
    projectType: "Fixed Price",
    duration: "Less than 1 month",
    experienceLevel: "Intermediate",
    proposalsCount: 20,
    lastActivity: "Interview scheduled for tomorrow",
  },
  {
    id: "PROP-005",
    projectTitle: "WordPress E-commerce Store",
    client: {
      name: "Artisan Crafts Co.",
      avatar: "/local-business.png",
      rating: 4.4,
      location: "Portland, OR",
    },
    status: "pending",
    submittedDate: "2024-01-25",
    budget: 4200,
    proposedAmount: 3800,
    timeline: "5 weeks",
    coverLetter:
      "I'd love to help bring your artisan crafts online! With extensive experience in WooCommerce and custom WordPress development, I can create a beautiful, functional store that showcases your handmade products...",
    projectDescription:
      "Develop a WordPress e-commerce website using WooCommerce for selling handmade crafts. Need custom product pages, inventory management, and payment processing.",
    skills: ["WordPress", "WooCommerce", "PHP", "E-commerce"],
    clientBudget: "$3,500 - $5,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Intermediate",
    proposalsCount: 9,
    lastActivity: "1 day ago",
  },
]

export default function FreelancerProposalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredProposals = proposals
    .filter((proposal) => {
      const matchesSearch =
        proposal.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.client.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || proposal.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime()
      } else if (sortBy === "amount_high") {
        return b.proposedAmount - a.proposedAmount
      } else if (sortBy === "amount_low") {
        return a.proposedAmount - b.proposedAmount
      }
      return 0
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "interviewing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "interviewing":
        return <User className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const totalProposals = proposals.length
  const pendingProposals = proposals.filter((p) => p.status === "pending").length
  const acceptedProposals = proposals.filter((p) => p.status === "accepted").length
  const interviewingProposals = proposals.filter((p) => p.status === "interviewing").length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Proposals</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your project proposals and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Proposals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProposals}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                  <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingProposals}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-2xl">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviewing</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{interviewingProposals}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-2xl">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{acceptedProposals}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                  placeholder="Search proposals..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount_high">Amount (High)</SelectItem>
                  <SelectItem value="amount_low">Amount (Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Proposals List */}
        <div className="space-y-6">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={proposal.client.avatar || "/placeholder.svg"}
                      alt={proposal.client.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {proposal.projectTitle}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{proposal.client.name}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-yellow-500">★</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{proposal.client.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{proposal.client.location}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {proposal.projectDescription}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {proposal.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {proposal.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{proposal.skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(proposal.status)}>
                      {getStatusIcon(proposal.status)}
                      <span className="ml-1 capitalize">{proposal.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Bid</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${proposal.proposedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Client Budget</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{proposal.clientBudget}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{proposal.timeline}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Proposals</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{proposal.proposalsCount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted {new Date(proposal.submittedDate).toLocaleDateString()}</span>
                    </div>
                    {proposal.acceptedDate && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Accepted {new Date(proposal.acceptedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {proposal.rejectedDate && (
                      <div className="flex items-center space-x-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>Rejected {new Date(proposal.rejectedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {proposal.status === "accepted" && (
                      <Button size="sm" asChild>
                        <Link href={`/freelancer/contracts/${proposal.id.replace("PROP", "CNT")}`}>View Contract</Link>
                      </Button>
                    )}
                    {proposal.status === "interviewing" && (
                      <Button size="sm" asChild>
                        <Link href={`/messages?proposal=${proposal.id}`}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Client
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/freelancer/proposals/${proposal.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>

                {proposal.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      <strong>Rejection Reason:</strong> {proposal.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProposals.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No proposals found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't submitted any proposals yet. Start by browsing available projects."}
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
