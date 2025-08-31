"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  MessageSquare,
  Bookmark,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Loader2,
  X,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { useGetProjectsQuery } from "@/lib/redux/api/firebaseApi"
import { useAppSelector } from "@/lib/redux/hooks"

// Define project categories based on Firebase data
const categories = [
  { label: "All Categories", value: "all" },  // Changed empty string to "all"
  { label: "Web Development", value: "Web Development" },
  { label: "Mobile Development", value: "Mobile Development" },
  { label: "Design", value: "Design" },
  { label: "UI/UX Design", value: "UI/UX Design" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "Data Science", value: "Data Science" },
  { label: "Writing & Content", value: "Writing & Content" },
  { label: "Video & Animation", value: "Video & Animation" },
  { label: "Music & Audio", value: "Music & Audio" },
]

// Map UI experience levels to Firebase values
const experienceLevels = [
  { label: "All Levels", value: "all" },  // Changed empty string to "all"
  { label: "Entry Level", value: "entry" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Expert", value: "expert" }
]

// Import Project type
import { Project } from "@/lib/redux/types/firebaseTypes"

export default function ProjectsPage() {
  // Get user state from Redux store using the typed hook
  const { user } = useAppSelector((state) => state.auth)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedExperience, setSelectedExperience] = useState("all")
  const [budgetRange, setBudgetRange] = useState([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // Number of projects to show per page
  
  // Prepare query parameters
  const queryParams = {
    limit: 100, // Fetch more projects at once to handle client-side pagination
    status: 'active',
    categories: selectedCategory && selectedCategory !== 'all' ? [selectedCategory] : undefined,
    // Experience level is now applied as a client-side filter, not in the query
    minBudget: budgetRange[0] > 0 ? budgetRange[0] : undefined,
    maxBudget: budgetRange[1] < 10000 ? budgetRange[1] : undefined,
    freelancerId: user?.role === 'freelancer' ? user.userId : undefined,
    // Only enable skill matching for logged-in freelancers, and make it less strict
    matchFreelancerSkills: user?.role === 'freelancer' && user?.userId ? true : false,
    // No need for lastDoc with page-based pagination
  }
  
  // Set default sort order to relevance for freelancers
  useEffect(() => {
    if (user?.role === 'freelancer' && sortBy === 'newest') {
      setSortBy('relevance');
    }
  }, [user?.role]);
  
  // Fetch projects from Firebase - get result type from API
  const { data, isLoading, isFetching, isError } = useGetProjectsQuery(queryParams)
  
  // Debug logs for user authentication
  console.log('ProjectsPage - Current user:', { 
    userId: user?.userId, 
    role: user?.role, 
    isFreelancer: user?.role === 'freelancer',
    isAuthenticated: !!user,
    displayName: user?.displayName
  });
  
  // Create a map of project IDs that the user has already applied to
  const [appliedProjectIds, setAppliedProjectIds] = useState<Map<string, string>>(new Map())
  const [isLoadingProposals, setIsLoadingProposals] = useState(false)
  
  // Fetch user proposals directly from Firestore
  const fetchUserProposals = useCallback(async () => {
    if (!user?.userId || user?.role !== 'freelancer') {
      return
    }
    
    setIsLoadingProposals(true)
    try {
      console.log('ProjectsPage - Directly querying Firestore for proposals by freelancerId:', user.userId)
      
      // Create query for proposals by this freelancer
      const q = query(
        collection(db, 'proposals'),
        where('freelancerId', '==', user.userId)
      )
      
      const querySnapshot = await getDocs(q)
      console.log(`ProjectsPage - Found ${querySnapshot.size} proposals for user ${user.userId}`)
      
      // Create new map of project IDs that the user has already applied to
      const newAppliedProjectIds = new Map<string, string>()
      
      // Process each proposal document
      querySnapshot.forEach(doc => {
        const proposal = doc.data()
        if (proposal.projectId) {
          console.log(`ProjectsPage - User has applied to project: ${proposal.projectId}, proposal ID: ${doc.id}`)
          newAppliedProjectIds.set(proposal.projectId, doc.id)
        }
      })
      
      setAppliedProjectIds(newAppliedProjectIds)
      console.log('ProjectsPage - Applied project IDs map size:', newAppliedProjectIds.size)
      console.log('ProjectsPage - Applied project IDs:', Array.from(newAppliedProjectIds.keys()))
    } catch (error) {
      console.error('ProjectsPage - Error fetching user proposals:', error)
    } finally {
      setIsLoadingProposals(false)
    }
  }, [user?.userId, user?.role])
  
  useEffect(() => {
    fetchUserProposals()
  }, [fetchUserProposals]);
  
  // We no longer need to cast since the API now returns the correct type
  const projectsData = data
  
  // Apply client-side filtering for search and experience level
  let allFilteredProjects = projectsData?.projects?.filter((project: Project) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.requirements?.skills?.some((skill: string) => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Experience level filter
    const matchesExperience = 
      selectedExperience === 'all' ||
      project.requirements?.experienceLevel === selectedExperience;
      
    return matchesSearch && matchesExperience;
  }) || [];
  
  // Calculate pagination data
  const totalProjects = allFilteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / itemsPerPage));
  
  // Ensure current page is within bounds
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (safeCurrentPage !== currentPage) {
    setCurrentPage(safeCurrentPage);
  }
  
  // Get projects for current page
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProjects);
  let filteredProjects = allFilteredProjects.slice(startIndex, endIndex);
  
  // Apply sorting based on selected sort option
  if (filteredProjects.length > 0) {
    filteredProjects = [...filteredProjects].sort((a: any, b: any) => {
      switch (sortBy) {
        case 'newest':
          // Default sort by creation date (newest first)
          // Handle different timestamp formats
          const getTime = (date: any) => {
            if (typeof date === 'string') {
              return new Date(date).getTime();
            } else if (date?.seconds) {
              return new Date(date.seconds * 1000).getTime();
            } else {
              return 0;
            }
          };
          return getTime(b.createdAt) - getTime(a.createdAt);
          
        case 'budget-high':
          // Sort by highest budget
          const budgetA = a.budget?.type === 'fixed' ? a.budget?.amount : a.budget?.maxAmount;
          const budgetB = b.budget?.type === 'fixed' ? b.budget?.amount : b.budget?.maxAmount;
          return (budgetB || 0) - (budgetA || 0);
          
        case 'budget-low':
          // Sort by lowest budget
          const budgetALow = a.budget?.type === 'fixed' ? a.budget?.amount : a.budget?.minAmount;
          const budgetBLow = b.budget?.type === 'fixed' ? b.budget?.amount : b.budget?.minAmount;
          return (budgetALow || 0) - (budgetBLow || 0);
          
        case 'proposals':
          // Sort by fewest proposals
          return (a.proposalCount || 0) - (b.proposalCount || 0);
          
        case 'relevance':
          // Sort by relevance score (if available)
          // Use any type to handle extra properties added by Firebase API
          return ((b as any).relevanceScore || 0) - ((a as any).relevanceScore || 0);
          
        default:
          return 0;
      }
    });
  }
  
  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of projects section
    window.scrollTo({
      top: document.querySelector('.space-y-6')?.getBoundingClientRect().top 
           ? window.scrollY + (document.querySelector('.space-y-6')?.getBoundingClientRect().top || 0) - 100
           : 0,
      behavior: 'smooth',
    });
  };
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedExperience, budgetRange, searchQuery, sortBy])
  
  // Helper function to format timestamps as "X time ago"
  function formatTimeAgo(timestamp: any): string {
    if (!timestamp) return "Recently";
    
    // Handle different timestamp formats
    let date;
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'object' && 'seconds' in timestamp) {
      // Firestore timestamp
      date = new Date(timestamp.seconds * 1000);
    } else {
      return "Recently";
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Convert to appropriate time unit
    if (diffInSeconds < 60) {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  }

  // Track error details for debugging
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Create a reusable error handler for debugging RTK Query errors
  const { error: queryError } = useGetProjectsQuery(queryParams, {
    skip: false,
    selectFromResult: ({ error }) => ({ error })
  });

  useEffect(() => {
    if (isError && queryError) {
      // Format error object in a readable way, handling any type
      const errorInfo = {
        error: JSON.stringify(queryError),
        status: (queryError as any)?.status || 'unknown',
        data: (queryError as any)?.data || null,
        // Include query parameters for debugging
        queryParams: {
          ...queryParams,
          // lastDoc is no longer used with page-based pagination
          // Remove or comment this line as it's not in the queryParams interface anymore
        },
        userInfo: {
          isAuthenticated: !!user,
          role: user?.role || 'none',
          userId: user?.userId || 'none'
        }
      };
      setErrorDetails(JSON.stringify(errorInfo, null, 2));
    } else {
      setErrorDetails(null);
    }
  }, [isError, queryError, queryParams, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

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
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.label} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.label} value={level.value}>
                        {level.label}
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
                    {user?.role === 'freelancer' && (
                      <SelectItem value="relevance">Best Match</SelectItem>
                    )}
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <div>
            <p className="text-gray-600">
              {isLoading || isLoadingProposals ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLoadingProposals ? 'Checking your proposals...' : 'Loading projects...'}
                </span>
              ) : (
                <span>
                  Showing {startIndex + 1}-{endIndex} of {totalProjects} projects
                </span>
              )}
            </p>
            
            {/* Active filters summary */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategory !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex gap-1 items-center">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </Badge>
              )}
              
              {selectedExperience !== 'all' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex gap-1 items-center">
                  Level: {selectedExperience}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedExperience('all')} />
                </Badge>
              )}
              
              {(budgetRange[0] > 0 || budgetRange[1] < 10000) && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex gap-1 items-center">
                  Budget: ${budgetRange[0]}-${budgetRange[1]}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setBudgetRange([0, 10000])} />
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 border-gray-200 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {user?.role === 'freelancer' && (
                  <SelectItem value="relevance">Best Match</SelectItem>
                )}
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
          {isLoading || isLoadingProposals ? (
            // Loading skeleton cards
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="border-0 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : isError ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-red-500 mb-2">Error loading projects</h3>
                <p className="text-gray-700 mb-4">We couldn't load the projects. Please try again later.</p>
                {errorDetails && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-md overflow-auto max-h-64">
                    <p className="font-semibold mb-2">Error details (for debugging):</p>
                    <pre className="text-xs text-red-600 whitespace-pre-wrap">{errorDetails}</pre>
                    <div className="mt-4 text-sm border-t border-gray-200 pt-4">
                      <p className="font-medium mb-2">Troubleshooting steps:</p>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Check that your Firebase configuration is correct</li>
                        <li>Verify that you have the required permissions in Firebase</li>
                        <li>Make sure the 'projects' collection exists in your database</li>
                        <li>Check for network connectivity issues</li>
                        <li>Review security rules in your Firestore database</li>
                      </ol>
                    </div>
                  </div>
                )}
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </CardContent>
            </Card>
          ) : totalProjects === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-700 mb-4">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          ) : (
            filteredProjects.map((project: Project) => (
              <Card key={project.projectId} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3 hover:text-blue-600 cursor-pointer">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {project.visibility === 'public' && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">Public</Badge>
                          )}
                          {project.timeline?.isUrgent && <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Urgent</Badge>}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-4">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.requirements?.skills?.map((skill: string, index: number) => (
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
                          {project.budget?.type === "fixed"
                            ? `$${project.budget?.amount?.toLocaleString()}`
                            : `$${project.budget?.minAmount} - $${project.budget?.maxAmount}/hr`
                          }
                        </span>
                        <span className="text-gray-600 ml-1">
                          {project.budget?.type === "fixed" ? "Fixed Price" : "Hourly"}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        <span>{project.proposalCount || 0} proposals</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatTimeAgo(project.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center mr-6">
                        <Image
                          src={project.clientInfo?.photoURL || "/placeholder-user.jpg"}
                          alt={project.clientInfo?.name || "Client"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {project.clientInfo?.name || "Anonymous Client"}
                            </span>
                            {project.clientInfo?.verificationStatus && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{project.requirements?.location === 'remote' ? 'Remote' : 'On-site'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Link href={`/projects/${project.projectId}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl">
                            View Details
                          </Button>
                        </Link>
                        {user?.role === 'freelancer' && (
                          <Link 
                            href={appliedProjectIds.has(project.projectId) 
                              ? `/projects/${project.projectId}/proposal?edit=true&proposalId=${appliedProjectIds.get(project.projectId)}`
                              : `/projects/${project.projectId}/proposal`
                            }
                          >
                            {(() => {
                              const hasApplied = appliedProjectIds.has(project.projectId);
                              const proposalId = appliedProjectIds.get(project.projectId);
                              
                              // More detailed debug log for this specific project
                              console.log(`ProjectCard - Project ${project.projectId}:`, {
                                hasApplied,
                                proposalId: proposalId || 'none',
                                buttonText: hasApplied ? 'Edit Proposal' : 'Apply Now',
                                buttonStyle: hasApplied ? 'amber/orange' : 'green',
                                mapContainsProject: appliedProjectIds.has(project.projectId),
                                mapSize: appliedProjectIds.size,
                                allAppliedProjects: Array.from(appliedProjectIds.keys()),
                                currentProject: project.projectId
                              });
                              
                              return (
                                <Button 
                                  className={hasApplied
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl"
                                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                                  }
                                >
                                  {hasApplied ? "Edit Proposal" : "Apply Now"}
                                </Button>
                              );
                            })()}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isLoadingProposals && !isError && totalProjects > 0 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              {/* First page button */}
              <Button
                variant="outline"
                size="icon"
                className={`w-9 h-9 ${safeCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handlePageChange(1)}
                disabled={safeCurrentPage === 1 || isFetching}
              >
                <span className="sr-only">First page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Previous page button */}
              <Button
                variant="outline"
                size="icon"
                className={`w-9 h-9 ${safeCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1 || isFetching}
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page number buttons */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate page numbers to show (5 at most)
                let pageNum: number;
                
                if (totalPages <= 5) {
                  // Show all pages if 5 or fewer
                  pageNum = i + 1;
                } else if (safeCurrentPage <= 3) {
                  // Show first 5 pages
                  pageNum = i + 1;
                } else if (safeCurrentPage >= totalPages - 2) {
                  // Show last 5 pages
                  pageNum = totalPages - 4 + i;
                } else {
                  // Show current page and 2 on each side
                  pageNum = safeCurrentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === safeCurrentPage ? "default" : "outline"}
                    className={`w-9 h-9 ${isFetching ? 'opacity-50' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isFetching}
                  >
                    <span className="sr-only">Page {pageNum}</span>
                    {pageNum}
                  </Button>
                );
              })}
              
              {/* Next page button */}
              <Button
                variant="outline"
                size="icon"
                className={`w-9 h-9 ${safeCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages || isFetching}
              >
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Last page button */}
              <Button
                variant="outline"
                size="icon"
                className={`w-9 h-9 ${safeCurrentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handlePageChange(totalPages)}
                disabled={safeCurrentPage === totalPages || isFetching}
              >
                <span className="sr-only">Last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
              
              {/* Page info */}
              <div className="ml-4 text-sm text-gray-500">
                Page {safeCurrentPage} of {totalPages} ({totalProjects} projects)
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
