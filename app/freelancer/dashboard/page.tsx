"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  Briefcase,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Eye,
  Plus,
  ArrowRight,
  FileText,
  Clock,
  MessageSquare,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetFreelancerContractsQuery,
  useGetFreelancerPaymentsQuery,
  useGetRecentConversationsQuery,
  useGetProposalsWithProjectsQuery,
  useGetFreelancerReviewsStatsQuery,
  useGetFreelancerProfileCompletionQuery,
} from "@/lib/redux/api/firebaseApi";
import { formatDistanceToNow } from "date-fns";
import { ProfileCompletionModal } from "@/components/modals/profile-completion-modal";

// Helper function to safely convert timestamps to dates
const toDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === "string") return new Date(timestamp);
  if (timestamp.toDate) return timestamp.toDate();
  return new Date();
};

export default function FreelancerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [showProfileCompletionModal, setShowProfileCompletionModal] =
    useState(false);

  // Fetch real-time data
  const { data: contracts = [], isLoading: contractsLoading } =
    useGetFreelancerContractsQuery(user?.userId || "", {
      skip: !user?.userId,
      pollingInterval: 30000, // Poll every 30 seconds
    });

  const { data: payments = [], isLoading: paymentsLoading } =
    useGetFreelancerPaymentsQuery(user?.userId || "", {
      skip: !user?.userId,
      pollingInterval: 30000,
    });

  const { data: proposals = [], isLoading: proposalsLoading } =
    useGetProposalsWithProjectsQuery(
      { freelancerId: user?.userId || "" },
      {
        skip: !user?.userId,
        pollingInterval: 30000,
      }
    );

  const { data: conversations = [], isLoading: conversationsLoading } =
    useGetRecentConversationsQuery(
      { userId: user?.userId || "", limit: 3 },
      {
        skip: !user?.userId,
        pollingInterval: 10000, // Poll more frequently for messages
      }
    );

  // Get real-time review stats
  const { data: reviewStats } = useGetFreelancerReviewsStatsQuery(
    user?.userId || "",
    {
      skip: !user?.userId,
      pollingInterval: 30000, // Poll every 30 seconds
    }
  );

  // Get profile completion rate
  const { data: profileCompletion } = useGetFreelancerProfileCompletionQuery(
    user?.userId || "",
    {
      skip: !user?.userId,
      pollingInterval: 60000, // Poll every 60 seconds
    }
  );

  // Calculate dashboard stats
  const activeContracts = contracts.filter((c) => c.status === "active");
  const completedContracts = contracts.filter((c) => c.status === "completed");
  const activeAndCompletedContracts = contracts.filter(
    (c) => c.status === "active" || c.status === "completed"
  );

  // Calculate total earnings from completed payments only
  // According to Payment schema: status can be "pending" | "escrowed" | "completed" | "refunded" | "failed"
  // Only "completed" payments represent actual earnings that have been released to the freelancer
  // Convert all currencies to USD equivalent and format to 2 decimal places (XXX.00)
  const calculateTotalEarnings = () => {
    // Currency conversion rates (you can fetch these from an API in production)
    const conversionRates: Record<string, number> = {
      USD: 1,
      EUR: 1.1,
      GBP: 1.27,
      XAF: 0.0016, // Central African CFA franc
      NGN: 0.0013, // Nigerian Naira
      GHS: 0.082, // Ghanaian Cedi
      KES: 0.0078, // Kenyan Shilling
      ZAR: 0.055, // South African Rand
    };

    const total = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => {
        const amount = p.amount?.net || 0;
        const currency = p.amount?.currency || "USD";
        const rate = conversionRates[currency] || 1;
        return sum + amount * rate;
      }, 0);

    // Return formatted to 2 decimal places
    return Math.round(total * 100) / 100;
  };

  const totalEarnings = calculateTotalEarnings();

  // Calculate escrow and pending amounts from active contracts
  const totalEscrowed = payments
    .filter((p) => p.status === "escrowed")
    .reduce((sum, p) => sum + (p.amount?.gross || 0), 0);

  const totalPending = contracts
    .filter((c) => c.status === "active")
    .reduce((sum, contract) => {
      const unpaidMilestones = contract.milestones.filter(
        (m) => m.status !== "completed"
      );
      return sum + unpaidMilestones.reduce((ms, m) => ms + (m.amount || 0), 0);
    }, 0);

  // Use real-time review stats, fallback to user stats if not available
  const clientRating =
    reviewStats?.averageRating ?? user?.stats?.averageRating ?? 0;
  const totalReviews =
    reviewStats?.totalReviews ?? user?.stats?.totalReviews ?? 0;
  const totalJobs = user?.stats?.completedJobs || 0;
  const profileCompletionRate = profileCompletion?.completionRate || 0;

  // Get recent proposals (last 3)
  const recentProposals = proposals.slice(0, 3);

  // Loading state
  if (
    contractsLoading &&
    paymentsLoading &&
    proposalsLoading &&
    conversationsLoading
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
        </div>
      </div>
    );
  }

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()},{" "}
            <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              {user?.displayName || user?.email || "Freelancer"}!
            </span>
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your freelance business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalEarnings.toFixed(2)}
                  </p>
                  {totalEarnings > 0 && (
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      From{" "}
                      {
                        payments.filter((p) => p.status === "completed").length
                      }{" "}
                      completed payments
                    </p>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active + Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeContracts.length} + {completedContracts.length}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {contracts.length === 1
                      ? `${contracts.length} contract`
                      : `${contracts.length} contracts`}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Client Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clientRating.toFixed(1)}
                  </p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Based on {totalReviews}{" "}
                    {totalReviews === 1 ? "review" : "reviews"}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-2xl">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setShowProfileCompletionModal(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Profile Completion
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profileCompletionRate}%
                  </p>
                  {profileCompletion && (
                    <p className="text-xs text-purple-600 flex items-center mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {profileCompletion.completedSections}/
                      {profileCompletion.totalSections} sections complete
                    </p>
                  )}
                </div>
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Contracts */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    Active & Completed Contracts
                  </CardTitle>
                  <Link href="/freelancer/contracts">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl bg-transparent"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeAndCompletedContracts.length > 0 ? (
                  activeAndCompletedContracts.map((contract) => {
                    // Use progress from contract data
                    const progress = contract.progress || 0;

                    // Calculate financial breakdown
                    const totalAmount = contract.terms.amount;
                    const completedMilestones = contract.milestones.filter(
                      (m) => m.status === "completed"
                    );
                    const amountPaid = completedMilestones.reduce(
                      (sum, m) => sum + (m.amount || 0),
                      0
                    );
                    const amountEscrowed = contract.milestones
                      .filter((m) => m.status === "in_review")
                      .reduce((sum, m) => sum + (m.amount || 0), 0);
                    const amountPending = contract.milestones
                      .filter(
                        (m) => m.status === "active" || m.status === "pending"
                      )
                      .reduce((sum, m) => sum + (m.amount || 0), 0);

                    return (
                      <Link
                        key={contract.contractId}
                        href={`/freelancer/contracts/${contract.contractId}`}
                      >
                        <div className="border border-gray-200 rounded-2xl p-4 hover:border-primary-blue transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  Contract #{contract.contractId.slice(-6)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Started{" "}
                                  {formatDistanceToNow(
                                    toDate(contract.createdAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className={
                                contract.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {contract.status === "active"
                                ? "Active"
                                : "Completed"}
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          {/* Financial Breakdown */}
                          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                            <div className="bg-green-50 rounded-lg p-2">
                              <div className="text-gray-600">Paid</div>
                              <div className="font-semibold text-green-700">
                                ${amountPaid.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-2">
                              <div className="text-gray-600">In Review</div>
                              <div className="font-semibold text-blue-700">
                                ${amountEscrowed.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="text-gray-600">Pending</div>
                              <div className="font-semibold text-gray-700">
                                ${amountPending.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-2">
                              <div className="text-gray-600">Total</div>
                              <div className="font-semibold text-purple-700">
                                ${totalAmount.toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                            <span className="text-gray-600">
                              <Briefcase className="w-4 h-4 inline mr-1" />
                              {contract.milestones.length} milestones
                            </span>
                            <span className="text-gray-500">
                              {completedMilestones.length}/
                              {contract.milestones.length} completed
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Contracts Yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start by browsing projects and submitting proposals
                    </p>
                    <Link href="/projects">
                      <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                        <Plus className="w-4 h-4 mr-2" />
                        Find Projects
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Messages */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Recent Messages
                  </CardTitle>
                  <Link href="/messages">
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {conversations.length > 0 ? (
                  conversations.map((conversation: any) => {
                    const unreadCount =
                      conversation.unreadCount?.[user?.userId || ""] || 0;

                    return (
                      <Link
                        key={conversation.conversationId}
                        href={`/messages?conversation=${conversation.conversationId}`}
                      >
                        <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <Image
                            src={
                              conversation.participantAvatar ||
                              "/placeholder-user.jpg"
                            }
                            alt={conversation.participantName || "User"}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {conversation.participantName || "User"}
                              </p>
                              {unreadCount > 0 && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                              {conversation.lastMessage?.text ||
                                "No messages yet"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {conversation.lastMessage?.timestamp
                                ? formatDistanceToNow(
                                    toDate(conversation.lastMessage.timestamp),
                                    {
                                      addSuffix: true,
                                    }
                                  )
                                : "Just now"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">No messages yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Start by applying to projects
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Proposals */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Recent Proposals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProposals.length > 0 ? (
                  recentProposals.map((proposal: any) => (
                    <Link
                      key={proposal.proposalId}
                      href={`/freelancer/proposals/${proposal.proposalId}`}
                    >
                      <div className="border border-gray-200 rounded-xl p-3 hover:border-primary-blue transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-2 flex-1 pr-2">
                            {proposal.projectTitle || "Untitled Project"}
                          </h4>
                          <Badge
                            variant={
                              proposal.status === "shortlisted"
                                ? "default"
                                : proposal.status === "rejected"
                                ? "destructive"
                                : proposal.status === "accepted"
                                ? "default"
                                : "secondary"
                            }
                            className={`text-xs shrink-0 ${
                              proposal.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : proposal.status === "shortlisted"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                            }`}
                          >
                            {proposal.status}
                          </Badge>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-600 font-semibold">
                              ${proposal.bid.amount.toLocaleString()}
                            </span>
                            <span className="text-gray-500">
                              {formatDistanceToNow(
                                toDate(proposal.submittedAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </div>
                          {proposal.coverLetter && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {proposal.coverLetter}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                            <span className="text-gray-500">
                              Timeline:{" "}
                              {proposal.bid.timeline || "Not specified"}
                            </span>
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">No proposals yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Browse projects and submit your first proposal
                    </p>
                    <Link href="/projects">
                      <Button
                        size="sm"
                        className="mt-3 bg-primary-blue hover:bg-primary-blue-dark"
                      >
                        Browse Projects
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/projects">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Find New Projects
                  </Button>
                </Link>
                <Link href="/freelancer/profile">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
                <Link href="/freelancer/contracts">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl bg-transparent"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    View Contracts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Profile Completion Modal */}
      {profileCompletion && (
        <ProfileCompletionModal
          open={showProfileCompletionModal}
          onOpenChange={setShowProfileCompletionModal}
          completionRate={profileCompletion.completionRate}
          sections={profileCompletion.sections}
          completedSections={profileCompletion.completedSections}
          totalSections={profileCompletion.totalSections}
        />
      )}
    </div>
  );
}
