"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Calendar,
  DollarSign,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Shield,
  TrendingUp,
  Wallet,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FreelancerContractsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [contracts, setContracts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch contracts and payments data
  useEffect(() => {
    if (!user?.userId) return;

    const fetchContractsData = async () => {
      try {
        setLoading(true);

        // Fetch contracts where user is the freelancer
        const contractsRef = query(
          collection(db, "contracts"),
          where("freelancerId", "==", user.userId),
          orderBy("createdAt", "desc")
        );

        // Set up real-time listener for contracts
        const unsubscribeContracts = onSnapshot(
          contractsRef,
          async (contractsSnap) => {
            const contractsData = contractsSnap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date(),
              terms: {
                ...doc.data().terms,
                startDate: doc.data().terms?.startDate?.toDate() || new Date(),
                endDate: doc.data().terms?.endDate?.toDate() || new Date(),
              },
              milestones: Array.isArray(doc.data().milestones)
                ? doc.data().milestones.map((milestone: any) => ({
                    ...milestone,
                    dueDate: milestone.dueDate?.toDate() || new Date(),
                  }))
                : [],
            }));

            setContracts(contractsData);

            // Fetch all related payments for these contracts
            if (contractsData.length > 0) {
              const contractIds = contractsData.map((contract) => contract.id);
              const paymentsRef = query(
                collection(db, "payments"),
                where("contractId", "in", contractIds)
              );

              const paymentsSnap = await getDocs(paymentsRef);
              const paymentsData = paymentsSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
              }));

              setPayments(paymentsData);

              // Fetch client information
              const clientIds = [
                ...new Set(
                  contractsData.map((contract: any) => contract.clientId)
                ),
              ];
              if (clientIds.length > 0) {
                const clientsRef = query(
                  collection(db, "users"),
                  where("userId", "in", clientIds)
                );

                const clientsSnap = await getDocs(clientsRef);
                const clientsData = clientsSnap.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));

                setClients(clientsData);
              }

              // Fetch project information
              const projectIds = [
                ...new Set(
                  contractsData.map((contract: any) => contract.projectId)
                ),
              ];
              if (projectIds.length > 0) {
                const projectsRef = query(
                  collection(db, "projects"),
                  where("projectId", "in", projectIds)
                );

                const projectsSnap = await getDocs(projectsRef);
                const projectsData = projectsSnap.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));

                setProjects(projectsData);
              }
            }

            setLoading(false);
          }
        );

        return () => unsubscribeContracts();
      } catch (err: any) {
        console.error("Error fetching contracts:", err);
        toast({
          title: "Error",
          description: "Failed to load contracts. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchContractsData();
  }, [user?.userId, toast]);

  // Get client info by ID
  const getClientInfo = (clientId: string) => {
    return (
      clients.find((client) => client.userId === clientId) || {
        name: "Unknown Client",
        photoURL: "/placeholder-user.jpg",
      }
    );
  };

  // Get project info from projects data
  const getProjectInfo = (contract: any) => {
    const project = projects.find((p) => p.projectId === contract.projectId);
    return {
      title: project?.title || "Unknown Project",
      description: project?.description || "No description available",
    };
  };

  // Filter and sort contracts
  const filteredContracts = contracts
    .filter((contract) => {
      const projectInfo = getProjectInfo(contract);
      const clientInfo = getClientInfo(contract.clientId);
      const matchesSearch =
        projectInfo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientInfo.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount":
          return (b.terms?.amount || 0) - (a.terms?.amount || 0);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

  // Calculate stats
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter((c) => c.status === "active").length;
  const completedContracts = contracts.filter(
    (c) => c.status === "completed"
  ).length;
  const totalEarned = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + (payment.amount?.gross || 0), 0);
  const totalEscrowed = payments
    .filter((p) => p.status === "escrowed")
    .reduce((sum, payment) => sum + (payment.amount?.gross || 0), 0);
  const totalPending = contracts
    .filter((c) => ["active", "pending_acceptance"].includes(c.status))
    .reduce((sum, contract) => {
      const contractPayments = payments.filter(
        (p) => p.contractId === contract.id
      );
      const paidAmount = contractPayments
        .filter((p) => p.status === "completed")
        .reduce((s, p) => s + (p.amount?.gross || 0), 0);
      const escrowedAmount = contractPayments
        .filter((p) => p.status === "escrowed")
        .reduce((s, p) => s + (p.amount?.gross || 0), 0);
      return (
        sum +
        Math.max(0, (contract.terms?.amount || 0) - paidAmount - escrowedAmount)
      );
    }, 0);

  // Get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending_acceptance":
        return {
          label: "Pending Acceptance",
          color: "bg-amber-100 text-amber-800",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "active":
        return {
          label: "Active",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
        };
      case "paused":
        return {
          label: "Paused",
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-3 w-3 mr-1" />,
        };
      case "revision_requested":
        return {
          label: "Revision Requested",
          color: "bg-orange-100 text-orange-800",
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center pt-10">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Loading contracts...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we fetch your contract data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Contracts
          </h1>
          <p className="text-gray-600">
            Manage your active and completed contracts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Contracts
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalContracts}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Earned
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalEarned.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-2xl">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Escrow</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalEscrowed.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Payment
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${totalPending.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search contracts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending_acceptance">
                    Pending Acceptance
                  </SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount">Highest Amount</SelectItem>
                  <SelectItem value="progress">Most Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-6">
          {filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => {
              const statusDisplay = getStatusDisplay(contract.status);
              const contractPayments = payments.filter(
                (p) => p.contractId === contract.id
              );
              const totalPaid = contractPayments
                .filter((p) => p.status === "completed")
                .reduce((sum, p) => sum + (p.amount?.gross || 0), 0);
              const totalEscrow = contractPayments
                .filter((p) => p.status === "escrowed")
                .reduce((sum, p) => sum + (p.amount?.gross || 0), 0);
              const clientInfo = getClientInfo(contract.clientId);
              const projectInfo = getProjectInfo(contract);

              return (
                <Card
                  key={contract.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {projectInfo.title}
                          </h3>
                          <Badge className={statusDisplay.color}>
                            {statusDisplay.icon}
                            {statusDisplay.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Started:{" "}
                            {format(contract.terms.startDate, "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Total: $
                            {contract.terms?.amount?.toLocaleString() || 0}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {clientInfo.name}
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Progress
                            </span>
                            <span className="text-sm text-gray-600">
                              {contract.progress || 0}%
                            </span>
                          </div>
                          <Progress
                            value={contract.progress || 0}
                            className="h-2"
                          />
                        </div>

                        {/* Payment Summary */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Earned</p>
                            <p className="font-semibold text-green-600">
                              ${totalPaid.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">In Escrow</p>
                            <p className="font-semibold text-blue-600">
                              ${totalEscrow.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Remaining</p>
                            <p className="font-semibold text-orange-600">
                              $
                              {Math.max(
                                0,
                                (contract.terms?.amount || 0) -
                                  totalPaid -
                                  totalEscrow
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-6">
                        <Button asChild>
                          <Link href={`/freelancer/contracts/${contract.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Contract
                          </Link>
                        </Button>

                        <Button variant="outline" asChild>
                          <Link href={`/messages?contract=${contract.id}`}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No contracts found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You don't have any contracts yet. Submit proposals to get started."}
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
  );
}
