"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Search, Calendar, Clock, User, FileText, CheckCircle, XCircle, Eye, MessageSquare, Send, AlertCircle, Star, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { Proposal, subscribeToFreelancerProposals, withdrawProposal, selectAllProposals, selectProposalLoading, selectProposalError, selectProposalStats } from "@/lib/redux"
import { Timestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

// Fallback proposals for when loading or if an error occurs
const fallbackProposals = [
  {
    id: "PROP-001",
    projectTitle: "Modern Restaurant Website",
    client: {
      name: "Bella Vista Restaurant",
      avatar: "/local-business.png",
      rating: 4.6,
      location: "New York, NY",
    },
    status: "pending",
    submittedDate: "2024-01-20",
    budget: 3500,
    proposedAmount: 3200,
    timeline: "6 weeks",
    coverLetter:
      "I'm excited to help create a stunning website for Bella Vista Restaurant. With my 5+ years of experience in restaurant web design, I understand the importance of showcasing your menu, atmosphere, and making online reservations seamless...",
    projectDescription:
      "Looking for a modern, responsive website for our upscale Italian restaurant. Need online reservation system, menu display, photo gallery, and contact information.",
    skills: ["React", "Node.js", "Restaurant Design", "Reservation Systems"],
    clientBudget: "$3,000 - $5,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Intermediate",
    proposalsCount: 12,
    lastActivity: "2 days ago",
  },
  {
    id: "PROP-002",
    projectTitle: "Mobile Fitness App Development",
    client: {
      name: "FitLife Solutions",
      avatar: "/fitness-company.png",
      rating: 4.9,
      location: "Los Angeles, CA",
    },
    status: "accepted",
    submittedDate: "2024-01-15",
    acceptedDate: "2024-01-18",
    budget: 8500,
    proposedAmount: 8000,
    timeline: "10 weeks",
    coverLetter:
      "Your fitness app project aligns perfectly with my expertise in React Native and health app development. I've successfully delivered 8 fitness apps with features like workout tracking, nutrition logging, and social features...",
    projectDescription:
      "Develop a comprehensive fitness tracking app with workout plans, nutrition tracking, progress analytics, and social features for iOS and Android.",
    skills: ["React Native", "Firebase", "Health APIs", "UI/UX Design"],
    clientBudget: "$7,000 - $10,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Expert",
    proposalsCount: 8,
    lastActivity: "Contract started",
  },
  {
    id: "PROP-003",
    projectTitle: "E-learning Platform Backend",
    client: {
      name: "EduTech Innovations",
      avatar: "/tech-startup-office.png",
      rating: 4.7,
      location: "Austin, TX",
    },
    status: "rejected",
    submittedDate: "2024-01-10",
    rejectedDate: "2024-01-14",
    budget: 6000,
    proposedAmount: 5800,
    timeline: "8 weeks",
    coverLetter:
      "I'm passionate about educational technology and would love to contribute to your e-learning platform. My experience with scalable backend systems and educational content management makes me a great fit...",
    projectDescription:
      "Build a robust backend system for an e-learning platform with user management, course content delivery, progress tracking, and payment processing.",
    skills: ["Node.js", "PostgreSQL", "AWS", "Payment Integration"],
    clientBudget: "$5,000 - $8,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Expert",
    proposalsCount: 15,
    lastActivity: "Proposal declined",
    rejectionReason: "Client chose a different freelancer with more e-learning experience",
  },
  {
    id: "PROP-004",
    projectTitle: "Brand Identity & Logo Design",
    client: {
      name: "StartupXYZ",
      avatar: "/data-company.png",
      rating: 4.5,
      location: "Seattle, WA",
    },
    status: "interviewing",
    submittedDate: "2024-01-22",
    budget: 2500,
    proposedAmount: 2300,
    timeline: "4 weeks",
    coverLetter:
      "I specialize in creating memorable brand identities for startups. My design process focuses on understanding your target audience and creating a visual identity that resonates with your brand values...",
    projectDescription:
      "Create a complete brand identity package including logo design, color palette, typography, business cards, and brand guidelines for a tech startup.",
    skills: ["Logo Design", "Brand Identity", "Adobe Creative Suite", "Brand Strategy"],
    clientBudget: "$2,000 - $3,500",
    projectType: "Fixed Price",
    duration: "Less than 1 month",
    experienceLevel: "Intermediate",
    proposalsCount: 20,
    lastActivity: "Interview scheduled for tomorrow",
  },
  {
    id: "PROP-005",
    projectTitle: "WordPress E-commerce Store",
    client: {
      name: "Artisan Crafts Co.",
      avatar: "/local-business.png",
      rating: 4.4,
      location: "Portland, OR",
    },
    status: "pending",
    submittedDate: "2024-01-25",
    budget: 4200,
    proposedAmount: 3800,
    timeline: "5 weeks",
    coverLetter:
      "I'd love to help bring your artisan crafts online! With extensive experience in WooCommerce and custom WordPress development, I can create a beautiful, functional store that showcases your handmade products...",
    projectDescription:
      "Develop a WordPress e-commerce website using WooCommerce for selling handmade crafts. Need custom product pages, inventory management, and payment processing.",
    skills: ["WordPress", "WooCommerce", "PHP", "E-commerce"],
    clientBudget: "$3,500 - $5,000",
    projectType: "Fixed Price",
    duration: "1-3 months",
    experienceLevel: "Intermediate",
    proposalsCount: 9,
    lastActivity: "1 day ago",
  },
]

export default function FreelancerProposalsPage() {
  const [user, loading, authError] = useAuthState(auth)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const dispatch = useAppDispatch();
  const reduxProposals = useAppSelector(selectAllProposals);
  const reduxLoading = useAppSelector(selectProposalLoading);
  const reduxError = useAppSelector(selectProposalError);

  // Fetch proposals when the user is authenticated
  useEffect(() => {
    let unsubscribe: () => void;
    
    const fetchProposals = () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // Subscribe to real-time updates for the freelancer's proposals using Redux
        unsubscribe = dispatch(subscribeToFreelancerProposals(user.uid));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('Failed to load proposals. Please try again.');
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load proposals. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (user) {
      fetchProposals();
    } else if (!loading) {
      setIsLoading(false);
    }

    // Clean up subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, loading, toast, dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    setProposals(reduxProposals);
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxProposals, reduxError]);

  // Handle proposal withdrawal
  const handleWithdrawProposal = async (proposalId: string) => {
    if (!confirm("Are you sure you want to withdraw this proposal? This action cannot be undone.")) {
      return;
    }
    
    try {
      await dispatch(withdrawProposal(proposalId));
      toast({
        title: "Proposal withdrawn",
        description: "Your proposal has been successfully withdrawn.",
      });
    } catch (err) {
      console.error('Error withdrawing proposal:', err);
      toast({
        title: "Error",
        description: "Failed to withdraw proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Map Firebase status values to UI display values
  const mapStatusToDisplay = (status: string) => {
    switch (status) {
      case "submitted":
        return "pending";
      case "shortlisted":
        return "interviewing";
      default:
        return status;
    }
  };

  const filteredProposals = proposals
    .filter((proposal) => {
      const mappedStatus = mapStatusToDisplay(proposal.status);
      
      const matchesSearch =
        (proposal.projectTitle?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (proposal.clientInfo?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === "all" || mappedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.submittedAt.toDate().getTime() - a.submittedAt.toDate().getTime();
      } else if (sortBy === "oldest") {
        return a.submittedAt.toDate().getTime() - b.submittedAt.toDate().getTime();
      } else if (sortBy === "amount_high") {
        return b.bid.amount - a.bid.amount;
      } else if (sortBy === "amount_low") {
        return a.bid.amount - b.bid.amount;
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    const mappedStatus = mapStatusToDisplay(status);
    switch (mappedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "interviewing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "withdrawn":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    const mappedStatus = mapStatusToDisplay(status);
    switch (mappedStatus) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "interviewing":
        return <User className="w-4 h-4" />;
      case "withdrawn":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Use statistics from Redux store
  const { total: totalProposals, submitted: pendingProposals, shortlisted: shortlistedProposals, 
    accepted: acceptedProposals } = useAppSelector(selectProposalStats);
  const interviewingProposals = shortlistedProposals; // Shortlisted is our "interviewing" status

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Proposals</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your project proposals and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Proposals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProposals}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
                  <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingProposals}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-2xl">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviewing</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{interviewingProposals}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-2xl">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{acceptedProposals}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount_high">Amount (High)</SelectItem>
                  <SelectItem value="amount_low">Amount (Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Proposals List */}
        <div className="space-y-6">
          {isLoading ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ) : filteredProposals.length > 0 ? (
            filteredProposals.map((proposal) => (
              <Card key={proposal.proposalId} className="border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Status Banner */}
                <div className={`h-1.5 w-full ${
                  proposal.status === "accepted" ? "bg-green-500" :
                  proposal.status === "shortlisted" ? "bg-blue-500" :
                  proposal.status === "rejected" ? "bg-red-500" :
                  proposal.status === "withdrawn" ? "bg-gray-500" :
                  "gradient-bg-2"
                }`}></div>
                
                <CardContent className="p-0">
                  {/* Header Section with Project Title and Status */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
                        <Link href={`/freelancer/proposals/${proposal.proposalId}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {proposal.projectTitle || "Untitled Project"}
                        </Link>
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(proposal.status)} px-2.5 py-1`}>
                          {getStatusIcon(proposal.status)}
                          <span className="ml-1 capitalize font-medium">{mapStatusToDisplay(proposal.status)}</span>
                        </Badge>
                        {proposal.isInvited && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border border-purple-200 px-2.5 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Invited
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span>Submitted: {proposal.submittedAt instanceof Timestamp 
                        ? proposal.submittedAt.toDate().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})
                        : proposal.submittedAt ? new Date(proposal.submittedAt).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})
                        : "Unknown"}</span>
                    </div>
                    
                    {/* Client Information */}
                    <div className="flex items-center space-x-3 mt-3">
                      <Image
                        src={proposal.clientInfo?.photoURL || "/placeholder-user.jpg"}
                        alt={proposal.clientInfo?.name || "Client"}
                        width={36}
                        height={36}
                        className="rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{proposal.clientInfo?.name || "Client"}</span>
                        {proposal.clientInfo?.rating && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400 mx-1">•</span>
                            <div className="flex items-center">
                              <Star className="w-3.5 h-3.5 text-yellow-500 mr-0.5" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">{proposal.clientInfo.rating}</span>
                            </div>
                          </div>
                        )}
                        {proposal.clientInfo?.location && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400 mx-1">•</span>
                            <div className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 text-gray-500 mr-0.5" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">{proposal.clientInfo.location}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Financial Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-gray-700">
                    <div className="p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase">Your Bid</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {proposal.bid && typeof proposal.bid.amount === 'number' ? 
                          `${proposal.bid.currency || '$'}${proposal.bid.amount.toLocaleString()}` : 
                          "Not specified"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {proposal.bid?.type === "fixed" ? "Fixed Price" : "Hourly Rate"}
                      </p>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase">Client Budget</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {proposal.projectBudget ? (
                          proposal.projectBudget.type === "fixed" && typeof proposal.projectBudget.amount === 'number' ? 
                            `${proposal.projectBudget.currency || '$'}${proposal.projectBudget.amount.toLocaleString()}` 
                          : typeof proposal.projectBudget.minAmount === 'number' && typeof proposal.projectBudget.maxAmount === 'number' ?
                            `${proposal.projectBudget.currency || '$'}${proposal.projectBudget.minAmount.toLocaleString()} - ${proposal.projectBudget.maxAmount.toLocaleString()}`
                          : "Not specified"
                        ) : "Not specified"}
                      </p>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase">Timeline</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{proposal.bid?.timeline || "Not specified"}</p>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium uppercase">Delivery</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {proposal.bid?.deliveryDate instanceof Timestamp
                          ? proposal.bid.deliveryDate.toDate().toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
                          : proposal.bid?.deliveryDate ? new Date(proposal.bid.deliveryDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) 
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Skills Section */}
                  {proposal.skills && proposal.skills.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <div className="flex flex-wrap gap-1.5">
                        {proposal.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {skill}
                          </Badge>
                        ))}
                        {proposal.skills.length > 5 && (
                          <Badge variant="secondary" className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            +{proposal.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {proposal.proposalId.substring(0, 8)}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {proposal.status === "shortlisted" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                          <Link href={`/messages?proposal=${proposal.proposalId}`}>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Link>
                        </Button>
                      )}
                      
                      {proposal.status === "accepted" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                          <Link href={`/freelancer/contracts/${proposal.proposalId}`}>View Contract</Link>
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600" asChild>
                        <Link href={`/freelancer/proposals/${proposal.proposalId}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      
                      {proposal.status === "submitted" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border-blue-200" 
                          asChild
                        >
                          <Link href={`/projects/${proposal.projectId}/proposal?edit=true&proposalId=${proposal.proposalId}`}>Edit</Link>
                        </Button>
                      )}
                      
                      {(proposal.status === "submitted" || proposal.status === "shortlisted") && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleWithdrawProposal(proposal.proposalId)}>
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No proposals found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't submitted any proposals yet. Start by browsing available projects."}
                </p>
                <Button asChild>
                  <Link href="/projects">Browse Projects</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
