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
  CheckCircle2,
  Sparkles,
  CreditCard,
  UserCheck,
  Send,
  ChevronRight,
  GraduationCap,
  Layers,
  LucideIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { 
  getFeaturedFreelancers, 
  getLatestProjects,
  getCategoryMetrics,
  getPlatformStats,
  getTimeAgo,
  getBudgetRangeString
} from "@/lib/services/landingPageService"
import { User, Project } from "@/lib/redux/types/firebaseTypes"

// We'll load these dynamically from Firebase
const initialCategories = [
  { name: "Web Development", count: "2,847", icon: "💻", color: "bg-blue-50 text-blue-600" },
  { name: "Mobile Apps", count: "1,923", icon: "📱", color: "bg-green-50 text-green-600" },
  { name: "UI/UX Design", count: "3,156", icon: "🎨", color: "bg-pink-50 text-pink-600" },
  { name: "Digital Marketing", count: "2,234", icon: "📈", color: "bg-orange-50 text-orange-600" },
  { name: "Content Writing", count: "1,876", icon: "✍️", color: "bg-cyan-50 text-cyan-600" },
  { name: "Data Science", count: "987", icon: "📊", color: "bg-blue-50 text-blue-600" },
]

// Initial placeholder stats until we load from Firebase
const initialStats = [
  { label: "Active Freelancers", value: "50,000+", icon: Users, color: "text-blue-600" },
  { label: "Projects Completed", value: "125,000+", icon: Briefcase, color: "text-green-600" },
  { label: "Total Earnings", value: "$45M+", icon: DollarSign, color: "text-green-600" },
  { label: "Client Satisfaction", value: "98.5%", icon: TrendingUp, color: "text-orange-600" },
]

