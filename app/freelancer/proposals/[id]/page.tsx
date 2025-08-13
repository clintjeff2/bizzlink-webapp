"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  MapPin,
  Globe,
  Mail,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - in real app, this would come from API based on proposal ID
const proposalData = {
  id: "PROP-001",
  projectTitle: "Modern Restaurant Website",
  client: {
    name: "Bella Vista Restaurant",
    avatar: "/local-business.png",
    rating: 4.6,
    reviewsCount: 23,
    location: "New York, NY",
    memberSince: "2023",
    email: "info@bellavista.com",
    phone: "+1 (555) 987-6543",
    website: "https://bellavista.com",
    description:
      "Family-owned Italian restaurant serving authentic cuisine in the heart of Manhattan for over 15 years.",
    totalSpent: 12500,
    projectsPosted: 5,
    hireRate: 80,
    averageRating: 4.6,
    completedProjects: 4,
  },
  status: "pending",
  submittedDate: "2024-01-20T14:30:00Z",
  budget: 3500,
  proposedAmount: 3200,
  timeline: "6 weeks",
  coverLetter: `Dear Bella Vista Restaurant Team,

I'm excited to help create a stunning website for your restaurant that truly captures the essence of your authentic Italian cuisine and warm atmosphere.

With over 5 years of experience specializing in restaurant web design, I understand the unique challenges and opportunities in the hospitality industry. I've successfully delivered 15+ restaurant websites that have helped increase online reservations by an average of 40% and improved customer engagement significantly.

Here's what I'll deliver for your project:

🍝 **Modern, Responsive Design**: A beautiful, mobile-first website that looks stunning on all devices
📱 **Online Reservation System**: Seamless booking integration with real-time availability
📋 **Dynamic Menu Display**: Easy-to-update menu with high-quality food photography
📸 **Photo Gallery**: Showcase your restaurant's ambiance and signature dishes
📍 **Location & Contact**: Interactive maps and clear contact information
⭐ **Customer Reviews**: Integration with review platforms to build trust
📧 **Email Integration**: Newsletter signup and automated confirmations

I'll use modern technologies including React.js for the frontend, Node.js for the backend, and integrate with popular reservation systems like OpenTable or Resy. The website will be fully SEO optimized to help you rank higher in local searches.

My approach includes:
1. Discovery call to understand your brand and goals
2. Wireframes and design mockups for your approval
3. Development with regular progress updates
4. Testing across all devices and browsers
5. Training on content management
6. 30 days of post-launch support

I'm confident I can deliver a website that not only looks beautiful but drives real business results. I'd love to discuss your vision in more detail and answer any questions you might have.

Looking forward to working with you!

Best regards,
Sarah Chen`,
  projectDescription:
    "Looking for a modern, responsive website for our upscale Italian restaurant. Need online reservation system, menu display, photo gallery, and contact information. The site should reflect our warm, family-friendly atmosphere while maintaining an elegant, professional look.",
  projectRequirements: [
    "Responsive design that works on all devices",
    "Online reservation system integration",
    "Menu display with categories and pricing",
    "Photo gallery showcasing food and restaurant",
    "Contact page with location map",
    "About us page with restaurant history",
    "Customer testimonials section",
    "Social media integration",
    "SEO optimization for local searches",
    "Content management system for easy updates",
  ],
  skills: ["React", "Node.js", "Restaurant Design", "Reservation Systems", "SEO", "Photography"],
  clientBudget: "$3,000 - $5,000",
  projectType: "Fixed Price",
  duration: "1-3 months",
  experienceLevel: "Intermediate",
  proposalsCount: 12,
  lastActivity: "2 days ago",
  milestones: [
    {
      name: "Discovery & Planning",
      description: "Initial consultation, requirements gathering, and project planning",
      amount: 800,
      timeline: "Week 1",
    },
    {
      name: "Design & Wireframes",
      description: "Create wireframes, mockups, and design system",
      amount: 800,
      timeline: "Week 2-3",
    },
    {
      name: "Development",
      description: "Frontend and backend development, reservation system integration",
      amount: 1200,
      timeline: "Week 4-5",
    },
    {
      name: "Testing & Launch",
      description: "Testing, bug fixes, deployment, and training",
      amount: 400,
      timeline: "Week 6",
    },
  ],
  portfolio: [
    {
      title: "Tuscan Kitchen Website",
      image: "/ecommerce-website-homepage.png",
      description: "Modern restaurant website with online ordering",
    },
    {
      title: "Café Bistro Redesign",
      image: "/general-dashboard-interface.png",
      description: "Complete website redesign with reservation system",
    },
  ],
}

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("proposal")
  const [newMessage, setNewMessage] = useState("")

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/freelancer/proposals">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Proposals
              </Button>
            </Link>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{proposalData.projectTitle}</h1>
              <div className="flex items-center space-x-4">
                <Badge className={getStatusColor(proposalData.status)}>
                  {getStatusIcon(proposalData.status)}
                  <span className="ml-1 capitalize">{proposalData.status}</span>
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">Proposal ID: {proposalData.id}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted {new Date(proposalData.submittedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/messages?proposal=${proposalData.id}`}>
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
            {/* Proposal Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Proposal Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Bid</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${proposalData.proposedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Client Budget</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{proposalData.clientBudget}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Timeline</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{proposalData.timeline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Project Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">{proposalData.projectType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium text-gray-900 dark:text-white">{proposalData.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Experience Level</p>
                    <p className="font-medium text-gray-900 dark:text-white">{proposalData.experienceLevel}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Proposals</p>
                    <p className="font-medium text-gray-900 dark:text-white">{proposalData.proposalsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {["proposal", "project", "milestones"].map((tab) => (
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
            {activeTab === "proposal" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                      {proposalData.coverLetter}
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills for this project</h4>
                    <div className="flex flex-wrap gap-2">
                      {proposalData.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "project" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      {proposalData.projectDescription}
                    </p>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Requirements</h4>
                      <ul className="space-y-2">
                        {proposalData.projectRequirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "milestones" && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Proposed Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {proposalData.milestones.map((milestone, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.name}</h4>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ${milestone.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{milestone.timeline}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      </div>
                    ))}
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
                    src={proposalData.client.avatar || "/placeholder.svg"}
                    alt={proposalData.client.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{proposalData.client.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {proposalData.client.rating} ({proposalData.client.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{proposalData.client.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Member since {proposalData.client.memberSince}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{proposalData.client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={proposalData.client.website} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {proposalData.client.website}
                    </a>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{proposalData.client.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Total Spent</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${proposalData.client.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Projects Posted</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{proposalData.client.projectsPosted}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Hire Rate</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{proposalData.client.hireRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {proposalData.client.completedProjects}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Portfolio */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Related Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proposalData.portfolio.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={300}
                        height={150}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/messages?proposal=${proposalData.id}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Client
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Edit Proposal
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <XCircle className="w-4 h-4 mr-2" />
                  Withdraw Proposal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
