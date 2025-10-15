"use client";

import { useState } from "react";
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
  Plus,
  ArrowRight,
  FileText,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetClientContractsQuery,
  useGetClientPaymentsQuery,
  useGetRecentConversationsQuery,
  useGetClientProposalsQuery,
  useGetClientHiredFreelancersCountQuery,
  useGetProjectsByClientQuery,
} from "@/lib/redux/api/firebaseApi";
import { formatDistanceToNow } from "date-fns";

// Helper function to safely convert timestamps to dates
const toDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === "string") return new Date(timestamp);
  if (timestamp.toDate) return timestamp.toDate();
  return new Date();
};

export default function ClientDashboard() {
  const { user } = useAppSelector((state) => state.auth);

  // Fetch real-time data
  const { data: contracts = [], isLoading: contractsLoading } =
    useGetClientContractsQuery(user?.userId || "", {
      skip: !user?.userId,
      pollingInterval: 30000, // Poll every 30 seconds
    });

  const {
    data: payments = [],
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetClientPaymentsQuery(user?.userId || "", {
    skip: !user?.userId,
    pollingInterval: 30000,
  });

  const { data: proposals = [], isLoading: proposalsLoading } =
    useGetClientProposalsQuery(
      { clientId: user?.userId || "", limit: 10 },
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

  const { data: hiredFreelancersCount = 0 } =
    useGetClientHiredFreelancersCountQuery(user?.userId || "", {
      skip: !user?.userId,
      pollingInterval: 30000,
    });

  const { data: projectsData } = useGetProjectsByClientQuery(
    { clientId: user?.userId || "" },
    {
      skip: !user?.userId,
      pollingInterval: 30000,
    }
  );

  const projects = projectsData || [];

  // Calculate dashboard stats
  const activeContracts = contracts.filter((c) => c.status === "active");
  const completedContracts = contracts.filter((c) => c.status === "completed");

  // Calculate total spent from completed payments only
  const calculateTotalSpent = () => {
    const conversionRates: Record<string, number> = {
      USD: 1,
      EUR: 1.1,
      GBP: 1.27,
      XAF: 0.0016,
      NGN: 0.0013,
      GHS: 0.082,
      KES: 0.0078,
      ZAR: 0.055,
    };

    const total = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => {
        const amount = p.amount?.gross || 0;
        const currency = p.amount?.currency || "USD";
        const rate = conversionRates[currency] || 1;
        return sum + amount * rate;
      }, 0);

    return Math.round(total * 100) / 100;
  };

  console.log(payments);
  const totalSpent = calculateTotalSpent();

  // Use real-time review stats from user profile
  const averageRating = user?.stats?.averageRating || 0;
  const totalReviews = user?.stats?.totalReviews || 0;

  // Get recent proposals (last 3)
  const recentProposals = proposals.slice(0, 3);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Loading state
  if (
    contractsLoading &&
    paymentsLoading &&
    proposalsLoading &&
    conversationsLoading
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()},{" "}
            <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
              {user?.displayName || user?.email || "Client"}!
            </span>
          </h1>
          <p className="text-gray-600">
            Manage your projects and find the perfect freelancers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalSpent.toFixed(2)}
                  </p>
                  {totalSpent > 0 && (
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
                    Freelancer Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
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

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Freelancers Hired
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {hiredFreelancersCount}
                  </p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    Across all projects
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-2xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active & Completed Contracts */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    Active & Completed Contracts
                  </CardTitle>
                  <Link href="/client/contracts">
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
                {contracts.length > 0 ? (
                  contracts.map((contract) => {
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
                    const amountInReview = contract.milestones
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
                        href={`/client/contracts/${contract.contractId}`}
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
                                ${amountInReview.toLocaleString()}
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
                      Start by posting a project and hiring freelancers
                    </p>
                    <Link href="/projects/post">
                      <Button className="bg-primary-blue hover:bg-primary-blue-dark">
                        <Plus className="w-4 h-4 mr-2" />
                        Post a Project
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
                      Start by hiring freelancers
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
                      href={`/client/proposals/${proposal.proposalId}`}
                    >
                      <div className="border border-gray-200 rounded-xl p-3 hover:border-primary-blue transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Image
                              src={
                                proposal.freelancerAvatar ||
                                "/placeholder-user.jpg"
                              }
                              alt={proposal.freelancerName || "Freelancer"}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover mr-2"
                            />
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {proposal.freelancerName || "Freelancer"}
                              </h4>
                              <div className="flex items-center text-xs text-gray-600">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                <span>
                                  {proposal.freelancerRating.toFixed(1)}
                                </span>
                                <span className="mx-1">•</span>
                                <span>
                                  {proposal.freelancerCompletedJobs} contracts
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Proposal preview text (max 20 characters) */}
                        {proposal.coverLetter && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                            {proposal.coverLetter.substring(0, 20)}
                            {proposal.coverLetter.length > 20 ? "..." : ""}
                          </p>
                        )}

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-green-600 font-semibold">
                            ${proposal.bid.amount.toLocaleString()}
                          </span>
                          <span className="text-gray-500">
                            {formatDistanceToNow(toDate(proposal.submittedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">No proposals yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Post a project to receive proposals
                    </p>
                    <Link href="/projects/post">
                      <Button
                        size="sm"
                        className="mt-3 bg-primary-blue hover:bg-primary-blue-dark"
                      >
                        Post Project
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
                <Link href="/projects/post">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Project
                  </Button>
                </Link>
                <Link href="/freelancers">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl bg-transparent"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Browse Freelancers
                  </Button>
                </Link>
                <Link href="/client/payments">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-xl bg-transparent"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payment History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
