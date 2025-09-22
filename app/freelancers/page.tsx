"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
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
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useGetFreelancersQuery } from "@/lib/redux/api/firebaseApi"
import { useToast } from "@/hooks/use-toast"

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
  const dispatch = useDispatch()
  const { toast } = useToast()
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedExperience, setSelectedExperience] = useState("All Levels")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [hourlyRateRange, setHourlyRateRange] = useState([0, 150])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("bestMatch")
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [lastVisible, setLastVisible] = useState<any>(null)
  const pageSize = 10

  // Debounced search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Convert UI sort options to API sort options
  const getSortOption = () => {
    switch(sortBy) {
      case "rating": return "rating"
      case "rate-low": return "hourRate"
      case "rate-high": return "hourRateDesc"
      case "reviews": return "reviewCount"
      default: return "bestMatch"
    }
  }
  
  // Fetch freelancers with filters
  const {
    data: freelancersData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  } = useGetFreelancersQuery({
    page: currentPage,
    pageSize,
    lastVisible,
    filters: {
      searchQuery: debouncedSearch,
      category: selectedCategory,
      location: selectedLocation,
      experienceLevel: selectedExperience === "All Levels" ? undefined : selectedExperience,
      minRate: hourlyRateRange[0],
      maxRate: hourlyRateRange[1],
    },
    sortBy: getSortOption(),
  }, { refetchOnMountOrArgChange: true })
  
  // Extract freelancer data
  const freelancers = freelancersData?.items || []
  const pagination = freelancersData?.pagination
  
  // Handle pagination
  const handleNextPage = () => {
    if (pagination?.hasMore) {
      setCurrentPage(prev => prev + 1)
      setLastVisible(pagination.lastVisible)
    }
  }
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
      setLastVisible(null) // Reset last visible when going back
    }
  }
  
  // Handle search and filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
    setLastVisible(null)
  }
  
  const handleFilterChange = () => {
    setCurrentPage(1)
    setLastVisible(null)
    refetch()
  }
  
  // Format hourly rate from string to display value
  const formatHourlyRate = (rateString: string | undefined) => {
    if (!rateString) return 0
    // Extract numeric value from hourRate string (e.g., "$ 20" -> 20)
    return parseFloat(rateString.replace(/[^0-9.]/g, '')) || 0
  }
  
  // Get freelancer availability status
  const getFreelancerAvailability = (freelancer: any) => {
    return freelancer?.preferences?.availability || "available"
  }
  
  // Get freelancer response time (estimated)
  const getResponseTime = (freelancer: any) => {
    // This could be based on actual data from Firebase in the future
    const responseRateScore = freelancer?.stats?.responseRate || 0
    
    if (responseRateScore > 90) return "1 hour"
    if (responseRateScore > 80) return "2 hours"
    if (responseRateScore > 70) return "4 hours"
    return "24 hours"
  }
  
  // Format skills for display
  const getFreelancerSkills = (freelancer: any) => {
    return freelancer?.skills?.map((skill: any) => skill.text) || []
  }
  
  // Check if freelancer is verified
  const isFreelancerVerified = (freelancer: any) => {
    return freelancer?.isVerified || false
  }
  
  // Check if freelancer is top rated
  const isTopRated = (freelancer: any) => {
    const rating = freelancer?.stats?.averageRating || 0
    const completedJobs = freelancer?.stats?.completedJobs || 0
    
    return rating >= 4.5 && completedJobs >= 10
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero section with background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="absolute inset-0 opacity-20 bg-[url('/tech-startup-office.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left md:max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">Find Top Freelancers For Your Project</h1>
            <p className="text-xl text-blue-100 mb-8">Hire verified professionals with proven expertise</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8">
        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-blue-500 transform hover:-translate-y-1 transition-all">
            <div className="text-2xl font-bold text-gray-900 mb-1">1,000+</div>
            <div className="text-sm text-gray-600">Skilled Freelancers</div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-green-500 transform hover:-translate-y-1 transition-all">
            <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-purple-500 transform hover:-translate-y-1 transition-all">
            <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Customer Support</div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-yellow-500 transform hover:-translate-y-1 transition-all">
            <div className="text-2xl font-bold text-gray-900 mb-1">48 hrs</div>
            <div className="text-sm text-gray-600">Avg. Turnaround</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search freelancers by name, skills, or expertise..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-200 shadow-sm"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 mt-2 border-t border-gray-200 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  handleFilterChange();
                }}>
                  <SelectTrigger className="rounded-xl border-gray-300 hover:border-blue-400 transition-colors">
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Location
                </label>
                <Select value={selectedLocation} onValueChange={(value) => {
                  setSelectedLocation(value);
                  handleFilterChange();
                }}>
                  <SelectTrigger className="rounded-xl border-gray-300 hover:border-blue-400 transition-colors">
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
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-blue-500" />
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  handleFilterChange();
                }}>
                  <SelectTrigger className="rounded-xl border-gray-300 hover:border-blue-400 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bestMatch">Best Match</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="rate-low">Lowest Rate</SelectItem>
                    <SelectItem value="rate-high">Highest Rate</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V20H10.74V18.07C9.03 17.71 7.58 16.61 7.47 14.67H9.43C9.53 15.72 10.25 16.54 12.08 16.54C14.04 16.54 14.48 15.56 14.48 14.95C14.48 14.12 14.04 13.34 11.81 12.81C9.33 12.21 7.63 11.19 7.63 9.14C7.63 7.42 9.02 6.3 10.74 5.93V4H13.41V5.95C15.27 6.4 16.2 7.81 16.26 9.34H14.3C14.25 8.23 13.66 7.47 12.08 7.47C10.58 7.47 9.68 8.15 9.68 9.11C9.68 9.95 10.33 10.5 12.35 11.02C14.37 11.54 16.53 12.41 16.53 14.93C16.53 16.75 15.15 17.76 13.41 18.09Z" fill="currentColor"/>
                    </svg>
                    Hourly Rate: <span className="ml-1 font-semibold text-blue-600">${hourlyRateRange[0]} - ${hourlyRateRange[1]}</span>
                  </div>
                </label>
                <Slider
                  value={hourlyRateRange}
                  onValueChange={(value) => setHourlyRateRange(value)}
                  onValueCommit={handleFilterChange}
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
        <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="bg-blue-600 rounded-full p-2 mr-3 hidden sm:flex">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-700 font-medium">
              {isLoading ? (
                "Loading freelancers..."
              ) : (
                <>
                  <span className="text-blue-600 font-bold">{freelancers.length}</span> {pagination?.totalItems ? 
                    <>out of <span className="text-blue-600 font-bold">{pagination.totalItems}</span></> : ""} top freelancers available
                </>
              )}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
              <div className="absolute inset-3 border-t-4 border-blue-400 border-solid rounded-full animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-blue-500 animate-pulse" />
            </div>
            <p className="text-lg font-medium text-gray-700">Loading talented freelancers...</p>
            <p className="text-gray-500 mt-2">Please wait while we find the perfect match for your project</p>
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md border border-red-100 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
            <div className="bg-red-50 rounded-full p-6 mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Failed to Load Freelancers</h3>
            <p className="text-gray-600 mb-6 max-w-md text-center">
              {error ? "There was an error loading freelancer data." : "We couldn't load the freelancer data at this time. Please try again later."}
            </p>
            <Button 
              onClick={() => refetch()} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2 rounded-full shadow-md"
            >
              Retry Now
            </Button>
          </div>
        )}

        {/* No results */}
        {!isLoading && !isError && freelancers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="bg-blue-50 rounded-full p-6 mb-6">
              <Search className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Freelancers Found</h3>
            <p className="text-gray-600 mb-6 max-w-md text-center">
              We couldn't find any freelancers matching your current filters. Try adjusting your search criteria to discover our talented professionals.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedLocation("All Locations");
                setSelectedExperience("All Levels");
                setHourlyRateRange([0, 150]);
                handleFilterChange();
              }} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2 rounded-full shadow-md"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Freelancers Grid */}
        {!isLoading && !isError && freelancers.length > 0 && (
          <div className="flex flex-col gap-6">
            {freelancers.map((freelancer: any) => (
              <Card 
                key={freelancer.userId} 
                className="w-full group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden rounded-xl"
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-5 w-full">
                    {/* Left Section with Banner and Profile Image */}
                    <div className="md:col-span-1 relative bg-gradient-to-b from-blue-50 to-blue-100 p-6 flex flex-col items-center justify-center border-r border-gray-100">
                      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative mb-4 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-300"></div>
                        <div className="relative">
                          <Image
                            src={freelancer.photoURL || "/placeholder-user.jpg"}
                            alt={freelancer.displayName || "Freelancer"}
                            width={100}
                            height={100}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md transform group-hover:scale-105 transition-transform"
                          />
                          {isFreelancerVerified(freelancer) && (
                            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 border-2 border-white shadow-lg">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center mb-1 gap-1">
                          <h3 className="text-lg font-bold text-gray-900">{freelancer.displayName}</h3>
                          {isTopRated(freelancer) && (
                            <div className="tooltip" data-tip="Top Rated">
                              <Award className="w-4 h-4 text-yellow-500" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium text-gray-900">{freelancer.stats?.averageRating?.toFixed(1) || "New"}</span>
                          <span className="text-gray-500 ml-1">({freelancer.stats?.totalReviews || 0})</span>
                        </div>
                        
                        <div className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full mb-3 shadow-md transform hover:scale-105 transition-transform">
                          ${formatHourlyRate(freelancer.hourRate)}/hr
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{freelancer.about?.country || "Remote"}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <div className={`w-2 h-2 rounded-full mr-1 ${
                            getFreelancerAvailability(freelancer) === "available" ? "bg-green-500" : "bg-yellow-500"
                          }`}></div>
                          <span>{getFreelancerAvailability(freelancer) === "available" ? "Available now" : "Busy"}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Section with Details */}
                    <div className="md:col-span-4 p-6 bg-white">
                      <div className="flex flex-col h-full">
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                              {freelancer.title || "Freelancer"}
                            </h3>
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                Pro Freelancer
                              </span>
                              {freelancer.stats?.completedJobs > 20 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Trusted
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-full h-9 w-9 p-0 border-gray-300 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600 transition-colors">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                          <div className="flex flex-col bg-blue-50 p-3 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                            <span className="text-sm text-blue-700 font-medium mb-1">Experience</span>
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-md bg-blue-600 text-white mr-3">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {freelancer.stats?.completedJobs || 0} 
                                <span className="text-gray-500 ml-1 text-sm">completed jobs</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col bg-green-50 p-3 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                            <span className="text-sm text-green-700 font-medium mb-1">Response Time</span>
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-md bg-green-600 text-white mr-3">
                                <Clock className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {getResponseTime(freelancer)}
                                <span className="text-gray-500 ml-1 text-sm">response</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col bg-purple-50 p-3 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                            <span className="text-sm text-purple-700 font-medium mb-1">Member Since</span>
                            <div className="flex items-center">
                              <div className="p-1.5 rounded-md bg-purple-600 text-white mr-3">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-gray-800">
                                {typeof freelancer.createdAt === 'string' 
                                  ? new Date(freelancer.createdAt).getFullYear() 
                                  : freelancer.createdAt && freelancer.createdAt.seconds 
                                    ? new Date(freelancer.createdAt.seconds * 1000).getFullYear() 
                                    : "New"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                            <p className="text-gray-700 line-clamp-3 italic">"{freelancer.overview || "No overview provided"}"</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 6.5C2 4.01472 4.01472 2 6.5 2H17.5C19.9853 2 22 4.01472 22 6.5V17.5C22 19.9853 19.9853 22 17.5 22H6.5C4.01472 22 2 19.9853 2 17.5V6.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8.5 11.5L11.5 14.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Top Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {getFreelancerSkills(freelancer).slice(0, 8).map((skill: string, index: number) => (
                                <Badge 
                                  key={index} 
                                  variant="outline" 
                                  className="bg-white hover:bg-blue-50 text-blue-800 border-blue-200 text-xs py-1 px-3 rounded-full transition-all hover:shadow-sm transform hover:-translate-y-0.5"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {getFreelancerSkills(freelancer).length > 8 && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs py-1 px-3 rounded-full cursor-pointer hover:bg-blue-100 bg-blue-50 text-blue-600 border-blue-200"
                                >
                                  +{getFreelancerSkills(freelancer).length - 8} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-5 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            {freelancer.languages && (
                              <div className="bg-blue-50 py-1.5 px-3 rounded-full border border-blue-100">
                                <div className="text-sm text-blue-800">
                                  <span className="font-semibold">Languages:</span> {
                                    Array.isArray(freelancer.languages) 
                                      ? freelancer.languages.slice(0, 3).map((lang: any) => lang.text || lang).join(", ")
                                      : "English"
                                  }
                                  {Array.isArray(freelancer.languages) && freelancer.languages.length > 3 && 
                                    ` +${freelancer.languages.length - 3} more`
                                  }
                                </div>
                              </div>
                            )}
                            <div className="hidden md:flex items-center space-x-1">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-500">Online now</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
                            >
                              <MessageSquare className="w-4 h-4 mr-1.5" />
                              Message
                            </Button>
                            <Link href={`/profile/${freelancer.userId}`}>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-md hover:shadow-lg transition-shadow px-5"
                              >
                                View Profile
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && freelancers.length > 0 && (
          <div className="flex flex-col items-center mt-12">
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-md border border-gray-200">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isFetching}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="bg-blue-50 text-blue-800 font-medium rounded-full px-4 py-1 border border-blue-200">
                Page {currentPage}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextPage}
                disabled={!pagination?.hasMore || isFetching}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {isFetching && (
              <div className="mt-4 text-blue-600 flex items-center animate-pulse">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading more results...
              </div>
            )}
          </div>
        )}
        
        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to hire top talent?</h2>
              <p className="text-blue-100 text-lg mb-6">
                Post your project today and get proposals from our verified freelancers within hours.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 rounded-full px-8 py-6 text-lg font-medium shadow-lg">
                  Post a Project
                </Button>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700 rounded-full px-8 py-6 text-lg font-medium">
                  Browse More Freelancers
                </Button>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative w-full h-48 md:h-64">
                <div className="absolute inset-0 rounded-lg overflow-hidden opacity-90">
                  <Image 
                    src="/modern-saas-office.png" 
                    alt="Start your project" 
                    fill 
                    style={{objectFit: "cover"}} 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Banner */}
      <div className="bg-gray-900 mt-16 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-white mb-4">Join thousands of businesses hiring on Bizzlink</h3>
          <p className="text-gray-400 mb-6">Find the perfect match for your next project with our pool of professional freelancers</p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6">
              Sign Up Free
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-gray-800 rounded-full px-6">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
