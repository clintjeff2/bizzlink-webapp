"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  AlertCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";
import {
  validateMobileMoneyPayment,
  getAvailableCountries,
  getExamplePhoneNumber,
  isProviderAvailableInCountry,
  MOBILE_MONEY_COUNTRIES,
} from "@/lib/utils/payments/mobile-money-validation";
import { RateFreelancerModal } from "@/components/modals/rate-freelancer-modal";
import { useGetReviewByContractQuery } from "@/lib/redux/api/firebaseApi";
import { Star } from "lucide-react";

const statusColors: Record<string, string> = {
  pending_acceptance: "bg-amber-100 text-amber-800 border-amber-200",
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-gray-100 text-gray-800 border-gray-200",
  completed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  revision_requested: "bg-blue-100 text-blue-800 border-blue-200",
};

const milestoneStatusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800 border-gray-200",
  active: "bg-blue-100 text-blue-800 border-blue-200",
  in_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function ContractDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<any>(null);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [contractEvents, setContractEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");

  // Phone validation state
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    error: "",
    formattedPhone: "",
  });

  // Dialog states
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showActivityApproveDialog, setShowActivityApproveDialog] =
    useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Get existing review for this contract
  const { data: existingReview } = useGetReviewByContractQuery(
    {
      contractId: resolvedParams.id,
      reviewerId: user?.userId || "",
    },
    { skip: !resolvedParams.id || !user?.userId }
  );

  // Calculate total contract amount from milestones
  const totalContractAmount =
    contract?.milestones?.reduce(
      (total: number, milestone: any) => total + (milestone.amount || 0),
      0
    ) || 0;
  const [paymentMethod, setPaymentMethod] = useState({
    type: "mtn_momo", // Default to MTN Momo
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    // Mobile Money fields
    countryCode: "+237", // Default to Cameroon
    phoneNumber: "",
    mobileProvider: "mtn_momo", // or "orange_momo"
  });

  // Fetch contract details
  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        setLoading(true);

        // Get contract data
        const contractRef = doc(db, "contracts", resolvedParams.id);
        const contractSnap = await getDoc(contractRef);

        if (!contractSnap.exists()) {
          setError("Contract not found");
          setLoading(false);
          return;
        }

        const contractData = contractSnap.data();

        // Format contract data
        const formattedContract = {
          id: contractSnap.id,
          ...contractData,
          terms: {
            ...contractData.terms,
            startDate: contractData.terms?.startDate?.toDate() || new Date(),
            endDate: contractData.terms?.endDate?.toDate() || new Date(),
          },
          milestones: Array.isArray(contractData.milestones)
            ? contractData.milestones.map((milestone: any) => ({
                ...milestone,
                dueDate: milestone.dueDate?.toDate() || new Date(),
              }))
            : [],
          createdAt: contractData.createdAt?.toDate() || new Date(),
          updatedAt: contractData.updatedAt?.toDate() || new Date(),
        };

        setContract(formattedContract);

        // Check if user is the contract's client
        if (contractData.clientId !== user?.userId) {
          setError("You don't have permission to view this contract");
          setLoading(false);
          return;
        }

        // Get project data
        const projectRef = query(
          collection(db, "projects"),
          where("projectId", "==", contractData.projectId)
        );
        const projectSnap = await getDocs(projectRef);

        if (!projectSnap.empty) {
          setProject(projectSnap.docs[0].data());
        }

        // Get freelancer data
        const freelancerRef = doc(db, "users", contractData.freelancerId);
        const freelancerSnap = await getDoc(freelancerRef);

        if (freelancerSnap.exists()) {
          setFreelancer(freelancerSnap.data());
        }

        // Get payments data
        const paymentsRef = query(
          collection(db, "payments"),
          where("contractId", "==", resolvedParams.id)
        );
        const paymentsSnap = await getDocs(paymentsRef);

        const paymentsData = paymentsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        setPayments(paymentsData);

        // Get contract events data
        const eventsRef = query(
          collection(db, "contractEvents"),
          where("contractId", "==", resolvedParams.id),
          orderBy("createdAt", "desc")
        );
        const eventsSnap = await getDocs(eventsRef);

        const eventsData = eventsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        setContractEvents(eventsData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching contract details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchContractDetails();
    }
  }, [resolvedParams.id, user?.userId]);

  // Pay milestone
  const payMilestone = async () => {
    if (!contract || !selectedMilestone || !user?.userId) return;

    // Validate payment method based on type
    if (
      paymentMethod.type === "mtn_momo" ||
      paymentMethod.type === "orange_momo"
    ) {
      if (!paymentMethod.phoneNumber || paymentMethod.phoneNumber.length < 8) {
        toast({
          title: "Error",
          description:
            "Please enter a valid phone number for mobile money payment.",
          variant: "destructive",
        });
        return;
      }
      if (!paymentMethod.countryCode) {
        toast({
          title: "Error",
          description: "Please select a country code for mobile money payment.",
          variant: "destructive",
        });
        return;
      }

      // Use the validation utility for comprehensive validation
      const validation = validateMobileMoneyPayment(
        paymentMethod.phoneNumber,
        paymentMethod.countryCode,
        paymentMethod.type as "mtn_momo" | "orange_momo"
      );

      if (!validation.isValid) {
        toast({
          title: "Invalid Phone Number",
          description:
            validation.error ||
            "Please enter a valid phone number for the selected country and provider.",
          variant: "destructive",
        });
        return;
      }
    } else if (paymentMethod.type === "card") {
      if (
        !paymentMethod.cardNumber ||
        !paymentMethod.cardName ||
        !paymentMethod.expiryMonth ||
        !paymentMethod.expiryYear ||
        !paymentMethod.cvc
      ) {
        toast({
          title: "Error",
          description: "Please fill in all card details.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Prepare payment method data based on type
      let paymentMethodData: any = {
        type: paymentMethod.type,
        provider: "bizzlink", // Default provider
      };

      // Handle different payment method types
      switch (paymentMethod.type) {
        case "mtn_momo":
          paymentMethodData = {
            type: "mtn_momo",
            countryCode: paymentMethod.countryCode,
            phoneNumber: paymentMethod.phoneNumber,
            provider: "mtn_momo",
            last4: paymentMethod.phoneNumber.slice(-4), // Last 4 digits of phone
          };
          break;
        case "orange_momo":
          paymentMethodData = {
            type: "orange_momo",
            countryCode: paymentMethod.countryCode,
            phoneNumber: paymentMethod.phoneNumber,
            provider: "orange_momo",
            last4: paymentMethod.phoneNumber.slice(-4), // Last 4 digits of phone
          };
          break;
        case "card":
          paymentMethodData = {
            type: "card",
            last4: paymentMethod.cardNumber.slice(-4),
            provider: "stripe",
          };
          break;
        case "paypal":
          paymentMethodData = {
            type: "paypal",
            provider: "paypal",
          };
          break;
        case "bank_transfer":
          paymentMethodData = {
            type: "bank_transfer",
            provider: "bank",
          };
          break;
      }

      // Process mobile money payment if applicable
      if (
        paymentMethod.type === "mtn_momo" ||
        paymentMethod.type === "orange_momo"
      ) {
        // Call the mobile money API
        const response = await fetch(
          `/api/webhooks/${
            paymentMethod.type === "mtn_momo" ? "mtn" : "orange"
          }/payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: selectedMilestone.amount,
              currency: contract.terms.currency,
              phone: `${paymentMethod.countryCode}${paymentMethod.phoneNumber}`,
              description: `Payment for milestone: ${
                selectedMilestone.title
              } in contract with ${freelancer?.displayName || "Freelancer"}`,
              contractId: contract.id,
              milestoneId: selectedMilestone.id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to process mobile money payment"
          );
        }

        // Get transaction details from response
        const transactionData = await response.json();

        // Save transaction reference for later verification
        paymentMethodData.transactionRef = transactionData.transactionId;
      }

      // Create payment record
      await addDoc(collection(db, "payments"), {
        contractId: contract.id,
        milestoneId: selectedMilestone.id,
        clientId: user.userId,
        freelancerId: contract.freelancerId,

        amount: {
          gross: Number(selectedMilestone.amount),
          fee: Number(selectedMilestone.amount) * 0.1, // 10% platform fee
          net: Number(selectedMilestone.amount) * 0.9,
          currency: contract.terms.currency,
        },

        status: "escrowed", // Payment is in escrow until milestone is completed
        type: "milestone",

        paymentMethod: paymentMethodData,

        // Add mobile money specific fields if applicable
        ...(paymentMethod.type === "mtn_momo" ||
        paymentMethod.type === "orange_momo"
          ? {
              mobileMoneyDetails: {
                countryCode: paymentMethod.countryCode,
                phoneNumber: paymentMethod.phoneNumber,
                fullPhoneNumber: `${paymentMethod.countryCode}${paymentMethod.phoneNumber}`,
                provider: paymentMethod.type,
                formattedPhone:
                  phoneValidation.formattedPhone || paymentMethod.phoneNumber,
              },
            }
          : {}),

        createdAt: serverTimestamp(),
      });

      // Update milestone status
      const updatedMilestones = contract.milestones.map((milestone: any) => {
        if (milestone.id === selectedMilestone.id) {
          return { ...milestone, status: "active" };
        }
        return milestone;
      });

      await updateDoc(doc(db, "contracts", contract.id), {
        milestones: updatedMilestones,
        updatedAt: serverTimestamp(),
      });

      // Update contract in state
      setContract({
        ...contract,
        milestones: updatedMilestones,
      });

      // Add payment event
      await addDoc(collection(db, "contractEvents"), {
        contractId: contract.id,
        milestoneId: selectedMilestone.id,
        eventType: "milestone_funded",
        createdBy: user.userId,
        userType: "client",
        comment: `Funded milestone: ${selectedMilestone.title}`,
        amount: selectedMilestone.amount,
        currency: contract.terms.currency,
        createdAt: serverTimestamp(),
      });

      // Show success message based on payment method
      const paymentMethodName =
        paymentMethod.type === "mtn_momo"
          ? "MTN Mobile Money"
          : paymentMethod.type === "orange_momo"
          ? "Orange Money"
          : paymentMethod.type === "card"
          ? "Card"
          : paymentMethod.type === "paypal"
          ? "PayPal"
          : "Bank Transfer";

      toast({
        title: "Payment Successful",
        description: `Milestone payment has been placed in escrow using ${paymentMethodName}.`,
      });

      setShowPayDialog(false);
      setIsSubmitting(false);
      setSelectedMilestone(null);

      // Refresh payments data
      const paymentsRef = query(
        collection(db, "payments"),
        where("contractId", "==", resolvedParams.id)
      );
      const paymentsSnap = await getDocs(paymentsRef);

      const paymentsData = paymentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      setPayments(paymentsData);
    } catch (err: any) {
      console.error("Error paying milestone:", err);
      toast({
        title: "Payment Failed",
        description:
          err.message || "Failed to process the payment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Release milestone payment
  const releaseMilestonePayment = async (milestone: any) => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Find the payment for this milestone
      const milestonePayment = payments.find(
        (p) => p.milestoneId === milestone.id
      );

      if (!milestonePayment) {
        toast({
          title: "Error",
          description: "No payment found for this milestone.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Update payment status to completed (release from escrow)
      await updateDoc(doc(db, "payments", milestonePayment.id), {
        status: "completed",
        completedAt: serverTimestamp(),
        escrow: {
          releasedAt: serverTimestamp(),
          releaseCondition: "milestone_completion_approval",
        },
      });

      // Add milestone payment release event
      await addDoc(collection(db, "contractEvents"), {
        contractId: contract.id,
        milestoneId: milestone.id,
        eventType: "milestone_payment_released",
        createdBy: user.userId,
        userType: "client",
        comment: comment || "Payment released to freelancer.",
        amount: milestone.amount,
        currency: contract.terms.currency,
        metadata: {
          paymentReleasedTo: contract.freelancerId,
          netAmount: milestone.amount * 0.9, // After platform fee
          platformFee: milestone.amount * 0.1, // 10% platform fee
        },
        createdAt: serverTimestamp(),
      });

      // Update UI state with latest contract data
      // Refresh contract data
      const contractRef = doc(db, "contracts", contract.id);
      const contractSnap = await getDoc(contractRef);
      if (contractSnap.exists()) {
        const contractData = contractSnap.data();
        const formattedContract = {
          id: contractSnap.id,
          ...contractData,
          terms: {
            ...contractData.terms,
            startDate: contractData.terms?.startDate?.toDate() || new Date(),
            endDate: contractData.terms?.endDate?.toDate() || new Date(),
          },
          milestones: Array.isArray(contractData.milestones)
            ? contractData.milestones.map((m: any) => ({
                ...m,
                dueDate: m.dueDate?.toDate() || new Date(),
              }))
            : [],
          createdAt: contractData.createdAt?.toDate() || new Date(),
          updatedAt: contractData.updatedAt?.toDate() || new Date(),
        };
        setContract(formattedContract);
      }

      // Refresh payments data
      const paymentsRef = query(
        collection(db, "payments"),
        where("contractId", "==", contract.id)
      );
      const paymentsSnap = await getDocs(paymentsRef);
      const paymentsData = paymentsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setPayments(paymentsData);

      // Refresh events data
      const eventsRef = query(
        collection(db, "contractEvents"),
        where("contractId", "==", contract.id),
        orderBy("createdAt", "desc")
      );
      const eventsSnap = await getDocs(eventsRef);
      const eventsData = eventsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setContractEvents(eventsData);

      toast({
        title: "Success",
        description: "Payment released successfully.",
      });
    } catch (error) {
      console.error("Error releasing payment:", error);
      toast({
        title: "Error",
        description: "Failed to release payment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setComment("");
    }
  };

  // Cancel contract
  const cancelContract = async () => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Update contract status
      await updateDoc(doc(db, "contracts", contract.id), {
        status: "cancelled",
        updatedAt: serverTimestamp(),
      });

      // Add contract cancellation record
      await addDoc(collection(db, "contractEvents"), {
        contractId: contract.id,
        eventType: "contract_cancelled",
        createdBy: user.userId,
        userType: "client",
        comment: comment || "Contract cancelled",
        createdAt: serverTimestamp(),
      });

      // Update contract in state
      setContract({
        ...contract,
        status: "cancelled",
      });

      toast({
        title: "Contract Cancelled",
        description: "The contract has been cancelled.",
      });

      setShowCancelDialog(false);
      setIsSubmitting(false);
      setComment("");
    } catch (err: any) {
      console.error("Error cancelling contract:", err);
      toast({
        title: "Error",
        description: "Failed to cancel the contract. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Edit contract - Navigate to edit page
  const editContract = () => {
    router.push(`/client/contracts/${contract.id}/edit?revise=true`);
  };

  // Pause contract
  const pauseContract = async () => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Update contract status
      await updateDoc(doc(db, "contracts", contract.id), {
        status: "paused",
        updatedAt: serverTimestamp(),
      });

      // Add contract pause record
      await addDoc(collection(db, "contractEvents"), {
        contractId: contract.id,
        eventType: "contract_paused",
        createdBy: user.userId,
        userType: "client",
        comment: comment || "Contract paused",
        createdAt: serverTimestamp(),
      });

      // Update contract in state
      setContract({
        ...contract,
        status: "paused",
      });

      toast({
        title: "Contract Paused",
        description: "The contract has been paused.",
      });

      setIsSubmitting(false);
      setComment("");
    } catch (err: any) {
      console.error("Error pausing contract:", err);
      toast({
        title: "Error",
        description: "Failed to pause the contract. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Resume contract
  const resumeContract = async () => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Update contract status
      await updateDoc(doc(db, "contracts", contract.id), {
        status: "active",
        updatedAt: serverTimestamp(),
      });

      // Add contract resume record
      await addDoc(collection(db, "contractEvents"), {
        contractId: contract.id,
        eventType: "contract_resumed",
        createdBy: user.userId,
        userType: "client",
        comment: comment || "Contract resumed",
        createdAt: serverTimestamp(),
      });

      // Update contract in state
      setContract({
        ...contract,
        status: "active",
      });

      toast({
        title: "Contract Resumed",
        description: "The contract is now active.",
      });

      setIsSubmitting(false);
      setComment("");
    } catch (err: any) {
      console.error("Error resuming contract:", err);
      toast({
        title: "Error",
        description: "Failed to resume the contract. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Approve milestone submission
  const approveMilestoneSubmission = async (milestone: any) => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Find the payment for this milestone
      const milestonePayment = payments.find(
        (p) => p.milestoneId === milestone.id
      );

      if (!milestonePayment) {
        toast({
          title: "Error",
          description: "No payment found for this milestone.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Update milestone status to completed but don't release payment yet
      const updatedMilestones = contract.milestones.map((m: any) => {
        if (m.id === milestone.id) {
          return { ...m, status: "completed", approvedAt: new Date() };
        }
        return m;
      });

      await updateDoc(doc(db, "contracts", contract.id), {
        milestones: updatedMilestones,
        updatedAt: serverTimestamp(),
      });

      // Add milestone approval event
      await addDoc(collection(db, "contractEvents"), {
        contractId: contract.id,
        milestoneId: milestone.id,
        eventType: "milestone_approved",
        createdBy: user.userId,
        userType: "client",
        comment: comment || "Work approved. Milestone completed.",
        amount: milestone.amount,
        currency: contract.terms.currency,
        metadata: {
          previousMilestoneStatus: "in_review",
          newMilestoneStatus: "completed",
        },
        createdAt: serverTimestamp(),
      });

      // Calculate progress
      const completedMilestones = updatedMilestones.filter(
        (m: any) => m.status === "completed"
      ).length;
      const progress = Math.floor(
        (completedMilestones / updatedMilestones.length) * 100
      );

      // Update contract progress
      await updateDoc(doc(db, "contracts", contract.id), {
        progress,
      });

      // If all milestones are complete, mark contract as completed
      const allComplete = updatedMilestones.every(
        (m: any) => m.status === "completed"
      );

      if (allComplete) {
        await updateDoc(doc(db, "contracts", contract.id), {
          status: "completed",
          completedAt: serverTimestamp(),
        });

        // Add contract completion event
        await addDoc(collection(db, "contractEvents"), {
          contractId: contract.id,
          eventType: "contract_completed",
          createdBy: user.userId,
          userType: "client",
          comment: "All milestones completed successfully. Excellent work!",
          metadata: {
            previousStatus: "active",
            newStatus: "completed",
            totalAmount: totalContractAmount,
            totalPaid: totalContractAmount,
            milestonesCompleted: updatedMilestones.length,
          },
          createdAt: serverTimestamp(),
        });

        setContract({
          ...contract,
          status: "completed",
          progress: 100,
          milestones: updatedMilestones,
        });
      }

      toast({
        title: "Milestone Approved",
        description:
          "Milestone has been approved. You can now release payment.",
      });

      setIsSubmitting(false);
      setComment("");
      setShowApproveDialog(false);
      setShowActivityApproveDialog(false);
    } catch (err: any) {
      console.error("Error approving milestone:", err);
      toast({
        title: "Error",
        description: "Failed to approve milestone. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Request milestone revision
  const requestMilestoneRevision = async (
    milestone: any,
    revisionComment: string
  ) => {
    if (!contract || !user?.userId || !revisionComment.trim()) return;

    try {
      setIsSubmitting(true);

      // Update milestone status back to active (needs revision)
      const updatedMilestones = contract.milestones.map((m: any) => {
        if (m.id === milestone.id) {
          return { ...m, status: "active" };
        }
        return m;
      });

      await updateDoc(doc(db, "contracts", contract.id), {
        milestones: updatedMilestones,
        updatedAt: serverTimestamp(),
      });

      // Add milestone revision request event
      await addDoc(collection(db, "contractEvents"), {
        contractId: contract.id,
        milestoneId: milestone.id,
        eventType: "milestone_rejected",
        createdBy: user.userId,
        userType: "client",
        comment: revisionComment,
        metadata: {
          previousStatus: "in_review",
          newStatus: "active",
          revisionNotes: revisionComment,
        },
        createdAt: serverTimestamp(),
      });

      setContract({
        ...contract,
        milestones: updatedMilestones,
      });

      toast({
        title: "Revision Requested",
        description:
          "The freelancer has been notified about the requested changes.",
      });

      setIsSubmitting(false);
      setComment("");
    } catch (err: any) {
      console.error("Error requesting revision:", err);
      toast({
        title: "Error",
        description: "Failed to request revision. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Handle payment method changes
  const handlePaymentChange = (field: string, value: any) => {
    setPaymentMethod((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate mobile money phone number when phone or country changes
    if (field === "phoneNumber" || field === "countryCode") {
      const phoneNumber =
        field === "phoneNumber" ? value : paymentMethod.phoneNumber;
      const countryCode =
        field === "countryCode" ? value : paymentMethod.countryCode;
      const provider = paymentMethod.type as "mtn_momo" | "orange_momo";

      if (
        phoneNumber &&
        countryCode &&
        (provider === "mtn_momo" || provider === "orange_momo")
      ) {
        validatePhoneNumber(phoneNumber, countryCode, provider);
      } else {
        setPhoneValidation({ isValid: false, error: "", formattedPhone: "" });
      }
    }

    // Auto-detect provider and validate when provider type changes
    if (field === "type" && (value === "mtn_momo" || value === "orange_momo")) {
      if (paymentMethod.phoneNumber && paymentMethod.countryCode) {
        // Check if current provider is available in selected country
        if (!isProviderAvailableInCountry(paymentMethod.countryCode, value)) {
          // Reset to a country where this provider is available
          const availableCountries = getAvailableCountries(value);
          if (availableCountries.length > 0) {
            const newCountryCode = availableCountries[0].code;
            setPaymentMethod((prev) => ({
              ...prev,
              [field]: value,
              countryCode: newCountryCode,
              phoneNumber: "", // Reset phone number
            }));
            setPhoneValidation({
              isValid: false,
              error: "",
              formattedPhone: "",
            });
            return;
          }
        }
        validatePhoneNumber(
          paymentMethod.phoneNumber,
          paymentMethod.countryCode,
          value
        );
      }
    }
  };

  // Validate mobile money phone number
  const validatePhoneNumber = (
    phoneNumber: string,
    countryCode: string,
    provider: "mtn_momo" | "orange_momo"
  ) => {
    if (!phoneNumber) {
      setPhoneValidation({ isValid: false, error: "", formattedPhone: "" });
      return;
    }

    const validation = validateMobileMoneyPayment(
      phoneNumber,
      countryCode,
      provider
    );

    if (validation.isValid) {
      setPhoneValidation({
        isValid: true,
        error: "",
        formattedPhone: validation.formattedPhone || "",
      });

      // Auto-detect and update provider if different
      if (
        validation.detectedProvider &&
        validation.detectedProvider !== provider
      ) {
        setPaymentMethod((prev) => ({
          ...prev,
          type: validation.detectedProvider!,
          mobileProvider: validation.detectedProvider!,
        }));
      }
    } else {
      setPhoneValidation({
        isValid: false,
        error: validation.error || "Invalid phone number",
        formattedPhone: "",
      });
    }
  };

  // Calculate total paid amount
  const totalPaid = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount.gross, 0);

  // Calculate total in escrow
  const totalInEscrow = payments
    .filter((payment) => payment.status === "escrowed")
    .reduce((sum, payment) => sum + payment.amount.gross, 0);

  // Calculate remaining amount
  const totalAmount = totalContractAmount; // Use calculated total from milestones
  const remainingAmount = totalAmount - totalPaid - totalInEscrow;

  // Pay milestone
  // const payMilestone = async () => {
  //   if (!contract || !selectedMilestone || !user?.userId) return;

  //   // Validate payment method based on type
  //   if (
  //     paymentMethod.type === "mtn_momo" ||
  //     paymentMethod.type === "orange_momo"
  //   ) {
  //     if (!paymentMethod.phoneNumber || paymentMethod.phoneNumber.length < 8) {
  //       toast({
  //         title: "Error",
  //         description:
  //           "Please enter a valid phone number for mobile money payment.",
  //         variant: "destructive",
  //       });
  //       return;
  //     }
  //     if (!paymentMethod.countryCode) {
  //       toast({
  //         title: "Error",
  //         description: "Please select a country code for mobile money payment.",
  //         variant: "destructive",
  //       });
  //       return;
  //     }
  //   } else if (paymentMethod.type === "card") {
  //     if (
  //       !paymentMethod.cardNumber ||
  //       !paymentMethod.cardName ||
  //       !paymentMethod.expiryMonth ||
  //       !paymentMethod.expiryYear ||
  //       !paymentMethod.cvc
  //     ) {
  //       toast({
  //         title: "Error",
  //         description: "Please fill in all card details.",
  //         variant: "destructive",
  //       });
  //       return;
  //     }
  //   }

  //   try {
  //     setIsSubmitting(true);

  //     // Prepare payment method data based on type
  //     let paymentMethodData: any = {
  //       type: paymentMethod.type,
  //       provider: "bizzlink", // Default provider
  //     };

  //     // Handle different payment method types
  //     switch (paymentMethod.type) {
  //       case "mtn_momo":
  //         paymentMethodData = {
  //           type: "mtn_momo",
  //           countryCode: paymentMethod.countryCode,
  //           phoneNumber: paymentMethod.phoneNumber,
  //           provider: "mtn_momo",
  //           last4: paymentMethod.phoneNumber.slice(-4), // Last 4 digits of phone
  //         };
  //         break;
  //       case "orange_momo":
  //         paymentMethodData = {
  //           type: "orange_momo",
  //           countryCode: paymentMethod.countryCode,
  //           phoneNumber: paymentMethod.phoneNumber,
  //           provider: "orange_momo",
  //           last4: paymentMethod.phoneNumber.slice(-4), // Last 4 digits of phone
  //         };
  //         break;
  //       case "card":
  //         paymentMethodData = {
  //           type: "card",
  //           last4: paymentMethod.cardNumber.slice(-4),
  //           provider: "stripe",
  //         };
  //         break;
  //     }

  //     // Create payment record
  //     const paymentRef = await addDoc(collection(db, "payments"), {
  //       contractId: contract.id,
  //       milestoneId: selectedMilestone.id,
  //       clientId: user.userId,
  //       freelancerId: contract.freelancerId,

  //       amount: {
  //         gross: Number(selectedMilestone.amount),
  //         fee: Number(selectedMilestone.amount) * 0.1, // 10% platform fee
  //         net: Number(selectedMilestone.amount) * 0.9,
  //         currency: contract.terms.currency,
  //       },

  //       status: "escrowed", // Payment is in escrow until milestone is completed
  //       type: "milestone",

  //       paymentMethod: paymentMethodData,

  //       // Add mobile money specific fields if applicable
  //       ...(paymentMethod.type === "mtn_momo" ||
  //       paymentMethod.type === "orange_momo"
  //         ? {
  //             mobileMoneyDetails: {
  //               countryCode: paymentMethod.countryCode,
  //               phoneNumber: paymentMethod.phoneNumber,
  //               fullPhoneNumber: `${paymentMethod.countryCode}${paymentMethod.phoneNumber}`,
  //               provider: paymentMethod.type,
  //             },
  //           }
  //         : {}),

  //       createdAt: serverTimestamp(),
  //     });

  //     // Update milestone status
  //     const updatedMilestones = contract.milestones.map((milestone: any) => {
  //       if (milestone.id === selectedMilestone.id) {
  //         return { ...milestone, status: "active" };
  //       }
  //       return milestone;
  //     });

  //     await updateDoc(doc(db, "contracts", contract.id), {
  //       milestones: updatedMilestones,
  //       updatedAt: serverTimestamp(),
  //     });

  //     // Update contract in state
  //     setContract({
  //       ...contract,
  //       milestones: updatedMilestones,
  //     });

  //     // Add payment event
  //     await addDoc(collection(db, "contractEvents"), {
  //       contractId: contract.id,
  //       milestoneId: selectedMilestone.id,
  //       eventType: "milestone_funded",
  //       createdBy: user.userId,
  //       userType: "client",
  //       comment: `Funded milestone: ${selectedMilestone.title}`,
  //       amount: selectedMilestone.amount,
  //       currency: contract.terms.currency,
  //       createdAt: serverTimestamp(),
  //     });

  //     // Show success message based on payment method
  //     const paymentMethodName =
  //       paymentMethod.type === "mtn_momo"
  //         ? "MTN Mobile Money"
  //         : paymentMethod.type === "orange_momo"
  //         ? "Orange Money"
  //         : paymentMethod.type === "card"
  //         ? "Card"
  //         : "Payment method";

  //     toast({
  //       title: "Payment Successful",
  //       description: `Milestone payment has been placed in escrow using ${paymentMethodName}.`,
  //     });

  //     setShowPayDialog(false);
  //     setIsSubmitting(false);
  //     setSelectedMilestone(null);

  //     // Refresh payments data
  //     const paymentsRef = query(
  //       collection(db, "payments"),
  //       where("contractId", "==", params.id)
  //     );
  //     const paymentsSnap = await getDocs(paymentsRef);

  //     const paymentsData = paymentsSnap.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //       createdAt: doc.data().createdAt?.toDate() || new Date(),
  //     }));

  //     setPayments(paymentsData);
  //   } catch (err: any) {
  //     console.error("Error paying milestone:", err);
  //     toast({
  //       title: "Payment Failed",
  //       description: "Failed to process the payment. Please try again.",
  //       variant: "destructive",
  //     });
  //     setIsSubmitting(false);
  //   }
  // };

  // Get milestone status display
  const getMilestoneStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          color: "bg-gray-100 text-gray-800",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "active":
        return {
          label: "Active",
          color: "bg-blue-100 text-blue-800",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "in_review":
        return {
          label: "In Review",
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
        };
    }
  };

  // Check if milestone has payment - using both milestoneId and contractId to avoid ambiguity across contracts
  const hasMilestonePayment = (milestoneId: string) => {
    return payments.some(
      (payment) =>
        payment.milestoneId === milestoneId &&
        payment.contractId === contract.id &&
        payment.status !== "failed"
    );
  };

  // Get contract status display
  const getStatusDisplay = () => {
    switch (contract?.status) {
      case "pending_acceptance":
        return {
          label: "Pending Acceptance",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <Clock className="h-4 w-4 mr-1" />,
          description: "Waiting for freelancer to accept the contract",
        };
      case "active":
        return {
          label: "Active",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          description: "Contract is currently active",
        };
      case "paused":
        return {
          label: "Paused",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          description: "Contract has been paused temporarily",
        };
      case "revision_requested":
        return {
          label: "Revision Requested",
          color: "bg-orange-100 text-orange-800 border-orange-200",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          description: "Freelancer has requested contract revisions",
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          description: "Contract has been completed successfully",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="h-4 w-4 mr-1" />,
          description: "Contract has been cancelled",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          description: "Unknown contract status",
        };
    }
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
              Please wait while we fetch the contract details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Error Loading Contract
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
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

  // No contract found
  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Contract Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The contract you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button onClick={() => router.push("/client/contracts")}>
              Go Back to Contracts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 p-0"
              onClick={() => router.push("/client/contracts")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Contracts
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project?.title || "Contract"}
              </h1>
              <div className="flex items-center mt-2">
                <Badge
                  className={statusDisplay.color + " text-sm py-1 px-3 mr-3"}
                >
                  {statusDisplay.icon}
                  {statusDisplay.label}
                </Badge>
                <span className="text-gray-600">
                  {statusDisplay.description}
                </span>
              </div>
            </div>

            {/* Contract Actions */}
            <div className="flex flex-wrap gap-3">
              {contract.status === "pending_acceptance" && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Waiting for freelancer response
                  </span>
                </div>
              )}

              {contract.status === "revision_requested" && (
                <Button
                  onClick={editContract}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Revise Contract
                </Button>
              )}

              {(contract.status === "pending_acceptance" ||
                contract.status === "revision_requested") && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel Contract
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Contract?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel this contract? This
                        action cannot be undone.
                        {contract.status === "pending_acceptance"
                          ? " The freelancer will be notified that the contract offer has been withdrawn."
                          : " This will end the contract negotiation process."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Contract</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={cancelContract}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>Cancel Contract</>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {contract.status === "active" && (
                <>
                  <Button
                    variant="outline"
                    onClick={pauseContract}
                    disabled={isSubmitting}
                  >
                    <PauseCircle className="h-4 w-4 mr-1" />
                    Pause Contract
                  </Button>
                  <Button
                    onClick={() => setShowRatingModal(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {existingReview ? "Edit Review" : "Rate Freelancer"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel Contract
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cancelling this contract will immediately terminate
                          the agreement with your freelancer. Any funds in
                          escrow will be returned to you.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-4">
                        <Label htmlFor="comment">
                          Reason for cancellation (optional)
                        </Label>
                        <Textarea
                          id="comment"
                          placeholder="Explain why you're cancelling this contract..."
                          className="mt-2"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setComment("")}>
                          Nevermind
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={cancelContract}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                              Processing
                            </>
                          ) : (
                            <>Cancel Contract</>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {contract.status === "paused" && (
                <Button onClick={resumeContract} disabled={isSubmitting}>
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Resume Contract
                </Button>
              )}

              {(contract.status === "completed" ||
                contract.status === "cancelled") && (
                <>
                  {contract.status === "completed" && (
                    <Button
                      onClick={() => setShowRatingModal(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      {existingReview ? "Edit Review" : "Rate Freelancer"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => router.push("/client/projects")}
                  >
                    Create New Project
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                onClick={() =>
                  router.push(
                    `/messages?user=${contract.freelancerId}&proposal=${contract.proposalId}`
                  )
                }
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message Freelancer
              </Button>
            </div>
          </div>
        </div>

        {/* Contract Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Freelancer Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Freelancer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage
                    src={freelancer?.photoURL || ""}
                    alt={freelancer?.displayName}
                  />
                  <AvatarFallback>
                    {freelancer?.displayName?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">
                    {freelancer?.displayName || "Freelancer"}
                  </h3>
                  <div className="text-gray-500">
                    {freelancer?.title || "Professional Freelancer"}
                  </div>
                </div>
              </div>
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(`/profile/${contract.freelancerId}`)
                  }
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contract Details Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Contract Type</div>
                <div className="font-medium">
                  {contract.terms.paymentType === "fixed"
                    ? "Fixed Price"
                    : "Hourly Rate"}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Total Amount</div>
                <div className="font-medium">
                  {contract.terms.currency}{" "}
                  {totalContractAmount.toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Start Date</div>
                <div className="font-medium">
                  {format(new Date(contract.terms.startDate), "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">End Date</div>
                <div className="font-medium">
                  {format(new Date(contract.terms.endDate), "MMM d, yyyy")}
                </div>
              </div>
              {contract.terms.paymentType === "hourly" && (
                <div className="flex justify-between items-center">
                  <div className="text-gray-500">Weekly Hour Limit</div>
                  <div className="font-medium">
                    {contract.terms.workingHoursPerWeek} hours
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Summary Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Total Contract Value</div>
                <div className="font-medium">
                  {contract.terms.currency} {totalAmount.toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Paid to Freelancer</div>
                <div className="font-medium text-green-600">
                  {contract.terms.currency} {totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">In Escrow</div>
                <div className="font-medium text-blue-600">
                  {contract.terms.currency} {totalInEscrow.toLocaleString()}
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="text-gray-900 font-medium">Remaining</div>
                <div className="font-bold">
                  {contract.terms.currency} {remainingAmount.toLocaleString()}
                </div>
              </div>

              {/* Project Progress */}
              <div className="pt-2">
                <div className="flex justify-between mb-1">
                  <div className="text-sm text-gray-500">Project Progress</div>
                  <div className="text-sm font-medium">
                    {contract.progress || 0}%
                  </div>
                </div>
                <Progress value={contract.progress || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Tabs */}
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Overview</CardTitle>
                <CardDescription>
                  Summary of your contract with{" "}
                  {freelancer?.displayName || "the freelancer"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Description */}
                <div>
                  <h3 className="font-medium text-lg mb-2">
                    Project Description
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                    {project?.description || "No project description available"}
                  </div>
                </div>

                {/* Milestones Summary */}
                <div>
                  <h3 className="font-medium text-lg mb-4">Milestones</h3>
                  <div className="space-y-4">
                    {contract.milestones.map(
                      (milestone: any, index: number) => {
                        const statusDisplay = getMilestoneStatusDisplay(
                          milestone.status
                        );
                        return (
                          <div
                            key={milestone.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                          >
                            <div className="flex justify-between mb-3">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                Milestone {index + 1}
                              </Badge>
                              <Badge className={statusDisplay.color}>
                                {statusDisplay.icon}
                                {statusDisplay.label}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="font-medium text-lg">
                                {milestone.title}
                              </div>
                              <div className="text-gray-700 text-sm">
                                {milestone.description}
                              </div>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm pt-1">
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="font-medium">
                                    {contract.terms.currency}{" "}
                                    {milestone.amount.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                  <span>
                                    Due:{" "}
                                    {format(
                                      new Date(milestone.dueDate),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Milestone Actions */}
                            {contract.status === "active" && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {milestone.status === "pending" &&
                                  !hasMilestonePayment(milestone.id) && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setSelectedMilestone(milestone);
                                        setShowPayDialog(true);
                                      }}
                                    >
                                      Fund
                                    </Button>
                                  )}

                                {milestone.status === "completed" &&
                                  hasMilestonePayment(milestone.id) &&
                                  payments.find(
                                    (p) => p.milestoneId === milestone.id
                                  )?.status !== "completed" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-green-500 text-green-600 hover:bg-green-50"
                                      onClick={() =>
                                        releaseMilestonePayment(milestone)
                                      }
                                      disabled={isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                          Processing
                                        </>
                                      ) : (
                                        <>Release Payment</>
                                      )}
                                    </Button>
                                  )}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle>Milestones & Deliverables</CardTitle>
                <CardDescription>
                  Track the progress of each milestone and manage payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.milestones.map((milestone: any) => {
                      const statusDisplay = getMilestoneStatusDisplay(
                        milestone.status
                      );
                      const payment = payments.find(
                        (p) => p.milestoneId === milestone.id
                      );

                      return (
                        <TableRow key={milestone.id}>
                          <TableCell>
                            <div className="font-medium">{milestone.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {milestone.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(milestone.dueDate), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {contract.terms.currency}{" "}
                            {milestone.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusDisplay.color}>
                              {statusDisplay.icon}
                              {statusDisplay.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment ? (
                              <Badge
                                className={
                                  payment.status === "escrowed"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : payment.status === "completed"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                }
                              >
                                {payment.status === "escrowed" && (
                                  <Shield className="h-3.5 w-3.5 mr-1" />
                                )}
                                {payment.status === "completed" && (
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                )}
                                {payment.status === "escrowed"
                                  ? "In Escrow"
                                  : payment.status === "completed"
                                  ? "Paid"
                                  : payment.status}
                              </Badge>
                            ) : (
                              <Badge variant="outline">Not Funded</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {contract.status === "active" && (
                              <div className="flex gap-2 justify-end">
                                {milestone.status === "pending" &&
                                  !hasMilestonePayment(milestone.id) && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedMilestone(milestone);
                                        setShowPayDialog(true);
                                      }}
                                    >
                                      Fund
                                    </Button>
                                  )}

                                {milestone.status === "in_review" &&
                                  hasMilestonePayment(milestone.id) && (
                                    <>
                                      <Dialog
                                        open={showApproveDialog}
                                        onOpenChange={setShowApproveDialog}
                                      >
                                        <DialogTrigger asChild>
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              setSelectedMilestone(milestone);
                                              setComment("");
                                              setShowApproveDialog(true);
                                            }}
                                          >
                                            Approve
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Approve Milestone
                                            </DialogTitle>
                                            <DialogDescription>
                                              Approve the work for "
                                              {milestone.title}". You'll be able
                                              to release payment separately
                                              after approval.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="py-4">
                                            <label
                                              htmlFor="approval-comment"
                                              className="text-sm font-medium"
                                            >
                                              Approval Comment (optional)
                                            </label>
                                            <Textarea
                                              id="approval-comment"
                                              placeholder="Leave feedback about the work quality..."
                                              className="mt-2"
                                              value={comment}
                                              onChange={(e) =>
                                                setComment(e.target.value)
                                              }
                                            />
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              variant="outline"
                                              onClick={() => {
                                                setComment("");
                                                setShowApproveDialog(false);
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              onClick={() => {
                                                if (selectedMilestone) {
                                                  approveMilestoneSubmission(
                                                    selectedMilestone
                                                  );
                                                }
                                              }}
                                              disabled={isSubmitting}
                                            >
                                              {isSubmitting ? (
                                                <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Approving
                                                </>
                                              ) : (
                                                "Approve Work"
                                              )}
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>

                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              setSelectedMilestone(milestone);
                                              setComment("");
                                            }}
                                          >
                                            Request Revision
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Request Revision
                                            </DialogTitle>
                                            <DialogDescription>
                                              Request changes to "
                                              {milestone.title}". The work will
                                              be sent back to the freelancer for
                                              revision.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="py-4">
                                            <label
                                              htmlFor="revision-comment"
                                              className="text-sm font-medium"
                                            >
                                              Revision Notes (required)
                                            </label>
                                            <Textarea
                                              id="revision-comment"
                                              placeholder="Please describe what needs to be changed or improved..."
                                              className="mt-2"
                                              value={comment}
                                              onChange={(e) =>
                                                setComment(e.target.value)
                                              }
                                              required
                                            />
                                          </div>
                                          <DialogFooter>
                                            <Button
                                              variant="outline"
                                              onClick={() => setComment("")}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              variant="destructive"
                                              onClick={() => {
                                                if (
                                                  selectedMilestone &&
                                                  comment.trim()
                                                ) {
                                                  requestMilestoneRevision(
                                                    selectedMilestone,
                                                    comment
                                                  );
                                                }
                                              }}
                                              disabled={
                                                isSubmitting || !comment.trim()
                                              }
                                            >
                                              {isSubmitting ? (
                                                <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Requesting
                                                </>
                                              ) : (
                                                "Request Revision"
                                              )}
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </>
                                  )}

                                {milestone.status === "active" &&
                                  hasMilestonePayment(milestone.id) && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled
                                    >
                                      In Progress
                                    </Button>
                                  )}
                              </div>
                            )}

                            {milestone.status === "completed" && (
                              <div className="flex gap-2 items-center">
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  Completed
                                </Badge>

                                {/* Check if payment has not been released yet */}
                                {hasMilestonePayment(milestone.id) &&
                                  payments.find(
                                    (p) => p.milestoneId === milestone.id
                                  )?.status !== "completed" && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-green-500 text-green-600 hover:bg-green-50"
                                          onClick={() => {
                                            setSelectedMilestone(milestone);
                                            setComment("");
                                          }}
                                        >
                                          Release Payment
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Release Payment
                                          </DialogTitle>
                                          <DialogDescription>
                                            Release payment for "
                                            {milestone.title}" to the
                                            freelancer. The freelancer will
                                            receive 90% ($
                                            {(milestone.amount * 0.9).toFixed(
                                              2
                                            )}
                                            ) of the milestone amount. 10% ($
                                            {(milestone.amount * 0.1).toFixed(
                                              2
                                            )}
                                            ) is the BizzLink platform fee.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                          <label
                                            htmlFor="payment-comment"
                                            className="text-sm font-medium"
                                          >
                                            Payment Comment (optional)
                                          </label>
                                          <Textarea
                                            id="payment-comment"
                                            placeholder="Add a comment for this payment release..."
                                            className="mt-2"
                                            value={comment}
                                            onChange={(e) =>
                                              setComment(e.target.value)
                                            }
                                          />
                                        </div>
                                        <DialogFooter>
                                          <Button
                                            variant="outline"
                                            onClick={() => setComment("")}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              if (selectedMilestone) {
                                                releaseMilestonePayment(
                                                  selectedMilestone
                                                );
                                              }
                                            }}
                                            disabled={isSubmitting}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            {isSubmitting ? (
                                              <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing
                                              </>
                                            ) : (
                                              "Release Payment"
                                            )}
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}

                                {/* Show if payment has been released */}
                                {hasMilestonePayment(milestone.id) &&
                                  payments.find(
                                    (p) => p.milestoneId === milestone.id
                                  )?.status === "completed" && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                      Paid
                                    </Badge>
                                  )}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Record of all payments related to this contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No Payments Yet
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mt-2">
                      When you make payments for milestones, they will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .map((payment) => {
                          // Find the corresponding milestone
                          const milestone = contract.milestones.find(
                            (m: any) => m.id === payment.milestoneId
                          );

                          return (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {format(
                                  new Date(payment.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {milestone
                                    ? `Payment for: ${milestone.title}`
                                    : "Contract Payment"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {payment.status === "completed"
                                    ? "Paid to freelancer"
                                    : "Held in escrow"}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {payment.amount.currency}{" "}
                                {payment.amount.gross.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    payment.status === "escrowed"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : payment.status === "completed"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : payment.status === "pending"
                                      ? "bg-amber-100 text-amber-800 border-amber-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                >
                                  {payment.status === "escrowed" && (
                                    <Shield className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {payment.status === "completed" && (
                                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {payment.status === "pending" && (
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {payment.paymentMethod?.type === "card" && (
                                    <div className="w-8 h-5 bg-blue-100 rounded flex items-center justify-center text-xs font-medium text-blue-800 mr-2">
                                      Visa
                                    </div>
                                  )}
                                  {payment.paymentMethod?.type === "paypal" && (
                                    <div className="w-12 h-5 bg-blue-500 rounded flex items-center justify-center text-xs font-medium text-white mr-2">
                                      PayPal
                                    </div>
                                  )}
                                  {payment.paymentMethod?.type ===
                                    "mtn_momo" && (
                                    <div className="w-12 h-5 bg-yellow-400 rounded flex items-center justify-center text-xs font-bold text-black mr-2">
                                      MTN
                                    </div>
                                  )}
                                  {payment.paymentMethod?.type ===
                                    "orange_momo" && (
                                    <div className="w-12 h-5 bg-orange-500 rounded flex items-center justify-center text-xs font-bold text-white mr-2">
                                      Orange
                                    </div>
                                  )}
                                  {payment.paymentMethod?.last4 && (
                                    <span className="text-sm text-gray-600">
                                      {payment.paymentMethod?.type ===
                                        "mtn_momo" ||
                                      payment.paymentMethod?.type ===
                                        "orange_momo"
                                        ? `Ending in ${payment.paymentMethod.last4}`
                                        : `Ending in ${payment.paymentMethod.last4}`}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Contract Activity & Submissions</CardTitle>
                <CardDescription>
                  Track milestone submissions and other contract events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contractEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      No Activity Yet
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mt-2">
                      When milestones are submitted or other actions are taken,
                      they will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {contractEvents.map((event) => {
                      const eventDate = event.createdAt
                        ? format(
                            new Date(event.createdAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )
                        : "";

                      return (
                        <div
                          key={event.id}
                          className="border rounded-lg p-4 relative"
                        >
                          {/* Event Header */}
                          <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                            <div className="flex items-center mb-2 sm:mb-0">
                              {event.eventType === "milestone_submitted" && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-1 sm:mb-0 mr-2">
                                  Milestone Submitted
                                </Badge>
                              )}

                              {event.eventType === "milestone_approved" && (
                                <Badge className="bg-green-100 text-green-800 border-green-200 mb-1 sm:mb-0 mr-2">
                                  Milestone Approved
                                </Badge>
                              )}

                              {(event.eventType === "milestone_rejected" ||
                                event.eventType === "revision_requested") && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-1 sm:mb-0 mr-2">
                                  Revision Requested
                                </Badge>
                              )}

                              {event.eventType ===
                                "milestone_payment_released" && (
                                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 mb-1 sm:mb-0 mr-2">
                                  Payment Released
                                </Badge>
                              )}

                              {event.eventType === "milestone_funded" && (
                                <Badge className="bg-purple-100 text-purple-800 border-purple-200 mb-1 sm:mb-0 mr-2">
                                  Milestone Funded
                                </Badge>
                              )}
                            </div>
                            <span className="text-gray-500 text-sm">
                              {eventDate}
                            </span>
                          </div>

                          {/* Event Description */}
                          <div className="mb-3">
                            <p className="text-gray-700">
                              {event.comment || "No comment provided"}
                            </p>
                          </div>

                          {/* Milestone Submissions */}
                          {event.eventType === "milestone_submitted" &&
                            event.metadata &&
                            event.metadata.submissionDetails && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">
                                  Submission Details
                                </h4>

                                {/* Milestone Title */}
                                {event.milestoneId && contract?.milestones && (
                                  <div className="mb-2">
                                    <p className="text-xs text-blue-700 mb-1">
                                      Milestone:
                                    </p>
                                    <p className="text-sm font-medium">
                                      {contract.milestones.find(
                                        (m: any) => m.id === event.milestoneId
                                      )?.title || "Unknown Milestone"}
                                    </p>
                                  </div>
                                )}

                                {/* Submission Description */}
                                {event.metadata.submissionDetails
                                  .description && (
                                  <div className="mb-3">
                                    <p className="text-xs text-blue-700 mb-1">
                                      Description:
                                    </p>
                                    <p className="text-sm bg-white p-2 rounded border border-blue-100">
                                      {
                                        event.metadata.submissionDetails
                                          .description
                                      }
                                    </p>
                                  </div>
                                )}

                                {/* Submission Links */}
                                {event.metadata.submissionDetails.links &&
                                  event.metadata.submissionDetails.links
                                    .length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-xs text-blue-700 mb-1">
                                        Links:
                                      </p>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {event.metadata.submissionDetails.links.map(
                                          (link: string, linkIdx: number) => (
                                            <li
                                              key={linkIdx}
                                              className="text-sm"
                                            >
                                              <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                              >
                                                {link}
                                              </a>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {/* Submission Files */}
                                {event.metadata.submissionDetails.files &&
                                  event.metadata.submissionDetails.files
                                    .length > 0 && (
                                    <div>
                                      <p className="text-xs text-blue-700 mb-1">
                                        Files:
                                      </p>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {event.metadata.submissionDetails.files.map(
                                          (file: any, fileIdx: number) => (
                                            <li
                                              key={fileIdx}
                                              className="text-sm"
                                            >
                                              <a
                                                href={file.fileUrl || file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline flex items-center"
                                              >
                                                <FileText className="w-4 h-4 mr-1" />
                                                {file.fileName ||
                                                  file.name ||
                                                  "Download File"}
                                              </a>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {/* Actions for in_review milestones */}
                                {event.eventType === "milestone_submitted" &&
                                  event.milestoneId &&
                                  contract?.milestones &&
                                  contract.milestones.find(
                                    (m: any) => m.id === event.milestoneId
                                  )?.status === "in_review" && (
                                    <div className="mt-4 pt-3 border-t border-blue-200">
                                      <div className="flex flex-wrap gap-2">
                                        <Dialog
                                          open={showActivityApproveDialog}
                                          onOpenChange={
                                            setShowActivityApproveDialog
                                          }
                                        >
                                          <DialogTrigger asChild>
                                            <Button
                                              size="sm"
                                              onClick={() => {
                                                setComment("");
                                                setShowActivityApproveDialog(
                                                  true
                                                );
                                              }}
                                            >
                                              Approve
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Approve Milestone
                                              </DialogTitle>
                                              <DialogDescription>
                                                Approve the work for this
                                                milestone. You'll be able to
                                                release payment separately after
                                                approval.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-4">
                                              <label
                                                htmlFor="approval-comment-dialog"
                                                className="text-sm font-medium"
                                              >
                                                Approval Comment (optional)
                                              </label>
                                              <Textarea
                                                id="approval-comment-dialog"
                                                placeholder="Leave feedback about the work quality..."
                                                className="mt-2"
                                                value={comment}
                                                onChange={(e) =>
                                                  setComment(e.target.value)
                                                }
                                              />
                                            </div>
                                            <DialogFooter>
                                              <Button
                                                variant="outline"
                                                onClick={() => {
                                                  setComment("");
                                                  setShowActivityApproveDialog(
                                                    false
                                                  );
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                onClick={() => {
                                                  const milestone =
                                                    contract.milestones.find(
                                                      (m: any) =>
                                                        m.id ===
                                                        event.milestoneId
                                                    );
                                                  if (milestone) {
                                                    approveMilestoneSubmission(
                                                      milestone
                                                    );
                                                  }
                                                }}
                                                disabled={isSubmitting}
                                              >
                                                {isSubmitting ? (
                                                  <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Approving
                                                  </>
                                                ) : (
                                                  "Approve Work"
                                                )}
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>

                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                              Request Revision
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>
                                                Request Revision
                                              </DialogTitle>
                                              <DialogDescription>
                                                Request changes to the submitted
                                                milestone.
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-4">
                                              <label
                                                htmlFor="revision-comment-dialog"
                                                className="text-sm font-medium"
                                              >
                                                Revision Notes (required)
                                              </label>
                                              <Textarea
                                                id="revision-comment-dialog"
                                                placeholder="Explain what changes are needed..."
                                                className="mt-2"
                                                value={comment}
                                                onChange={(e) =>
                                                  setComment(e.target.value)
                                                }
                                              />
                                            </div>
                                            <DialogFooter>
                                              <Button
                                                variant="outline"
                                                onClick={() => setComment("")}
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                onClick={() => {
                                                  const milestone =
                                                    contract.milestones.find(
                                                      (m: any) =>
                                                        m.id ===
                                                        event.milestoneId
                                                    );
                                                  if (
                                                    milestone &&
                                                    comment.trim()
                                                  ) {
                                                    requestMilestoneRevision(
                                                      milestone,
                                                      comment
                                                    );
                                                  } else {
                                                    toast({
                                                      title: "Error",
                                                      description:
                                                        "Please provide revision notes.",
                                                      variant: "destructive",
                                                    });
                                                  }
                                                }}
                                                disabled={
                                                  isSubmitting ||
                                                  !comment.trim()
                                                }
                                                variant="secondary"
                                              >
                                                {isSubmitting ? (
                                                  <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Requesting Revision
                                                  </>
                                                ) : (
                                                  "Request Revision"
                                                )}
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            )}

                          {/* Payment Release Details */}
                          {event.eventType === "milestone_payment_released" &&
                            event.metadata && (
                              <div className="mt-2 text-sm text-gray-600">
                                <p>
                                  Amount: {contract.terms.currency}{" "}
                                  {event.amount?.toLocaleString()}
                                </p>
                                {event.metadata.netAmount && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Freelancer received:{" "}
                                    {contract.terms.currency}{" "}
                                    {event.metadata.netAmount?.toLocaleString()}
                                    (after 10% platform fee)
                                  </p>
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fund Milestone Dialog */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent className="sm:max-w-md h-[90vh] flex flex-col p-0">
          <div className="flex-shrink-0 p-6 pb-0">
            <DialogHeader>
              <DialogTitle>Fund Milestone</DialogTitle>
              <DialogDescription>
                Your payment will be held in escrow until you approve the
                completed work. The milestone will become active once funded.
              </DialogDescription>
            </DialogHeader>
          </div>

          {selectedMilestone && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Milestone Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-500">Title:</span>{" "}
                      {selectedMilestone.title}
                    </div>
                    <div>
                      <span className="text-gray-500">Description:</span>{" "}
                      {selectedMilestone.description}
                    </div>
                    <div>
                      <span className="text-gray-500">Due Date:</span>{" "}
                      {format(
                        new Date(selectedMilestone.dueDate),
                        "MMM d, yyyy"
                      )}
                    </div>
                    <div className="font-medium">
                      <span className="text-gray-500">Amount:</span>{" "}
                      {contract.terms.currency}{" "}
                      {selectedMilestone.amount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Select Payment Method
                    </Label>
                    <RadioGroup
                      value={paymentMethod.type}
                      onValueChange={(value) => {
                        handlePaymentChange("type", value);
                        // Update mobileProvider when selecting MTN or Orange
                        if (value === "mtn_momo") {
                          handlePaymentChange("mobileProvider", "mtn_momo");
                        } else if (value === "orange_momo") {
                          handlePaymentChange("mobileProvider", "orange_momo");
                        }
                      }}
                      className="space-y-2"
                    >
                      {/* MTN Mobile Money - Default */}
                      <div className="flex items-center space-x-3 border-2 border-amber-300 bg-amber-50 rounded-lg p-3 cursor-pointer hover:bg-amber-100">
                        <RadioGroupItem value="mtn_momo" id="mtn_momo_dialog" />
                        <Label
                          htmlFor="mtn_momo_dialog"
                          className="flex-1 cursor-pointer font-medium text-sm"
                        >
                          MTN Mobile Money
                        </Label>
                        <div className="w-12 h-6 bg-yellow-400 rounded flex items-center justify-center text-xs font-bold text-black">
                          MTN
                        </div>
                      </div>

                      {/* Orange Mobile Money */}
                      <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem
                          value="orange_momo"
                          id="orange_momo_dialog"
                        />
                        <Label
                          htmlFor="orange_momo_dialog"
                          className="flex-1 cursor-pointer text-sm"
                        >
                          Orange Money
                        </Label>
                        <div className="w-12 h-6 bg-orange-500 rounded flex items-center justify-center text-xs font-bold text-white">
                          Orange
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="card" id="card_dialog" />
                        <Label
                          htmlFor="card_dialog"
                          className="flex-1 cursor-pointer text-sm"
                        >
                          Credit/Debit Card
                        </Label>
                        <div className="flex space-x-1">
                          <div className="w-8 h-5 bg-blue-100 rounded flex items-center justify-center text-xs font-medium text-blue-800 mr-2">
                            Visa
                          </div>
                          <div className="w-8 h-5 bg-red-100 rounded flex items-center justify-center text-xs font-medium text-red-800 mr-2">
                            MC
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* MTN Mobile Money Form */}
                  {paymentMethod.type === "mtn_momo" && (
                    <div className="space-y-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-6 bg-yellow-400 rounded flex items-center justify-center text-xs font-bold text-black">
                          MTN
                        </div>
                        <span className="text-sm font-medium">
                          MTN Mobile Money
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label
                            htmlFor="mtn-country-code-dialog"
                            className="text-xs"
                          >
                            Country
                          </Label>
                          <Select
                            value={paymentMethod.countryCode}
                            onValueChange={(value) =>
                              handlePaymentChange("countryCode", value)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableCountries("mtn_momo").map(
                                (country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    {country.flag} {country.name} (
                                    {country.code})
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="mtn-phone-dialog" className="text-xs">
                            Phone Number
                          </Label>
                          <div className="flex">
                            <div className="flex items-center px-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md text-xs">
                              {paymentMethod.countryCode}
                            </div>
                            <Input
                              id="mtn-phone-dialog"
                              type="tel"
                              placeholder={
                                getExamplePhoneNumber(
                                  paymentMethod.countryCode,
                                  "mtn_momo"
                                ) || "6XXXXXXXX"
                              }
                              value={paymentMethod.phoneNumber}
                              onChange={(e) =>
                                handlePaymentChange(
                                  "phoneNumber",
                                  e.target.value.replace(/\D/g, "")
                                )
                              }
                              className={`rounded-l-none border-l-0 h-9 text-sm focus:border-l ${
                                phoneValidation.error
                                  ? "border-red-300 focus:border-red-500"
                                  : phoneValidation.isValid
                                  ? "border-green-300 focus:border-green-500"
                                  : ""
                              }`}
                              maxLength={
                                MOBILE_MONEY_COUNTRIES[
                                  paymentMethod.countryCode
                                ]?.phoneLength || 10
                              }
                            />
                          </div>
                          <div className="mt-1">
                            {phoneValidation.error ? (
                              <p className="text-xs text-red-600">
                                {phoneValidation.error}
                              </p>
                            ) : phoneValidation.isValid ? (
                              <p className="text-xs text-green-600">
                                ✓ Valid MTN number:{" "}
                                {phoneValidation.formattedPhone}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Enter your MTN mobile number without the country
                                code
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orange Mobile Money Form */}
                  {paymentMethod.type === "orange_momo" && (
                    <div className="space-y-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-6 bg-orange-500 rounded flex items-center justify-center text-xs font-bold text-white">
                          Orange
                        </div>
                        <span className="text-sm font-medium">
                          Orange Money
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label
                            htmlFor="orange-country-code-dialog"
                            className="text-xs"
                          >
                            Country
                          </Label>
                          <Select
                            value={paymentMethod.countryCode}
                            onValueChange={(value) =>
                              handlePaymentChange("countryCode", value)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableCountries("orange_momo").map(
                                (country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    {country.flag} {country.name} (
                                    {country.code})
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2">
                          <Label
                            htmlFor="orange-phone-dialog"
                            className="text-xs"
                          >
                            Phone Number
                          </Label>
                          <div className="flex">
                            <div className="flex items-center px-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md text-xs">
                              {paymentMethod.countryCode}
                            </div>
                            <Input
                              id="orange-phone-dialog"
                              type="tel"
                              placeholder={
                                getExamplePhoneNumber(
                                  paymentMethod.countryCode,
                                  "orange_momo"
                                ) || "6XXXXXXXX"
                              }
                              value={paymentMethod.phoneNumber}
                              onChange={(e) =>
                                handlePaymentChange(
                                  "phoneNumber",
                                  e.target.value.replace(/\D/g, "")
                                )
                              }
                              className={`rounded-l-none border-l-0 h-9 text-sm focus:border-l ${
                                phoneValidation.error
                                  ? "border-red-300 focus:border-red-500"
                                  : phoneValidation.isValid
                                  ? "border-green-300 focus:border-green-500"
                                  : ""
                              }`}
                              maxLength={
                                MOBILE_MONEY_COUNTRIES[
                                  paymentMethod.countryCode
                                ]?.phoneLength || 10
                              }
                            />
                          </div>
                          <div className="mt-1">
                            {phoneValidation.error ? (
                              <p className="text-xs text-red-600">
                                {phoneValidation.error}
                              </p>
                            ) : phoneValidation.isValid ? (
                              <p className="text-xs text-green-600">
                                ✓ Valid Orange number:{" "}
                                {phoneValidation.formattedPhone}
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Enter your Orange mobile number without the
                                country code
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Credit Card Form */}
                  {paymentMethod.type === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={paymentMethod.cardNumber}
                          onChange={(e) =>
                            handlePaymentChange("cardNumber", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={paymentMethod.cardName}
                          onChange={(e) =>
                            handlePaymentChange("cardName", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Input
                            id="expiryMonth"
                            placeholder="MM"
                            value={paymentMethod.expiryMonth}
                            onChange={(e) =>
                              handlePaymentChange("expiryMonth", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Year</Label>
                          <Input
                            id="expiryYear"
                            placeholder="YY"
                            value={paymentMethod.expiryYear}
                            onChange={(e) =>
                              handlePaymentChange("expiryYear", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={paymentMethod.cvc}
                            onChange={(e) =>
                              handlePaymentChange("cvc", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex-shrink-0 p-6 pt-4 border-t bg-gray-50/50">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPayDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={payMilestone}
                disabled={
                  isSubmitting ||
                  ((paymentMethod.type === "mtn_momo" ||
                    paymentMethod.type === "orange_momo") &&
                    (!phoneValidation.isValid || !paymentMethod.phoneNumber))
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                  </>
                ) : paymentMethod.type === "mtn_momo" ? (
                  `Request MTN Payment ${contract.terms.currency} ${
                    selectedMilestone?.amount?.toLocaleString() || 0
                  }`
                ) : paymentMethod.type === "orange_momo" ? (
                  `Request Orange Payment ${contract.terms.currency} ${
                    selectedMilestone?.amount?.toLocaleString() || 0
                  }`
                ) : (
                  `Pay ${contract.terms.currency} ${
                    selectedMilestone?.amount?.toLocaleString() || 0
                  }`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rate Freelancer Modal */}
      {contract && freelancer && (
        <RateFreelancerModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          contractId={contract.id}
          projectId={contract.projectId}
          freelancerId={contract.freelancerId}
          freelancerName={freelancer.displayName || "Freelancer"}
          freelancerPhotoURL={freelancer.photoURL}
          clientId={user?.userId || ""}
          existingReview={existingReview}
        />
      )}
    </div>
  );
}
