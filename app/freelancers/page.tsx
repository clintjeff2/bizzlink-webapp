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
                  onChange={handleSearchChange}
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
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  handleFilterChange();
                }}>
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
                <Select value={selectedLocation} onValueChange={(value) => {
                  setSelectedLocation(value);
                  handleFilterChange();
                }}>
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
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  handleFilterChange();
                }}>
                  <SelectTrigger className="rounded-xl">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate: ${hourlyRateRange[0]} - ${hourlyRateRange[1]}
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
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {isLoading ? (
              "Loading freelancers..."
            ) : (
              `Showing ${freelancers.length} ${pagination?.totalItems ? `of ${pagination.totalItems}` : ""} freelancers`
            )}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading freelancers...</p>
          </div>
        )}
        
        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load freelancers</h3>
            <p className="text-gray-600 mb-4">
              {error ? "There was an error loading freelancer data." : "There was an error loading freelancer data. Please try again."}
            </p>
            <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700 text-white">
              Retry
            </Button>
          </div>
        )}

        {/* No results */}
        {!isLoading && !isError && freelancers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <Search className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No freelancers found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find more results.
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Freelancers Grid */}
        {!isLoading && !isError && freelancers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {freelancers.map((freelancer: any) => (
              <Card key={freelancer.userId} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <Image
                        src={freelancer.photoURL || "/placeholder-user.jpg"}
                        alt={freelancer.displayName || "Freelancer"}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 mr-2">{freelancer.displayName}</h3>
                          {isFreelancerVerified(freelancer) && <CheckCircle className="w-4 h-4 text-blue-500" />}
                          {isTopRated(freelancer) && <Award className="w-4 h-4 text-yellow-500 ml-1" />}
                        </div>
                        <p className="text-gray-600 mb-1">{freelancer.title}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{freelancer.about?.country || "Remote"}</span>
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
                        <span className="font-medium text-gray-900">{freelancer.stats?.averageRating?.toFixed(1) || "New"}</span>
                        <span className="text-gray-600 ml-1">({freelancer.stats?.totalReviews || 0})</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>{freelancer.stats?.completedJobs || 0} jobs</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${formatHourlyRate(freelancer.hourRate)}</div>
                      <div className="text-sm text-gray-600">/hour</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{freelancer.overview || "No overview provided"}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {getFreelancerSkills(freelancer).slice(0, 6).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {getFreelancerSkills(freelancer).length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{getFreelancerSkills(freelancer).length - 6} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Responds in {getResponseTime(freelancer)}</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-1 ${
                            getFreelancerAvailability(freelancer) === "available" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        ></div>
                        <span>{getFreelancerAvailability(freelancer) === "available" ? "Available now" : "Busy"}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Link href={`/profile/${freelancer.userId}`}>
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
        )}

        {/* Pagination */}
        {!isLoading && !isError && freelancers.length > 0 && (
          <div className="flex justify-center items-center mt-12 space-x-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isFetching}
              className="border-gray-300 text-gray-700"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            <div className="text-gray-700">
              Page {currentPage}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleNextPage}
              disabled={!pagination?.hasMore || isFetching}
              className="border-gray-300 text-gray-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