// How Bizzlink works process steps
const howItWorksSteps = [
  {
    title: "Post Your Project",
    description: "Describe your project requirements, budget, and timeline",
    icon: Layers,
    color: "bg-blue-500"
  },
  {
    title: "Review Proposals",
    description: "Freelancers submit tailored proposals for your review",
    icon: CheckCircle2,
    color: "bg-green-500"
  },
  {
    title: "Chat & Select",
    description: "Interview candidates and choose the perfect match",
    icon: MessageSquare,
    color: "bg-purple-500"
  },
  {
    title: "Secure Payment",
    description: "Funds are securely held in escrow until work is approved",
    icon: CreditCard,
    color: "bg-amber-500"
  },
  {
    title: "Work Delivery",
    description: "Freelancer completes milestones and delivers quality work",
    icon: Briefcase,
    color: "bg-pink-500"
  },
  {
    title: "Release Payment",
    description: "Review and approve work to release payment to freelancer",
    icon: Send,
    color: "bg-teal-500"
  }
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [featuredFreelancers, setFeaturedFreelancers] = useState<User[]>([])
  const [latestProjects, setLatestProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState(initialCategories)
  const [stats, setStats] = useState(initialStats)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSelector((state: RootState) => state.auth)

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch freelancers and projects in parallel
        const [freelancersData, projectsData, categoryData, statsData] = await Promise.all([
          getFeaturedFreelancers(6),
          getLatestProjects(3),
          getCategoryMetrics(),
          getPlatformStats()
        ])
        
        setFeaturedFreelancers(freelancersData)
        setLatestProjects(projectsData)
        setCategories(categoryData)
        
        // Map icon strings to actual Lucide icons
        const mappedStats = statsData.map(stat => {
          let icon
          switch(stat.icon) {
            case "Users": icon = Users; break;
            case "Briefcase": icon = Briefcase; break;
            case "DollarSign": icon = DollarSign; break;
            case "TrendingUp": icon = TrendingUp; break;
            default: icon = Briefcase;
          }
          return { ...stat, icon }
        })
        
        setStats(mappedStats)
      } catch (error) {
        console.error("Error loading landing page data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

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
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-36 lg:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/5 to-green-500/10"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.15\'%3E%3Cpath opacity=\'.5\' d=\'M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content */}
            <div className="max-w-2xl lg:max-w-3xl mb-16 lg:mb-0">
              <div
                className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              >
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-6 py-2 px-4 text-sm rounded-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  The Future of Work is Here
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-8">
                  Connect with <span className="text-blue-600">Expert</span> 
                  <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                    Freelancers
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
                  Transform your ideas into reality with the perfect talent. Find vetted experts or exciting opportunities on the leading freelance marketplace.
                </p>
              
                {/* Search Bar */}
                <div className="relative max-w-xl mb-10">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for services (e.g., web development, logo design...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-36 py-7 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:ring-0 shadow-lg"
                  />
                  <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 text-base font-medium">
                    Search
                  </Button>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  <Link href="/projects" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto font-medium text-base"
                    >
                      <Briefcase className="w-5 h-5 mr-3" />
                      Find Work
                    </Button>
                  </Link>
                  <Link href="/freelancers" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-transparent w-full sm:w-auto font-medium text-base"
                    >
                      <Users className="w-5 h-5 mr-3" />
                      Hire Talent
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right Content - Hero Image */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"} relative lg:w-1/2`}>
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-36 h-36 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-40 right-40 w-24 h-24 bg-purple-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="/modern-saas-office.png"
                    alt="Bizzlink - Freelance Marketplace"
                    width={700}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                
                {/* Stats Overlays */}
                <div className="absolute top-5 -left-5 bg-white p-4 rounded-xl shadow-xl flex items-center z-20 transform -rotate-6">
                  <div className="bg-green-100 p-3 rounded-lg mr-3">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Completed Projects</p>
                    <p className="font-bold text-gray-900 text-lg">125,000+</p>
                  </div>
                </div>
                
                <div className="absolute bottom-10 -right-6 bg-white p-4 rounded-xl shadow-xl flex items-center z-20 transform rotate-3">
                  <div className="bg-blue-100 p-3 rounded-lg mr-3">
                    <UserCheck className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Verified Freelancers</p>
                    <p className="font-bold text-gray-900 text-lg">50,000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trusted By Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="text-center">
            <p className="text-base text-gray-500 uppercase tracking-wider font-semibold mb-8">Trusted by leading brands</p>
            <div className="flex flex-wrap justify-center items-center gap-10 opacity-75">
              <div className="w-28 h-14 flex items-center justify-center">
                <Image src="/images/microsoft-logo.svg" alt="Microsoft" width={100} height={35} />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image src="/images/google-logo.svg" alt="Google" width={100} height={35} />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image src="/images/airbnb-logo.svg" alt="Airbnb" width={100} height={35} />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image src="/images/netflix-logo.svg" alt="Netflix" width={100} height={35} />
              </div>
              <div className="w-28 h-14 flex items-center justify-center">
                <Image src="/images/shopify-logo.svg" alt="Shopify" width={100} height={35} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 py-2 px-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Platform Stats
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">The Leading Freelance Marketplace</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of businesses and professionals already using our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-gradient-to-br from-gray-50 to-gray-100">
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
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 py-2 px-4">
              <Briefcase className="w-4 h-4 mr-2" />
              Service Categories
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Explore Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover thousands of services across various categories and find the perfect match for your project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link href={`/projects?category=${encodeURIComponent(category.name)}`} key={index}>
                <Card
                  className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg overflow-hidden h-full"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`text-4xl p-4 rounded-2xl ${category.color}`}>{category.icon}</div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.count} services available</p>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <span className="text-sm text-blue-600 font-medium flex items-center">
                        Browse Category
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Projects Section */}
      <section className="py-28 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-100 text-cyan-800 hover:bg-cyan-200 py-2 px-4 rounded-full">
              <Briefcase className="w-4 h-4 mr-2" />
              New Opportunities
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Latest Project Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Fresh projects posted by clients looking for talented freelancers — start your next successful collaboration today
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="animate-pulse">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                        <div className="h-8 bg-slate-200 rounded-lg w-2/5 mb-3 lg:mb-0"></div>
                        <div className="flex items-center space-x-6">
                          <div className="h-5 bg-slate-200 rounded-lg w-28"></div>
                          <div className="h-5 bg-slate-200 rounded-lg w-32"></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="w-14 h-14 rounded-full bg-slate-200 mr-4"></div>
                          <div>
                            <div className="h-4 bg-slate-200 rounded-lg w-20 mb-2"></div>
                            <div className="h-5 bg-slate-200 rounded-lg w-32"></div>
                          </div>
                        </div>
                        <div>
                          <div className="h-4 bg-slate-200 rounded-lg w-16 mb-2"></div>
                          <div className="h-7 bg-slate-200 rounded-lg w-28"></div>
                        </div>
                      </div>
                      
                      <div className="h-16 bg-slate-200 rounded-lg mb-6"></div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <div className="h-7 bg-slate-200 rounded-full w-20"></div>
                        <div className="h-7 bg-slate-200 rounded-full w-24"></div>
                        <div className="h-7 bg-slate-200 rounded-full w-16"></div>
                        <div className="h-7 bg-slate-200 rounded-full w-20"></div>
                      </div>
                      
                      <div className="h-px bg-slate-200 w-full my-4"></div>
                      
                      <div className="flex justify-between items-center">
                        <div className="h-5 bg-slate-200 rounded-lg w-28"></div>
                        <div className="h-6 bg-slate-200 rounded-lg w-32"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {latestProjects.map((project) => (
                <Link href={`/projects/${project.projectId}`} key={project.projectId}>
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group mt-4">
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                        <div className="flex items-center mb-3 lg:mb-0">
                          <h3 className="text-2xl font-bold text-gray-900 mr-4 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          {project.timeline?.isUrgent && 
                            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 py-1 px-3 rounded-full">
                              <Clock className="w-3 h-3 mr-1" /> Urgent
                            </Badge>
                          }
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <span className="flex items-center text-gray-600">
                            <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                            {project.proposalCount || 0} proposals
                          </span>
                          <span className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-green-500" />
                            {getTimeAgo(project.publishedAt || project.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center mb-4 sm:mb-0">
                          <div className="flex-shrink-0 mr-4">
                            <Image
                              src={project.clientInfo?.photoURL || "/placeholder-user.jpg"}
                              alt={project.clientInfo?.name || "Client"}
                              width={56}
                              height={56}
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                            />
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Posted by</span>
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              {project.clientInfo?.name || "Client"}
                              {project.clientInfo?.verificationStatus && (
                                <CheckCircle2 className="inline-block w-4 h-4 ml-1 text-blue-500" />
                              )}
                            </h4>
                          </div>
                        </div>
                        <div className="bg-white py-2 px-4 rounded-xl shadow-sm border border-gray-100">
                          <div className="text-sm text-gray-600 mb-1">Budget</div>
                          <div className="text-xl font-bold text-green-600">
                            {getBudgetRangeString(project)}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-gray-700 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.requirements?.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100 py-1.5 px-3 rounded-full border-0">
                            {skill}
                          </Badge>
                        ))}
                        {(project.requirements?.skills.length || 0) > 4 && (
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 py-1.5 px-3 rounded-full border-0">
                            +{(project.requirements?.skills.length || 0) - 4} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {project.requirements?.experienceLevel.charAt(0).toUpperCase() + 
                           project.requirements?.experienceLevel.slice(1)} level
                        </div>
                        <div className="flex items-center text-blue-600 font-medium">
                          View Project Details
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/projects">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-6 rounded-full shadow-xl font-medium text-lg"
              >
                Browse All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - New Visual Workflow */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 opacity-80"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 rounded-full opacity-40 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 py-2 px-4">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Your Journey with Bizzlink
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">How Bizzlink Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our seamless platform connects clients with top freelancers, ensuring quality work delivery with secure payment protection
            </p>
          </div>

          {/* Interactive Visual Workflow - Improved Version */}
          <div className="relative mb-28">
            {/* Central Flow Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connection Dots (Visible on mobile) */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="md:hidden absolute top-full left-1/2 w-0.5 h-8 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2"></div>
                  )}
                  
                  {/* Card */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative z-10 h-full hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col items-center transform hover:-translate-y-2">
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center border-4 border-gray-100 z-20">
                      <div className={`w-10 h-10 ${step.color} rounded-full flex items-center justify-center`}>
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                    
                    {/* Visual Image for each step */}
                    <div className="mt-6 w-full h-32 bg-gray-50 rounded-xl overflow-hidden">
                      <Image 
                        src={index === 0 ? "/food-delivery-app-screen.png" :
                             index === 1 ? "/marketing-campaign-results.png" :
                             index === 2 ? "/messages-components/chat-interface.png" :
                             index === 3 ? "/images/payment-escrow.png" :
                             index === 4 ? "/mobile-banking-app.png" : 
                             "/data-analytics-dashboard.png"}
                        alt={step.title}
                        width={200}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Step Number */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gray-900 text-white text-sm flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Detailed Platform Workflow Visualization */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 p-8 lg:p-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  The Complete Bizzlink Experience
                </h3>
                
                <div className="space-y-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Client Posts a Project</h4>
                      <p className="text-gray-600">
                        Clients detail their project requirements, budget, and timeline. Our intelligent matching system immediately starts identifying suitable freelancers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mr-4">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Freelancers Submit Proposals</h4>
                      <p className="text-gray-600">
                        Qualified freelancers review the project and submit customized proposals highlighting their relevant skills and approach to the project.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment & Delivery</h4>
                      <p className="text-gray-600">
                        Once hired, clients fund the project securely through our escrow system. Payment is only released when the client approves the completed work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-7 bg-gradient-to-br from-blue-500 to-purple-600 p-8 lg:p-0 relative">
                <div className="h-full w-full flex items-center justify-center overflow-hidden">
                  <div className="relative w-full max-w-3xl p-8">

                    {/* Process Flow Diagram */}
                    <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                        <div className="text-center p-4 rounded-xl bg-white/10">
                          <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Layers className="w-8 h-8" />
                          </div>
                          <h5 className="font-semibold text-lg mb-2">Project Posting</h5>
                          <div className="text-sm opacity-90">Client defines requirements</div>
                        </div>
                        
                        <div className="relative text-center p-4 rounded-xl bg-white/10">
                          <div className="hidden md:block absolute -left-4 top-1/2 w-4 h-0.5 bg-white/60 transform -translate-y-1/2"></div>
                          <div className="hidden md:block absolute -right-4 top-1/2 w-4 h-0.5 bg-white/60 transform -translate-y-1/2"></div>
                          <div className="w-16 h-16 mx-auto bg-purple-600 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-8 h-8" />
                          </div>
                          <h5 className="font-semibold text-lg mb-2">Collaboration</h5>
                          <div className="text-sm opacity-90">Messaging & milestone tracking</div>
                        </div>
                        
                        <div className="text-center p-4 rounded-xl bg-white/10">
                          <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
                            <CreditCard className="w-8 h-8" />
                          </div>
                          <h5 className="font-semibold text-lg mb-2">Project Completion</h5>
                          <div className="text-sm opacity-90">Approval & secure payment</div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-center">
                        <Image 
                          src="/general-dashboard-interface.png"
                          alt="Bizzlink Dashboard Interface"
                          width={600}
                          height={300}
                          className="w-full max-w-lg rounded-xl shadow-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Secure Payments</h4>
              <p className="text-gray-600">
                Your payment is held safely in escrow until you verify and approve the completed work, protecting both parties.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h4>
              <p className="text-gray-600">
                Our milestone-based system ensures projects stay on track with clear deliverables and transparent progress tracking.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Quality Guaranteed</h4>
              <p className="text-gray-600">
                Access verified freelancers with proven track records, portfolios, and skills validated through our rigorous vetting process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 py-2 px-4">
              <Star className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from clients and freelancers who've found success on our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 relative">
              <div className="absolute -top-5 left-8 text-6xl text-indigo-300">"</div>
              <div className="relative z-10">
                <p className="text-gray-700 mb-6 italic">
                  "Bizzlink completely transformed how I run my business. I found amazing developers who delivered
                  exactly what I needed, on time and within budget."
                </p>
                <div className="flex items-center">
                  <Image 
                    src="/business-client.png" 
                    alt="Client" 
                    width={60} 
                    height={60} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Thompson</p>
                    <p className="text-sm text-gray-600">CEO, DigitalFirst</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 relative">
              <div className="absolute -top-5 left-8 text-6xl text-indigo-300">"</div>
              <div className="relative z-10">
                <p className="text-gray-700 mb-6 italic">
                  "As a freelance designer, Bizzlink has been instrumental in growing my client base. The secure payment system
                  gives me peace of mind to focus on what I do best."
                </p>
                <div className="flex items-center">
                  <Image 
                    src="/professional-black-designer.png" 
                    alt="Freelancer" 
                    width={60} 
                    height={60} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Marcus Johnson</p>
                    <p className="text-sm text-gray-600">UI/UX Designer</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 relative">
              <div className="absolute -top-5 left-8 text-6xl text-indigo-300">"</div>
              <div className="relative z-10">
                <p className="text-gray-700 mb-6 italic">
                  "The talent on Bizzlink is outstanding. We've built an entire development team through the platform
                  and have seen incredible results for our startup."
                </p>
                <div className="flex items-center">
                  <Image 
                    src="/tech-startup-office.png" 
                    alt="Client" 
                    width={60} 
                    height={60} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">David Chen</p>
                    <p className="text-sm text-gray-600">CTO, TechInnovate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600"></div>
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20.83l2.83-2.83 1.41 1.41L1.41 22.24H0v-1.41zM0 3.06l2.83-2.83 1.41 1.41L1.41 4.47H0V3.06zm20 0l2.83-2.83 1.41 1.41L21.41 4.47h-1.41V3.06zm0 17.77l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zm0 17.77l2.83-2.83 1.41 1.41-2.83 2.83h-1.41v-1.41zM20 0l2.83 2.83-1.41 1.41L18.59 1.41V0h1.41zm0 17.77l2.83 2.83-1.41 1.41-2.83-2.83V17.77h1.41zm0 17.77l2.83 2.83-1.41 1.41-2.83-2.83V35.53h1.41zm-20 0l2.83 2.83-1.41 1.41L0 37.06v-1.41h.59zm0-17.77l2.83 2.83-1.41 1.41L0 19.3v-1.41h.59zm0-17.77L2.83 2.83 1.41 4.24 0 1.59V.18h.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '36px 36px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-6 bg-white/90 text-blue-800 hover:bg-white py-2 px-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Today
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Work Experience?
              </h2>
              <p className="text-xl text-blue-50 mb-8">
                Join thousands of businesses and freelancers already growing with Bizzlink. Whether you're hiring or looking for work, start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup?type=client">
                  <Button
                    size="lg"
                    className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 rounded-full shadow-xl font-semibold w-full sm:w-auto"
                  >
                    <Briefcase className="w-5 h-5 mr-2" />
                    Hire Talent
                  </Button>
                </Link>
                <Link href="/auth/signup?type=freelancer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-6 rounded-full font-semibold bg-transparent w-full sm:w-auto"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Find Work
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Image 
                      src="/professional-woman-developer.png" 
                      alt="Freelancer" 
                      width={60} 
                      height={60} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Alex Morgan</h4>
                      <p className="text-sm text-gray-600">Full Stack Developer</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
                
                <div className="bg-indigo-50 rounded-2xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-indigo-900">Project Completed</h4>
                    <Badge className="bg-indigo-100 text-indigo-800">+ $3,500</Badge>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Successfully delivered e-commerce platform with custom payment integration ahead of schedule.
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900 ml-2">5.0</span>
                    <span className="text-xs text-gray-600 ml-1">(Client Rating)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-indigo-600 mr-2" />
                    <span className="text-sm text-gray-700">127 Jobs Completed</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">$95k+ Earned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 px-6 lg:px-8 py-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-8">
                <Image src="/images/bizzlink-icon.png" alt="Bizzlink" width={52} height={52} className="w-13 h-13" />
                <span className="text-3xl font-bold text-white ml-3">Bizzlink</span>
              </div>
              <p className="text-gray-300 mb-10 text-lg max-w-md leading-relaxed">
                The leading platform connecting businesses with skilled freelancers to create successful collaborations worldwide.
              </p>
              
              <h5 className="text-white font-semibold mb-5 text-lg">Download Our App</h5>
              <div className="flex flex-wrap gap-4">
                <Link href="#" className="bg-black border border-gray-700 hover:border-gray-500 rounded-xl py-3 px-5 flex items-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white w-7 h-7 mr-3">
                    <path d="M17.0383 10.1842C17.0193 8.30439 18.0904 7.0594 18.1379 7.01178C17.4338 6.1151 16.3659 5.99808 15.9876 5.98813C15.0371 5.89082 14.0988 6.52141 13.618 6.52141C13.1371 6.52141 12.3213 6.0007 11.6054 6.01808C10.7117 6.03547 9.91784 6.49774 9.5088 7.2398C8.68422 8.72238 9.28491 10.8927 10.0729 12.0731C10.463 12.662 10.9318 13.3023 11.5324 13.2601C12.1212 13.2178 12.4044 12.9233 13.1084 12.9233C13.8004 12.9233 14.0481 13.2601 14.6844 13.2372C15.3309 13.2178 15.7404 12.6395 16.1185 12.0507C16.5638 11.3936 16.7403 10.7366 16.7522 10.6943C16.7403 10.6846 15.0609 9.98501 15.0371 8.11748C15.0133 6.57559 16.3541 5.73802 16.4015 5.70334C15.7522 4.79434 14.7573 4.70944 14.4146 4.69697C13.4672 4.61915 12.5971 5.17322 12.1212 5.17322C11.6452 5.17322 10.8651 4.71085 10.0611 4.71085C8.31259 4.71085 6.5 6.10825 6.5 8.83256C6.5 10.1842 6.81894 11.604 7.32231 12.6643C7.93139 13.9293 9.33981 15.6172 10.8176 15.5734C11.2867 15.5529 11.9304 15.2046 12.755 15.2046C13.5438 15.2046 14.1671 15.5734 14.6608 15.5734C16.139 15.5734 17.4102 13.9911 18 12.7233C17.0978 12.2884 16.4281 11.1063 16.4064 10.1842H17.0383Z" />
                    <path d="M14.8943 3.65622C15.4237 3.02224 15.7684 2.14392 15.6805 1.25293C14.9178 1.28244 13.9902 1.74807 13.4357 2.36629C12.941 2.91557 12.5249 3.82765 12.6245 4.68696C13.4845 4.75138 14.3407 4.2879 14.8943 3.65622Z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Download on the</p>
                    <p className="text-white font-medium text-base">App Store</p>
                  </div>
                </Link>
                <Link href="#" className="bg-black border border-gray-700 hover:border-gray-500 rounded-xl py-3 px-5 flex items-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white w-7 h-7 mr-3">
                    <path d="M4.70873 3.30974C4.37595 3.67372 4.18607 4.23769 4.18607 4.94764C4.18607 5.64163 4.37595 6.21364 4.70873 6.56562C5.05301 6.93763 5.52727 7.1106 6.08539 7.1106C6.63201 7.1106 7.09476 6.93763 7.43905 6.56562C7.78333 6.21364 7.97321 5.64163 7.97321 4.93561C7.97321 4.22566 7.78333 3.66169 7.44056 3.30171C7.09778 2.92969 6.63352 2.76477 6.08539 2.76477C5.52727 2.76477 5.05301 2.92969 4.70873 3.30974ZM7.78333 7.76869H4.38746V15.9204H7.78333V7.76869ZM12.4981 7.76869H9.13731V15.9204H12.4981V11.4957C12.4981 10.1795 13.3262 9.92756 13.7723 9.92756C14.2184 9.92756 15.0616 10.2515 15.0616 11.4957V15.9204H18.4224V11.0033C18.4224 8.08437 16.2212 7.57224 15.0616 7.57224C13.902 7.57224 12.8978 8.39408 12.4981 8.88217V7.76869Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.5 0C1.53789 0 0.637939 0.36979 0 1.00736V19.9926C0.637939 20.6302 1.53789 21 2.5 21H19.5C20.4621 21 21.3621 20.6302 22 19.9926V1.00736C21.3621 0.36979 20.4621 0 19.5 0H2.5ZM4.25 19.25C4.94036 19.25 5.5 18.6904 5.5 18C5.5 17.3096 4.94036 16.75 4.25 16.75C3.55964 16.75 3 17.3096 3 18C3 18.6904 3.55964 19.25 4.25 19.25Z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Get it on</p>
                    <p className="text-white font-medium text-base">Google Play</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">For Clients</h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link href="/projects/post" className="hover:text-white transition-colors">
                    Post a Project
                  </Link>
                </li>
                <li>
                  <Link href="/freelancers" className="hover:text-white transition-colors">
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise" className="hover:text-white transition-colors">
                    Enterprise Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">For Freelancers</h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link href="/projects" className="hover:text-white transition-colors">
                    Find Work
                  </Link>
                </li>
                <li>
                  <Link href="/success-tips" className="hover:text-white transition-colors">
                    Success Tips
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white transition-colors">
                    Learning Resources
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/freelancer-plus" className="hover:text-white transition-colors">
                    Freelancer Plus
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Support & Legal</h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter Sign-up */}
          <div className="bg-gray-800 rounded-2xl p-8 mt-8 mb-16 mx-6 lg:mx-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <h4 className="text-xl lg:text-2xl font-bold text-white mb-2">Stay updated with Bizzlink</h4>
                <p className="text-gray-300">Get the latest job opportunities, freelancer tips, and platform updates.</p>
              </div>
              <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-grow"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Links & Copyright */}
          <div className="border-t border-gray-800 px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <Image src="/images/bizzlink-icon.png" alt="Bizzlink" width={36} height={36} className="w-9 h-9 mr-3" />
                <p className="text-gray-300">&copy; 2025 Bizzlink. All rights reserved.</p>
              </div>
              
              <div className="flex space-x-6">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
