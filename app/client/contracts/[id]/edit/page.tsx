"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  doc,
  collection,
  updateDoc,
  serverTimestamp,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CalendarIcon,
  ArrowLeft,
  InfoIcon,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  HelpCircle,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import {
  validateMobileMoneyPayment,
  getAvailableCountries,
  isProviderAvailableInCountry,
  getExamplePhoneNumber,
  MOBILE_MONEY_COUNTRIES,
  detectProvider,
} from "@/lib/utils/payments/mobile-money-validation";

export default function EditContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRevisionMode = searchParams.get("revise") === "true";
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalContract, setOriginalContract] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [freelancer, setFreelancer] = useState<any>(null);

  // Contract form state
  const [contract, setContract] = useState({
    // Basic information
    projectId: "",
    proposalId: "",
    clientId: "",
    freelancerId: "",

    // Contract terms (editable)
    terms: {
      amount: 0,
      currency: "USD",
      paymentType: "fixed",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      workingHoursPerWeek: 40,
    },

    // Milestones (editable)
    milestones: [] as any[],

    // Contract status
    status: "pending_acceptance",
    progress: 0,

    // Time tracking settings
    timeTracking: {
      totalHours: 0,
      weeklyLimit: 40,
      isManualTime: true,
    },
  });

  // Tabs state
  const [activeTab, setActiveTab] = useState("details");

  // Additional state for milestone management
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    amount: 0,
    dueDate: new Date(),
    status: "pending",
  });

  // Track changes
  const [hasChanges, setHasChanges] = useState(false);
  const [changedFields, setChangedFields] = useState<string[]>([]);

  // Check if user can edit this contract
  const canEditContract = () => {
    return (
      user?.role === "client" &&
      user?.userId === contract.clientId &&
      (contract.status === "pending_acceptance" ||
        contract.status === "revision_requested")
    );
  };

  // Fetch contract details
  // Store funded milestone IDs to prevent editing
  const [fundedMilestones, setFundedMilestones] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setLoading(true);

        // Get contract data
        const contractRef = doc(db, "contracts", resolvedParams.id);
        const contractSnap = await getDoc(contractRef);

        if (!contractSnap.exists()) {
          setError("Contract not found");
          return;
        }

        const contractData = contractSnap.data();

        // Format contract data
        const formattedContract = {
          id: contractSnap.id,
          projectId: contractData.projectId || "",
          proposalId: contractData.proposalId || "",
          clientId: contractData.clientId || "",
          freelancerId: contractData.freelancerId || "",
          terms: {
            amount: contractData.terms?.amount || 0,
            currency: contractData.terms?.currency || "USD",
            paymentType: contractData.terms?.paymentType || "fixed",
            startDate: contractData.terms?.startDate?.toDate() || new Date(),
            endDate: contractData.terms?.endDate?.toDate() || new Date(),
            workingHoursPerWeek: contractData.terms?.workingHoursPerWeek || 40,
          },
          milestones: Array.isArray(contractData.milestones)
            ? contractData.milestones.map((milestone: any) => ({
                ...milestone,
                dueDate: milestone.dueDate?.toDate() || new Date(),
              }))
            : [],
          status: contractData.status || "pending_acceptance",
          progress: contractData.progress || 0,
          timeTracking: {
            totalHours: contractData.timeTracking?.totalHours || 0,
            weeklyLimit: contractData.timeTracking?.weeklyLimit || 40,
            isManualTime: contractData.timeTracking?.isManualTime || true,
          },
          createdAt: contractData.createdAt?.toDate() || new Date(),
          updatedAt: contractData.updatedAt?.toDate() || new Date(),
        };

        setContract(formattedContract);
        setOriginalContract(formattedContract);

        // Get project data
        if (contractData.projectId) {
          const projectDoc = await getDoc(
            doc(db, "projects", contractData.projectId)
          );
          if (projectDoc.exists()) {
            setProject(projectDoc.data());
          }
        }

        // Get freelancer data
        if (contractData.freelancerId) {
          const freelancerDoc = await getDoc(
            doc(db, "users", contractData.freelancerId)
          );
          if (freelancerDoc.exists()) {
            setFreelancer(freelancerDoc.data());
          }
        }

        // Get payments data to check which milestones are already funded
        const paymentsRef = query(
          collection(db, "payments"),
          where("contractId", "==", resolvedParams.id)
        );
        const paymentsSnap = await getDocs(paymentsRef);

        const fundedMilestonesMap: Record<string, boolean> = {};
        paymentsSnap.docs.forEach((doc) => {
          const payment = doc.data();
          if (payment.milestoneId && payment.status !== "failed") {
            fundedMilestonesMap[payment.milestoneId] = true;
          }
        });

        setFundedMilestones(fundedMilestonesMap);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching contract:", err);
        setError("Failed to load contract");
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [resolvedParams.id]);

  // Check for changes whenever contract state updates
  useEffect(() => {
    if (!originalContract) return;

    const hasChanges =
      JSON.stringify(contract) !== JSON.stringify(originalContract);
    setHasChanges(hasChanges);

    // Track which fields have changed
    const changed: string[] = [];
    // No longer check contract.terms.amount directly as it's calculated from milestones
    if (contract.terms.currency !== originalContract.terms.currency)
      changed.push("currency");
    if (contract.terms.paymentType !== originalContract.terms.paymentType)
      changed.push("paymentType");
    if (
      contract.terms.startDate.getTime() !==
      originalContract.terms.startDate.getTime()
    )
      changed.push("startDate");
    if (
      contract.terms.endDate.getTime() !==
      originalContract.terms.endDate.getTime()
    )
      changed.push("endDate");
    if (
      contract.terms.workingHoursPerWeek !==
      originalContract.terms.workingHoursPerWeek
    )
      changed.push("workingHoursPerWeek");
    if (
      JSON.stringify(contract.milestones) !==
      JSON.stringify(originalContract.milestones)
    )
      changed.push("milestones");
    if (
      JSON.stringify(contract.timeTracking) !==
      JSON.stringify(originalContract.timeTracking)
    )
      changed.push("timeTracking");

    setChangedFields(changed);
  }, [contract, originalContract]);

  // Calculate total contract amount from milestones
  const totalContractAmount = contract.milestones.reduce(
    (total, milestone) => total + (milestone.amount || 0),
    0
  );

  // Handle contract terms changes
  const handleTermsChange = (field: string, value: any) => {
    setContract((prev) => ({
      ...prev,
      terms: {
        ...prev.terms,
        [field]: value,
      },
    }));
  };

  // Handle time tracking changes
  const handleTimeTrackingChange = (field: string, value: any) => {
    setContract((prev) => ({
      ...prev,
      timeTracking: {
        ...prev.timeTracking,
        [field]: value,
      },
    }));
  };

  // Handle new milestone changes
  const handleMilestoneChange = (field: string, value: any) => {
    setNewMilestone((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add a new milestone
  const addMilestone = () => {
    const milestone = {
      ...newMilestone,
      id: `milestone-${contract.milestones.length + 1}`,
    };

    setContract((prev) => ({
      ...prev,
      milestones: [...prev.milestones, milestone],
    }));

    // Reset the new milestone form
    setNewMilestone({
      title: "",
      description: "",
      amount: 0,
      dueDate: new Date(),
      status: "pending",
    });

    setShowAddMilestone(false);
  };

  // Remove a milestone
  const removeMilestone = (index: number) => {
    const milestoneToRemove = contract.milestones[index];

    // Check if this milestone is funded
    if (fundedMilestones[milestoneToRemove.id]) {
      toast({
        title: "Cannot Remove",
        description:
          "This milestone has already been funded and cannot be removed.",
        variant: "destructive",
      });
      return;
    }

    setContract((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  // Edit existing milestone
  const editMilestone = (index: number, field: string, value: any) => {
    const milestoneToEdit = contract.milestones[index];

    // Check if this milestone is funded
    if (fundedMilestones[milestoneToEdit.id]) {
      toast({
        title: "Cannot Edit",
        description:
          "This milestone has already been funded and cannot be modified.",
        variant: "destructive",
      });
      return;
    }

    setContract((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      ),
    }));
  };

  // Save contract changes
  const saveContract = async () => {
    if (!canEditContract()) {
      toast({
        title: "Permission Denied",
        description: "You cannot edit this contract in its current state.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare contract data for update
      const contractData: any = {
        terms: {
          ...contract.terms,
          amount: totalContractAmount, // Use calculated total from milestones
          startDate: contract.terms.startDate,
          endDate: contract.terms.endDate,
        },
        milestones: contract.milestones.map((milestone) => ({
          ...milestone,
          dueDate: milestone.dueDate,
        })),
        timeTracking: contract.timeTracking,
        updatedAt: serverTimestamp(),
      };

      // If in revision mode, set status back to pending_acceptance
      if (isRevisionMode) {
        contractData.status = "pending_acceptance";
      }

      // Update contract in Firestore
      await updateDoc(doc(db, "contracts", resolvedParams.id), contractData);

      // Add contract update event
      await addDoc(collection(db, "contractEvents"), {
        contractId: resolvedParams.id,
        eventType: isRevisionMode ? "contract_revised" : "contract_updated",
        createdBy: user?.userId,
        userType: "client",
        comment: isRevisionMode
          ? `Contract revised by client and sent back for acceptance. Changed fields: ${changedFields.join(
              ", "
            )}`
          : `Contract updated by client. Changed fields: ${changedFields.join(
              ", "
            )}`,
        metadata: {
          changedFields,
          isRevision: isRevisionMode,
          previousValues: {
            amount: originalContract.terms.amount,
            paymentType: originalContract.terms.paymentType,
            milestonesCount: originalContract.milestones.length,
          },
          newValues: {
            amount: contract.terms.amount,
            paymentType: contract.terms.paymentType,
            milestonesCount: contract.milestones.length,
          },
        },
        createdAt: serverTimestamp(),
      });

      // Update original contract to track future changes
      setOriginalContract(contract);
      setHasChanges(false);
      setChangedFields([]);

      toast({
        title: isRevisionMode ? "Contract Revised" : "Contract Updated",
        description: isRevisionMode
          ? "The contract has been revised and sent back for acceptance."
          : "The contract has been successfully updated.",
      });

      // Navigate back to contract view
      setTimeout(() => {
        router.push(`/client/contracts/${resolvedParams.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating contract:", error);
      toast({
        title: "Error",
        description: "Failed to update the contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing and go back
  const cancelEditing = () => {
    if (hasChanges) {
      // Show confirmation dialog if there are unsaved changes
      return;
    }
    router.push(`/client/contracts/${resolvedParams.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center pt-10">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Loading contract...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we load the contract details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {error || "Contract Not Found"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "The contract you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.refresh()}>Try Again</Button>
              <Button
                variant="outline"
                onClick={() => router.push("/client/contracts")}
              >
                Go Back to Contracts
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Permission check
  if (!canEditContract()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Cannot Edit Contract
            </h2>
            <p className="text-gray-600 mb-6">
              This contract cannot be edited in its current state (
              {contract.status.replace("_", " ")}). You can only edit contracts
              that are pending acceptance or have revision requests.
            </p>
            <Button
              onClick={() =>
                router.push(`/client/contracts/${resolvedParams.id}`)
              }
            >
              View Contract
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 p-0"
              onClick={cancelEditing}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Contract
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isRevisionMode ? "Revise Contract" : "Edit Contract"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isRevisionMode
                  ? "Make changes and send the contract back for acceptance: "
                  : "Review and update the contract terms for: "}
                {project?.title || "Project"}
              </p>
              {isRevisionMode && (
                <div className="flex items-center mt-3 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    Revision Mode: Changes will reset contract status to pending
                    acceptance
                  </span>
                </div>
              )}
              {hasChanges && (
                <div className="flex items-center mt-3 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    You have unsaved changes
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {hasChanges ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You have unsaved changes. Are you sure you want to leave
                        without saving? All changes will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          router.push(`/client/contracts/${resolvedParams.id}`)
                        }
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Discard Changes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button variant="outline" onClick={cancelEditing}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}

              <Button
                onClick={saveContract}
                disabled={!hasChanges || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isRevisionMode ? "Sending Revision..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    {isRevisionMode ? "Send Revision" : "Save Contract"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Contract Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Project</div>
                  <div className="font-medium">
                    {project?.title || "Unknown Project"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Category</div>
                  <div className="font-medium">
                    {project?.category || "Not specified"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Budget Range</div>
                  <div className="font-medium">
                    {project?.budget?.currency || "$"}
                    {project?.budget?.minAmount?.toLocaleString() || 0} -
                    {project?.budget?.currency || "$"}
                    {project?.budget?.maxAmount?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Freelancer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Freelancer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {freelancer?.photoURL ? (
                    <Image
                      src={freelancer.photoURL}
                      alt={freelancer.displayName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {freelancer?.displayName?.substring(0, 2).toUpperCase() ||
                        "FL"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium">
                    {freelancer?.displayName || "Freelancer"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {freelancer?.title || "Professional"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contract Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge
                  className={
                    contract.status === "pending_acceptance"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : contract.status === "revision_requested"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {contract.status.replace("_", " ").toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-600">
                  {contract.status === "pending_acceptance"
                    ? "Awaiting freelancer acceptance"
                    : contract.status === "revision_requested"
                    ? "Freelancer requested changes"
                    : "Contract status"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Edit Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="details">Contract Details</TabsTrigger>
            <TabsTrigger value="milestones">Milestones & Payments</TabsTrigger>
          </TabsList>

          {/* Contract Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Terms</CardTitle>
                <CardDescription>
                  Update the basic contract terms and conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contract Type */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentType">Contract Type</Label>
                    <Select
                      value={contract.terms.paymentType}
                      onValueChange={(value) =>
                        handleTermsChange("paymentType", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1.5">
                      {contract.terms.paymentType === "fixed"
                        ? "Pay a fixed price for the entire project, released by milestones."
                        : "Pay an hourly rate based on tracked time, billed weekly."}
                    </p>
                  </div>
                </div>

                {/* Contract Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={contract.terms.currency}
                      onValueChange={(value) =>
                        handleTermsChange("currency", value)
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="XAF">XAF (CFA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="amount"
                      className="flex items-center justify-between"
                    >
                      <span>Total Amount ({contract.terms.currency})</span>
                      <Badge variant="outline" className="ml-2 bg-gray-100">
                        Auto-calculated
                      </Badge>
                    </Label>
                    <div className="mt-1.5 relative">
                      <Input
                        id="amount"
                        type="text"
                        value={`${totalContractAmount.toLocaleString()}`}
                        disabled={true}
                        className="bg-gray-50 text-gray-800"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Total is automatically calculated from milestone amounts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <DatePicker
                      date={contract.terms.startDate}
                      setDate={(date) => handleTermsChange("startDate", date)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <DatePicker
                      date={contract.terms.endDate}
                      setDate={(date) => handleTermsChange("endDate", date)}
                    />
                  </div>
                </div>

                {/* Weekly Hours (for hourly contracts) */}
                {contract.terms.paymentType === "hourly" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="weeklyLimit">
                        Weekly Hour Limit: {contract.timeTracking.weeklyLimit}{" "}
                        hours
                      </Label>
                    </div>
                    <Slider
                      id="weeklyLimit"
                      min={1}
                      max={60}
                      step={1}
                      value={[contract.timeTracking.weeklyLimit]}
                      onValueChange={(values) =>
                        handleTimeTrackingChange("weeklyLimit", values[0])
                      }
                      className="mb-6"
                    />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isManualTime"
                        checked={contract.timeTracking.isManualTime}
                        onCheckedChange={(checked) =>
                          handleTimeTrackingChange("isManualTime", checked)
                        }
                      />
                      <Label htmlFor="isManualTime">
                        Allow manual time entry
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5">
                      When enabled, freelancers can manually log time instead of
                      using the time tracker.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("milestones")}
                >
                  Next: Milestones
                </Button>
                <Button
                  onClick={saveContract}
                  disabled={!hasChanges || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>
                  Define payment milestones for the project deliverables
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing Milestones */}
                {contract.milestones.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Current Milestones</h4>
                    {contract.milestones.map((milestone, index) => (
                      <div
                        key={milestone.id || index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Milestone {index + 1}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`milestone-title-${index}`}>
                              Title
                            </Label>
                            <Input
                              id={`milestone-title-${index}`}
                              value={milestone.title}
                              onChange={(e) =>
                                editMilestone(index, "title", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor={`milestone-amount-${index}`}>
                              Amount ({contract.terms.currency})
                            </Label>
                            <Input
                              id={`milestone-amount-${index}`}
                              type="number"
                              value={milestone.amount}
                              onChange={(e) =>
                                editMilestone(
                                  index,
                                  "amount",
                                  parseFloat(e.target.value)
                                )
                              }
                              min={0}
                              step={1}
                            />
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`milestone-description-${index}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`milestone-description-${index}`}
                              value={milestone.description}
                              onChange={(e) =>
                                editMilestone(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`milestone-dueDate-${index}`}>
                              Due Date
                            </Label>
                            <DatePicker
                              date={milestone.dueDate}
                              setDate={(date) =>
                                editMilestone(index, "dueDate", date)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total Contract Value */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-medium">
                      Total Contract Value
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {contract.terms.currency}{" "}
                      {totalContractAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {contract.milestones.length} milestone
                    {contract.milestones.length !== 1 ? "s" : ""} defined
                  </div>
                </div>

                {/* Add Milestone Form */}
                {showAddMilestone ? (
                  <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
                    <h4 className="font-medium mb-4">Add New Milestone</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="milestone-title">Milestone Title</Label>
                        <Input
                          id="milestone-title"
                          value={newMilestone.title}
                          onChange={(e) =>
                            handleMilestoneChange("title", e.target.value)
                          }
                          placeholder="E.g., Design Completion, Backend Development"
                        />
                      </div>
                      <div>
                        <Label htmlFor="milestone-description">
                          Description
                        </Label>
                        <Textarea
                          id="milestone-description"
                          value={newMilestone.description}
                          onChange={(e) =>
                            handleMilestoneChange("description", e.target.value)
                          }
                          placeholder="Describe what will be delivered in this milestone"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="milestone-amount">
                            Amount ({contract.terms.currency})
                          </Label>
                          <Input
                            id="milestone-amount"
                            type="number"
                            value={newMilestone.amount}
                            onChange={(e) =>
                              handleMilestoneChange(
                                "amount",
                                parseFloat(e.target.value)
                              )
                            }
                            min={0}
                            step={1}
                          />
                        </div>
                        <div>
                          <Label htmlFor="milestone-dueDate">Due Date</Label>
                          <DatePicker
                            date={newMilestone.dueDate}
                            setDate={(date) =>
                              handleMilestoneChange("dueDate", date)
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowAddMilestone(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={addMilestone}>Add Milestone</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowAddMilestone(true)}
                    className="w-full"
                    variant="outline"
                  >
                    + Add Milestone
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Back to Details
                </Button>
                <Button
                  onClick={saveContract}
                  disabled={!hasChanges || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Contract"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
