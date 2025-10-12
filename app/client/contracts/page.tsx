"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Contract {
  id: string;
  projectId: string;
  projectTitle?: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  freelancerName?: string;
  freelancerAvatar?: string;
  terms: {
    amount: number;
    currency: string;
    paymentType: string;
    startDate: Date;
    endDate: Date;
    workingHoursPerWeek?: number;
  };
  milestones: {
    id: string;
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
    status: string;
  }[];
  status: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const statusColors: Record<string, string> = {
  pending_acceptance: "bg-amber-100 text-amber-800 border-amber-200",
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  revision_requested: "bg-orange-100 text-orange-800 border-orange-200",
};

const statusIcons: Record<string, any> = {
  pending_acceptance: <Clock className="h-4 w-4 mr-1" />,
  active: <CheckCircle className="h-4 w-4 mr-1" />,
  paused: <AlertTriangle className="h-4 w-4 mr-1" />,
  completed: <CheckCircle className="h-4 w-4 mr-1" />,
  cancelled: <XCircle className="h-4 w-4 mr-1" />,
  revision_requested: <AlertTriangle className="h-4 w-4 mr-1" />,
};

export default function ClientContractsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all user's contracts
  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);

    const contractsRef = collection(db, "contracts");
    const q = query(
      contractsRef,
      where("clientId", "==", user.userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const contractsData: Contract[] = [];

          // Process contracts
          for (const doc of snapshot.docs) {
            const contract = doc.data();

            // Get project details
            let projectTitle = "Project";
            try {
              const projectDoc = await getDocs(
                query(
                  collection(db, "projects"),
                  where("projectId", "==", contract.projectId)
                )
              );

              if (!projectDoc.empty) {
                projectTitle = projectDoc.docs[0].data().title || "Project";
              }
            } catch (err) {
              console.error("Error fetching project:", err);
            }

            // Get freelancer details
            let freelancerName = "Freelancer";
            let freelancerAvatar = "";
            try {
              const freelancerDoc = await getDocs(
                query(
                  collection(db, "users"),
                  where("userId", "==", contract.freelancerId)
                )
              );

              if (!freelancerDoc.empty) {
                const freelancerData = freelancerDoc.docs[0].data();
                freelancerName = freelancerData.displayName || "Freelancer";
                freelancerAvatar = freelancerData.photoURL || "";
              }
            } catch (err) {
              console.error("Error fetching freelancer:", err);
            }

            // Format the contract data
            contractsData.push({
              id: doc.id,
              projectId: contract.projectId,
              projectTitle,
              proposalId: contract.proposalId,
              clientId: contract.clientId,
              freelancerId: contract.freelancerId,
              freelancerName,
              freelancerAvatar,
              terms: {
                amount: contract.terms?.amount || 0,
                currency: contract.terms?.currency || "USD",
                paymentType: contract.terms?.paymentType || "fixed",
                startDate: contract.terms?.startDate?.toDate() || new Date(),
                endDate: contract.terms?.endDate?.toDate() || new Date(),
                workingHoursPerWeek: contract.terms?.workingHoursPerWeek || 40,
              },
              milestones: Array.isArray(contract.milestones)
                ? contract.milestones.map((milestone: any) => ({
                    id: milestone.id,
                    title: milestone.title,
                    description: milestone.description,
                    amount: milestone.amount,
                    dueDate: milestone.dueDate?.toDate() || new Date(),
                    status: milestone.status,
                  }))
                : [],
              status: contract.status,
              progress: contract.progress,
              createdAt: contract.createdAt?.toDate() || new Date(),
              updatedAt: contract.updatedAt?.toDate() || new Date(),
            });
          }

          setContracts(contractsData);
          setLoading(false);
        } catch (err: any) {
          console.error("Error processing contracts:", err);
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching contracts:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.userId]);

  // Filter contracts based on search query and status
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      searchQuery === "" ||
      contract.projectTitle
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      contract.freelancerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && contract.status === "active") ||
      (filterStatus === "pending_acceptance" &&
        contract.status === "pending_acceptance") ||
      (filterStatus === "completed" && contract.status === "completed") ||
      (filterStatus === "ongoing" &&
        [
          "active",
          "pending_acceptance",
          "revision_requested",
          "paused",
        ].includes(contract.status));

    return matchesSearch && matchesStatus;
  });

  // Handle tab selection
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilterStatus(value);
  };

  // Navigate to contract details
  const viewContract = (id: string) => {
    router.push(`/client/contracts/${id}`);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Error Loading Contracts
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.refresh()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
            <p className="text-gray-600">
              Manage and track all your contracts with freelancers
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => router.push("/client/projects")}>
              Find Freelancers
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending_acceptance">Pending</TabsTrigger>
            <TabsTrigger value="ongoing">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contracts or freelancers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterStatus("pending_acceptance")}
              >
                Pending Acceptance
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterStatus("revision_requested")}
              >
                Revision Requested
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("paused")}>
                Paused
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contracts List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              Loading contracts...
            </h2>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Contracts Found
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Try changing your search or filter criteria"
                : "You haven't created any contracts yet"}
            </p>
            <Button onClick={() => router.push("/client/projects")}>
              Find Freelancers
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Contracts Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Freelancer</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract) => (
                      <TableRow
                        key={contract.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => viewContract(contract.id)}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={contract.freelancerAvatar || ""}
                                alt={contract.freelancerName}
                              />
                              <AvatarFallback>
                                {contract.freelancerName
                                  ?.substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {contract.freelancerName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {contract.projectTitle}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              statusColors[contract.status] || "bg-gray-100"
                            }
                          >
                            {statusIcons[contract.status]}
                            {contract.status.charAt(0).toUpperCase() +
                              contract.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {contract.terms.paymentType === "fixed"
                            ? "Fixed Price"
                            : "Hourly"}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {contract.terms.currency}{" "}
                            {contract.terms.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(contract.terms.startDate),
                            "MMM d, yyyy"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="h-8">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
