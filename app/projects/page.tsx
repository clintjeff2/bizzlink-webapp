"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  MessageSquare,
  Bookmark,
  Star,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const projects = [
  {
    id: 1,
    title: "E-commerce Website Development with React & Node.js",
    description:
      "Looking for an experienced full-stack developer to build a modern e-commerce platform. The project includes user authentication, payment integration, inventory management, and admin dashboard. Must have experience with React, Node.js, MongoDB, and Stripe integration.",
    budget: { type: "fixed", min: 5000, max: 8000 },
    client: {
      name: "TechStart Inc.",
      location: "San Francisco, CA",
      rating: 4.8,
      jobsPosted: 23,
      verified: true,
      avatar: "/business-client.png",
    },
    skills: ["React", "Node.js", "MongoDB", "Stripe", "JavaScript", "Express.js"],
    proposals: 34,
    timePosted: "2 hours ago",
    deadline: "6 weeks",
    category: "Web Development",
    experienceLevel: "Expert",
    urgent: true,
    featured: true,
  },
  {
    id: 2,
    title: "Mobile App UI/UX Design for Fitness Platform",
    description:
      "Need a talented UI/UX designer to create a modern, intuitive design for our fitness tracking mobile app. The design should include onboarding screens, workout tracking, progress analytics, and social features. Looking for someone with experience in fitness/health apps.",
    budget: { type: "fixed", min: 2500, max: 4000 },
    client: {
      name: "FitLife Solutions",
      location: "Austin, TX",
      rating: 4.9,
      jobsPosted: 12,
      verified: true,
      avatar: "/fitness-company.png",
    },
    skills: ["UI/UX Design", "Figma", "Mobile Design", "Prototyping", "User Research"],
    proposals: 28,
    timePosted: "4 hours ago",
    deadline: "4 weeks",
    category: "Design",
    experienceLevel: "Intermediate",
    urgent: false,
    featured: false,
  },
  {
    id: 3,
    title: "SEO & Content Marketing Strategy for SaaS Platform",
    description:
      "Seeking an experienced SEO specialist and content marketer to develop and execute a comprehensive strategy for our B2B SaaS platform. Need someone who can create high-quality content, optimize for search engines, and drive organic traffic growth.",
    budget: { type: "hourly", min: 50, max: 80 },
    client: {
      name: "CloudSync Solutions",
      location: "Remote",
      rating: 4.7,
      jobsPosted: 8,
      verified: false,
      avatar: "/modern-saas-office.png",
    },
    skills: ["SEO", "Content Marketing", "Google Analytics", "Keyword Research", "Link Building"],
    proposals: 19,
    timePosted: "1 day ago",
    deadline: "3 months",
    category: "Digital Marketing",
    experienceLevel: "Expert",
    urgent: false,
    featured: false,
  },
  {
    id: 4,
    title: "Python Data Analysis & Machine Learning Model",
    description:
      "Looking for a data scientist to analyze customer behavior data and build predictive models. The project involves data cleaning, exploratory analysis, feature engineering, and model development using Python and scikit-learn.",
    budget: { type: "fixed", min: 3000, max: 5000 },
    client: {
      name: "DataDriven Corp",
      location: "New York, NY",
      rating: 4.6,
      jobsPosted: 15,
      verified: true,
      avatar: "/data-company.png",
    },
    skills: ["Python", "Machine Learning", "Pandas", "Scikit-learn", "Data Visualization"],
    proposals: 22,
    timePosted: "1 day ago",
    deadline: "8 weeks",
    category: "Data Science",
    experienceLevel: "Expert",
    urgent: false,
    featured: true,
  },
  {
    id: 5,
    title: "Brand Identity & Logo Design for Tech Startup",
    description:
      "New tech startup needs a complete brand identity package including logo design, color palette, typography, and brand guidelines. Looking for a creative designer who can capture our innovative and modern vision.",
    budget: { type: "fixed", min: 1500, max: 2500 },
    client: {
      name: "InnovateTech",
      location: "Seattle, WA",
      rating: 5.0,
      jobsPosted: 3,
      verified: true,
      avatar: "/tech-startup-office.png",
    },
    skills: ["Logo Design", "Brand Identity", "Adobe Illustrator", "Typography", "Color Theory"],
    proposals: 45,
    timePosted: "3 hours ago",
    deadline: "3 weeks",
    category: "Design",
    experienceLevel: "Intermediate",
    urgent: true,
    featured: false,
  },
  {
    id: 6,
    title: "WordPress Website Development & Customization",
    description:
      "Need a WordPress developer to create a custom business website with advanced functionality. Requirements include custom theme development, plugin integration, SEO optimization, and responsive design.",
    budget: { type: "fixed", min: 2000, max: 3500 },
    client: {
      name: "Local Business Hub",
      location: "Chicago, IL",
      rating: 4.4,
      jobsPosted: 7,
      verified: false,
      avatar: "/local-business.png",
    },
    skills: ["WordPress", "PHP", "CSS", "JavaScript", "MySQL"],
    proposals: 31,
    timePosted: "6 hours ago",
    deadline: "5 weeks",
    category: "Web Development",
    experienceLevel: "Intermediate",
    urgent: false,
    featured: false,
  },
]

