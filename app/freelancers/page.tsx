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
  Star,
  MapPin,
  Clock,
  MessageSquare,
  Heart,
  ChevronDown,
  SlidersHorizontal,
  Briefcase,
  Award,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"

const freelancers = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior Full-Stack Developer",
    avatar: "/professional-asian-woman-developer.png",
    location: "San Francisco, CA",
    hourlyRate: 85,
    rating: 4.9,
    reviewCount: 127,
    completedJobs: 89,
    responseTime: "1 hour",
    availability: "Available now",
    skills: ["React", "Node.js", "Python", "PostgreSQL", "AWS", "TypeScript"],
    specialties: ["Web Development", "API Development", "Database Design"],
    description:
      "Experienced full-stack developer with 8+ years building scalable web applications. Specialized in React, Node.js, and cloud architecture. Delivered 100+ successful projects for startups and enterprises.",
    portfolio: [
      { title: "E-commerce Platform", image: "/ecommerce-website-homepage.png" },
      { title: "SaaS Dashboard", image: "/general-dashboard-interface.png" },
    ],
    verified: true,
    topRated: true,
    featured: true,
    languages: ["English (Native)", "Mandarin (Fluent)"],
    education: "MS Computer Science - Stanford University",
    certifications: ["AWS Certified", "Google Cloud Professional"],
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Creative UI/UX Designer",
    avatar: "/professional-black-designer.png",
    location: "New York, NY",
    hourlyRate: 75,
    rating: 5.0,
    reviewCount: 94,
    completedJobs: 156,
    responseTime: "30 minutes",
    availability: "Available now",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Design Systems"],
    specialties: ["Mobile App Design", "Web Design", "Brand Identity"],
    description:
      "Award-winning UI/UX designer with a passion for creating intuitive and beautiful digital experiences. 6+ years of experience working with Fortune 500 companies and innovative startups.",
    portfolio: [
      { title: "Mobile Banking App", image: "/mobile-banking-app.png" },
      { title: "Brand Identity System", image: "/brand-identity-design.png" },
    ],
    verified: true,
    topRated: true,
    featured: false,
    languages: ["English (Native)", "Spanish (Conversational)"],
    education: "BFA Graphic Design - Parsons School of Design",
    certifications: ["Google UX Design Certificate", "Adobe Certified Expert"],
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Digital Marketing Strategist",
    avatar: "/latina-marketer.png",
    location: "Austin, TX",
    hourlyRate: 65,
    rating: 4.8,
    reviewCount: 203,
    completedJobs: 234,
    responseTime: "2 hours",
    availability: "Available in 1 week",
    skills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Analytics", "Email Marketing"],
    specialties: ["PPC Advertising", "SEO Strategy", "Social Media Marketing"],
    description:
      "Results-driven digital marketing expert with 7+ years helping businesses grow their online presence. Specialized in data-driven strategies that deliver measurable ROI.",
    portfolio: [
      { title: "SaaS Growth Campaign", image: "/marketing-campaign-results.png" },
      { title: "E-commerce SEO Strategy", image: "/seo-analytics-dashboard.png" },
    ],
    verified: true,
    topRated: false,
    featured: true,
    languages: ["English (Native)", "Spanish (Native)"],
    education: "MBA Marketing - University of Texas",
    certifications: ["Google Ads Certified", "HubSpot Certified", "Facebook Blueprint"],
  },
  {
    id: 4,
    name: "David Kim",
    title: "Mobile App Developer",
    avatar: "/asian-mobile-developer.png",
    location: "Seattle, WA",
    hourlyRate: 80,
    rating: 4.7,
    reviewCount: 156,
    completedJobs: 78,
    responseTime: "1 hour",
    availability: "Available now",
    skills: ["React Native", "Flutter", "iOS", "Android", "Firebase", "Swift"],
    specialties: ["Cross-platform Development", "Native iOS", "App Store Optimization"],
    description:
      "Mobile app developer with 6+ years of experience creating high-performance apps for iOS and Android. Expert in React Native and Flutter with 50+ apps published.",
    portfolio: [
      { title: "Fitness Tracking App", image: "/fitness-mobile-app-interface.png" },
      { title: "Food Delivery Platform", image: "/food-delivery-app-screen.png" },
    ],
    verified: true,
    topRated: true,
    featured: false,
    languages: ["English (Fluent)", "Korean (Native)"],
    education: "BS Computer Science - University of Washington",
    certifications: ["Apple Developer Certified", "Google Associate Android Developer"],
  },
  {
    id: 5,
    name: "Sophia Williams",
    title: "Content Writer & Copywriter",
    avatar: "/professional-woman-writer.png",
    location: "Remote",
    hourlyRate: 45,
    rating: 4.9,
    reviewCount: 312,
    completedJobs: 445,
    responseTime: "4 hours",
    availability: "Available now",
    skills: ["Content Writing", "Copywriting", "SEO Writing", "Blog Writing", "Technical Writing", "Email Marketing"],
    specialties: ["B2B Content", "SaaS Writing", "Email Campaigns"],
    description:
      "Professional content writer and copywriter with 5+ years creating compelling content that converts. Specialized in B2B SaaS, technology, and marketing content.",
    portfolio: [
      { title: "SaaS Blog Content", image: "/blog-content-writing.png" },
      { title: "Email Campaign Series", image: "/email-marketing-campaign.png" },
    ],
    verified: true,
    topRated: true,
    featured: false,
    languages: ["English (Native)", "French (Conversational)"],
    education: "BA English Literature - Columbia University",
    certifications: ["HubSpot Content Marketing", "Google Analytics Certified"],
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    title: "Data Scientist & ML Engineer",
    avatar: "/middle-eastern-data-scientist.png",
    location: "Toronto, Canada",
    hourlyRate: 90,
    rating: 4.8,
    reviewCount: 87,
    completedJobs: 52,
    responseTime: "3 hours",
    availability: "Available in 2 weeks",
    skills: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "SQL", "R"],
    specialties: ["Predictive Analytics", "Computer Vision", "NLP"],
    description:
      "Data scientist and ML engineer with PhD in Computer Science. 8+ years of experience building AI solutions for healthcare, finance, and e-commerce industries.",
    portfolio: [
      { title: "Predictive Analytics Model", image: "/data-analytics-dashboard.png" },
      { title: "Computer Vision System", image: "/computer-vision-interface.png" },
    ],
    verified: true,
    topRated: true,
    featured: true,
    languages: ["English (Fluent)", "Arabic (Native)", "French (Conversational)"],
    education: "PhD Computer Science - University of Toronto",
    certifications: ["AWS Machine Learning", "Google Cloud ML Engineer", "Microsoft Azure AI"],
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

