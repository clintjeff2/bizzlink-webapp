"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/firebase";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  User,
  ThumbsUp,
  ThumbsDown,
  Edit,
  History,
  AlertOctagon,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/navigation";

// Safe date formatting utility
const formatDate = (
  dateValue: any,
  formatString: string = "MMM d, yyyy"
): string => {
  try {
    if (!dateValue) return "Unknown date";

    const date =
      dateValue instanceof Date
        ? dateValue
        : dateValue.toDate && typeof dateValue.toDate === "function"
        ? dateValue.toDate() // Handle Firestore Timestamp
        : new Date(dateValue);

    return isNaN(date.getTime()) ? "Unknown date" : format(date, formatString);
  } catch (error) {
    console.warn("Date formatting error:", error, "for value:", dateValue);
    return "Unknown date";
  }
};

// Import contract transaction services
import {
  acceptContract as acceptContractService,
  rejectContract as rejectContractService,
  requestRevision as requestRevisionService,
  submitMilestone as submitMilestoneService,
  updateContractProgress as updateContractProgressService,
} from "@/lib/services/contract-transaction";
import {
  Contract as ContractType,
  ContractEvent,
  MilestoneStatus,
  ContractStatus,
  Milestone,
} from "@/lib/types/contract.types";

export default function FreelancerContractDetailsPage({
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
  const [client, setClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contract response actions
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [actionComment, setActionComment] = useState("");

  // Milestone submission
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [showSubmitMilestoneDialog, setShowSubmitMilestoneDialog] =
    useState(false);
  const [milestoneComment, setMilestoneComment] = useState("");
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [submissionLinks, setSubmissionLinks] = useState<string[]>([]);
  const [newSubmissionLink, setNewSubmissionLink] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<
    Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      storagePath?: string;
    }>
  >([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [deliverables, setDeliverables] = useState<
    { url: string; description: string }[]
  >([]);
  const [newDeliverableUrl, setNewDeliverableUrl] = useState("");
  const [newDeliverableDescription, setNewDeliverableDescription] =
    useState("");

  // Progress tracking
  const [progressValue, setProgressValue] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [progressComment, setProgressComment] = useState("");

  // Contract events
  const [contractEvents, setContractEvents] = useState<ContractEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Payment history
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Fetch contract details
  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!user?.userId) return;

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

        const contractData = contractSnap.data() as ContractType;

        // Check if user is the contract's freelancer
        if (contractData.freelancerId !== user.userId) {
          setError("You don't have permission to view this contract");
          setLoading(false);
          return;
        }

        // Format contract data
        const formattedContract = {
          id: contractSnap.id,
          ...contractData,
          contractId: contractSnap.id,
          terms: {
            ...contractData.terms,
            startDate:
              contractData.terms?.startDate instanceof Timestamp
                ? contractData.terms?.startDate?.toDate()
                : contractData.terms?.startDate,
            endDate:
              contractData.terms?.endDate instanceof Timestamp
                ? contractData.terms?.endDate?.toDate()
                : contractData.terms?.endDate,
          },
          milestones: Array.isArray(contractData.milestones)
            ? contractData.milestones.map((milestone: any) => ({
                ...milestone,
                dueDate:
                  milestone.dueDate instanceof Timestamp
                    ? milestone.dueDate?.toDate()
                    : milestone.dueDate,
                submittedAt:
                  milestone.submittedAt instanceof Timestamp
                    ? milestone.submittedAt?.toDate()
                    : milestone.submittedAt,
                approvedAt:
                  milestone.approvedAt instanceof Timestamp
                    ? milestone.approvedAt?.toDate()
                    : milestone.approvedAt,
              }))
            : [],
          createdAt:
            contractData.createdAt instanceof Timestamp
              ? contractData.createdAt?.toDate()
              : new Date(),
          updatedAt:
            contractData.updatedAt instanceof Timestamp
              ? contractData.updatedAt?.toDate()
              : new Date(),
          completedAt:
            contractData.completedAt instanceof Timestamp
              ? contractData.completedAt?.toDate()
              : null,
        };

        setContract(formattedContract as ContractType);
        setProgressValue(formattedContract.progress || 0);

        // Get project data
        const projectQuery = query(
          collection(db, "projects"),
          where("projectId", "==", contractData.projectId)
        );
        const projectSnap = await getDocs(projectQuery);

        if (!projectSnap.empty) {
          setProject(projectSnap.docs[0].data());
        }

        // Get client data
        const clientRef = doc(db, "users", contractData.clientId);
        const clientSnap = await getDoc(clientRef);

        if (clientSnap.exists()) {
          setClient(clientSnap.data());
        }

        // Fetch contract events
        await fetchContractEvents(contractSnap.id);

        // Fetch payment history
        await fetchPaymentHistory(contractSnap.id);

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching contract details:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [resolvedParams.id, user?.userId]);

  // Fetch payment history
  const fetchPaymentHistory = async (contractId: string) => {
    try {
      setLoadingPayments(true);

      const paymentsQuery = query(
        collection(db, "payments"),
        where("contractId", "==", contractId),
        orderBy("createdAt", "desc")
      );

      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsData = paymentsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(),
          processedAt:
            data.processedAt instanceof Timestamp
              ? data.processedAt.toDate()
              : null,
          completedAt:
            data.completedAt instanceof Timestamp
              ? data.completedAt.toDate()
              : null,
        };
      });

      setPayments(paymentsData);
      setLoadingPayments(false);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setLoadingPayments(false);
    }
  };

  // Fetch contract events
  const fetchContractEvents = async (contractId: string) => {
    try {
      setLoadingEvents(true);

      const eventsQuery = query(
        collection(db, "contractEvents"),
        where("contractId", "==", contractId),
        orderBy("createdAt", "desc"),
        limit(20)
      );

      const eventsSnap = await getDocs(eventsQuery);

      const events = eventsSnap.docs.map((doc) => {
        const data = doc.data() as ContractEvent;
        return {
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(),
        };
      });

      setContractEvents(events);
      setLoadingEvents(false);
    } catch (error) {
      console.error("Error fetching contract events:", error);
      setLoadingEvents(false);
    }
  };

  // Accept contract - Change status from pending_acceptance to active
  const acceptContract = async () => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Use the transaction service to accept the contract
      await acceptContractService(
        contract.contractId,
        user.userId,
        actionComment
      );

      toast({
        title: "Contract Accepted",
        description:
          "The contract is now active. Awaiting client to fund the first milestone.",
      });

      // Refresh contract data using helper
      await refreshContractData(contract.contractId);

      setIsSubmitting(false);
      setActionComment("");
    } catch (err: any) {
      console.error("Error accepting contract:", err);
      toast({
        title: "Error",
        description: "Failed to accept the contract. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Reject contract - Change status from pending_acceptance to cancelled
  const rejectContract = async () => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Use transaction service to reject contract
      await rejectContractService(
        contract.contractId,
        user.userId,
        actionComment
      );

      toast({
        title: "Contract Rejected",
        description: "The contract has been cancelled.",
      });

      // Refresh contract data using helper
      await refreshContractData(contract.contractId);

      setIsSubmitting(false);
      setActionComment("");
    } catch (err: any) {
      console.error("Error rejecting contract:", err);
      toast({
        title: "Error",
        description: "Failed to reject the contract. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Request contract revision - Change status to revision_requested
  const requestRevision = async () => {
    if (!contract || !user?.userId || !actionComment.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the revision request.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Use transaction service to request contract revision
      await requestRevisionService(
        contract.contractId,
        user.userId,
        actionComment
      );

      toast({
        title: "Revision Requested",
        description:
          "Your request for contract revision has been sent to the client.",
      });

      // Refresh contract data using helper
      await refreshContractData(contract.contractId);

      setIsSubmitting(false);
      setActionComment("");
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

  // Submit milestone for review
  const submitMilestone = async () => {
    if (!contract || !user?.userId || !selectedMilestone) return;

    try {
      setIsSubmitting(true);

      // Check if this is a re-submission and handle file cleanup if needed
      if (
        selectedMilestone.status === "in_review" &&
        selectedMilestone.submissionDetails?.files
      ) {
        // Find files that were removed in this submission
        const existingFilePaths = selectedMilestone.submissionDetails.files
          .filter((file) => file.storagePath) // Only those with storage path
          .map((file) => file.storagePath);

        const newFilePaths = submissionFiles
          .filter((file) => file.storagePath)
          .map((file) => file.storagePath);

        // Find files that exist in the old submission but not in the new one
        const filesToDelete = existingFilePaths.filter(
          (path) => path && !newFilePaths.includes(path)
        );

        // Delete removed files from storage
        for (const filePath of filesToDelete) {
          try {
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
            console.log(`Deleted file ${filePath} from storage`);
          } catch (error) {
            console.error(`Failed to delete file ${filePath}:`, error);
          }
        }
      }

      // Format deliverables
      const formattedDeliverables = deliverables.map((d) => ({
        url: d.url,
        description: d.description,
        addedAt: new Date(),
      }));

      // Prepare submission details
      const submissionDetails = {
        description: submissionDescription,
        links: submissionLinks,
        files: submissionFiles,
      };

      // Use transaction service to submit milestone
      await submitMilestoneService(
        contract.contractId,
        selectedMilestone.id,
        user.userId,
        milestoneComment,
        formattedDeliverables,
        submissionDetails
      );

      toast({
        title: "Milestone Submitted",
        description: "Your work has been submitted for client review.",
      });

      // Close the dialog
      setShowSubmitMilestoneDialog(false);

      // Refresh contract data using helper
      await refreshContractData(contract.contractId);

      // Reset form
      setMilestoneComment("");
      setDeliverables([]);
      setSubmissionDescription("");
      setSubmissionLinks([]);
      setSubmissionFiles([]);
      setSelectedMilestone(null);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("Error submitting milestone:", err);
      toast({
        title: "Error",
        description: "Failed to submit milestone. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Update contract progress
  const updateProgress = async () => {
    if (!contract || !user?.userId) return;

    try {
      setIsSubmitting(true);

      // Use transaction service to update progress
      await updateContractProgressService(
        contract.contractId,
        user.userId,
        progressValue,
        progressComment
      );

      toast({
        title: "Progress Updated",
        description: `Project progress updated to ${progressValue}%`,
      });

      // Close the dialog
      setShowProgressDialog(false);

      // Refresh contract data using helper
      await refreshContractData(contract.contractId);

      // Reset form
      setProgressComment("");
      setIsSubmitting(false);
    } catch (err: any) {
      console.error("Error updating progress:", err);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to refresh contract data
  const refreshContractData = async (contractId: string) => {
    try {
      // Refresh contract data
      const contractRef = doc(db, "contracts", contractId);
      const contractSnap = await getDoc(contractRef);

      if (contractSnap.exists()) {
        const updatedContractData = contractSnap.data();

        // Format contract data
        const formattedContract = {
          ...updatedContractData,
          id: contractSnap.id,
          contractId: contractSnap.id,
          terms: {
            ...updatedContractData.terms,
            startDate:
              updatedContractData.terms?.startDate instanceof Timestamp
                ? updatedContractData.terms?.startDate?.toDate()
                : updatedContractData.terms?.startDate,
            endDate:
              updatedContractData.terms?.endDate instanceof Timestamp
                ? updatedContractData.terms?.endDate?.toDate()
                : updatedContractData.terms?.endDate,
          },
          milestones: Array.isArray(updatedContractData.milestones)
            ? updatedContractData.milestones.map((milestone: any) => ({
                ...milestone,
                dueDate:
                  milestone.dueDate instanceof Timestamp
                    ? milestone.dueDate?.toDate()
                    : milestone.dueDate,
                submittedAt:
                  milestone.submittedAt instanceof Timestamp
                    ? milestone.submittedAt?.toDate()
                    : milestone.submittedAt,
                approvedAt:
                  milestone.approvedAt instanceof Timestamp
                    ? milestone.approvedAt?.toDate()
                    : milestone.approvedAt,
              }))
            : [],
          createdAt:
            updatedContractData.createdAt instanceof Timestamp
              ? updatedContractData.createdAt?.toDate()
              : new Date(),
          updatedAt:
            updatedContractData.updatedAt instanceof Timestamp
              ? updatedContractData.updatedAt?.toDate()
              : new Date(),
          completedAt:
            updatedContractData.completedAt instanceof Timestamp
              ? updatedContractData.completedAt?.toDate()
              : null,
        };

        setContract(formattedContract);
      }

      // Refresh contract events
      await fetchContractEvents(contractId);

      // Refresh payment history
      await fetchPaymentHistory(contractId);
    } catch (error) {
      console.error("Error refreshing contract data:", error);
    }
  };

  // Handler functions for the dialog buttons
  const handleAcceptContract = async () => {
    await acceptContract();
    setShowAcceptDialog(false);
  };

  const handleRejectContract = async () => {
    await rejectContract();
    setShowRejectDialog(false);
  };

  const handleRequestRevision = async () => {
    await requestRevision();
    setShowRevisionDialog(false);
  };

  const handleOpenMilestoneSubmitDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);

    // If this is a re-submission, pre-populate form with existing data
    if (milestone.status === "in_review" && milestone.submissionDetails) {
      setSubmissionDescription(milestone.submissionDetails.description || "");
      setSubmissionLinks(milestone.submissionDetails.links || []);
      setSubmissionFiles(milestone.submissionDetails.files || []);
      setMilestoneComment(""); // Reset comment for resubmission
    } else {
      // Reset form for new submission
      setSubmissionDescription("");
      setSubmissionLinks([]);
      setSubmissionFiles([]);
      setMilestoneComment("");
    }

    setShowSubmitMilestoneDialog(true);
  };

  const handleSubmitMilestone = async () => {
    if (!selectedMilestone) return;

    // Validate submission details
    if (!submissionDescription.trim()) {
      toast({
        title: "Missing Details",
        description: "Please provide a detailed description of your work.",
        variant: "destructive",
      });
      return;
    }

    // If this is a resubmission, show a confirmation dialog
    if (selectedMilestone.status === "in_review") {
      if (
        confirm(
          "You're re-submitting this milestone. Any previous submission data will be replaced. Continue?"
        )
      ) {
        await submitMilestone();
      }
    } else {
      await submitMilestone();
    }
  };
  const handleUpdateProgress = async () => {
    await updateProgress();
  };

  const handleAddDeliverable = () => {
    if (newDeliverableUrl.trim()) {
      setDeliverables([
        ...deliverables,
        {
          url: newDeliverableUrl.trim(),
          description: newDeliverableDescription.trim() || "No description",
        },
      ]);
      setNewDeliverableUrl("");
      setNewDeliverableDescription("");
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    const newDeliverables = [...deliverables];
    newDeliverables.splice(index, 1);
    setDeliverables(newDeliverables);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !contract || !selectedMilestone) return;

    const maxFiles = 5;
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/gif",
      "text/plain",
    ];

    // Check if adding these files would exceed max file count
    if (submissionFiles.length + files.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can upload a maximum of ${maxFiles} files total.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploadingFiles(true);

    const newFiles = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > maxFileSize) {
        errors.push(`${file.name} exceeds 10MB limit`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} has an unsupported file type`);
        continue;
      }

      try {
        // Use a specific folder structure for milestone review attachments
        const fileId = uuidv4();
        const storagePath = `milestone-review-attachments/${contract.contractId}/${selectedMilestone.id}/${fileId}_${file.name}`;
        const fileRef = ref(storage, storagePath);

        // Upload file with progress monitoring
        const uploadTask = uploadBytesResumable(fileRef, file);

        // Monitor upload progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: progress,
            }));
          },
          (error) => {
            console.error("Upload failed:", error);
            errors.push(`Failed to upload ${file.name}`);
          }
        );

        // Wait for the upload to complete
        await uploadTask;

        // Get the download URL
        const downloadUrl = await getDownloadURL(fileRef);

        // Add to files array with storage path for future reference
        newFiles.push({
          fileName: file.name,
          fileUrl: downloadUrl,
          fileType: file.type,
          storagePath: storagePath, // Store path for deletion if needed
        });
      } catch (error) {
        console.error("Error uploading file:", error);
        errors.push(`Failed to upload ${file.name}`);
      }
    }

    if (errors.length > 0) {
      toast({
        title: "Some files failed to upload",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    if (newFiles.length > 0) {
      setSubmissionFiles([...submissionFiles, ...newFiles]);
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${newFiles.length} file(s)`,
      });
    }

    setIsUploadingFiles(false);
    setUploadProgress({});
  };

  const handleFileDelete = async (index: number) => {
    try {
      const fileToDelete = submissionFiles[index];

      if (fileToDelete.storagePath) {
        // Delete the file from Firebase Storage
        const fileRef = ref(storage, fileToDelete.storagePath);
        await deleteObject(fileRef);
      }

      // Remove from state
      const newFiles = [...submissionFiles];
      newFiles.splice(index, 1);
      setSubmissionFiles(newFiles);

      toast({
        title: "File Deleted",
        description: `${fileToDelete.fileName} was successfully removed`,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate total contract amount
  const totalContractAmount =
    contract?.milestones?.reduce(
      (sum: number, milestone: any) => sum + Number(milestone.amount),
      0
    ) || 0;

  // Calculate contract status
  const getStatusDisplay = () => {
    switch (contract?.status) {
      case "pending_acceptance":
        return {
          label: "Pending Your Review",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
          description: "Please review and accept or reject this contract",
        };
      case "active":
        return {
          label: "Active",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          description: "Contract is active - you can work on milestones",
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
          description: "Awaiting client response to your revision request",
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          description: "Contract has been successfully completed",
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

  // Calculate milestone status display
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
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
        <Navigation />
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
                onClick={() => router.push("/freelancer/contracts")}
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
        <Navigation />
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
            <Button onClick={() => router.push("/freelancer/contracts")}>
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
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 p-0"
              onClick={() => router.push("/freelancer/contracts")}
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
                <>
                  <Button onClick={() => setShowAcceptDialog(true)}>
                    Accept Contract
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    Reject Contract
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRevisionDialog(true)}
                  >
                    Request Revision
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                onClick={() =>
                  router.push(
                    `/messages?user=${contract.clientId}&proposal=${contract.proposalId}`
                  )
                }
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message Client
              </Button>
            </div>
          </div>
        </div>

        {/* Contract Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Client Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage
                    src={client?.photoURL || ""}
                    alt={client?.displayName}
                  />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">
                    {client?.displayName || "Client"}
                  </h3>
                  <div className="text-gray-500">
                    {client?.title || "Business Owner"}
                  </div>
                </div>
              </div>
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(`/profile/${contract.clientId}`)
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
                  {formatDate(contract.terms.startDate, "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-gray-500">End Date</div>
                <div className="font-medium">
                  {formatDate(contract.terms.endDate, "MMM d, yyyy")}
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

          {/* Progress Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Project Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Completion</div>
                <div className="font-medium">{contract.progress || 0}%</div>
              </div>
              <Progress value={contract.progress || 0} className="h-2" />
              <div className="flex justify-between items-center">
                <div className="text-gray-500">Milestones</div>
                <div className="font-medium">
                  {contract.milestones?.filter(
                    (m: any) => m.status === "complete"
                  ).length || 0}
                  /{contract.milestones?.length || 0} completed
                </div>
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
                  Your work agreement with {client?.displayName || "the client"}
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
                    {contract.milestones?.map(
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
                                    {formatDate(
                                      milestone.dueDate,
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
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
            <div className="space-y-6">
              {/* Progress Update Card */}
              {contract.status === "active" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Update Progress</CardTitle>
                    <CardDescription>
                      Manually update your overall project progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress
                          value={contract.progress || 0}
                          className="h-2"
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>0%</span>
                          <span className="font-medium">
                            {contract.progress || 0}%
                          </span>
                          <span>100%</span>
                        </div>
                      </div>
                      <AlertDialog
                        open={showProgressDialog}
                        onOpenChange={setShowProgressDialog}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setProgressValue(contract.progress || 0);
                              setShowProgressDialog(true);
                            }}
                          >
                            Update Progress
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Update Project Progress
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Set the current progress percentage for this
                              project.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Label htmlFor="progress-input">
                              Progress Percentage (0-100)
                            </Label>
                            <input
                              id="progress-input"
                              type="number"
                              min="0"
                              max="100"
                              value={progressValue}
                              onChange={(e) =>
                                setProgressValue(parseInt(e.target.value) || 0)
                              }
                              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Label
                              htmlFor="progressComment"
                              className="mt-4 block"
                            >
                              Comment (optional)
                            </Label>
                            <Textarea
                              id="progressComment"
                              placeholder="Add any notes about the progress update"
                              className="mt-2"
                              value={progressComment}
                              onChange={(e) =>
                                setProgressComment(e.target.value)
                              }
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => {
                                setShowProgressDialog(false);
                                setProgressComment("");
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleUpdateProgress}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Updating
                                </>
                              ) : (
                                "Update Progress"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Milestones List */}
              <Card>
                <CardHeader>
                  <CardTitle>Milestones & Deliverables</CardTitle>
                  <CardDescription>
                    Track your progress and deliverables for each milestone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contract.milestones?.map(
                      (milestone: any, index: number) => {
                        const statusDisplay = getMilestoneStatusDisplay(
                          milestone.status
                        );

                        return (
                          <div
                            key={milestone.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {milestone.title}
                                  </h3>
                                  <Badge className={statusDisplay.color}>
                                    {statusDisplay.icon}
                                    {statusDisplay.label}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 mb-3">
                                  {milestone.description}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <span>
                                      {contract.terms.currency}{" "}
                                      {milestone.amount.toLocaleString()}
                                      {milestone.status === "completed" && (
                                        <span className="text-gray-500 ml-2">
                                          (You receive:{" "}
                                          {contract.terms.currency}{" "}
                                          {(
                                            milestone.amount * 0.9
                                          ).toLocaleString()}{" "}
                                          after 10% platform fee)
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>
                                      Due:{" "}
                                      {formatDate(
                                        milestone.dueDate,
                                        "MMM d, yyyy"
                                      )}
                                    </span>
                                  </div>
                                  {milestone.submittedAt && (
                                    <div className="flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      <span>
                                        Submitted:{" "}
                                        {formatDate(
                                          milestone.submittedAt,
                                          "MMM d, yyyy"
                                        )}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Show revision notes if milestone was rejected */}
                                {milestone.revisionNotes &&
                                  milestone.status === "active" && (
                                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                      <p className="text-sm font-medium text-yellow-900 mb-1">
                                        Revision Notes from Client:
                                      </p>
                                      <p className="text-sm text-yellow-800">
                                        {milestone.revisionNotes}
                                      </p>
                                      {milestone.revisionRequestedAt && (
                                        <p className="text-xs text-yellow-600 mt-1">
                                          Requested on:{" "}
                                          {formatDate(
                                            milestone.revisionRequestedAt,
                                            "MMM d, yyyy 'at' h:mm a"
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </div>

                              {/* Milestone Actions */}
                              <div className="ml-4">
                                {milestone.status === "active" &&
                                  contract.status === "active" && (
                                    <Button
                                      onClick={() =>
                                        handleOpenMilestoneSubmitDialog(
                                          milestone
                                        )
                                      }
                                    >
                                      Submit for Review
                                    </Button>
                                  )}

                                {milestone.status === "in_review" && (
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleOpenMilestoneSubmitDialog(milestone)
                                    }
                                  >
                                    Edit Submission
                                  </Button>
                                )}

                                {milestone.status === "completed" && (
                                  <Button disabled variant="outline">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Completed
                                  </Button>
                                )}

                                {milestone.status === "pending" && (
                                  <Button disabled variant="outline">
                                    Pending
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Deliverables Section */}
                            {milestone.status === "completed" && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">
                                  Deliverables
                                </h4>
                                <div className="space-y-2">
                                  {milestone.deliverables?.length === 0 && (
                                    <p className="text-gray-500 text-sm">
                                      No deliverables submitted for this
                                      milestone.
                                    </p>
                                  )}
                                  {milestone.deliverables?.map(
                                    (deliverable: any, index: number) => {
                                      // Handle both string deliverables and object deliverables
                                      if (typeof deliverable === "string") {
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                          >
                                            <div className="flex items-center">
                                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                              <span className="text-gray-700 text-sm">
                                                {deliverable}
                                              </span>
                                            </div>
                                            <Button
                                              variant="link"
                                              className="text-blue-600 hover:underline"
                                              onClick={() =>
                                                window.open(
                                                  `/api/files/${deliverable}`,
                                                  "_blank"
                                                )
                                              }
                                            >
                                              Download
                                            </Button>
                                          </div>
                                        );
                                      } else if (
                                        typeof deliverable === "object" &&
                                        deliverable !== null
                                      ) {
                                        // Handle object deliverables
                                        const displayText =
                                          deliverable.description ||
                                          deliverable.fileName ||
                                          deliverable.url ||
                                          "Deliverable";
                                        const downloadUrl =
                                          deliverable.fileUrl ||
                                          deliverable.url ||
                                          `/api/files/${deliverable}`;

                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                          >
                                            <div className="flex items-center">
                                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                              <span className="text-gray-700 text-sm">
                                                {displayText}
                                              </span>
                                            </div>
                                            {downloadUrl && (
                                              <Button
                                                variant="link"
                                                className="text-blue-600 hover:underline"
                                                onClick={() =>
                                                  window.open(
                                                    downloadUrl,
                                                    "_blank"
                                                  )
                                                }
                                              >
                                                Download
                                              </Button>
                                            )}
                                          </div>
                                        );
                                      } else {
                                        // Fallback for any other type
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                          >
                                            <div className="flex items-center">
                                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                              <span className="text-gray-700 text-sm">
                                                {String(deliverable)}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Contract Activity</CardTitle>
                <CardDescription>
                  Recent events and updates on this contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEvents ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  </div>
                ) : contractEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No activity to display
                  </div>
                ) : (
                  <div className="space-y-6">
                    {contractEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="mt-1">
                          {event.eventType === "contract_created" && (
                            <FileText className="h-6 w-6 text-blue-600" />
                          )}
                          {event.eventType === "contract_accepted" && (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          )}
                          {event.eventType === "contract_rejected" && (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                          {event.eventType === "revision_requested" && (
                            <Edit className="h-6 w-6 text-yellow-600" />
                          )}
                          {event.eventType === "milestone_funded" && (
                            <DollarSign className="h-6 w-6 text-green-600" />
                          )}
                          {event.eventType === "milestone_submitted" && (
                            <FileText className="h-6 w-6 text-blue-600" />
                          )}
                          {event.eventType === "milestone_approved" ||
                            (event.eventType ===
                              "milestone_payment_released" && (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ))}
                          {event.eventType === "milestone_rejected" && (
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                          )}
                          {event.eventType === "progress_updated" && (
                            <Clock className="h-6 w-6 text-blue-600" />
                          )}
                          {(event.eventType === "dispute_opened" ||
                            event.eventType === "dispute_resolved") && (
                            <AlertOctagon className="h-6 w-6 text-red-600" />
                          )}
                          {![
                            "contract_created",
                            "contract_accepted",
                            "contract_rejected",
                            "revision_requested",
                            "milestone_funded",
                            "milestone_submitted",
                            "milestone_approved",
                            "milestone_payment_released",
                            "milestone_rejected",
                            "progress_updated",
                            "dispute_opened",
                            "dispute_resolved",
                          ].includes(event.eventType) && (
                            <History className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <p className="font-medium text-sm">
                              {event.eventType === "contract_created" &&
                                "Contract Created"}
                              {event.eventType === "contract_accepted" &&
                                "Contract Accepted"}
                              {event.eventType === "contract_rejected" &&
                                "Contract Rejected"}
                              {event.eventType === "revision_requested" &&
                                "Revision Requested"}
                              {event.eventType === "milestone_funded" &&
                                "Milestone Funded"}
                              {event.eventType === "milestone_submitted" &&
                                "Milestone Submitted"}
                              {event.eventType === "milestone_approved" &&
                                "Milestone Approved"}
                              {event.eventType ===
                                "milestone_payment_released" &&
                                "Payment Released"}
                              {event.eventType === "milestone_rejected" &&
                                "Revision Requested"}
                              {event.eventType === "progress_updated" &&
                                "Progress Updated"}
                              {event.eventType === "dispute_opened" &&
                                "Dispute Opened"}
                              {event.eventType === "dispute_resolved" &&
                                "Dispute Resolved"}
                              {![
                                "contract_created",
                                "contract_accepted",
                                "contract_rejected",
                                "revision_requested",
                                "milestone_funded",
                                "milestone_submitted",
                                "milestone_approved",
                                "milestone_payment_released",
                                "milestone_rejected",
                                "progress_updated",
                                "dispute_opened",
                                "dispute_resolved",
                              ].includes(event.eventType) &&
                                event.eventType.replace("_", " ")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(
                                event.createdAt,
                                "MMM d, yyyy 'at' h:mm a"
                              )}
                            </p>
                          </div>
                          {event.comment && (
                            <p className="text-sm text-gray-700 mt-1">
                              {event.comment}
                            </p>
                          )}
                          {event.amount && (
                            <p className="text-sm text-gray-700 mt-1">
                              Amount:{" "}
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency:
                                  event.currency ||
                                  contract.terms.currency ||
                                  "USD",
                              }).format(event.amount)}
                            </p>
                          )}
                          {event.metadata &&
                            event.metadata.deliverables &&
                            event.metadata.deliverables.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">
                                  Deliverables:
                                </p>
                                <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                                  {event.metadata.deliverables.map(
                                    (item: any, idx: number) => {
                                      // Handle both string deliverables (backward compatibility) and object deliverables
                                      if (typeof item === "string") {
                                        return <li key={idx}>{item}</li>;
                                      } else if (
                                        typeof item === "object" &&
                                        item !== null
                                      ) {
                                        // Handle object deliverables with description and url
                                        if (item.url && item.description) {
                                          return (
                                            <li key={idx}>
                                              <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                              >
                                                {item.description}
                                              </a>
                                              {item.addedAt && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                  (Added:{" "}
                                                  {formatDate(item.addedAt)})
                                                </span>
                                              )}
                                            </li>
                                          );
                                        } else if (item.url) {
                                          return (
                                            <li key={idx}>
                                              <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                              >
                                                {item.url}
                                              </a>
                                            </li>
                                          );
                                        } else {
                                          // Fallback: stringify the object safely
                                          return (
                                            <li key={idx}>
                                              {JSON.stringify(item)}
                                            </li>
                                          );
                                        }
                                      } else {
                                        // Fallback for any other type
                                        return (
                                          <li key={idx}>{String(item)}</li>
                                        );
                                      }
                                    }
                                  )}
                                </ul>
                              </div>
                            )}
                          {/* Display submission details for milestone_submitted events */}
                          {event.eventType === "milestone_submitted" &&
                            event.metadata &&
                            event.metadata.submissionDetails && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border">
                                <p className="text-sm font-medium text-blue-900 mb-2">
                                  Submission Details:
                                </p>

                                {/* Submission Description */}
                                {event.metadata.submissionDetails
                                  .description && (
                                  <div className="mb-2">
                                    <p className="text-xs font-medium text-blue-800">
                                      Description:
                                    </p>
                                    <p className="text-sm text-blue-700">
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
                                    <div className="mb-2">
                                      <p className="text-xs font-medium text-blue-800">
                                        Links:
                                      </p>
                                      <ul className="list-disc pl-4 mt-1">
                                        {event.metadata.submissionDetails.links.map(
                                          (link: string, linkIdx: number) => (
                                            <li key={linkIdx}>
                                              <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm"
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
                                      <p className="text-xs font-medium text-blue-800">
                                        Files:
                                      </p>
                                      <ul className="list-disc pl-4 mt-1">
                                        {event.metadata.submissionDetails.files.map(
                                          (file: any, fileIdx: number) => {
                                            // Handle both string files and object files
                                            if (typeof file === "string") {
                                              return (
                                                <li key={fileIdx}>
                                                  <span className="text-sm text-blue-700">
                                                    {file}
                                                  </span>
                                                </li>
                                              );
                                            } else if (
                                              typeof file === "object" &&
                                              file !== null
                                            ) {
                                              return (
                                                <li key={fileIdx}>
                                                  <a
                                                    href={
                                                      file.fileUrl || file.url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm"
                                                  >
                                                    {file.fileName ||
                                                      file.name ||
                                                      "File"}
                                                  </a>
                                                  {file.fileType && (
                                                    <span className="text-xs text-blue-500 ml-2">
                                                      ({file.fileType})
                                                    </span>
                                                  )}
                                                </li>
                                              );
                                            } else {
                                              return (
                                                <li key={fileIdx}>
                                                  <span className="text-sm text-blue-700">
                                                    {String(file)}
                                                  </span>
                                                </li>
                                              );
                                            }
                                          }
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            )}
                          {/* Display revision notes for milestone_rejected events */}
                          {event.eventType === "milestone_rejected" &&
                            event.metadata &&
                            event.metadata.revisionNotes && (
                              <div className="mt-2 p-3 bg-yellow-50 rounded-lg border">
                                <p className="text-sm font-medium text-yellow-900 mb-1">
                                  Revision Notes:
                                </p>
                                <p className="text-sm text-yellow-800">
                                  {event.metadata.revisionNotes}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all payments related to this contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingPayments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payment records found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Milestone</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => {
                          // Find associated milestone
                          const milestone = contract?.milestones?.find(
                            (m) => m.id === payment.milestoneId
                          );

                          return (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {formatDate(payment.createdAt, "MMM d, yyyy")}
                              </TableCell>
                              <TableCell className="capitalize">
                                {payment.type}
                              </TableCell>
                              <TableCell>
                                {milestone?.title || payment.milestoneId}
                              </TableCell>
                              <TableCell>
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: payment.amount.currency || "USD",
                                }).format(payment.amount.gross)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    payment.status === "completed"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : payment.status === "escrowed"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : payment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : payment.status === "failed"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }
                                >
                                  {payment.status === "completed" && (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {payment.status === "escrowed" && (
                                    <DollarSign className="h-3 w-3 mr-1" />
                                  )}
                                  {payment.status === "pending" && (
                                    <Clock className="h-3 w-3 mr-1" />
                                  )}
                                  {payment.status === "failed" && (
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                  )}
                                  <span className="capitalize">
                                    {payment.status}
                                  </span>
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Accept Contract Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this contract? This will indicate
              your agreement to the terms and conditions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Add any comments or notes about accepting this contract"
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAcceptDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptContract}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Accept Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Contract Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this contract? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="reason">Reason for Declining</Label>
              <Textarea
                id="reason"
                placeholder="Please explain why you're declining this contract"
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectContract}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Decline Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Revision Dialog */}
      <Dialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Contract Revision</DialogTitle>
            <DialogDescription>
              Request changes to the contract terms before accepting. Provide
              clear details about what needs to be changed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="revision">Revision Details</Label>
              <Textarea
                id="revision"
                placeholder="Please specify what changes you would like to make to the contract"
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                className="min-h-24"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRevisionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestRevision}
              disabled={isSubmitting || !actionComment.trim()}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Request Revision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Milestone Dialog */}
      <Dialog
        open={showSubmitMilestoneDialog}
        onOpenChange={setShowSubmitMilestoneDialog}
      >
        <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Milestone for Review</DialogTitle>
            <DialogDescription>
              Submit your work for the client to review. Provide details about
              what you've completed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedMilestone && (
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <h4 className="font-medium text-blue-900">
                  {selectedMilestone.title}
                </h4>
                {selectedMilestone.description && (
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedMilestone.description}
                  </p>
                )}
                <div className="text-sm text-blue-700 mt-1">
                  Amount:{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: contract.terms.currency || "USD",
                  }).format(selectedMilestone.amount)}
                </div>
              </div>
            )}

            <div className="grid w-full gap-1.5">
              <Label htmlFor="comment">Message to Client</Label>
              <Textarea
                id="comment"
                placeholder="Message for the client about this milestone submission"
                value={milestoneComment}
                onChange={(e) => setMilestoneComment(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="submissionDescription">
                Detailed Description
              </Label>
              <Textarea
                id="submissionDescription"
                placeholder="Provide a detailed description of the work completed for this milestone"
                value={submissionDescription}
                onChange={(e) => setSubmissionDescription(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="submissionLinks">Submission Links</Label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="submission-link"
                      placeholder="URL (GitHub, demo link, docs, etc.)"
                      value={newSubmissionLink}
                      onChange={(e) => setNewSubmissionLink(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newSubmissionLink.trim()) {
                        setSubmissionLinks([
                          ...submissionLinks,
                          newSubmissionLink.trim(),
                        ]);
                        setNewSubmissionLink("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {submissionLinks.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {submissionLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <ExternalLink className="h-4 w-4 text-blue-500 mr-2" />
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate"
                            >
                              {link}
                            </a>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newLinks = [...submissionLinks];
                            newLinks.splice(index, 1);
                            setSubmissionLinks(newLinks);
                          }}
                        >
                          <XCircle className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="fileUploads">Upload Files</Label>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500">
                            Upload files
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, Word, PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Show upload progress */}
                {isUploadingFiles && Object.keys(uploadProgress).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(uploadProgress).map(
                      ([fileName, progress]) => (
                        <div key={fileName} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="truncate max-w-xs">
                              {fileName}
                            </span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-1" />
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Show uploaded files */}
                {submissionFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Uploaded Files:
                    </p>
                    <div className="max-h-40 overflow-y-auto">
                      {submissionFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-blue-500 mr-2" />
                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline truncate"
                              >
                                {file.fileName}
                              </a>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileDelete(index)}
                            disabled={isUploadingFiles}
                          >
                            {isUploadingFiles ? (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full gap-1.5">
              <Label htmlFor="deliverables">
                Additional Deliverables (Optional)
              </Label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      id="deliverable-url"
                      placeholder="URL or link to deliverable"
                      value={newDeliverableUrl}
                      onChange={(e) => setNewDeliverableUrl(e.target.value)}
                    />
                    <Input
                      id="deliverable-description"
                      placeholder="Brief description of deliverable"
                      value={newDeliverableDescription}
                      onChange={(e) =>
                        setNewDeliverableDescription(e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newDeliverableUrl.trim()) {
                        setDeliverables([
                          ...deliverables,
                          {
                            url: newDeliverableUrl.trim(),
                            description:
                              newDeliverableDescription.trim() ||
                              "No description",
                          },
                        ]);
                        setNewDeliverableUrl("");
                        setNewDeliverableDescription("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {deliverables.length > 0 && (
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {deliverables.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <ExternalLink className="h-4 w-4 text-blue-500 mr-2" />
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline truncate"
                            >
                              {item.url}
                            </a>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-600 mt-1 ml-6">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newDeliverables = [...deliverables];
                            newDeliverables.splice(index, 1);
                            setDeliverables(newDeliverables);
                          }}
                        >
                          <XCircle className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Add links to GitHub repositories, design files, documents, or
                  any other deliverables
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSubmitMilestoneDialog(false);
                setSelectedMilestone(null);
                setMilestoneComment("");
                setDeliverables([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitMilestone}
              disabled={
                isSubmitting ||
                !milestoneComment.trim() ||
                !submissionDescription.trim()
              }
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit for Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