const categories = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Design",
  "Digital Marketing",
  "Data Science",
  "Writing & Content",
  "Video & Animation",
  "Music & Audio",
]

const experienceLevels = ["All Levels", "Entry Level", "Intermediate", "Expert"]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedExperience, setSelectedExperience] = useState("All Levels")
  const [budgetRange, setBudgetRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All Categories" || project.category === selectedCategory
    const matchesExperience = selectedExperience === "All Levels" || project.experienceLevel === selectedExperience

    const projectBudget = project.budget.type === "fixed" ? project.budget.max : project.budget.max * 40 // Estimate for hourly
    const matchesBudget = projectBudget >= budgetRange[0] && projectBudget <= budgetRange[1]

    return matchesSearch && matchesCategory && matchesExperience && matchesBudget
  })

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
                  Bizzlink
                </span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/projects" className="text-blue-600 font-medium">
                  Find Work
                </Link>
                <Link href="/freelancers" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Find Talent
                </Link>
                <Link href="/how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors">
                  How it Works
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Project</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and interests</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search projects, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 border-gray-200 rounded-xl hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="budget-high">Highest Budget</SelectItem>
                    <SelectItem value="budget-low">Lowest Budget</SelectItem>
                    <SelectItem value="proposals">Fewest Proposals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
                </label>
                <Slider
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  max={10000}
                  min={0}
                  step={100}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="budget-high">Highest Budget</SelectItem>
                <SelectItem value="budget-low">Lowest Budget</SelectItem>
                <SelectItem value="proposals">Fewest Proposals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3 hover:text-blue-600 cursor-pointer">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {project.featured && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">Featured</Badge>
                        )}
                        {project.urgent && <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Urgent</Badge>}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-4">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex items-center space-x-6 mb-4 lg:mb-0">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-semibold text-gray-900">
                        {project.budget.type === "fixed"
                          ? `$${project.budget.min.toLocaleString()} - $${project.budget.max.toLocaleString()}`
                          : `$${project.budget.min} - $${project.budget.max}/hr`}
                      </span>
                      <span className="text-gray-600 ml-1">
                        {project.budget.type === "fixed" ? "Fixed Price" : "Hourly"}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{project.proposals} proposals</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{project.timePosted}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center mr-6">
                      <Image
                        src={project.client.avatar || "/placeholder.svg"}
                        alt={project.client.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{project.client.name}</span>
                          {project.client.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          <span>{project.client.rating}</span>
                          <span className="mx-1">•</span>
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{project.client.location}</span>
                        </div>
                      </div>
                    </div>

                    <Link href={`/projects/${project.id}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-2xl bg-transparent"
          >
            Load More Projects
          </Button>
        </div>
      </div>
    </div>
  )
}
