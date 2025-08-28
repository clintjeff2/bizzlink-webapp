"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useGetProjectsByClientQuery } from "@/lib/redux/api/firebaseApi"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  DollarSign, 
  Users, 
  Eye, 
  Edit, 
  Clock,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  PauseCircle,
  XCircle,
  Briefcase,
  RefreshCw
} from "lucide-react"
import { updateDraftProjectsToActive } from "@/lib/utils/updateProjectStatus"

const ProjectCard = ({ project, onViewDetails, onEdit }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'paused': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200'
      case 'draft': return 'bg-slate-50 text-slate-700 border-slate-200'
      default: return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'paused': return <PauseCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'draft': return <Edit className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatBudget = (project: any) => {
    console.log("Budget data for project:", project.title, project.budget)
    
    // Handle different budget structures
    if (!project.budget) return 'Budget not set'
    
    const currency = project.budget.currency || 'USD'
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency + ' '
    
    // Handle different budget formats
    if (project.budget.amount) {
      // Single amount
      return `${symbol}${Number(project.budget.amount).toLocaleString()}`
    } else if (project.budget.min && project.budget.max) {
      // Range
      const min = Number(project.budget.min).toLocaleString()
      const max = Number(project.budget.max).toLocaleString()
      const suffix = project.budget.type === 'hourly' ? '/hr' : ''
      return `${symbol}${min} - ${symbol}${max}${suffix}`
    } else if (project.budget.min) {
      // Minimum only
      const suffix = project.budget.type === 'hourly' ? '/hr' : ''
      return `From ${symbol}${Number(project.budget.min).toLocaleString()}${suffix}`
    } else if (project.budget.max) {
      // Maximum only
      const suffix = project.budget.type === 'hourly' ? '/hr' : ''
      return `Up to ${symbol}${Number(project.budget.max).toLocaleString()}${suffix}`
    }
    
    return 'Budget not specified'
  }

  const formatTimeline = (project: any) => {
    if (!project.timeline) return 'Timeline not set'
    
    // Handle different timeline formats
    if (typeof project.timeline === 'string') {
      return project.timeline.replace('-', ' ')
    }
    
    if (project.timeline.duration) {
      return project.timeline.duration
    }
    
    if (project.timeline.startDate && project.timeline.endDate) {
      const start = new Date(project.timeline.startDate).toLocaleDateString()
      const end = new Date(project.timeline.endDate).toLocaleDateString()
      return `${start} - ${end}`
    }
    
    if (project.timeline.startDate) {
      const start = new Date(project.timeline.startDate).toLocaleDateString()
      return `Starts ${start}`
    }
    
    return 'Timeline not specified'
  }

  const formatCreatedDate = (project: any) => {
    if (project.createdAt) {
      // Handle different date formats
      if (typeof project.createdAt === 'string') {
        return new Date(project.createdAt).toLocaleDateString()
      } else if (project.createdAt.seconds) {
        return new Date(project.createdAt.seconds * 1000).toLocaleDateString()
      } else if (project.createdAt.toDate) {
        return project.createdAt.toDate().toLocaleDateString()
      }
    }
    return 'Date not available'
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-200 bg-white overflow-hidden relative">
      {/* Hover overlay - only appears on card hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      
      <CardHeader className="relative pb-4 border-b border-slate-100 z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">
              {project.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${getStatusColor(project.status)} border font-medium px-3 py-1`}>
                <div className="flex items-center space-x-1.5">
                  {getStatusIcon(project.status)}
                  <span className="capitalize">{project.status}</span>
                </div>
              </Badge>
              {project.isUrgent && (
                <Badge className="bg-red-50 text-red-700 border-red-200 font-medium">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
              {project.featured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 font-medium">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {formatBudget(project)}
            </div>
            <div className="text-xs text-slate-500">
              {project.budget?.type === 'hourly' ? 'Hourly Rate' : 'Project Budget'}
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </CardHeader>
      
      <CardContent className="relative pt-4 space-y-4 z-10">
        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Timeline</div>
                <div className="font-medium text-slate-700">{formatTimeline(project)}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <div className="p-1.5 bg-primary-green/10 rounded-lg">
                <Users className="w-4 h-4 text-primary-green-dark" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Proposals</div>
                <div className="font-medium text-slate-700">{project.proposalCount || 0} received</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Briefcase className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Category</div>
                <div className="font-medium text-slate-700">{project.category || 'General'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Posted</div>
                <div className="font-medium text-slate-700">{formatCreatedDate(project)}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skills Section */}
        {project.requirements?.skills && project.requirements.skills.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-500 uppercase tracking-wide">Required Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {project.requirements.skills.slice(0, 4).map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-colors">
                  {skill}
                </Badge>
              ))}
              {project.requirements.skills.length > 4 && (
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">
                  +{project.requirements.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{project.views || 0} views</span>
            </div>
            {project.saved && (
              <div className="flex items-center space-x-1 text-blue-600">
                <span>⭐ Saved</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(project.projectId)}
              className="text-xs bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
            >
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => onEdit(project.projectId)}
              className="text-xs bg-gradient-to-r from-primary-blue to-primary-green hover:from-primary-blue-dark hover:to-primary-green-dark text-white border-0 shadow-sm"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ClientProjectsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const { user } = useSelector((state: RootState) => state.auth)
  
  // Enhanced Debug Logging
  console.log("=== CLIENT PROJECTS PAGE DEBUG ===")
  console.log("1. Current user object:", user)
  console.log("2. User ID for query:", user?.userId)
  console.log("3. User role:", user?.role)
  console.log("4. Is user authenticated:", !!user)
  
  const {
    data: projects = [],
    isLoading,
    error
  } = useGetProjectsByClientQuery({ 
    clientId: user?.userId || "" 
  }, {
    skip: !user?.userId
  })
  
  // Enhanced Debug Logging for Query Results
  console.log("5. Projects query skipped:", !user?.userId)
  console.log("6. Projects query result:", { 
    projectsCount: projects.length, 
    projects: projects.slice(0, 2), // Log first 2 projects only
    isLoading, 
    error 
  })
  console.log("7. First project details (if exists):")
  if (projects[0]) {
    console.log("   - Project ID:", projects[0].projectId)
    console.log("   - Client ID:", projects[0].clientId)
    console.log("   - Title:", projects[0].title)
    console.log("   - Status:", projects[0].status)
    console.log("   - Budget structure:", projects[0].budget)
    console.log("   - Timeline structure:", projects[0].timeline)
    console.log("   - Created at:", projects[0].createdAt)
    console.log("   - Skills:", projects[0].requirements?.skills)
    console.log("   - Category:", projects[0].category)
  }
  
  // Log all project statuses to understand the issue
  console.log("8. All project statuses:")
  projects.forEach((project: any, index: number) => {
    console.log(`   Project ${index + 1}: "${project.title}" - Status: "${project.status}"`)
  })
  
  console.log("===============================")

  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((project: any) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.requirements?.skills?.some((skill: string) => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((project: any) => project.status === activeTab)
    }

    return filtered
  }, [projects, searchTerm, activeTab])

  const projectStats = useMemo(() => {
    const stats = {
      total: projects.length,
      active: projects.filter((p: any) => p.status === 'active').length,
      completed: projects.filter((p: any) => p.status === 'completed').length,
      draft: projects.filter((p: any) => p.status === 'draft').length,
      totalBudget: projects.reduce((sum: number, p: any) => {
        return sum + (p.budget?.max || 0)
      }, 0),
      totalProposals: projects.reduce((sum: number, p: any) => {
        return sum + (p.proposalCount || 0)
      }, 0)
    }
    return stats
  }, [projects])

  const handleViewDetails = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  const handleEditProject = (projectId: string) => {
    router.push(`/projects/post?edit=${projectId}`)
  }

  const handleCreateProject = () => {
    router.push("/projects/post")
  }

  // Temporary function to fix existing draft projects
  const handleFixDraftProjects = async () => {
    if (!user?.userId) return
    
    try {
      const result = await updateDraftProjectsToActive(user.userId)
      if (result.success) {
        // Refresh the projects list
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update draft projects:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-primary-green/20 border-b-primary-green rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Loading your projects...</h3>
              <p className="text-slate-600">Please wait while we fetch your project data</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <Card className="bg-white border border-red-200 shadow-lg max-w-md w-full">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Error loading projects</h3>
                <p className="text-slate-600 mb-6">We encountered an issue while fetching your projects. Please try again.</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-gradient-to-r from-primary-blue to-primary-green hover:from-primary-blue-dark hover:to-primary-green-dark text-white"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                My Projects
              </h1>
              <p className="text-lg text-slate-600">Manage and track your project portfolio</p>
            </div>
            <Button 
              onClick={handleCreateProject}
              size="lg"
              className="bg-gradient-to-r from-primary-blue to-primary-green hover:from-primary-blue-dark hover:to-primary-green-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Project
            </Button>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Projects</p>
                      <p className="text-3xl font-bold text-slate-800">{projectStats.total}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl text-white shadow-lg">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active</p>
                      <p className="text-3xl font-bold text-slate-800">{projectStats.active}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-xl text-white shadow-lg">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Completed</p>
                      <p className="text-3xl font-bold text-slate-800">{projectStats.completed}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white shadow-lg">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Budget</p>
                      <p className="text-3xl font-bold text-slate-800">
                        ${projectStats.totalBudget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white shadow-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Proposals</p>
                      <p className="text-3xl font-bold text-slate-800">{projectStats.totalProposals}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search projects by title, description, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white border-slate-200 shadow-sm focus:shadow-md transition-shadow duration-200 text-slate-700"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-6">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="h-12 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 px-6">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              {/* Temporary fix button - remove after fixing existing projects */}
              {projectStats.draft > 0 && (
                <Button 
                  onClick={handleFixDraftProjects}
                  variant="outline" 
                  className="h-12 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 px-6"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Fix Draft Projects ({projectStats.draft})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Projects Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-200 shadow-sm p-1 h-12 rounded-lg mb-8">
            <TabsTrigger value="all" className="h-10 px-6 text-slate-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200">
              All Projects ({projectStats.total})
            </TabsTrigger>
            <TabsTrigger value="active" className="h-10 px-6 text-slate-600 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200">
              Active ({projectStats.active})
            </TabsTrigger>
            <TabsTrigger value="completed" className="h-10 px-6 text-slate-600 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200">
              Completed ({projectStats.completed})
            </TabsTrigger>
            <TabsTrigger value="draft" className="h-10 px-6 text-slate-600 data-[state=active]:bg-slate-50 data-[state=active]:text-slate-700 data-[state=active]:border-slate-200">
              Drafts ({projectStats.draft})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredProjects.length === 0 ? (
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="p-16 text-center">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6">
                    <Briefcase className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {activeTab === "all" 
                      ? "No projects yet" 
                      : `No ${activeTab} projects`
                    }
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                    {activeTab === "all"
                      ? "Start building your portfolio by posting your first project and connecting with talented freelancers."
                      : `You don't have any ${activeTab} projects at the moment. Check back later or explore other tabs.`
                    }
                  </p>
                  {activeTab === "all" && (
                    <Button 
                      onClick={handleCreateProject}
                      size="lg"
                      className="bg-gradient-to-r from-primary-blue to-primary-green hover:from-primary-blue-dark hover:to-primary-green-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Post Your First Project
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map((project: any) => (
                  <ProjectCard
                    key={project.projectId}
                    project={project}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditProject}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
