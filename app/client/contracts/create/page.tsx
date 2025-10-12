"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  useGetProposalQuery,
  useGetProjectQuery,
} from "@/lib/redux/api/firebaseApi";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDoc,
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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CreateContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const freelancerId = searchParams.get("freelancerId");
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freelancerData, setFreelancerData] = useState<any>(null);

  // Contract form state
  const [contract, setContract] = useState({
    // Basic information (pulled from proposal/project)
    projectId: "",
    proposalId: proposalId || "",
    clientId: user?.userId || "",
    freelancerId: freelancerId || "",

    // Contract terms (editable)
    terms: {
      amount: 0,
      currency: "USD",
      paymentType: "fixed",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default: 1 month from now
      workingHoursPerWeek: 40,
    },

    // Milestones (from proposal or created here)
    milestones: [] as any[],

    // Contract status (starts pending freelancer acceptance)
    status: "pending_acceptance",
    progress: 0,

    // Time tracking settings
    timeTracking: {
      totalHours: 0,
      weeklyLimit: 40,
      isManualTime: true,
    },
  });

  // We've removed payment method state since payments are handled on milestone basis

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

  // Fetch proposal data
  const {
    data: proposal,
    isLoading: isLoadingProposal,
    error: proposalError,
  } = useGetProposalQuery(proposalId || "", {
    skip: !proposalId,
  });

  // Fetch project data once we have the proposal
  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useGetProjectQuery(proposal?.projectId || "", {
    skip: !proposal?.projectId,
  });

  // Fetch freelancer data
  useEffect(() => {
    const fetchFreelancerData = async () => {
      if (!freelancerId) return;

      try {
        const freelancerDoc = await getDoc(doc(db, "users", freelancerId));
        if (freelancerDoc.exists()) {
          setFreelancerData(freelancerDoc.data());
        }
      } catch (error) {
        console.error("Error fetching freelancer data:", error);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  // Populate contract form with proposal and project data
  useEffect(() => {
    if (proposal && project) {
      // Set project ID
      setContract((prev) => ({
        ...prev,
        projectId: project.projectId,
        terms: {
          ...prev.terms,
          amount: proposal.bid?.amount || 0,
          currency: proposal.bid?.currency || "USD",
          paymentType: proposal.bid?.type || "fixed",
        },
      }));

      // If proposal has milestones, set those
      if (proposal.milestones && proposal.milestones.length > 0) {
        setContract((prev) => ({
          ...prev,
          milestones: proposal.milestones.map((m: any, index: number) => ({
            id: `milestone-${index + 1}`,
            title: m.title,
            description: m.description,
            amount: m.amount,
            dueDate: m.dueDate ? new Date(m.dueDate) : new Date(),
            status: "pending",
          })),
        }));
      } else {
        // Create a default milestone based on proposal amount
        setContract((prev) => ({
          ...prev,
          milestones: [
            {
              id: "milestone-1",
              title: "Project Completion",
              description: "Full project delivery as specified in requirements",
              amount: proposal.bid?.amount || 0,
              dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
              status: "pending",
            },
          ],
        }));
      }
    }
  }, [proposal, project]);

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

  // Payment handling has been removed since payments are now handled on milestone basis

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

    // Reset new milestone form
    setNewMilestone({
      title: "",
      description: "",
      amount: 0,
      dueDate: new Date(),
      status: "pending",
    });

    // Hide the add milestone form
    setShowAddMilestone(false);
  };

  // Remove a milestone
  const removeMilestone = (id: string) => {
    setContract((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  // Calculate total contract amount based on milestones
  const totalContractAmount =
    contract.milestones.length > 0
      ? contract.milestones.reduce(
          (total, milestone) => total + (Number(milestone.amount) || 0),
          0
        )
      : 0;

  // Create the contract
  const createContract = async () => {
    // Validate inputs
    if (contract.milestones.length === 0) {
      toast({
        title: "Missing Milestones",
        description:
          "Please add at least one milestone before creating the contract.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Format milestones for Firestore
      const formattedMilestones = contract.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        amount: Number(milestone.amount),
        dueDate: milestone.dueDate,
        status: milestone.status,
      }));

      // Create the contract in Firestore
      const contractRef = await addDoc(collection(db, "contracts"), {
        projectId: project.projectId,
        proposalId: proposal.proposalId,
        clientId: user.userId,
        freelancerId: freelancerId,

        terms: {
          amount: Number(totalContractAmount), // Use calculated total from milestones
          currency: contract.terms.currency,
          paymentType: contract.terms.paymentType,
          startDate: contract.terms.startDate,
          endDate: contract.terms.endDate,
          workingHoursPerWeek: Number(contract.terms.workingHoursPerWeek),
        },

        status: "pending_acceptance",
        progress: 0,

        milestones: formattedMilestones,

        timeTracking: {
          totalHours: 0,
          weeklyLimit: Number(contract.timeTracking.weeklyLimit),
          isManualTime: contract.timeTracking.isManualTime,
        },

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // No payment method is stored during contract creation
      // Payments will be handled individually for each milestone in the contract details page

      // Show success message
      toast({
        title: "Contract Created",
        description:
          "The contract has been created and is awaiting acceptance by the freelancer.",
      });

      // Navigate to the contract view page
      setTimeout(() => {
        router.push(`/client/contracts/${contractRef.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error creating contract:", error);
      toast({
        title: "Error",
        description: "Failed to create the contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoadingProposal || isLoadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center pt-10">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Loading contract information...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we prepare your contract.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (proposalError || projectError || !proposal || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Error Loading Information
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't load the required information to create this contract.
              Please try again or contact support.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => router.refresh()}>Try Again</Button>
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
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
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 p-0"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Contract
            </h1>
            <p className="text-gray-600">
              You're creating a contract with{" "}
              {freelancerData?.displayName || "Freelancer"} for "{project.title}
              "
            </p>
          </div>
          <div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm py-1 px-3">
              <InfoIcon className="h-3.5 w-3.5 mr-1" />
              Draft Contract
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="details">Contract Details</TabsTrigger>
            <TabsTrigger value="milestones">
              Milestones & Deliverables
            </TabsTrigger>
          </TabsList>

          {/* Contract Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>
                  Define the basic contract terms between you and the freelancer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Project Title
                      </div>
                      <div className="font-medium">{project.title}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Project Budget
                      </div>
                      <div className="font-medium">
                        {project.budget?.type === "fixed"
                          ? `${project.budget?.currency || "$"}${
                              project.budget?.amount?.toLocaleString() || 0
                            } (Fixed)`
                          : `${project.budget?.currency || "$"}${
                              project.budget?.minAmount?.toLocaleString() || 0
                            } - 
                             ${project.budget?.currency || "$"}${
                              project.budget?.maxAmount?.toLocaleString() || 0
                            } (Hourly)`}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Proposal Amount
                      </div>
                      <div className="font-medium">
                        {proposal.bid?.currency || "$"}
                        {proposal.bid?.amount?.toLocaleString() || 0}
                        {proposal.bid?.type === "hourly" && " per hour"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Type and Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Contract Type</Label>
                    <Select
                      value={contract.terms.paymentType}
                      onValueChange={(value) =>
                        handleTermsChange("paymentType", value)
                      }
                    >
                      <SelectTrigger>
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
                      defaultValue={[40]}
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
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button onClick={() => setActiveTab("milestones")}>
                  Continue to Milestones
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Milestones & Payments</CardTitle>
                <CardDescription>
                  Break down the project into deliverable milestones with
                  associated payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Milestones List */}
                <div className="space-y-4">
                  {contract.milestones.length > 0 ? (
                    contract.milestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        className="bg-white border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {index + 1}. {milestone.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {milestone.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <div className="flex items-center text-gray-700">
                                <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                                Due:{" "}
                                {milestone.dueDate instanceof Date
                                  ? format(milestone.dueDate, "MMM d, yyyy")
                                  : "No date set"}
                              </div>
                              <div className="flex items-center font-medium">
                                <DollarSign className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                                {contract.terms.currency}{" "}
                                {Number(milestone.amount).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(milestone.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 border-dashed border-2 border-gray-300 rounded-lg p-8 text-center">
                      <HelpCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-600 mb-1">
                        No Milestones Yet
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Add milestones to break down the project into manageable
                        deliverables
                      </p>
                      <Button
                        onClick={() => setShowAddMilestone(true)}
                        size="sm"
                      >
                        Add Your First Milestone
                      </Button>
                    </div>
                  )}
                </div>

                {/* Total Contract Amount */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">Total Contract Value:</div>
                    <div className="text-xl font-bold text-green-600">
                      {contract.terms.currency}{" "}
                      {totalContractAmount.toLocaleString()}
                    </div>
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
                          <Label htmlFor="milestone-amount">Amount</Label>
                          <div className="relative">
                            <DollarSign className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                              id="milestone-amount"
                              type="number"
                              value={String(newMilestone.amount)}
                              onChange={(e) =>
                                handleMilestoneChange(
                                  "amount",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="pl-8"
                              placeholder="0.00"
                            />
                          </div>
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
                  onClick={createContract}
                  disabled={isSubmitting || contract.milestones.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Create Contract"
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
