"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  MapPin,
  Globe,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { Proposal, subscribeToProposal, withdrawProposal, selectCurrentProposal, selectProposalLoading, selectProposalError, fetchProposal } from "@/lib/redux"
import { Timestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Helper function to format dates consistently
const formatDate = (date: any): string => {
  if (!date) return "Not specified";
  
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  if (typeof date === 'number' || date instanceof Date || typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  return "Invalid date";
};

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  // Use React.use() to unwrap the params object properly
  const unwrappedParams = use(params)
  const proposalId = unwrappedParams.id
  
  const [user, authLoading] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState("proposal")
  const [selectedFile, setSelectedFile] = useState<{ url: string; name: string; type: string } | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const dispatch = useAppDispatch()
  const currentProposal = useAppSelector(selectCurrentProposal)
  const reduxLoading = useAppSelector(selectProposalLoading)
  const reduxError = useAppSelector(selectProposalError)
  
  // Fetch proposal when component mounts
  useEffect(() => {
    let unsubscribe: () => void
    
    const fetchProposal = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // Subscribe to real-time updates for this specific proposal using Redux
        unsubscribe = dispatch(subscribeToProposal(proposalId))
      } catch (err) {
        console.error('Error fetching proposal:', err)
        setError('Failed to load proposal details. Please try again.')
        setLoading(false)
        toast({
          title: "Error",
          description: "Failed to load proposal details. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (user) {
      fetchProposal()
    } else if (!authLoading) {
      setLoading(false)
    }

    // Clean up subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user, authLoading, proposalId, toast, dispatch])

  // Update local state when Redux state changes
  useEffect(() => {
    if (currentProposal) {
      // Verify this proposal belongs to the current user
      if (user && currentProposal.freelancerId !== user.uid) {
        setError("You do not have permission to view this proposal")
        setLoading(false)
        return
      }
      
      setProposal(currentProposal)
      setLoading(false)
    }
    
    if (reduxError) {
      setError(reduxError)
      setLoading(false)
    }
  }, [currentProposal, reduxError, user])

  // Handle proposal withdrawal
  const handleWithdrawProposal = async () => {
    if (!proposal) return
    
    if (!confirm("Are you sure you want to withdraw this proposal? This action cannot be undone.")) {
      return
    }
    
    try {
      await dispatch(withdrawProposal(proposal.proposalId))
      toast({
        title: "Proposal withdrawn",
        description: "Your proposal has been successfully withdrawn.",
      })
    } catch (err) {
      console.error('Error withdrawing proposal:', err)
      toast({
        title: "Error",
        description: "Failed to withdraw proposal. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Map Firebase status values to UI display values
  const mapStatusToDisplay = (status: string) => {
    switch (status) {
      case "submitted":
        return "pending"
      case "shortlisted":
        return "interviewing"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    const mappedStatus = mapStatusToDisplay(status)
    switch (mappedStatus) {
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
      case "shortlisted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
    }
  }
  
  const getStatusIcon = (status: string) => {
    const mappedStatus = mapStatusToDisplay(status)
    switch (mappedStatus) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      case "interviewing":
        return <User className="w-4 h-4" />
      case "withdrawn":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  if (!user && !authLoading) {
    router.push('/auth/login')
    return null
  }

  // Loading view
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/freelancer/proposals">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Proposals
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center items-center py-24">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Loading proposal details...</h3>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error view
  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/freelancer/proposals">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Proposals
              </Button>
            </Link>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {error || "Proposal not found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We couldn't load the proposal details. Please try again later.
              </p>
              <Button asChild>
                <Link href="/freelancer/proposals">Back to Proposals</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main proposal view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/freelancer/proposals">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Proposals
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {proposal.projectTitle || "Untitled Project"}
              </h1>
              <div className="flex items-center flex-wrap gap-4">
                <Badge className={getStatusColor(proposal.status)}>
                  {getStatusIcon(proposal.status)}
                  <span className="ml-1 capitalize">{mapStatusToDisplay(proposal.status)}</span>
                </Badge>
                {proposal.isInvited && (
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Invited
                  </Badge>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">ID: {proposal.proposalId.substring(0, 8)}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Submitted: {formatDate(proposal.submittedAt)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {proposal.status === "shortlisted" && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href={`/messages?proposal=${proposal.proposalId}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Client
                  </Link>
                </Button>
              )}
              {proposal.status === "accepted" && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <Link href={`/freelancer/contracts/${proposal.proposalId}`}>
                    <FileText className="w-4 h-4 mr-2" />
                    View Contract
                  </Link>
                </Button>
              )}
              {proposal.status === "submitted" && (
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50" asChild>
                  <Link href={`/projects/${proposal.projectId}/proposal?edit=true&proposalId=${proposal.proposalId}`}>Edit Proposal</Link>
                </Button>
              )}
              {(proposal.status === "submitted" || proposal.status === "shortlisted") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleWithdrawProposal}>
                  Withdraw Proposal
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Proposal Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle>Proposal Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Bid</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {proposal.bid && typeof proposal.bid.amount === 'number' 
                        ? `${proposal.bid.currency || '$'}${proposal.bid.amount.toLocaleString()}` 
                        : "Not specified"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {proposal.bid.type === "fixed" ? "Fixed Price" : "Hourly Rate"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Timeline</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{proposal.bid.timeline}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Delivery Date</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(proposal.bid.deliveryDate)}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab("proposal")}
                      className={`pb-4 px-1 ${
                        activeTab === "proposal"
                          ? "border-b-2 border-primary text-primary font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Cover Letter
                    </button>
                    <button
                      onClick={() => setActiveTab("project")}
                      className={`pb-4 px-1 ${
                        activeTab === "project"
                          ? "border-b-2 border-primary text-primary font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Project Details
                    </button>
                    {proposal.attachments?.length > 0 && (
                      <button
                        onClick={() => setActiveTab("attachments")}
                        className={`pb-4 px-1 ${
                          activeTab === "attachments"
                            ? "border-b-2 border-primary text-primary font-medium"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        Attachments
                      </button>
                    )}
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "proposal" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Cover Letter</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 whitespace-pre-wrap">
                      {proposal.coverLetter}
                    </div>

                    {proposal.skills && proposal.skills.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {proposal.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {proposal.questions?.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Screening Questions</h4>
                        <div className="space-y-4">
                          {proposal.questions.map((qa, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                Q: {qa.question}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                A: {qa.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "project" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Description</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                      {proposal.projectDescription || "No project description available."}
                    </div>
                  </div>
                )}
                
                {activeTab === "attachments" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Attachments</h3>
                    {proposal.attachments && proposal.attachments.length > 0 ? (
                      <div className="space-y-3">
                        {proposal.attachments.map((attachment, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                            <span className="text-sm font-medium">{attachment.fileName}</span>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                onClick={() => {
                                  setSelectedFile({
                                    url: attachment.fileUrl,
                                    name: attachment.fileName,
                                    type: attachment.fileName.split('.').pop()?.toLowerCase() || ''
                                  });
                                  setIsPreviewOpen(true);
                                }}
                              >
                                View
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No attachments provided with this proposal.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Client Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Image
                    src={proposal.clientInfo?.photoURL || "/placeholder.svg"}
                    alt={proposal.clientInfo?.name || "Client"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {proposal.clientInfo?.name || "Client"}
                    </h3>
                    {proposal.clientInfo?.rating && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {proposal.clientInfo.rating} Rating
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {proposal.clientInfo?.location && (
                  <div className="flex items-start space-x-3 mb-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {proposal.clientInfo.location}
                    </span>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Project Budget</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {proposal.projectBudget ? (
                      proposal.projectBudget.type === "fixed" && typeof proposal.projectBudget.amount === 'number' ? 
                        `${proposal.projectBudget.currency || '$'} ${proposal.projectBudget.amount.toLocaleString()} (Fixed Price)` 
                      : typeof proposal.projectBudget.minAmount === 'number' && typeof proposal.projectBudget.maxAmount === 'number' ?
                        `${proposal.projectBudget.currency || '$'} ${proposal.projectBudget.minAmount.toLocaleString()} - ${proposal.projectBudget.currency || '$'} ${proposal.projectBudget.maxAmount.toLocaleString()} (Hourly Rate)`
                      : "Not specified"
                    ) : "Not specified"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Proposal Submitted</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(proposal.submittedAt)}
                      </p>
                    </div>
                  </div>
                  
                  {(proposal.status === "shortlisted" || proposal.status === "accepted" || proposal.status === "rejected") && (
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {proposal.status === "shortlisted" ? "Shortlisted for Interview" : "Client Responded"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {proposal.respondedAt instanceof Timestamp 
                            ? proposal.respondedAt.toDate().toLocaleString() 
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {proposal.status === "accepted" && (
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Proposal Accepted</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {proposal.respondedAt instanceof Timestamp 
                            ? proposal.respondedAt.toDate().toLocaleString() 
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {proposal.status === "rejected" && (
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Proposal Rejected</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {proposal.respondedAt instanceof Timestamp 
                            ? proposal.respondedAt.toDate().toLocaleString() 
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {proposal.status === "withdrawn" && (
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Proposal Withdrawn</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {proposal.updatedAt instanceof Timestamp 
                            ? proposal.updatedAt.toDate().toLocaleString() 
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* File Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center p-4">
            {selectedFile && (
              <>
                {selectedFile.type === 'pdf' ? (
                  <iframe 
                    src={`${selectedFile.url}#toolbar=0`} 
                    className="w-full h-[60vh]" 
                    title={selectedFile.name}
                  />
                ) : selectedFile.type?.match(/^(jpg|jpeg|png|gif|webp|svg)$/) ? (
                  <div className="overflow-auto max-h-[60vh]">
                    <img 
                      src={selectedFile.url} 
                      alt={selectedFile.name} 
                      className="max-w-full h-auto"
                    />
                  </div>
                ) : selectedFile.type?.match(/^(txt|json|md|js|ts|html|css|csv)$/) ? (
                  <div className="w-full overflow-auto max-h-[60vh] bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                    <pre className="whitespace-pre-wrap break-all">
                      {/* Text content would be loaded and displayed here */}
                      Loading text content...
                    </pre>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p>This file type cannot be previewed. Please download to view.</p>
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700" asChild>
                      <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">
                        Download File
                      </a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
