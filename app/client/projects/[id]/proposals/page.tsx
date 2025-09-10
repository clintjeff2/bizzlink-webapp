"use client"

import React, { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { useGetProjectQuery, useGetProposalsQuery } from "@/lib/redux/api/firebaseApi"
import { updateProposalStatus } from "@/lib/redux"
import { useToast } from "@/hooks/use-toast"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  ArrowLeft,
  Filter, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Calendar,
  MessageSquare,
  User,
  MapPin,
  ChevronUp,
  ChevronDown,
  Settings,
  ThumbsUp,
  ThumbsDown,
  X,
  FileText
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function ClientProjectProposalsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { user } = useSelector((state: RootState) => state.auth)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [isHireModalOpen, setIsHireModalOpen] = useState(false)
  const [isUnshortlistModalOpen, setIsUnshortlistModalOpen] = useState(false)
  const [isUnacceptModalOpen, setIsUnacceptModalOpen] = useState(false)
  const { toast } = useToast()
  const dispatch = useDispatch()
  
  // Get project and proposals data
  const {
    data: project,
    isLoading: isProjectLoading,
    error: projectError
  } = useGetProjectQuery(projectId)
  
  const {
    data: allProposals = [],
    isLoading: isProposalsLoading,
    error: proposalsError,
    refetch: refetchProposals
  } = useGetProposalsQuery({ 
    projectId
  }, {
    skip: !projectId,
    refetchOnMountOrArgChange: true
  })
  
  const isLoading = isProjectLoading || isProposalsLoading
  const error = projectError || proposalsError
  
  // Filter and sort proposals
  const filteredProposals = useMemo(() => {
    if (!allProposals) return []
    
    let filtered = [...allProposals]
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(proposal => {
        const freelancerInfo = proposal.freelancerInfo || {}
        return (
          freelancerInfo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proposal.coverLetter?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    
    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(proposal => proposal.status === activeTab)
    }
    
    // Sort proposals
    switch (sortOption) {
      case "newest": {
        return filtered.sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt) : new Date(0)
          const dateB = b.submittedAt ? new Date(b.submittedAt) : new Date(0)
          return dateB.getTime() - dateA.getTime()
        })
      }
      case "oldest": {
        return filtered.sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt) : new Date(0)
          const dateB = b.submittedAt ? new Date(b.submittedAt) : new Date(0)
          return dateA.getTime() - dateB.getTime()
        })
      }
      case "highest_bid":
        return filtered.sort((a, b) => (b.bid?.amount || 0) - (a.bid?.amount || 0))
      case "lowest_bid":
        return filtered.sort((a, b) => (a.bid?.amount || 0) - (b.bid?.amount || 0))
      case "best_match":
        return filtered.sort((a, b) => (b.freelancerInfo?.rating || 0) - (a.freelancerInfo?.rating || 0))
      default:
        return filtered
    }
  }, [allProposals, searchTerm, activeTab, sortOption])
  
  // Compute proposal stats
  const proposalStats = useMemo(() => {
    return {
      all: allProposals.length,
      submitted: allProposals.filter(p => p.status === "submitted").length,
      shortlisted: allProposals.filter(p => p.status === "shortlisted").length,
      accepted: allProposals.filter(p => p.status === "accepted").length,
      rejected: allProposals.filter(p => p.status === "rejected").length,
      withdrawn: allProposals.filter(p => p.status === "withdrawn").length
    }
  }, [allProposals])

  // Helper function to format date display
  const formatDate = (dateValue: any) => {
    if (!dateValue) return ""
    
    if (typeof dateValue === "string") {
      return new Date(dateValue).toLocaleDateString()
    }
    
    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString()
    }
    
    if (dateValue.toDate) {
      return dateValue.toDate().toLocaleDateString()
    }
    
    // Try to handle Firebase Timestamp objects
    if (typeof dateValue === 'object' && 'toDate' in dateValue && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString()
    }
    
    try {
      return new Date(dateValue).toLocaleDateString()
    } catch (error) {
      console.error("Invalid date format:", dateValue)
      return ""
    }
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        )
      case "submitted":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "shortlisted":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Star className="w-3 h-3 mr-1" />
            Shortlisted
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <ThumbsDown className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case "withdrawn":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200">
            <X className="w-3 h-3 mr-1" />
            Withdrawn
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        )
    }
  }

  // Handle viewing proposal details
  const handleViewProposalDetails = (proposalId: string) => {
    router.push(`/client/proposals/${proposalId}`)
  }
  
  // Handle viewing or creating contract for accepted proposal
  const handleViewContract = (proposalId: string) => {
    // Direct the user to the contract creation page with the proposalId
    // The contract page will handle checking if a contract exists and redirecting appropriately
    router.push(`/client/contracts/create?proposalId=${proposalId}`);
  }
  
  // Handle declining a proposal
  const openDeclineModal = (proposalId: string) => {
    setSelectedProposalId(proposalId)
    setIsDeclineModalOpen(true)
  }
  
  const handleDeclineProposal = async () => {
    if (!selectedProposalId) return
    
    try {
      // Find the proposal being updated
      const proposal = allProposals.find(p => p.proposalId === selectedProposalId)
      if (!proposal) return
      
      // Close modal right away for better UX
      setIsDeclineModalOpen(false)
      
      // Optimistically update the UI
      const updatedProposals = allProposals.map(p => 
        p.proposalId === selectedProposalId 
          ? { ...p, status: 'rejected' } 
          : p
      )
      
      // Find the proposal card element and update its status badge
      const proposalCard = document.querySelector(`[data-proposal-id="${selectedProposalId}"]`)
      if (proposalCard) {
        const statusBadgeContainer = proposalCard.querySelector('[data-status-badge]')
        if (statusBadgeContainer) {
          statusBadgeContainer.innerHTML = `
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 mr-1"><path d="M17 7 7 17"></path><path d="m7 7 10 10"></path></svg>
              Rejected
            </div>
          `
          // Update the badge styling
          statusBadgeContainer.className = "bg-red-100 text-red-800 border-red-200 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        }
        
        // Hide action buttons for rejected proposals
        const actionButtons = proposalCard.querySelector('[data-proposal-actions]')
        if (actionButtons) {
          actionButtons.style.display = 'none'
        }
        
        // Update the card border to show rejected state
        proposalCard.className = proposalCard.className.replace(/border-\w+-\d+/g, 'border-red-100')
      }
      
      // Dispatch the action to update in Firebase
      await dispatch(updateProposalStatus({ 
        proposalId: selectedProposalId, 
        status: 'rejected' 
      }) as any)
      
      toast({
        title: "Proposal declined",
        description: "The freelancer has been notified that their proposal was declined."
      })
      
      // Force a refetch to ensure data consistency
      await refetchProposals()
      
      setSelectedProposalId(null)
    } catch (err) {
      console.error('Error declining proposal:', err)
      toast({
        title: "Error",
        description: "Failed to decline the proposal. Please try again.",
        variant: "destructive"
      })
      
      // Force a refetch to revert UI to actual state
      await refetchProposals()
    }
  }
  
  // Handle opening unshortlist modal
  const openUnshortlistModal = (proposalId: string) => {
    setSelectedProposalId(proposalId)
    setIsUnshortlistModalOpen(true)
  }
  
  // Handle unshortlisting a proposal (returning it to submitted status)
  const handleUnshortlistProposal = async () => {
    if (!selectedProposalId) return
    
    try {
      // Close modal right away for better UX
      setIsUnshortlistModalOpen(false)
      // Find the proposal being updated
      const proposal = allProposals.find(p => p.proposalId === selectedProposalId)
      if (!proposal) return
      
      // Optimistically update the UI
      const proposalCard = document.querySelector(`[data-proposal-id="${selectedProposalId}"]`)
      if (proposalCard) {
        const statusBadgeContainer = proposalCard.querySelector('[data-status-badge]')
        if (statusBadgeContainer) {
          statusBadgeContainer.innerHTML = `
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Pending
            </div>
          `
          // Update the badge styling
          statusBadgeContainer.className = "bg-amber-100 text-amber-800 border-amber-200 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        }
        
        // Update the card border
        proposalCard.className = proposalCard.className.replace(/border-\w+-\d+|border-transparent/g, 'border-transparent hover:border-blue-100')
        
        // Show the action buttons for submitted proposals
        const actionButtons = proposalCard.querySelector('[data-proposal-actions]')
        if (actionButtons) {
          actionButtons.style.display = 'block'
        }
      }
      
      // Show toast notification
      toast({
        title: "Proposal unshortlisted",
        description: "The proposal has been moved back to pending status."
      })
      
      // Send the actual request to the server
      await dispatch(updateProposalStatus({ 
        proposalId: selectedProposalId, 
        status: 'submitted' 
      }) as any)
      
      // Force a refetch to ensure data consistency
      await refetchProposals()
      
    } catch (err) {
      console.error('Error unshortlisting proposal:', err)
      toast({
        title: "Error",
        description: "Failed to update the proposal status. Please try again.",
        variant: "destructive"
      })
      
      // Force a refetch to revert UI to actual state
      await refetchProposals()
    }
  }
  
  // Handle opening unaccept modal
  const openUnacceptModal = (proposalId: string) => {
    setSelectedProposalId(proposalId)
    setIsUnacceptModalOpen(true)
  }
  
  // Handle unaccepting a proposal (returning it to submitted status)
  const handleUnacceptProposal = async () => {
    if (!selectedProposalId) return
    
    try {
      // Close modal right away for better UX
      setIsUnacceptModalOpen(false)
      // Find the proposal being updated
      const proposal = allProposals.find(p => p.proposalId === selectedProposalId)
      if (!proposal) return
      
      // Optimistically update the UI
      const proposalCard = document.querySelector(`[data-proposal-id="${selectedProposalId}"]`)
      if (proposalCard) {
        const statusBadgeContainer = proposalCard.querySelector('[data-status-badge]')
        if (statusBadgeContainer) {
          statusBadgeContainer.innerHTML = `
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Pending
            </div>
          `
          // Update the badge styling
          statusBadgeContainer.className = "bg-amber-100 text-amber-800 border-amber-200 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        }
        
        // Update the card border
        proposalCard.className = proposalCard.className.replace(/border-\w+-\d+|border-transparent/g, 'border-transparent hover:border-blue-100')
        
        // Show the action buttons for submitted proposals
        const actionButtons = proposalCard.querySelector('[data-proposal-actions]')
        if (actionButtons) {
          actionButtons.style.display = 'block'
        }
      }
      
      // Show toast notification
      toast({
        title: "Accepted status removed",
        description: "The proposal has been moved back to pending status."
      })
      
      // Send the actual request to the server
      await dispatch(updateProposalStatus({ 
        proposalId: selectedProposalId, 
        status: 'submitted' 
      }) as any)
      
      // Force a refetch to ensure data consistency
      await refetchProposals()
      
    } catch (err) {
      console.error('Error updating proposal status:', err)
      toast({
        title: "Error",
        description: "Failed to update the proposal status. Please try again.",
        variant: "destructive"
      })
      
      // Force a refetch to revert UI to actual state
      await refetchProposals()
    }
  }
  
  // Handle hiring a freelancer
  const openHireModal = (proposalId: string) => {
    setSelectedProposalId(proposalId)
    setIsHireModalOpen(true)
  }
  
  const handleHireFreelancer = async () => {
    if (!selectedProposalId) return
    
    try {
      // Find the proposal being updated
      const proposal = allProposals.find(p => p.proposalId === selectedProposalId)
      if (!proposal) return
      
      // Close modal right away for better UX
      setIsHireModalOpen(false)
      
      // Optimistically update the UI
      const updatedProposals = allProposals.map(p => 
        p.proposalId === selectedProposalId 
          ? { ...p, status: 'accepted' } 
          : p
      )
      
      // Find the proposal card element and update its status badge
      const proposalCard = document.querySelector(`[data-proposal-id="${selectedProposalId}"]`)
      if (proposalCard) {
        const statusBadgeContainer = proposalCard.querySelector('[data-status-badge]')
        if (statusBadgeContainer) {
          statusBadgeContainer.innerHTML = `
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Accepted
            </div>
          `
          // Update the badge styling
          statusBadgeContainer.className = "bg-green-100 text-green-800 border-green-200 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        }
        
        // Hide action buttons for accepted proposals
        const actionButtons = proposalCard.querySelector('[data-proposal-actions]')
        if (actionButtons) {
          actionButtons.style.display = 'none'
        }
        
        // Update the card border to show accepted state
        proposalCard.className = proposalCard.className.replace(/border-\w+-\d+|border-transparent/g, 'border-green-200')
      }
      
      // Show toast notification
      toast({
        title: "Proposal accepted",
        description: "Great! You're on your way to starting a new contract."
      })
      
      // Send the actual request to the server
      await dispatch(updateProposalStatus({ 
        proposalId: selectedProposalId, 
        status: 'accepted' 
      }) as any)
      
      // Force a refetch before navigation
      await refetchProposals()
      
      // Navigate to the contract creation page after a short delay to show the toast
      setTimeout(() => {
        router.push(`/client/contracts/create?proposalId=${selectedProposalId}`)
      }, 1500)
    } catch (err) {
      console.error('Error hiring freelancer:', err)
      toast({
        title: "Error",
        description: "Failed to accept the proposal. Please try again.",
        variant: "destructive"
      })
      
      // Force a refetch to revert UI to actual state
      await refetchProposals()
    }
  }
  
  // Handle sending a message
  const handleMessage = (proposalId: string) => {
    // Find the proposal to get the freelancerId
    const proposal = allProposals.find(p => p.proposalId === proposalId);
    if (proposal && proposal.freelancerId) {
      router.push(`/messages?user=${proposal.freelancerId}&proposal=${proposalId}`);
    } else {
      // Fallback if for some reason we can't find the proposal or it doesn't have a freelancerId
      router.push(`/messages?proposal=${proposalId}`);
      console.error('Could not find proposal or freelancerId for message routing', proposalId);
    }
  }
  

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="mb-4">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
          <div className="mb-6">
            <Skeleton className="h-12 w-full rounded-lg mb-6" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg mb-4" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Proposals</h2>
            <p className="text-gray-600 mb-4">
              We couldn't load the project proposals. Please try again or contact support.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.refresh()}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push('/client/projects')}>
                Back to Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Decline Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleDeclineProposal}
        title="Decline Proposal"
        description="Are you sure you want to decline this proposal? The freelancer will be notified."
        confirmText="Yes, decline"
        cancelText="Cancel"
        variant="destructive"
      />
      
      {/* Hire Confirmation Modal */}
      <ConfirmModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onConfirm={handleHireFreelancer}
        title="Hire Freelancer"
        description="Are you sure you want to hire this freelancer? This will create a new contract based on the proposal terms."
        confirmText="Yes, hire freelancer"
        cancelText="Cancel"
        variant="default"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push(`/client/projects/${projectId}`)}
              className="text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Proposals for {project.title}
              </h1>
              <div className="flex items-center space-x-2 text-slate-600">
                <Badge className={
                  project.status === "active" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                  project.status === "completed" ? "bg-blue-100 text-blue-800 border-blue-200" :
                  project.status === "paused" ? "bg-amber-100 text-amber-800 border-amber-200" :
                  "bg-slate-100 text-slate-800 border-slate-200"
                }>
                  {project.status}
                </Badge>
                <span className="text-sm">•</span>
                <span className="text-sm">{proposalStats.all} Proposals</span>
                <span className="text-sm">•</span>
                <span className="text-sm">Posted {formatDate(project.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-800">{proposalStats.all}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{proposalStats.submitted}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-full">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Hired</p>
                  <p className="text-2xl font-bold text-green-600">{proposalStats.accepted}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Declined</p>
                  <p className="text-2xl font-bold text-red-600">{proposalStats.rejected}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ThumbsDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search by freelancer name or proposal content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest_bid">Highest Bid</SelectItem>
                <SelectItem value="lowest_bid">Lowest Bid</SelectItem>
                <SelectItem value="best_match">Best Match</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="h-10">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white rounded-lg border shadow-sm h-10">
            <TabsTrigger value="all">
              All ({proposalStats.all})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Pending ({proposalStats.submitted})
            </TabsTrigger>
            <TabsTrigger value="shortlisted">
              Shortlisted ({proposalStats.shortlisted})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({proposalStats.accepted})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({proposalStats.rejected})
            </TabsTrigger>
            <TabsTrigger value="withdrawn">
              Withdrawn ({proposalStats.withdrawn})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Proposal List */}
        <div className="space-y-6">
          {filteredProposals.length === 0 ? (
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <MessageSquare className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No proposals found</h3>
                <p className="text-slate-600 text-center mb-6 max-w-lg">
                  {activeTab === "all" ? 
                    "This project doesn't have any proposals yet. Check back later or try modifying your search." :
                    `There are no proposals with the "${activeTab}" status. Try selecting a different filter.`
                  }
                </p>
                {activeTab !== "all" && (
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("all")}
                  >
                    View All Proposals
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredProposals.map((proposal) => (
              <Card 
                key={proposal.proposalId} 
                data-proposal-id={proposal.proposalId}
                data-status={proposal.status}
                className={`bg-white shadow-sm border-2 transition-all ${
                  proposal.status === "accepted" ? "border-green-200" :
                  proposal.status === "rejected" ? "border-red-100" :
                  "border-transparent hover:border-blue-100"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Image
                          src={proposal.freelancerInfo?.photoURL || "/placeholder-user.jpg"}
                          alt={proposal.freelancerInfo?.name || "Freelancer"}
                          width={60}
                          height={60}
                          className="rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        {proposal.freelancerInfo?.topRated && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 shadow-sm">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-slate-800">
                            {proposal.freelancerInfo?.name || "Anonymous"}
                          </h3>
                          {proposal.freelancerInfo?.topRated && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Award className="w-3 h-3 mr-1" />
                              Top Rated
                            </Badge>
                          )}
                          <span data-status-badge>{getStatusBadge(proposal.status)}</span>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-slate-600 mb-2">
                          <div className="flex items-center mr-4">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                            <span>{proposal.freelancerInfo?.rating || "N/A"}</span>
                            {proposal.freelancerInfo?.completedJobs && (
                              <span className="ml-1 text-slate-500">
                                ({proposal.freelancerInfo.completedJobs} jobs)
                              </span>
                            )}
                          </div>
                          {proposal.freelancerInfo?.title && (
                            <div className="flex items-center mr-4">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                              <span>{proposal.freelancerInfo.title}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                            <span>Submitted {formatDate(proposal.submittedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        ${proposal.bid?.amount?.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        {proposal.bid?.timeline || "Not specified"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-slate-700 line-clamp-3 mb-4">
                      {proposal.coverLetter}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-x-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProposalDetails(proposal.proposalId)}
                        >
                          View Details
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMessage(proposal.proposalId)}
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-2" />
                          Message
                        </Button>
                      </div>
                      
                      <div className="space-x-2" data-proposal-actions-container>
                        {proposal.status === "submitted" && (
                          <div className="space-x-2" data-proposal-actions>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => openDeclineModal(proposal.proposalId)}
                            >
                              <ThumbsDown className="w-3.5 h-3.5 mr-2" />
                              Decline
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => openHireModal(proposal.proposalId)}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-2" />
                              Hire
                            </Button>
                          </div>
                        )}
                        
                        {proposal.status === "shortlisted" && (
                          <div className="space-x-2" data-proposal-actions>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={() => openUnshortlistModal(proposal.proposalId)}
                            >
                              <Star className="w-3.5 h-3.5 mr-2" />
                              Unshortlist
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => openHireModal(proposal.proposalId)}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-2" />
                              Hire
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => openDeclineModal(proposal.proposalId)}
                            >
                              <ThumbsDown className="w-3.5 h-3.5 mr-2" />
                              Decline
                            </Button>
                          </div>
                        )}
                        
                        {proposal.status === "accepted" && (
                          <div className="space-x-2" data-proposal-actions>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-amber-200 text-amber-600 hover:bg-amber-50"
                              onClick={() => openUnacceptModal(proposal.proposalId)}
                            >
                              <Clock className="w-3.5 h-3.5 mr-2" />
                              Return to Pending
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleViewContract(proposal.proposalId)}
                            >
                              <FileText className="w-3.5 h-3.5 mr-2" />
                              Contract
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Decline Proposal Modal */}
      <ConfirmModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleDeclineProposal}
        title="Decline Proposal"
        description="Are you sure you want to decline this proposal? The freelancer will be notified."
        confirmText="Yes, decline"
        cancelText="Cancel"
        variant="destructive"
      />
      
      {/* Hire Freelancer Modal */}
      <ConfirmModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onConfirm={handleHireFreelancer}
        title="Accept Proposal"
        description="Are you sure you want to accept this proposal? This will begin the contracting process."
        confirmText="Yes, accept"
        cancelText="Cancel"
        variant="default"
      />
      
      {/* Unshortlist Proposal Modal */}
      <ConfirmModal
        isOpen={isUnshortlistModalOpen}
        onClose={() => setIsUnshortlistModalOpen(false)}
        onConfirm={handleUnshortlistProposal}
        title="Remove from Shortlist"
        description="Are you sure you want to remove this proposal from your shortlist? The proposal will be moved back to pending status."
        confirmText="Yes, remove from shortlist"
        cancelText="Cancel"
        variant="default"
      />
      
      {/* Unaccept Proposal Modal */}
      <ConfirmModal
        isOpen={isUnacceptModalOpen}
        onClose={() => setIsUnacceptModalOpen(false)}
        onConfirm={handleUnacceptProposal}
        title="Return to Pending Status"
        description="Are you sure you want to change this proposal's status back to pending? This will cancel the acceptance."
        confirmText="Yes, change to pending"
        cancelText="Cancel"
        variant="default"
      />
    </div>
  )
}