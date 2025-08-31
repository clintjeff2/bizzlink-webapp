"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MapPin,
  Star,
  Download,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useAppSelector } from "@/lib/redux/hooks"
import { useGetProjectQuery } from "@/lib/redux/api/firebaseApi"
import Link from "next/link"
import Image from "next/image"
import FreelancerProjectAction from "@/components/freelancer-project-action"

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  
  // Enhanced Debug Logging
  console.log("=== PROJECT DETAILS PAGE DEBUG ===")
  console.log("1. Project ID from params:", id)
  console.log("2. Current user:", user)
  console.log("3. User ID:", user?.userId)
  console.log("4. User role:", user?.role)
  
  const { data: project, isLoading, error } = useGetProjectQuery(id as string)
  
  // Enhanced Debug Logging for Project Data
  console.log("5. Project query result:", { 
    project: project ? { 
      id: project.projectId, 
      title: project.title,
      clientId: project.clientId,
      status: project.status 
    } : null, 
    isLoading, 
    error 
  })
  console.log("6. Does project belong to user:", project?.clientId === user?.userId)
  console.log("===================================")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-8">The project you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = user?.userId === project.clientId
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-blue-100 text-blue-800",
    in_progress: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const formatBudget = (budget: any) => {
    if (budget.type === "fixed") {
      return `${budget.currency} ${budget.amount.toLocaleString()}`
    }
    return `${budget.currency} ${budget.minAmount}-${budget.maxAmount}/hr`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500 text-white'
      case 'active':
        return 'bg-blue-500 text-white'
      case 'in_progress':
        return 'bg-orange-500 text-white'
      case 'completed':
        return 'bg-green-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="container mx-auto max-w-[1600px] py-8 px-6">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Project ID</div>
                <div className="font-mono text-sm text-gray-700">{project.projectId}</div>
              </div>
              
              {isOwner && (
                <div className="flex items-center space-x-3">
                  <Link href={`/projects/post?edit=${project.projectId}`}>
                    <Button variant="outline" className="bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </Button>
                  </Link>
                  <Badge className={`${statusColors[project.status as keyof typeof statusColors]} text-sm font-semibold px-4 py-2`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Project Overview */}
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-10 text-white relative">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <h1 className="text-lg lg:text-xl font-bold mb-6 leading-tight">{project.title}</h1>
                  
                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <h3 className="text-lg font-bold mb-4 text-white">Project Description</h3>
                    <p className="text-blue-50 leading-relaxed text-base">{project.description}</p>
                    
                    {project.detailedRequirements && (
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <h4 className="text-base font-bold mb-3 text-white">Detailed Requirements</h4>
                        <p className="text-blue-50 leading-relaxed text-sm">{project.detailedRequirements}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {project.requirements?.attachments && project.requirements.attachments.length > 0 && (
                <CardContent className="p-10">
                  <div className="space-y-8">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <div className="w-3 h-10 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-5"></div>
                      Project Attachments
                    </h3>
                    <div className="grid gap-6">
                      {project.requirements.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02]">
                          <div className="flex items-center space-x-6">
                            <div className="p-4 bg-white rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
                              <FileText className="w-8 h-8 text-blue-600" />
                            </div>
                            <span className="text-base font-bold text-gray-900">{attachment.fileName}</span>
                          </div>
                          <Button variant="ghost" size="lg" className="hover:bg-blue-100 hover:text-blue-700" asChild>
                            <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-6 h-6" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Enhanced Requirements */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-4"></div>
                  Project Requirements
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                    <h3 className="text-base font-bold text-gray-900 mb-6">Required Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.requirements?.skills?.map((skill, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm font-semibold rounded-full hover:shadow-lg transition-shadow">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-shadow">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Experience Level</h4>
                      <p className="text-blue-700 font-semibold text-base capitalize">{project.requirements?.experienceLevel}</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Work Type</h4>
                      <p className="text-purple-700 font-semibold text-base capitalize">{project.requirements?.freelancerType}</p>
                    </div>
                    <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl border border-indigo-200 hover:shadow-md transition-shadow">
                      <h4 className="text-sm font-bold text-gray-900 mb-3">Location</h4>
                      <p className="text-indigo-700 font-semibold text-base capitalize">{project.requirements?.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Milestones */}
            {project.milestones && project.milestones.length > 0 && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-4"></div>
                    Project Milestones
                  </h2>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-base font-bold text-gray-900">{milestone.title}</h3>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">
                                ${milestone.amount.toLocaleString()}
                              </span>
                            </div>
                            <Badge className={`text-sm font-bold px-4 py-2 rounded-full ${
                              milestone.status === "completed" ? "bg-green-500 text-white" :
                              milestone.status === "in_progress" ? "bg-orange-500 text-white" :
                              "bg-gray-400 text-white"
                            }`}>
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">{milestone.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm text-gray-500">Milestone {index + 1} of {project.milestones.length}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Project Stats */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                  Project Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <span className="text-gray-700 font-semibold">Budget</span>
                    <span className="text-base font-bold text-blue-600">{formatBudget(project.budget)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <span className="text-gray-700 font-semibold">Timeline</span>
                    <span className="text-sm font-bold text-purple-600">{project.timeline?.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                    <span className="text-gray-700 font-semibold">Category</span>
                    <span className="text-sm font-bold text-indigo-600">{project.category}</span>
                  </div>
                  
                  {project.subcategory && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                      <span className="text-gray-700 font-semibold">Subcategory</span>
                      <span className="text-sm font-bold text-gray-700">{project.subcategory}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <span className="text-gray-700 font-semibold">Proposals</span>
                    <span className="text-sm font-bold text-green-600">{project.proposalCount || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <span className="text-gray-700 font-semibold">Posted</span>
                    <span className="text-sm font-bold text-orange-600">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {project.timeline?.isUrgent && (
                    <div className="flex items-center space-x-3 p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-xl border border-red-300">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                      <span className="text-red-800 font-bold text-base">Urgent Project</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Client Info */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
                  Client Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="relative w-16 h-16">
                      <Image
                        src={project.clientInfo?.photoURL || "/placeholder-user.jpg"}
                        alt={project.clientInfo?.name || "Client"}
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900">{project.clientInfo?.name}</h4>
                      {project.clientInfo?.verificationStatus && (
                        <div className="flex items-center space-x-2 mt-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-green-700 font-semibold">Verified Client</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!isOwner && (
                    <div className="space-y-4">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200">
                        <MessageSquare className="w-5 h-5 mr-3" />
                        Contact Client
                      </Button>
                      
                      {user?.role === 'freelancer' && (
                        <>
                          {console.log('ProjectDetailsPage - Rendering FreelancerProjectAction with props:', {
                            projectId: project.projectId,
                            userId: user.userId
                          })}
                          <FreelancerProjectAction projectId={project.projectId} userId={user.userId} />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
