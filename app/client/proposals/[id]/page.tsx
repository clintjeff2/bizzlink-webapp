"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useGetProposalQuery, useGetProjectQuery } from "@/lib/redux/api/firebaseApi"
import { useSelector, useDispatch } from "react-redux"
import { updateProposalStatus } from "@/lib/redux"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { RootState } from "@/lib/redux/store"
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
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Briefcase,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Helper function to format dates consistently
const formatDate = (date: any): string => {
  if (!date) return "Not specified";
  
  if (typeof date === 'number' || date instanceof Date || typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  return "Invalid date";
};

export default function ClientProposalDetailPage({ params }: { params: { id: string } }) {
  const unwrappedParams = use(params);
  const proposalId = unwrappedParams.id;
  const [activeTab, setActiveTab] = useState("proposal");
  const [selectedFile, setSelectedFile] = useState<{ url: string; name: string; type: string } | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [clientResponses, setClientResponses] = useState<{[key: number]: string}>({});
  const [isSavingResponse, setIsSavingResponse] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Get current user from Redux state
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Fetch proposal details
  const { 
    data: proposal, 
    isLoading: isLoadingProposal, 
    error: proposalError 
  } = useGetProposalQuery(proposalId, { 
    skip: !proposalId 
  });
  
  // Fetch associated project details once we have the proposal
  const { 
    data: project, 
    isLoading: isLoadingProject 
  } = useGetProjectQuery(proposal?.projectId || "", { 
    skip: !proposal?.projectId 
  });
  
  // Check if the current user is the project owner
  const isProjectOwner = user?.userId === project?.clientId;
  
  // Handle file preview
  const openFilePreview = (file: { fileUrl: string; fileName: string; fileType: string }) => {
    setSelectedFile({
      url: file.fileUrl,
      name: file.fileName,
      type: file.fileType
    });
    setIsPreviewOpen(true);
  };
  
  // Handle proposal shortlisting
  const handleShortlistProposal = async () => {
    try {
      if (!proposalId || !proposal) return;
      
      // Store the current proposal for rollback if needed
      const originalProposal = { ...proposal };
      const newStatus = 'shortlisted';
      
      // Optimistically update the UI
      document.querySelector(`[data-proposal-id="${proposalId}"]`)?.setAttribute('data-status', newStatus);
      
      // Update the status badge directly in the DOM
      const statusBadge = document.getElementById('proposal-status-badge');
      if (statusBadge) {
        // Get new status badge styling
        const newBadgeStyle = getStatusBadge(newStatus);
        
        // Remove all background classes and add the new ones
        statusBadge.className = `${newBadgeStyle.color} border font-medium px-3 py-1`;
        
        // Update the text content to show the new status
        const statusTextElement = statusBadge.querySelector('span');
        if (statusTextElement) {
          statusTextElement.textContent = newStatus;
        }
      }
      
      // Hide the action card since we've taken an action
      const actionCard = document.getElementById('proposal-action-card');
      if (actionCard) {
        actionCard.style.display = 'none';
      }
      
      // Close modal
      setIsShortlistModalOpen(false);
      
      // Show toast notification
      toast({
        title: "Proposal shortlisted",
        description: "The freelancer has been added to your shortlist.",
      });
      
      try {
        // Send the actual request to the server using proper typing
        const resultAction = await dispatch(updateProposalStatus({
          proposalId,
          status: newStatus
        }) as any);
        
        // Go back to the previous page after a short delay to show the toast
        setTimeout(() => {
          router.back();
        }, 1500);
      } catch (error) {
        console.error('Error updating proposal status:', error);
        
        // If the server request fails, revert to the original state
        document.querySelector(`[data-proposal-id="${proposalId}"]`)?.setAttribute('data-status', originalProposal.status);
        
        // Revert the status badge
        if (statusBadge) {
          // Get original status badge styling
          const originalBadgeStyle = getStatusBadge(originalProposal.status);
          
          // Reset to original classes
          statusBadge.className = `${originalBadgeStyle.color} border font-medium px-3 py-1`;
              
          const statusTextElement = statusBadge.querySelector('span');
          if (statusTextElement) {
            statusTextElement.textContent = originalProposal.status;
          }
        }
        
        // Show the action card again if the API call failed
        if (actionCard) {
          actionCard.style.display = 'block';
        }
        
        toast({
          title: "Failed to shortlist",
          description: "There was an error updating the status. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleShortlistProposal:', error);
      toast({
        title: "Failed to shortlist",
        description: "There was an error updating the status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle accepting a proposal
  const handleAcceptProposal = async () => {
    try {
      if (!proposalId || !proposal) return;
      
      // Store the current proposal for rollback if needed
      const originalProposal = { ...proposal };
      const newStatus = 'accepted';
      
      // Optimistically update the UI
      document.querySelector(`[data-proposal-id="${proposalId}"]`)?.setAttribute('data-status', newStatus);
      
      // Update the status badge directly in the DOM
      const statusBadge = document.getElementById('proposal-status-badge');
      if (statusBadge) {
        // Get new status badge styling
        const newBadgeStyle = getStatusBadge(newStatus);
        
        // Remove all background classes and add the new ones
        statusBadge.className = `${newBadgeStyle.color} border font-medium px-3 py-1`;
        
        // Update the text content to show the new status
        const statusTextElement = statusBadge.querySelector('span');
        if (statusTextElement) {
          statusTextElement.textContent = newStatus;
        }
      }
      
      // Hide the action card since we've taken an action
      const actionCard = document.getElementById('proposal-action-card');
      if (actionCard) {
        actionCard.style.display = 'none';
      }
      
      // Close modal
      setIsAcceptModalOpen(false);
      
      // Show toast notification
      toast({
        title: "Proposal accepted",
        description: "You've accepted this proposal. Let's set up your contract.",
      });
      
      try {
        // Send the actual request to the server using proper typing
        const resultAction = await dispatch(updateProposalStatus({
          proposalId,
          status: newStatus
        }) as any);
        
        // Navigate to contract setup page after a short delay to show the toast
        setTimeout(() => {
          router.push(`/client/contracts/create?proposalId=${proposalId}`);
        }, 1500);
      } catch (error) {
        console.error('Error updating proposal status:', error);
        
        // If the request fails, revert the optimistic update
        document.querySelector(`[data-proposal-id="${proposalId}"]`)?.setAttribute('data-status', originalProposal.status);
        
        // Revert the status badge
        if (statusBadge) {
          // Get original status badge styling
          const originalBadgeStyle = getStatusBadge(originalProposal.status);
          
          // Reset to original classes
          statusBadge.className = `${originalBadgeStyle.color} border font-medium px-3 py-1`;
              
          const statusTextElement = statusBadge.querySelector('span');
          if (statusTextElement) {
            statusTextElement.textContent = originalProposal.status;
          }
        }
        
        // Show the action card again if the API call failed
        if (actionCard) {
          actionCard.style.display = 'block';
        }
        
        toast({
          title: "Failed to accept proposal",
          description: "There was an error accepting the proposal. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleAcceptProposal:', error);
      toast({
        title: "Failed to accept proposal",
        description: "There was an error accepting the proposal. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle rejecting a proposal
  const handleRejectProposal = async () => {
    try {
      if (!proposalId || !proposal) return;
      
      // Store the current proposal for rollback if needed
      const originalProposal = { ...proposal };
      const newStatus = 'rejected';
      
      // Optimistically update the UI
      document.querySelector(`[data-proposal-id="${proposalId}"]`)?.setAttribute('data-status', newStatus);
      
      // Update the status badge directly in the DOM
      const statusBadge = document.getElementById('proposal-status-badge');
      if (statusBadge) {
        // Get new status badge styling
        const newBadgeStyle = getStatusBadge(newStatus);
        
        // Remove all background classes and add the new ones
        statusBadge.className = `${newBadgeStyle.color} border font-medium px-3 py-1`;
        
        // Update the text content to show the new status
        const statusTextElement = statusBadge.querySelector('span');
        if (statusTextElement) {
          statusTextElement.textContent = newStatus;
        }
      }
      
      // Hide the action card since we've taken an action
      const actionCard = document.getElementById('proposal-action-card');
      if (actionCard) {
        actionCard.style.display = 'none';
      }
      
      // Close modal
      setIsDeclineModalOpen(false);
      
      // Show toast notification
      toast({
        title: "Proposal rejected",
        description: "The proposal has been rejected.",
      });
      
      try {
        // Send the actual request to the server using proper typing
        const resultAction = await dispatch(updateProposalStatus({
          proposalId,
          status: newStatus
        }) as any);
        
        // Go back to the previous page after a short delay to show the toast
        setTimeout(() => {
          router.back();
        }, 1500);
      } catch (error) {
        console.error('Error updating proposal status:', error);
        
        // If the request fails, revert the optimistic update
        document.querySelector(`[data-proposal-id="${proposalId}"]`)?.setAttribute('data-status', originalProposal.status);
        
        // Revert the status badge
        if (statusBadge) {
          // Get original status badge styling
          const originalBadgeStyle = getStatusBadge(originalProposal.status);
          
          // Reset to original classes
          statusBadge.className = `${originalBadgeStyle.color} border font-medium px-3 py-1`;
              
          const statusTextElement = statusBadge.querySelector('span');
          if (statusTextElement) {
            statusTextElement.textContent = originalProposal.status;
          }
        }
        
        // Show the action card again if the API call failed
        if (actionCard) {
          actionCard.style.display = 'block';
        }
        
        toast({
          title: "Failed to reject proposal",
          description: "There was an error rejecting the proposal. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in handleRejectProposal:', error);
      toast({
        title: "Failed to reject proposal",
        description: "There was an error rejecting the proposal. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Access denied for non-project owners
  if (project && user?.userId && !isProjectOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">You do not have permission to view this proposal.</p>
            <Button 
              onClick={() => router.push('/client/projects')} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle client response to a question
  const handleSaveResponse = async (questionIndex: number) => {
    try {
      if (!proposal || !proposalId) return;
      
      setIsSavingResponse(true);
      
      // Get the client's response for this question
      const clientResponse = clientResponses[questionIndex];
      if (!clientResponse || clientResponse.trim() === '') {
        toast({
          title: "Response required",
          description: "Please enter a response before saving.",
          variant: "destructive",
        });
        setIsSavingResponse(false);
        return;
      }
      
      // Create updated questions array with the client's response
      // According to Firebase schema, there's only question and answer fields
      const updatedQuestions = [...proposal.questions];
      updatedQuestions[questionIndex] = {
        question: updatedQuestions[questionIndex].question,
        answer: clientResponse // Update the answer field directly
      };
      
      // Optimistically update the UI
      const updatedProposal = {
        ...proposal,
        questions: updatedQuestions
      };
      
      // Apply the updated proposal to the component state to update the UI immediately
      // This is done by manually overriding the RTK Query cache entry
      dispatch({
        type: 'firebaseApi/invalidateTags',
        payload: [{ type: 'Proposal', id: proposalId }]
      });
      
      dispatch({
        type: 'firebaseApi/upsertQueryData',
        payload: {
          queryKey: ['getProposal', proposalId],
          data: updatedProposal
        }
      });
      
      // Update the proposal in Firebase
      await dispatch(updateProposalStatus({
        proposalId,
        updates: {
          questions: updatedQuestions
        }
      }) as any);
      
      // Clear editing state
      setEditingQuestionId(null);
      
      toast({
        title: "Response saved",
        description: "Your response has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving response:', error);
      toast({
        title: "Error saving response",
        description: "There was a problem saving your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingResponse(false);
    }
  };

  // Format proposal bid/budget
  const formatProposalBid = (proposal: any) => {
    if (!proposal?.bid) return "Not specified";
    
    const currency = proposal.bid.currency || "USD";
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;
    const amount = Number(proposal.bid.amount).toLocaleString();
    const type = proposal.bid.type === "hourly" ? "/hr" : "";
    
    return `${symbol}${amount}${type}`;
  };
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: <Clock className="w-4 h-4 mr-1.5" /> };
      case "shortlisted":
        return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: <Star className="w-4 h-4 mr-1.5" /> };
      case "accepted":
        return { color: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle className="w-4 h-4 mr-1.5" /> };
      case "rejected":
        return { color: "bg-red-50 text-red-700 border-red-200", icon: <XCircle className="w-4 h-4 mr-1.5" /> };
      case "withdrawn":
        return { color: "bg-slate-50 text-slate-700 border-slate-200", icon: <AlertCircle className="w-4 h-4 mr-1.5" /> };
      default:
        return { color: "bg-slate-50 text-slate-700 border-slate-200", icon: <Clock className="w-4 h-4 mr-1.5" /> };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40" 
      data-proposal-id={proposalId} 
      data-status={proposal?.status || "submitted"}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back button and Proposal Header */}
        <div className="mb-6">
          <Button
            onClick={() => router.push(`/client/projects/${proposal?.projectId}/proposals`)}
            variant="outline"
            className="mb-4 text-slate-700 border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proposals
          </Button>

          {isLoadingProposal || isLoadingProject ? (
            <div>
              <div className="h-8 bg-slate-200 animate-pulse rounded w-1/3 mb-2"></div>
              <div className="h-5 bg-slate-200 animate-pulse rounded w-1/4"></div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Proposal for "{project?.title || 'Project'}"
              </h1>
              {proposal && (
                <div className="flex items-center mt-2 space-x-3">
                  <Badge className={`${getStatusBadge(proposal.status).color} border font-medium px-3 py-1`}
                    id="proposal-status-badge">
                    <div className="flex items-center">
                      {getStatusBadge(proposal.status).icon}
                      <span className="capitalize">{proposal.status}</span>
                    </div>
                  </Badge>
                  <span className="text-slate-500">
                    Submitted {formatDate(proposal.submittedAt)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Proposal details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proposal Content Card */}
            <Card className="overflow-hidden border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Proposal Details
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {isLoadingProposal ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                ) : proposalError ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Failed to Load Proposal</h3>
                    <p className="text-slate-500">There was an error loading the proposal details.</p>
                  </div>
                ) : proposal ? (
                  <>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-3">Cover Letter</h3>
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <p className="whitespace-pre-line text-slate-700">
                          {proposal.coverLetter}
                        </p>
                      </div>
                    </div>
                    
                    {proposal.attachments && proposal.attachments.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-3">Attachments</h3>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <ul className="space-y-2">
                            {proposal.attachments.map((file: any, index: number) => (
                              <li key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 text-blue-600 mr-2" />
                                  <span className="text-slate-700">{file.fileName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs border-slate-200 hover:bg-slate-50"
                                    onClick={() => openFilePreview(file)}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Preview
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs border-slate-200 hover:bg-slate-50"
                                    asChild
                                  >
                                    <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" download>
                                      Download
                                    </a>
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {proposal.questions && proposal.questions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-3">Questions & Answers</h3>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                          <ul className="space-y-6">
                            {proposal.questions.map((qa: any, index: number) => (
                              <li key={index} className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0">
                                {/* Question from freelancer */}
                                <div className="mb-2">
                                  <p className="font-medium text-slate-800">
                                    <span className="text-blue-600 mr-1">Q:</span> 
                                    {qa.question}
                                  </p>
                                </div>
                                
                                {/* Freelancer's answer */}
                                <div className="mb-3 ml-5 pl-3 border-l-2 border-blue-100">
                                  <p className="text-slate-600">
                                    <span className="text-blue-600 font-medium mr-1">A:</span>
                                    {qa.answer}
                                  </p>
                                </div>
                                
                                {/* Client response section */}
                                <div className="mt-3 bg-white rounded p-3 border border-slate-200">
                                  <p className="text-sm font-medium text-slate-700 mb-2">Your Response:</p>
                                  
                                  {editingQuestionId === index ? (
                                    <div className="space-y-2">
                                      <textarea 
                                        className="w-full border border-slate-300 rounded-md p-2 text-slate-800 text-sm min-h-[80px]"
                                        placeholder="Enter your response to the freelancer..."
                                        value={clientResponses[index] || qa.answer || ''}
                                        onChange={(e) => setClientResponses({
                                          ...clientResponses, 
                                          [index]: e.target.value
                                        })}
                                      />
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingQuestionId(null)}
                                          disabled={isSavingResponse}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          size="sm"
                                          onClick={() => handleSaveResponse(index)}
                                          disabled={isSavingResponse}
                                        >
                                          {isSavingResponse ? (
                                            <>
                                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                              Saving...
                                            </>
                                          ) : 'Save Response'}
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      {qa.answer ? (
                                        <div className="flex justify-between items-start">
                                          <p className="text-slate-700">{qa.answer}</p>
                                          <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            onClick={() => {
                                              setClientResponses({
                                                ...clientResponses, 
                                                [index]: qa.answer
                                              });
                                              setEditingQuestionId(index);
                                            }}
                                          >
                                            Edit
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="flex justify-between items-center">
                                          <p className="text-slate-500 italic">No response yet</p>
                                          <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => {
                                              setClientResponses({
                                                ...clientResponses, 
                                                [index]: ''
                                              });
                                              setEditingQuestionId(index);
                                            }}
                                          >
                                            Add Response
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </CardContent>
            </Card>
            
            {/* Project Summary Card */}
            <Card className="overflow-hidden border-slate-200">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  Project Summary
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {isLoadingProject ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                ) : project ? (
                  <div className="space-y-4">
                    <p className="text-slate-700">{project.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-1">Budget</h4>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-green-600 mr-1.5" />
                          <p className="text-slate-800">
                            {project.budget?.type === 'fixed' ? 'Fixed Price: ' : 'Hourly Rate: '}
                            {project.budget?.currency || '$'}
                            {project.budget?.amount?.toLocaleString() || project.budget?.maxAmount?.toLocaleString() || 'Not specified'}
                            {project.budget?.type === 'hourly' ? '/hr' : ''}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-1">Timeline</h4>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-blue-600 mr-1.5" />
                          <p className="text-slate-800">
                            {project.timeline?.duration || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-1">Experience Level</h4>
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-purple-600 mr-1.5" />
                          <p className="text-slate-800 capitalize">
                            {project.requirements?.experienceLevel || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-1">Location</h4>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-red-600 mr-1.5" />
                          <p className="text-slate-800 capitalize">
                            {project.requirements?.location || 'Remote'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {project.requirements?.skills && project.requirements.skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-2">Skills Required</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.requirements.skills.map((skill: string, index: number) => (
                            <Badge 
                              key={index} 
                              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-100">
                      <Button 
                        onClick={() => router.push(`/projects/${project.projectId}`)} 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-transparent p-0"
                      >
                        View Full Project Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">Project details not available.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column: Freelancer info and actions */}
          <div className="space-y-6">
            {/* Freelancer Card */}
            <Card className="border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Freelancer
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {isLoadingProposal ? (
                  <div className="flex flex-col items-center text-center animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-slate-200 mb-4"></div>
                    <div className="h-5 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-8 bg-slate-200 rounded w-full mt-4"></div>
                  </div>
                ) : proposal?.freelancerInfo ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-20 h-20 mb-3">
                      <Image
                        src={proposal.freelancerInfo.photoURL || "/placeholder-user.jpg"}
                        alt={proposal.freelancerInfo.name || "Freelancer"}
                        fill
                        className="object-cover rounded-full border-2 border-blue-100"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {proposal.freelancerInfo.name}
                    </h3>
                    <p className="text-slate-600 mb-3">{proposal.freelancerInfo.title}</p>
                    
                    <div className="flex items-center justify-center mb-4">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                      <span className="font-medium mr-1">
                        {proposal.freelancerInfo.rating?.toFixed(1) || "New"}
                      </span>
                      <span className="text-slate-500 text-sm">
                        ({proposal.freelancerInfo.completedJobs || 0} jobs)
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => router.push(`/messages?user=${proposal.freelancerId}&proposal=${proposalId}`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-1.5" />
                      Contact Freelancer
                    </Button>
                    
                    <Link 
                      href={`/profile/${proposal.freelancerId}`}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-3 inline-block"
                    >
                      View Full Profile
                    </Link>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center">Freelancer information not available.</p>
                )}
              </CardContent>
            </Card>

            {/* Proposal Details Card */}
            <Card className="border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center text-lg">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Proposal Details
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                {isLoadingProposal ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ) : proposal ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Bid Amount</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {proposal && formatProposalBid(proposal)}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {proposal?.bid?.type === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-1">Delivery Timeline</h4>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-blue-600 mr-1.5" />
                        <p className="text-slate-800">
                          {proposal?.bid?.timeline || "Not specified"}
                        </p>
                      </div>
                    </div>
                    
                    {proposal?.bid?.deliveryDate && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 mb-1">Expected Delivery Date</h4>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-purple-600 mr-1.5" />
                          <p className="text-slate-800">
                            {proposal?.bid?.deliveryDate && formatDate(proposal.bid.deliveryDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500">Proposal details not available.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Action Card */}
            {proposal && proposal.status === "submitted" && (
              <Card className="border-slate-200 overflow-hidden" id="proposal-action-card">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                  <CardTitle className="flex items-center text-lg">
                    Actions
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setIsAcceptModalOpen(true)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Accept Proposal
                    </Button>
                    
                    <Button 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={() => setIsShortlistModalOpen(true)}
                    >
                      <Star className="w-4 h-4 mr-1.5" />
                      Shortlist
                    </Button>
                    
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setIsDeclineModalOpen(true)}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Accept Proposal Modal */}
      <ConfirmModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onConfirm={handleAcceptProposal}
        title="Accept Proposal"
        description="Are you sure you want to accept this proposal? This will initiate the contracting process."
        confirmText="Yes, accept proposal"
        cancelText="Cancel"
        variant="default"
      />
      
      {/* Shortlist Proposal Modal */}
      <ConfirmModal
        isOpen={isShortlistModalOpen}
        onClose={() => setIsShortlistModalOpen(false)}
        onConfirm={handleShortlistProposal}
        title="Shortlist Proposal"
        description="Would you like to add this freelancer to your shortlist? They will be notified of this change."
        confirmText="Yes, shortlist"
        cancelText="Cancel"
        variant="default"
      />
      
      {/* Decline Proposal Modal */}
      <ConfirmModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleRejectProposal}
        title="Decline Proposal"
        description="Are you sure you want to decline this proposal? This action cannot be undone."
        confirmText="Yes, decline"
        cancelText="Cancel"
        variant="destructive"
      />
      
      {/* File Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name || "File Preview"}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 max-h-[70vh] overflow-auto">
            {selectedFile && (
              selectedFile.type.includes('image') ? (
                <div className="flex justify-center">
                  <Image 
                    src={selectedFile.url} 
                    alt={selectedFile.name || "File preview"}
                    width={800}
                    height={600}
                    style={{ objectFit: 'contain', maxHeight: '70vh' }}
                  />
                </div>
              ) : selectedFile.type.includes('pdf') ? (
                <iframe 
                  src={`${selectedFile.url}#toolbar=0&navpanes=0`} 
                  className="w-full h-[60vh]" 
                />
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">File Preview Not Available</h3>
                  <p className="text-slate-500 mb-4">This file type cannot be previewed directly.</p>
                  <Button asChild>
                    <a href={selectedFile.url} target="_blank" rel="noopener noreferrer" download>
                      Download File
                    </a>
                  </Button>
                </div>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
