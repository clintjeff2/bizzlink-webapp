"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Video,
  FileText,
  Download,
  Search,
  Filter,
  Clock,
  Users,
  Star,
  Bookmark,
  Play,
  ImageIcon,
  TrendingUp,
  Award,
  Globe,
  Zap,
} from "lucide-react"

export default function ResourcesPage() {
  const resourceCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "bg-blue-500",
      description: "Essential guides for new users",
    },
    {
      title: "Best Practices",
      icon: Award,
      color: "bg-green-500",
      description: "Proven strategies for success",
    },
    {
      title: "Tools & Templates",
      icon: ImageIcon,
      color: "bg-purple-500",
      description: "Ready-to-use resources",
    },
    {
      title: "Industry Insights",
      icon: TrendingUp,
      color: "bg-orange-500",
      description: "Market trends and analysis",
    },
    {
      title: "Legal & Contracts",
      icon: FileText,
      color: "bg-red-500",
      description: "Legal templates and guidance",
    },
    {
      title: "Marketing & Growth",
      icon: Globe,
      color: "bg-teal-500",
      description: "Grow your freelance business",
    },
  ]

  const featuredResources = [
    {
      type: "Guide",
      title: "Complete Freelancer's Handbook 2024",
      description:
        "Everything you need to know to start and grow your freelance business, from setting rates to finding clients.",
      category: "Getting Started",
      duration: "45 min read",
      rating: 4.9,
      downloads: "12.5K",
      icon: BookOpen,
      color: "bg-blue-500",
      featured: true,
    },
    {
      type: "Video Course",
      title: "Mastering Client Communication",
      description:
        "Learn how to communicate effectively with clients, handle difficult situations, and build lasting relationships.",
      category: "Best Practices",
      duration: "2.5 hours",
      rating: 4.8,
      downloads: "8.3K",
      icon: Video,
      color: "bg-green-500",
      featured: true,
    },
    {
      type: "Template Pack",
      title: "Professional Proposal Templates",
      description:
        "20+ proven proposal templates for different industries and project types to help you win more clients.",
      category: "Tools & Templates",
      duration: "Instant download",
      rating: 4.7,
      downloads: "15.2K",
      icon: FileText,
      color: "bg-purple-500",
      featured: true,
    },
  ]

  const allResources = [
    {
      type: "Guide",
      title: "Setting Your Freelance Rates",
      description: "Learn how to price your services competitively while ensuring profitability.",
      category: "Getting Started",
      duration: "20 min read",
      rating: 4.6,
      downloads: "9.1K",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      type: "Checklist",
      title: "Project Onboarding Checklist",
      description: "Ensure smooth project starts with this comprehensive onboarding checklist.",
      category: "Best Practices",
      duration: "5 min read",
      rating: 4.8,
      downloads: "6.7K",
      icon: FileText,
      color: "bg-green-500",
    },
    {
      type: "Video",
      title: "Building Your Portfolio",
      description: "Step-by-step guide to creating a portfolio that attracts high-paying clients.",
      category: "Getting Started",
      duration: "35 minutes",
      rating: 4.7,
      downloads: "11.3K",
      icon: Video,
      color: "bg-blue-500",
    },
    {
      type: "Template",
      title: "Contract Templates Library",
      description: "Legally-reviewed contract templates for various types of freelance work.",
      category: "Legal & Contracts",
      duration: "Instant download",
      rating: 4.9,
      downloads: "18.4K",
      icon: FileText,
      color: "bg-red-500",
    },
    {
      type: "Podcast",
      title: "Freelance Success Stories",
      description: "Weekly interviews with successful freelancers sharing their strategies and insights.",
      category: "Industry Insights",
      duration: "30-45 min episodes",
      rating: 4.5,
      downloads: "25.6K",
      icon: ImageIcon,
      color: "bg-orange-500",
    },
    {
      type: "Tool",
      title: "Rate Calculator",
      description: "Interactive tool to help you calculate optimal hourly and project rates.",
      category: "Tools & Templates",
      duration: "Interactive tool",
      rating: 4.6,
      downloads: "13.8K",
      icon: ImageIcon,
      color: "bg-purple-500",
    },
    {
      type: "Guide",
      title: "Tax Guide for Freelancers",
      description: "Complete guide to managing taxes, deductions, and financial planning as a freelancer.",
      category: "Legal & Contracts",
      duration: "40 min read",
      rating: 4.8,
      downloads: "14.2K",
      icon: BookOpen,
      color: "bg-red-500",
    },
    {
      type: "Video",
      title: "Social Media Marketing for Freelancers",
      description: "Learn how to use social media to attract clients and build your personal brand.",
      category: "Marketing & Growth",
      duration: "1.5 hours",
      rating: 4.4,
      downloads: "7.9K",
      icon: Video,
      color: "bg-teal-500",
    },
    {
      type: "Template",
      title: "Invoice Templates Collection",
      description: "Professional invoice templates in multiple formats for different business needs.",
      category: "Tools & Templates",
      duration: "Instant download",
      rating: 4.7,
      downloads: "22.1K",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      type: "Report",
      title: "Freelance Market Trends 2024",
      description: "Comprehensive analysis of freelance market trends, rates, and opportunities.",
      category: "Industry Insights",
      duration: "25 min read",
      rating: 4.6,
      downloads: "16.5K",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
    {
      type: "Course",
      title: "Time Management Mastery",
      description: "Learn proven time management techniques to boost productivity and work-life balance.",
      category: "Best Practices",
      duration: "3 hours",
      rating: 4.9,
      downloads: "10.7K",
      icon: Video,
      color: "bg-green-500",
    },
    {
      type: "Guide",
      title: "Building Long-term Client Relationships",
      description: "Strategies for turning one-time clients into long-term, high-value partnerships.",
      category: "Marketing & Growth",
      duration: "30 min read",
      rating: 4.8,
      downloads: "12.3K",
      icon: BookOpen,
      color: "bg-teal-500",
    },
  ]

  const webinars = [
    {
      title: "Scaling Your Freelance Business",
      date: "March 15, 2024",
      time: "2:00 PM EST",
      speaker: "Sarah Johnson, 6-Figure Freelancer",
      attendees: 1250,
      status: "upcoming",
    },
    {
      title: "AI Tools for Freelancers",
      date: "March 8, 2024",
      time: "1:00 PM EST",
      speaker: "Mike Chen, Tech Consultant",
      attendees: 890,
      status: "recorded",
    },
    {
      title: "Negotiating Higher Rates",
      date: "March 1, 2024",
      time: "3:00 PM EST",
      speaker: "Lisa Rodriguez, Business Coach",
      attendees: 1450,
      status: "recorded",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Resources & Learning Center</h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Everything you need to succeed as a freelancer or client - guides, templates, tools, and expert insights
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search resources, guides, templates..."
                  className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-white/70"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-purple-600 hover:bg-gray-100">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find exactly what you need with our organized resource categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">Featured</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Most Popular Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our top-rated resources that have helped thousands of freelancers and clients succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredResources.map((resource, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 ${resource.color} rounded-lg flex items-center justify-center`}>
                      <resource.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Download className="w-4 h-4 mr-2" />
                      Access Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Resources</h2>
              <p className="text-xl text-gray-600">Comprehensive library of guides, templates, and tools</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allResources.map((resource, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 ${resource.color} rounded-lg flex items-center justify-center`}>
                      <resource.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      Access
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Resources
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Live Learning</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Webinars & Live Sessions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our expert-led webinars and interactive sessions to accelerate your learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {webinars.map((webinar, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={
                        webinar.status === "upcoming" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {webinar.status === "upcoming" ? "Upcoming" : "Recorded"}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{webinar.attendees}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{webinar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong> {webinar.date}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Time:</strong> {webinar.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Speaker:</strong> {webinar.speaker}
                    </p>
                  </div>
                  <Button className="w-full" variant={webinar.status === "upcoming" ? "default" : "outline"}>
                    <Play className="w-4 h-4 mr-2" />
                    {webinar.status === "upcoming" ? "Register Now" : "Watch Recording"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated with New Resources</h2>
          <p className="text-xl mb-8 text-purple-100">
            Get notified when we publish new guides, templates, and learning materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder-white/70"
            />
            <Button className="bg-white text-purple-600 hover:bg-gray-100">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