const locations = ["All Locations", "United States", "Canada", "United Kingdom", "Australia", "Remote Only"]

export default function FreelancersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedExperience, setSelectedExperience] = useState("All Levels")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [hourlyRateRange, setHourlyRateRange] = useState([0, 150])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("rating")

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesSearch =
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      freelancer.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "All Categories" ||
      freelancer.specialties.some((specialty) => specialty.includes(selectedCategory.replace(" Development", "")))

    const matchesLocation =
      selectedLocation === "All Locations" ||
      freelancer.location.includes(selectedLocation) ||
      (selectedLocation === "Remote Only" && freelancer.location === "Remote")

    const matchesRate = freelancer.hourlyRate >= hourlyRateRange[0] && freelancer.hourlyRate <= hourlyRateRange[1]

    return matchesSearch && matchesCategory && matchesLocation && matchesRate
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Top Freelancers</h1>
          <p className="text-gray-600">Hire verified professionals for your next project</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search freelancers by name, skills, or expertise..."
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
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
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="rate-low">Lowest Rate</SelectItem>
                    <SelectItem value="rate-high">Highest Rate</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate: ${hourlyRateRange[0]} - ${hourlyRateRange[1]}
                </label>
                <Slider
                  value={hourlyRateRange}
                  onValueChange={setHourlyRateRange}
                  max={150}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredFreelancers.length} of {freelancers.length} freelancers
          </p>
        </div>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Image
                      src={freelancer.avatar || "/placeholder.svg"}
                      alt={freelancer.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 mr-2">{freelancer.name}</h3>
                        {freelancer.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        {freelancer.topRated && <Award className="w-4 h-4 text-yellow-500 ml-1" />}
                      </div>
                      <p className="text-gray-600 mb-1">{freelancer.title}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{freelancer.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium text-gray-900">{freelancer.rating}</span>
                      <span className="text-gray-600 ml-1">({freelancer.reviewCount})</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span>{freelancer.completedJobs} jobs</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${freelancer.hourlyRate}</div>
                    <div className="text-sm text-gray-600">/hour</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{freelancer.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {freelancer.skills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {freelancer.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{freelancer.skills.length - 6} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Responds in {freelancer.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-1 ${
                          freelancer.availability === "Available now" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></div>
                      <span>{freelancer.availability}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                    <Link href={`/freelancers/${freelancer.id}`}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
                      >
                        View Profile
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
            Load More Freelancers
          </Button>
        </div>
      </div>
    </div>
  )
}
