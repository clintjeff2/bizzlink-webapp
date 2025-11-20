"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  useGetProjectQuery,
  useCreateProposalMutation,
  useGetProposalQuery,
  useUpdateProposalMutation,
} from "@/lib/redux/api/firebaseApi";
import { Proposal, ProposalBid } from "@/lib/redux/types/firebaseTypes";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  validateProposalFile,
  uploadProposalAttachments,
} from "@/lib/services/storageService";
import { storage } from "@/firebase";

export default function ProposalPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth.user);

  // Extract query parameters for edit mode
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const proposalId = searchParams.get("proposalId");

  // Fetch the project details
  const { data: project, isLoading: isLoadingProject } = useGetProjectQuery(
    id as string
  );

  // Fetch existing proposal data if in edit mode
  const { data: existingProposal, isLoading: isLoadingProposal } =
    useGetProposalQuery(proposalId as string, {
      skip: !isEditMode || !proposalId,
    });

  // State for proposal form
  const [bidType, setBidType] = useState<"fixed" | "hourly">("fixed");
  const [bidAmount, setBidAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // State for file attachments
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    { name: string; url: string; size: number; type: string }[]
  >([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  // State for questions
  const [questions, setQuestions] = useState<
    { id: string; question: string }[]
  >([]);
  const [newQuestion, setNewQuestion] = useState("");

  // Redux mutation hooks for creating and updating proposals
  const [
    createProposal,
    {
      isLoading: isCreating,
      isSuccess: isCreateSuccess,
      isError: isCreateError,
      error: createError,
    },
  ] = useCreateProposalMutation();
  const [
    updateProposal,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateProposalMutation();

  // Combine loading and submission states
  const isSubmitting = isCreating || isUpdating;
  const isSuccess = isCreateSuccess || isUpdateSuccess;
  const isError = isCreateError || isUpdateError;
  const error = createError || updateError;

  // Load existing proposal data when in edit mode
  useEffect(() => {
    if (isEditMode && existingProposal && !isLoadingProposal) {
      // Set bid type and amount
      if (existingProposal.bid) {
        setBidType(existingProposal.bid.type as "fixed" | "hourly");
        setBidAmount(existingProposal.bid.amount.toString());
      }

      // Set timeline
      if (existingProposal.timeline) {
        setTimeline(existingProposal.timeline);
      }

      // Set cover letter
      if (existingProposal.coverLetter) {
        setCoverLetter(existingProposal.coverLetter);
      }

      // Set questions
      if (existingProposal.questions && existingProposal.questions.length > 0) {
        setQuestions(
          existingProposal.questions.map((q: any, index: number) => ({
            id: `existing-${index}`,
            question: typeof q === "string" ? q : q.question,
          }))
        );
      }

      // Set existing attachments
      if (
        existingProposal.attachments &&
        existingProposal.attachments.length > 0
      ) {
        setExistingAttachments(
          existingProposal.attachments.map((attachment) => ({
            name: attachment.fileName || attachment.name || "Unnamed file",
            url: attachment.fileUrl || attachment.url || "",
            size: attachment.size || 0,
            type:
              attachment.fileType ||
              attachment.type ||
              "application/octet-stream",
          }))
        );
      }

      // Automatically agree to terms
      setAgreeToTerms(true);
    }
  }, [existingProposal, isEditMode, isLoadingProposal]);

  // Calculate suggested bid range based on project budget
  const getSuggestedBidRange = () => {
    if (!project) return { min: 0, max: 0, currency: "$" };

    const { budget } = project;
    let min, max, currency;

    if (budget.type === "fixed") {
      // For fixed projects, suggest a range around the budget amount
      min = Math.round(budget.amount * 0.85); // 15% less than budget
      max = Math.round(budget.amount * 1.1); // 10% more than budget
      currency = budget.currency;
    } else {
      // For hourly projects, use the min and max hourly rate
      min = budget.minAmount;
      max = budget.maxAmount;
      currency = budget.currency;
    }

    return { min, max, currency };
  };

  // Get suggested timeline based on project timeline
  const getSuggestedTimeline = () => {
    if (!project) return "";
    return project.timeline?.duration || "";
  };

  // Prefill form with suggested values
  useEffect(() => {
    if (project) {
      setBidType(project.budget?.type || "fixed");
      setTimeline(getSuggestedTimeline());
    }
  }, [project]);

  // Form validation
  const validateForm = () => {
    const bidAmountNum = parseFloat(bidAmount);

    if (!bidAmount || isNaN(bidAmountNum) || bidAmountNum <= 0) {
      return "Please enter a valid bid amount";
    }

    if (!timeline) {
      return "Please enter your estimated timeline";
    }

    if (!coverLetter || coverLetter.length < 50) {
      return "Please write a detailed cover letter (at least 50 characters)";
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question || q.question.trim().length < 5) {
        return "All questions must be at least 5 characters long";
      }
    }

    if (attachments.length > 5) {
      return "You can attach a maximum of 5 files";
    }

    if (!agreeToTerms) {
      return "You must agree to the terms and conditions";
    }

    return null; // No errors
  };

  // Use the proposal attachment service imported at the top of the file

  // Upload attachments to Firebase Storage
  const uploadAttachments = async () => {
    if (attachments.length === 0) return [];

    try {
      setUploadError(null);

      // Use the centralized storage service
      return await uploadProposalAttachments(
        attachments,
        project.projectId,
        (fileName, progress) => {
          // Update progress state
          setUploadProgress((prev) => ({
            ...prev,
            [fileName]: progress,
          }));
        }
      );
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError("Failed to upload one or more files");
      throw new Error("Failed to upload attachments");
    }
  };

  // Handle proposal submission
  const handleSubmitProposal = async () => {
    setSubmitAttempted(true);

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Missing Information",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    if (!user || !project) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a proposal",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload files first if there are any attachments
      const uploadedAttachments = await uploadAttachments();

      // Format questions for the API to match ProposalQuestion type
      const formattedQuestions = questions.map((q) => ({
        question: q.question,
        answer: "", // Initialize empty answer field
      }));

      // Combine existing attachments with newly uploaded ones and format them correctly for Firestore
      const allAttachments = [
        // Format existing attachments to match ProposalAttachment interface
        ...existingAttachments.map((file) => ({
          fileName: file.name || "Unnamed file",
          fileUrl: file.url || "",
          fileType: file.type || "application/octet-stream",
          size: file.size || 0,
        })),
        // New uploaded attachments already have the correct format
        ...uploadedAttachments,
      ];

      // Create the proposal data object
      const proposalData = {
        projectId: project.projectId,
        freelancerId: user.userId,
        freelancerInfo: {
          name: user.displayName,
          photoURL: user.photoURL || "",
          title: user.title || "",
          rating: user.stats?.averageRating || 0,
          completedJobs: user.stats?.completedJobs || 0,
        },
        bid: {
          amount: parseFloat(bidAmount),
          currency: project.budget.currency,
          type: bidType,
          timeline: timeline,
          deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now as default
        },
        coverLetter: coverLetter,
        attachments: allAttachments,
        questions: formattedQuestions,
        status: "submitted" as const,
        isInvited: false,
        updatedAt: new Date(),
      };

      if (isEditMode && proposalId) {
        // When editing, maintain the original submission date and update the updatedAt date
        await updateProposal({
          id: proposalId,
          proposal: {
            ...proposalData,
            // Don't overwrite the original submission date when editing
            submittedAt: existingProposal?.submittedAt || new Date(),
          },
        });

        toast({
          title: "Proposal Updated",
          description: "Your proposal has been updated successfully!",
          variant: "default",
        });
      } else {
        // For new proposals, set the submission date
        proposalData.submittedAt = new Date();

        // Submit as a new proposal
        await createProposal(proposalData);

        toast({
          title: "Proposal Submitted",
          description: "Your proposal has been submitted successfully!",
          variant: "default",
        });
      }

      // Redirect to the project page after success
      router.push(`/projects/${id}`);
    } catch (err: any) {
      toast({
        title: "Error Submitting Proposal",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Redirect if user is not logged in or is not a freelancer
  useEffect(() => {
    if (user && user.role !== "freelancer") {
      toast({
        title: "Access Restricted",
        description: "Only freelancers can submit proposals",
        variant: "destructive",
      });
      router.push(`/projects/${id}`);
    }
  }, [user, id, router, toast]);

  // Handle successful submission
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been submitted successfully!",
        variant: "default",
      });
      router.push(`/projects/${id}`);
    }
  }, [isSuccess, id, router, toast]);

  // Handle submission error
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error Submitting Proposal",
        description:
          (error as any)?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Handle file attachment selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      // Convert FileList to array
      const newFiles = Array.from(fileList);

      // First check if adding these files would exceed our 5 file limit
      const totalExistingFiles =
        attachments.length + existingAttachments.length;
      if (totalExistingFiles + newFiles.length > 5) {
        setUploadError(
          `You can only upload a maximum of 5 files total. You've selected ${
            newFiles.length
          } new files, but can only add ${5 - totalExistingFiles} more.`
        );
        return;
      }

      // Validate file types and sizes using our service
      for (const file of newFiles) {
        const validation = validateProposalFile(file);
        if (!validation.valid) {
          setUploadError(validation.error);
          return;
        }
      }

      // All files are valid, add them to state
      setAttachments((prev) => [...prev, ...newFiles]);
      setUploadError(null);
    }
  };

  // Remove a file from attachments
  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    if (newQuestion.trim() && questions.length < 5) {
      const questionId = `q_${Date.now()}`;
      setQuestions((prev) => [
        ...prev,
        { id: questionId, question: newQuestion.trim() },
      ]);
      setNewQuestion("");
    }
  };

  // Handle removing a question
  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Track form changes
  useEffect(() => {
    if (
      bidAmount ||
      timeline ||
      coverLetter ||
      attachments.length > 0 ||
      questions.length > 0
    ) {
      setFormTouched(true);
    }
  }, [bidAmount, timeline, coverLetter, attachments, questions]);

  // Loading state
  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state if project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The project you're applying to doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  // Get suggested bid range
  const suggestedBid = getSuggestedBidRange();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isEditMode ? "Edit Proposal" : "Submit a Proposal"}
          </h1>
          <p className="text-lg text-gray-600">
            {isEditMode ? "Update" : "Submit"} your proposal for{" "}
            <span className="font-semibold text-blue-700">{project.title}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Proposal Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 p-6">
                <h2 className="text-xl font-bold text-white">Your Proposal</h2>
              </div>
              <CardContent className="p-8 pt-6">
                <div className="space-y-6">
                  {/* Bid Details */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">
                      Bid Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="bid-type">Bid Type</Label>
                        <Select
                          value={bidType}
                          onValueChange={(value: "fixed" | "hourly") =>
                            setBidType(value)
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select bid type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Price</SelectItem>
                            <SelectItem value="hourly">Hourly Rate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="bid-amount"
                          className="flex justify-between"
                        >
                          <span>Bid Amount</span>
                          <span className="text-gray-500 text-sm">
                            {suggestedBid.currency}
                            {suggestedBid.min} - {suggestedBid.currency}
                            {suggestedBid.max} (suggested)
                          </span>
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <DollarSign className="w-5 h-5 text-gray-500" />
                          </div>
                          <Input
                            type="number"
                            id="bid-amount"
                            placeholder={
                              bidType === "fixed"
                                ? "Enter your bid amount"
                                : "Enter hourly rate"
                            }
                            className="pl-10"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            required
                          />
                        </div>
                        {submitAttempted && !bidAmount && (
                          <p className="text-sm text-red-600">
                            Please enter a bid amount
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="timeline"
                        className="flex justify-between"
                      >
                        <span>Estimated Timeline</span>
                        <span className="text-gray-500 text-sm">
                          Project duration:{" "}
                          {project.timeline?.duration || "Not specified"}
                        </span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Clock className="w-5 h-5 text-gray-500" />
                        </div>
                        <Input
                          type="text"
                          id="timeline"
                          placeholder="e.g. '2 weeks', '1 month'"
                          className="pl-10"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          required
                        />
                      </div>
                      {submitAttempted && !timeline && (
                        <p className="text-sm text-red-600">
                          Please specify your estimated timeline
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-medium text-gray-900">
                        Cover Letter
                      </h3>
                      <div className="text-sm text-gray-500">
                        {coverLetter.length}/5000 characters
                      </div>
                    </div>

                    <Textarea
                      placeholder="Introduce yourself, explain why you're the best fit for this project, and detail your relevant experience..."
                      className="min-h-[200px] resize-y"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      maxLength={5000}
                      required
                    />
                    {submitAttempted &&
                      (!coverLetter || coverLetter.length < 50) && (
                        <p className="mt-2 text-sm text-red-600">
                          Please write a detailed cover letter (at least 50
                          characters)
                        </p>
                      )}

                    <div className="mt-3 text-sm text-gray-500">
                      <p>A great cover letter should:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>
                          Show your understanding of the project requirements
                        </li>
                        <li>Highlight your relevant skills and experience</li>
                        <li>Explain your approach to the project</li>
                        <li>
                          Mention your availability and communication style
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                      <Paperclip className="w-5 h-5 mr-2" />
                      Attachments
                    </h3>

                    <div className="space-y-4">
                      {/* File upload input */}
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="file-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Paperclip className="w-8 h-8 text-blue-500 mb-2" />
                            <p className="mb-2 text-sm text-blue-700">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-blue-600">
                              PDF, DOCX, JPG, PNG, GIF, or ZIP (Max 5MB)
                            </p>
                            {uploadError && (
                              <p className="text-xs text-red-600 mt-2">
                                {uploadError}
                              </p>
                            )}
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                            disabled={
                              attachments.length + existingAttachments.length >=
                              5
                            }
                          />
                        </label>
                      </div>

                      {/* Info text */}
                      <p className="text-sm text-gray-500">
                        Attach up to 5 files that showcase your relevant work or
                        provide additional information.
                      </p>

                      {/* Existing Attachments (if editing) */}
                      {existingAttachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Existing Attachments
                          </h4>
                          <div className="space-y-3">
                            {existingAttachments.map((file, index) => (
                              <div
                                key={`existing-${index}`}
                                className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                              >
                                <div className="flex items-center space-x-3 flex-1 mr-4">
                                  <div className="p-2 bg-white rounded-md shadow-sm">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                      {file.name || "Unnamed file"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {typeof file.size === "number" &&
                                      !isNaN(file.size)
                                        ? `${(file.size / 1024).toFixed(1)} KB`
                                        : "Size unknown"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {file.url ? (
                                    <Link
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:bg-blue-50"
                                      >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 cursor-not-allowed"
                                      disabled
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() =>
                                      setExistingAttachments((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      )
                                    }
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New File list */}
                      {attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            New Files
                          </h4>
                          <div className="space-y-3">
                            {attachments.map((file, index) => (
                              <div
                                key={`new-${index}`}
                                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg"
                              >
                                <div className="flex items-center space-x-3 flex-1 mr-4">
                                  <div className="p-2 bg-white rounded-md shadow-sm">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                      {file.name || "Unnamed file"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {typeof file.size === "number" &&
                                      !isNaN(file.size)
                                        ? `${(file.size / 1024).toFixed(1)} KB`
                                        : "Size unknown"}
                                    </p>
                                  </div>
                                </div>

                                {/* Upload progress */}
                                {uploadProgress[file.name] !== undefined &&
                                  uploadProgress[file.name] < 100 && (
                                    <div className="w-24 mr-4">
                                      <Progress
                                        value={uploadProgress[file.name]}
                                        className="h-2 bg-blue-100"
                                      />
                                      <span className="text-xs text-gray-500">
                                        {uploadProgress[file.name]}%
                                      </span>
                                    </div>
                                  )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          {attachments.length + existingAttachments.length >=
                            5 && (
                            <p className="text-sm text-amber-600">
                              Maximum 5 files allowed
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Questions for Client
                    </h3>

                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Add up to 5 questions for the client to answer. This
                        helps clarify project details and demonstrates your
                        engagement.
                      </p>

                      {/* Current Questions */}
                      {questions.length > 0 && (
                        <div className="space-y-3">
                          {questions.map((q) => (
                            <div key={q.id} className="flex items-start group">
                              <div className="flex-1 p-3 border border-gray-200 rounded-lg bg-white">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">
                                    Question:
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveQuestion(q.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-gray-800 mt-1">
                                  {q.question}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add New Question */}
                      {questions.length < 5 && (
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-3">
                            <Textarea
                              placeholder="Enter a question for the client..."
                              value={newQuestion}
                              onChange={(e) => setNewQuestion(e.target.value)}
                              className="resize-none"
                              maxLength={300}
                            />
                            <Button
                              className="h-full bg-blue-600 hover:bg-blue-700"
                              disabled={!newQuestion.trim()}
                              onClick={handleAddQuestion}
                            >
                              Add
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 flex justify-between">
                            <span>Be concise and specific</span>
                            <span>{newQuestion.length}/300 characters</span>
                          </div>
                        </div>
                      )}

                      {questions.length >= 5 && (
                        <p className="text-sm text-amber-600">
                          Maximum 5 questions allowed
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={setAgreeToTerms}
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms and Conditions
                        </Link>{" "}
                        and confirm that my proposal is accurate and honest
                      </Label>
                    </div>
                    {submitAttempted && !agreeToTerms && (
                      <p className="mt-2 text-sm text-red-600">
                        You must agree to the terms and conditions
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-8 pb-2">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 text-lg shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                      onClick={handleSubmitProposal}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          {isEditMode
                            ? "Updating Proposal..."
                            : "Submitting Proposal..."}
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6 mr-3" />
                          {isEditMode ? "Update Proposal" : "Submit Proposal"}
                        </>
                      )}
                    </Button>
                    {submitAttempted && validateForm() && (
                      <p className="mt-2 text-center text-red-600">
                        {validateForm()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Project Summary */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 p-5">
                <h3 className="text-lg font-bold text-white">
                  Project Summary
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-4">
                    {project.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/projects/${project.projectId}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View full project details
                    </Link>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Budget:</span>
                      <span className="font-semibold text-gray-900">
                        {project.budget?.type === "fixed"
                          ? `${project.budget.currency} ${project.budget.amount}`
                          : `${project.budget.currency} ${project.budget.minAmount} - ${project.budget.maxAmount}/hr`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Duration:</span>
                      <span className="font-semibold text-gray-900">
                        {project.timeline?.duration || "Not specified"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Experience:</span>
                      <span className="font-semibold text-gray-900 capitalize">
                        {project.requirements?.experienceLevel || "Any"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Posted:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 p-5">
                <h3 className="text-lg font-bold text-white">
                  Submission Tips
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Be specific.</strong>{" "}
                      Show that you understand the project by mentioning
                      specific requirements.
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Be realistic.</strong>{" "}
                      Set fair pricing and timeline expectations for the work
                      required.
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Stand out.</strong>{" "}
                      Highlight your unique skills and experiences relevant to
                      this project.
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      4
                    </div>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Proofread.</strong>{" "}
                      Check for typos, grammar mistakes, and clarity before
                      submitting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {formTouched && !agreeToTerms && !submitAttempted && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Don't forget to agree to the terms and conditions before
                  submitting your proposal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
