"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Star,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Globe,
  Shield,
  Zap,
  Award,
  MessageSquare,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"

const categories = [
  { name: "Web Development", count: "2,847", icon: "💻", color: "bg-blue-50 text-blue-600" },
  { name: "Mobile Apps", count: "1,923", icon: "📱", color: "bg-green-50 text-green-600" },
  { name: "UI/UX Design", count: "3,156", icon: "🎨", color: "bg-green-50 text-green-600" },
  { name: "Digital Marketing", count: "2,234", icon: "📈", color: "bg-orange-50 text-orange-600" },
  { name: "Content Writing", count: "1,876", icon: "✍️", color: "bg-pink-50 text-pink-600" },
  { name: "Data Science", count: "987", icon: "📊", color: "bg-blue-50 text-blue-600" },
]

const featuredFreelancers = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Full-Stack Developer",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 85,
    image: "/professional-woman-developer.png",
    skills: ["React", "Node.js", "Python"],
    completedJobs: 89,
    responseTime: "1 hour",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "UI/UX Designer",
    rating: 5.0,
    reviews: 94,
    hourlyRate: 75,
    image: "/professional-man-designer.png",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    completedJobs: 156,
    responseTime: "30 mins",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Digital Marketing Expert",
    rating: 4.8,
    reviews: 203,
    hourlyRate: 65,
    image: "/professional-woman-marketer.png",
    skills: ["SEO", "Google Ads", "Social Media"],
    completedJobs: 234,
    responseTime: "2 hours",
  },
]

const recentProjects = [
  {
    id: 1,
    title: "E-commerce Mobile App Development",
    budget: "$5,000 - $8,000",
    proposals: 23,
    timePosted: "2 hours ago",
    client: "TechStart Inc.",
    description: "Looking for an experienced mobile developer to create a cross-platform e-commerce app...",
    skills: ["React Native", "Firebase", "Payment Integration"],
    urgent: true,
  },
  {
    id: 2,
    title: "Brand Identity & Logo Design",
    budget: "$800 - $1,200",
    proposals: 45,
    timePosted: "5 hours ago",
    client: "Green Valley Organics",
    description: "Need a complete brand identity package including logo, color palette, and brand guidelines...",
    skills: ["Logo Design", "Brand Identity", "Adobe Illustrator"],
    urgent: false,
  },
  {
    id: 3,
    title: "SEO Optimization for SaaS Platform",
    budget: "$2,000 - $3,500",
    proposals: 18,
    timePosted: "1 day ago",
    client: "CloudSync Solutions",
    description: "Seeking an SEO expert to improve our SaaS platform's search engine rankings...",
    skills: ["SEO", "Content Strategy", "Analytics"],
    urgent: false,
  },
]

const stats = [
  { label: "Active Freelancers", value: "50,000+", icon: Users, color: "text-blue-600" },
  { label: "Projects Completed", value: "125,000+", icon: Briefcase, color: "text-green-600" },
  { label: "Total Earnings", value: "$45M+", icon: DollarSign, color: "text-green-600" },
  { label: "Client Satisfaction", value: "98.5%", icon: TrendingUp, color: "text-orange-600" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "admin":
          window.location.href = "/admin"
          break
        case "client":
          window.location.href = "/client/dashboard"
          break
        case "freelancer":
          window.location.href = "/freelancer/dashboard"
          break
      }
    }
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-green-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                Find the Perfect
                <span className="block bg-gradient-to-r from-blue-600 via-teal-600 to-green-500 bg-clip-text text-transparent">
                  Freelance Services
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Connect with world-class freelancers and get your projects done with confidence. From web development to
                digital marketing, find the expertise you need.
              </p>
            </div>

            {/* Search Bar */}
            <div
              className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for services (e.g., web development, logo design...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 shadow-lg"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-xl px-6">
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link href="/projects">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Find Work
                  </Button>
                </Link>
                <Link href="/freelancers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-transparent"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Hire Talent
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover thousands of services across various categories and find the perfect match for your project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-3xl p-3 rounded-2xl ${category.color}`}>{category.icon}</div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} services available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Top-Rated Freelancers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Work with verified professionals who deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFreelancers.map((freelancer) => (
              <Card
                key={freelancer.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={freelancer.image || "/placeholder.svg"}
                      alt={freelancer.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{freelancer.name}</h3>
                      <p className="text-gray-600">{freelancer.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 ml-1">{freelancer.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({freelancer.reviews})</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {freelancer.completedJobs} jobs
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${freelancer.hourlyRate}</span>
                      <span className="text-gray-600">/hour</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Responds in</div>
                      <div className="text-sm font-medium text-green-600">{freelancer.responseTime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/freelancers">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl bg-transparent"
              >
                View All Freelancers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Project Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh projects posted by clients looking for talented freelancers
            </p>
          </div>

          <div className="space-y-6">
            {recentProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center mb-2 lg:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">{project.title}</h3>
                      {project.urgent && <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Urgent</Badge>}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {project.proposals} proposals
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.timePosted}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold text-green-600 mr-4">{project.budget}</span>
                    <span className="text-gray-600">by {project.client}</span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl shadow-xl"
              >
                Browse All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Bizzlink?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the tools and security you need for successful project collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Your money is protected with our escrow system. Payments are only released when you're satisfied with
                the work.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-green-100 to-green-200">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your projects completed quickly with our network of professional freelancers who deliver on time.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-green-100 to-green-200">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">
                All freelancers are vetted and rated by previous clients. Work with confidence knowing you'll get
                quality results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-teal-600 to-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and freelancers who trust Bizzlink for their project needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?type=client">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl font-semibold"
              >
                Hire Freelancers
              </Button>
            </Link>
            <Link href="/auth/signup?type=freelancer">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-semibold bg-transparent"
              >
                Start Freelancing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/images/bizzlink-icon.png" alt="Bizzlink" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">Bizzlink</span>
              </div>
              <p className="text-gray-400 mb-4">
                The world's largest freelancing platform connecting businesses with talented professionals.
              </p>
              <div className="flex space-x-4">
                <Globe className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <MessageSquare className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/projects/post" className="hover:text-white">
                    Post a Project
                  </Link>
                </li>
                <li>
                  <Link href="/freelancers" className="hover:text-white">
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/projects" className="hover:text-white">
                    Find Work
                  </Link>
                </li>
                <li>
                  <Link href="/freelancer-tips" className="hover:text-white">
                    Success Tips
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bizzlink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
