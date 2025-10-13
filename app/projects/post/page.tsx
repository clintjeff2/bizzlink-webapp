"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  DollarSign,
  Calendar,
  Briefcase,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
  Users,
  User,
  Eye,
  Globe,
  Lock,
  Zap,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  type ProjectFormData,
  defaultProjectFormData,
  ProjectFormPersistence,
  validateStep,
  convertFormDataToProject,
  AutoSave,
} from "@/lib/services/projectFormService";
import {
  uploadProjectRequirementFiles,
  deleteProjectRequirementFiles,
  type FileUploadResult,
} from "@/lib/services/storageService";
import {
  useCreateProjectMutation,
  useGetProjectQuery,
  useUpdateProjectMutation,
} from "@/lib/redux/api/firebaseApi";
import { toast } from "@/hooks/use-toast";

const categories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Data Science",
  "DevOps",
  "Blockchain",
  "AI/Machine Learning",
];

const subcategories: Record<string, string[]> = {
  "Web Development": [
    "Frontend Development",
    "Backend Development",
    "Full Stack",
    "E-commerce",
    "CMS Development",
    "API Development",
  ],
  "Mobile Development": [
    "iOS Development",
    "Android Development",
    "Cross-Platform",
    "React Native",
    "Flutter",
    "Ionic",
  ],
  "UI/UX Design": [
    "User Interface Design",
    "User Experience Design",
    "Wireframing",
    "Prototyping",
    "Visual Design",
    "Interaction Design",
  ],
  "Graphic Design": [
    "Logo Design",
    "Brand Identity",
    "Print Design",
    "Illustrations",
    "Icon Design",
    "Packaging Design",
  ],
  "Digital Marketing": [
    "SEO",
    "Social Media Marketing",
    "PPC Advertising",
    "Email Marketing",
    "Content Marketing",
    "Analytics",
  ],
  "Content Writing": [
    "Blog Writing",
    "Copywriting",
    "Technical Writing",
    "Social Media Content",
    "Product Descriptions",
    "SEO Writing",
  ],
  "Data Science": [
    "Data Analysis",
    "Machine Learning",
    "Data Visualization",
    "Statistical Analysis",
    "Business Intelligence",
    "Data Mining",
  ],
  DevOps: [
    "CI/CD",
    "Cloud Infrastructure",
    "Container Management",
    "Monitoring",
    "Security",
    "Automation",
  ],
  Blockchain: [
    "Smart Contracts",
    "DeFi Development",
    "NFT Projects",
    "Crypto Trading Bots",
    "Blockchain Architecture",
    "Web3 Development",
  ],
  "AI/Machine Learning": [
    "Computer Vision",
    "Natural Language Processing",
    "Predictive Modeling",
    "Deep Learning",
    "AI Chatbots",
    "Recommendation Systems",
  ],
};

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"];

const skills = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "iOS",
  "Android",
  "Flutter",
  "React Native",
  "Swift",
  "Kotlin",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Photoshop",
  "Illustrator",
  "SEO",
  "Google Ads",
  "Facebook Ads",
  "Content Marketing",
  "Email Marketing",
  "WordPress",
  "Shopify",
  "Magento",
  "WooCommerce",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
];

export default function PostProjectPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isDeletingFiles, setIsDeletingFiles] = useState<
    Record<number, boolean>
  >({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if we're in edit mode
  const editProjectId = searchParams.get("edit");
  const isEditMode = !!editProjectId;

  const { user } = useSelector((state: RootState) => state.auth);
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();

  // Fetch project data for edit mode
  const {
    data: existingProject,
    isLoading: isLoadingProject,
    error: projectLoadError,
  } = useGetProjectQuery(editProjectId || "", {
    skip: !isEditMode,
  });

  const [projectData, setProjectData] = useState<ProjectFormData>(
    defaultProjectFormData
  );

  // Load existing project data for editing
  useEffect(() => {
    if (isEditMode && existingProject && !isLoadingProject) {
      // Check if user is the owner
      if (existingProject.clientId !== user?.userId) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to edit this project",
          variant: "destructive",
        });
        router.push("/client/projects");
        return;
      }

      // Convert project to form data
      const formData: ProjectFormData = {
        title: existingProject.title || "",
        category: existingProject.category || "",
        subcategory: existingProject.subcategory || "",
        description: existingProject.description || "",
        requirements: existingProject.detailedRequirements || "",
        skills: existingProject.requirements?.skills || [],
        experienceLevel:
          existingProject.requirements?.experienceLevel || "intermediate",
        projectType: "one-time", // Default fallback
        location: existingProject.requirements?.location || "remote",
        freelancerType:
          existingProject.requirements?.freelancerType || "individual",
        budgetType: existingProject.budget?.type || "fixed",
        budgetMin:
          existingProject.budget?.minAmount?.toString() ||
          existingProject.budget?.amount?.toString() ||
          "",
        budgetMax:
          existingProject.budget?.maxAmount?.toString() ||
          existingProject.budget?.amount?.toString() ||
          "",
        currency: existingProject.budget?.currency || "USD",
        timeline: existingProject.timeline?.duration || "",
        startDate: existingProject.timeline?.startDate
          ? new Date(existingProject.timeline.startDate)
              .toISOString()
              .split("T")[0]
          : "",
        endDate: existingProject.timeline?.endDate
          ? new Date(existingProject.timeline.endDate)
              .toISOString()
              .split("T")[0]
          : "",
        isUrgent: existingProject.timeline?.isUrgent || false,
        visibility: existingProject.visibility || "public",
        milestones:
          existingProject.milestones?.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            amount: m.amount.toString(),
            dueDate: new Date(m.dueDate).toISOString().split("T")[0],
            deliverables: m.deliverables || [],
          })) || [],
        attachments: [], // We'll handle file attachments separately
        currentStep: 1,
        lastSavedAt: "",
        isDraft: existingProject.status === "draft",
      };

      setProjectData(formData);

      // Set uploaded files from existing attachments
      if (existingProject.requirements?.attachments) {
        // First, extract file sizes from the attachments or estimate based on file type
        const estimateFileSize = (
          fileName: string,
          fileType: string,
          providedSize: number | undefined
        ) => {
          // If size is provided and valid, use it
          if (providedSize && providedSize > 0) {
            return providedSize;
          }

          // Otherwise estimate based on file type
          const fileExt = fileName.split(".").pop()?.toLowerCase();
          if (fileType.includes("image")) {
            return 500 * 1024; // ~500KB for images
          } else if (fileExt === "pdf") {
            return 2 * 1024 * 1024; // ~2MB for PDFs
          } else if (["doc", "docx"].includes(fileExt || "")) {
            return 1.5 * 1024 * 1024; // ~1.5MB for Word docs
          } else if (["zip"].includes(fileExt || "")) {
            return 3 * 1024 * 1024; // ~3MB for archives
          } else {
            return 1 * 1024 * 1024; // ~1MB default
          }
        };

        const fileResults: FileUploadResult[] =
          existingProject.requirements.attachments.map((a) => {
            const estimatedSize = estimateFileSize(
              a.fileName,
              a.fileType || "",
              a.fileSize
            );
            return {
              fileName: a.fileName,
              fileUrl: a.fileUrl,
              fileType: a.fileType || "application/octet-stream",
              uploadedAt: a.uploadedAt || new Date().toISOString(),
              path: a.storageRef || a.fileUrl, // Use storageRef if available, fallback to fileUrl
              size: estimatedSize, // Use estimated size if fileSize is not available
            };
          });
        setUploadedFiles(fileResults);

        // Create File objects for the UI to display with reasonable size estimates
        const filePlaceholders = existingProject.requirements.attachments.map(
          (a) => {
            // Create a File-like object for UI display with the same size as in fileResults
            const correspondingFileResult = fileResults.find(
              (f) => f.fileName === a.fileName
            );
            const size = correspondingFileResult?.size || 0;

            // Create blob with dummy content proportional to the estimated size
            // This is just to make the File object report a realistic size
            const dummyContent = new ArrayBuffer(Math.min(size, 1024)); // Limit actual memory usage
            const fileBlob = new Blob([dummyContent], {
              type: a.fileType || "application/octet-stream",
            });

            const file = new File([fileBlob], a.fileName, {
              type: a.fileType || "application/octet-stream",
              lastModified: new Date(a.uploadedAt || Date.now()).getTime(),
            });

            // Use Object.defineProperty to override the size property
            Object.defineProperty(file, "size", {
              value: size,
              writable: false,
            });

            return file;
          }
        );

        // Update the form data with these placeholder files for UI display
        handleInputChange("attachments", filePlaceholders);
      }

      toast({
        title: "Project Loaded",
        description: "Project details loaded for editing",
      });
    }
  }, [isEditMode, existingProject, isLoadingProject, user?.userId, router]);

  // Load saved data on component mount (only for new projects)
  useEffect(() => {
    if (!isEditMode) {
      const savedData = ProjectFormPersistence.load();
      if (savedData) {
        setProjectData(savedData);
        if (savedData.currentStep > 1) {
          setStep(savedData.currentStep);
        }
        if (savedData.lastSavedAt) {
          setLastSaved(new Date(savedData.lastSavedAt));
        }
        toast({
          title: "Draft Restored",
          description: "Your previous work has been restored",
          duration: 3000,
        });
      }
    }
  }, [isEditMode]);

  // Auto-save functionality
  useEffect(() => {
    if (projectData.title || projectData.description || projectData.category) {
      AutoSave.schedule({
        ...projectData,
        currentStep: step,
        lastSavedAt: new Date().toISOString(),
      });
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [projectData, step]);

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors for this field
    if (validationErrors.length > 0) {
      const validation = validateStep(step, { ...projectData, [field]: value });
      setValidationErrors(validation.errors);
    }
  };

  const addSkill = (skill: string) => {
    if (!projectData.skills.includes(skill)) {
      handleInputChange("skills", [...projectData.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    handleInputChange(
      "skills",
      projectData.skills.filter((s) => s !== skill)
    );
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      title: "",
      description: "",
      amount: "",
      dueDate: "",
      deliverables: [],
    };
    handleInputChange("milestones", [...projectData.milestones, newMilestone]);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = projectData.milestones.filter((_, i) => i !== index);
    handleInputChange("milestones", newMilestones);
  };

  const updateMilestone = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    const newMilestones = projectData.milestones.map((milestone, i) =>
      i === index ? { ...milestone, [field]: value } : milestone
    );
    handleInputChange("milestones", newMilestones);
  };

  const addDeliverable = (milestoneIndex: number) => {
    const milestone = projectData.milestones[milestoneIndex];
    const newDeliverables = [...milestone.deliverables, ""];
    updateMilestone(milestoneIndex, "deliverables", newDeliverables);
  };

  const updateDeliverable = (
    milestoneIndex: number,
    deliverableIndex: number,
    value: string
  ) => {
    const milestone = projectData.milestones[milestoneIndex];
    const newDeliverables = milestone.deliverables.map((d, i) =>
      i === deliverableIndex ? value : d
    );
    updateMilestone(milestoneIndex, "deliverables", newDeliverables);
  };

  const removeDeliverable = (
    milestoneIndex: number,
    deliverableIndex: number
  ) => {
    const milestone = projectData.milestones[milestoneIndex];
    const newDeliverables = milestone.deliverables.filter(
      (_, i) => i !== deliverableIndex
    );
    updateMilestone(milestoneIndex, "deliverables", newDeliverables);
  };

  const handleFileUpload = async (files: FileList | null) => {
    console.log("handleFileUpload called with:", files);

    if (!files || files.length === 0) {
      console.log("No files selected");
      return;
    }

    console.log(
      "Files selected:",
      Array.from(files).map((f) => f.name)
    );

    const maxFiles = 5;
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/gif",
      "application/zip",
      "text/plain",
    ];

    const currentFiles = projectData.attachments.length;
    const availableSlots = maxFiles - currentFiles;

    if (files.length > availableSlots) {
      toast({
        title: "Too Many Files",
        description: `You can only upload ${availableSlots} more file(s). Maximum ${maxFiles} files allowed.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name} exceeds 10MB limit`);
      } else if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} has an unsupported file type`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "Invalid Files",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      setIsUploadingFiles(true);
      setUploadProgress({});

      try {
        // Generate a temporary project ID for file organization
        const tempProjectId = `temp_${Date.now()}`;

        // Upload files to Firebase Storage
        const uploadResults = await uploadProjectRequirementFiles(
          tempProjectId,
          validFiles,
          (progress, fileName) => {
            setUploadProgress((prev) => ({
              ...prev,
              [fileName]: progress,
            }));
          }
        );

        // Add uploaded files to state
        setUploadedFiles((prev) => [...prev, ...uploadResults]);

        // Update form data with file information
        const newAttachments = [...projectData.attachments, ...validFiles];
        handleInputChange("attachments", newAttachments);

        toast({
          title: "Files Uploaded Successfully",
          description: `${uploadResults.length} file(s) uploaded and ready to attach to your project`,
        });
      } catch (error) {
        console.error("File upload error:", error);
        toast({
          title: "Upload Failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to upload files. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploadingFiles(false);
        setUploadProgress({});
      }
    }
  };

  const removeAttachment = async (index: number) => {
    // Set loading state for this specific file
    setIsDeletingFiles((prev) => ({ ...prev, [index]: true }));

    try {
      // Check if this file was uploaded to Firebase Storage
      const uploadedFile = uploadedFiles[index];

      if (uploadedFile && uploadedFile.path) {
        // For existing files in edit mode, we don't want to delete from storage yet
        // We'll track removals and only delete on form submission
        const isExistingFile =
          isEditMode && !projectData.attachments[index]?.size && uploadedFile;

        if (!isExistingFile) {
          // Delete from Firebase Storage first (only for newly uploaded files)
          await deleteProjectRequirementFiles([uploadedFile.path]);

          toast({
            title: "File Removed",
            description: `${uploadedFile.fileName} has been deleted from storage`,
          });
        } else {
          // Just mark for removal without immediate deletion for existing files
          toast({
            title: "File Marked for Removal",
            description: `${uploadedFile.fileName} will be removed when you save changes`,
          });
        }
      }

      // Remove from local state
      const newAttachments = projectData.attachments.filter(
        (_, i) => i !== index
      );
      handleInputChange("attachments", newAttachments);

      // Remove from uploaded files list
      if (index < uploadedFiles.length) {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error removing attachment:", error);
      toast({
        title: "Error Removing File",
        description:
          error instanceof Error
            ? error.message
            : "Failed to remove file. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clear loading state
      setIsDeletingFiles((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    }
  };

  const handleNext = () => {
    const validation = validateStep(step, projectData);
    setValidationErrors(validation.errors);

    if (validation.isValid) {
      if (step < 4) {
        setStep(step + 1);
        handleInputChange("currentStep", step + 1);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before continuing",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      handleInputChange("currentStep", step - 1);
    }
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      const draftData = {
        ...projectData,
        isDraft: true,
        lastSavedAt: new Date().toISOString(),
      };
      ProjectFormPersistence.save(draftData);
      setLastSaved(new Date());
      toast({
        title: "Draft Saved",
        description: "Your project has been saved as a draft",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    const validation = validateStep(4, projectData);
    setValidationErrors(validation.errors);

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before posting",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Ensure user is authenticated
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to post a project",
          variant: "destructive",
        });
        router.push("/auth/login");
        return;
      }

      // Use actual authenticated user data
      const clientInfo = {
        name: user.displayName || `${user.firstname} ${user.lastname}`,
        photoURL: user.photoURL || "/placeholder-user.jpg",
        verificationStatus: user.isVerified,
      };

      // Convert uploaded files to project attachment format
      const attachmentData = uploadedFiles.map((file) => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileType: file.fileType || file.fileName.split(".").pop() || "",
        uploadedAt: new Date().toISOString(),
        storageRef: file.path, // Store the storage reference for later deletion
        fileSize: file.size || 0, // Store file size for reference
      }));

      if (isEditMode && editProjectId && existingProject) {
        // Update existing project - ensure isDraft is false for publishing
        const finalProjectData = {
          ...projectData,
          isDraft: false, // Explicitly set to false when posting project
        };

        const baseProjectData = convertFormDataToProject(
          finalProjectData,
          user.userId,
          clientInfo,
          attachmentData,
          existingProject // Pass existing project to preserve important fields
        );

        // Create an update object that preserves important existing data
        const projectToUpdate = {
          ...baseProjectData,
          // Preserve existing proposal count
          proposalCount: existingProject.proposalCount,
          // Preserve hired freelancer ID if exists
          hiredFreelancerId: existingProject.hiredFreelancerId || "",
        };

        await updateProject({
          projectId: editProjectId,
          updateData: projectToUpdate,
        }).unwrap();

        toast({
          title: "Project Updated Successfully!",
          description: "Your project changes have been saved",
        });

        router.push(`/projects/${editProjectId}`);
      } else {
        // Create new project - ensure isDraft is false for publishing
        const finalProjectData = {
          ...projectData,
          isDraft: false, // Explicitly set to false when posting project
        };

        const projectToCreate = convertFormDataToProject(
          finalProjectData,
          user.userId,
          clientInfo,
          attachmentData
        );

        const result = await createProject(projectToCreate).unwrap();

        // Clear saved draft
        ProjectFormPersistence.clear();
        AutoSave.cancel();

        toast({
          title: "Project Posted Successfully!",
          description: "Your project is now live and visible to freelancers",
        });

        router.push("/client/projects");
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while fetching project for edit mode
  if (isEditMode && isLoadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen if project failed to load for edit mode
  if (isEditMode && projectLoadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The project you're trying to edit doesn't exist or you don't have
              permission to edit it.
            </p>
            <Button onClick={() => router.push("/client/projects")}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/10 to-green-50/10">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Gradient */}
        <div className="relative mb-12 text-center">
          <div className="absolute inset-0 bg-primary-blue/10 rounded-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-md">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary-blue p-3 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-primary-blue mb-3">
              {isEditMode ? "Edit Your Project" : "Post Your Dream Project"}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {isEditMode
                ? "Update your project details and requirements"
                : "Connect with world-class freelancers and bring your vision to life"}
            </p>
            {/* Back to Projects Button (Only visible in edit mode) */}
            {isEditMode && (
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    // Clear form data and navigate back to projects
                    ProjectFormPersistence.clear();
                    router.push("/client/projects");
                  }}
                  className="bg-primary-blue hover:bg-primary-blue-dark text-white flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </Button>
              </div>
            )}{" "}
            {/* Auto-save indicator */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
                  <span className="text-sm text-primary-blue">Saving...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-primary-green" />
                  <span className="text-sm text-primary-green-dark">
                    Last saved {lastSaved.toLocaleTimeString()}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              {[
                "Project Details",
                "Requirements & Preferences",
                "Budget & Timeline",
                "Review & Post",
              ].map((stepName, index) => (
                <div key={index} className="flex items-center relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        index + 1 < step
                          ? "bg-green-400 text-white shadow-lg scale-110"
                          : index + 1 === step
                          ? "bg-primary-blue text-white shadow-lg scale-110"
                          : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                      }`}
                    >
                      {index + 1 < step ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                        index + 1 <= step ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      {stepName}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-24 h-1 mx-6 rounded-full transition-all duration-500 ${
                        index + 1 < step
                          ? "bg-gradient-to-r from-green-400 to-blue-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Main Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-xl"></div>
          <Card className="relative border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            {/* Validation Errors Display */}
            {validationErrors.length > 0 && (
              <div className="m-6 mb-0 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <h4 className="text-red-800 font-medium">
                    Please fix the following issues:
                  </h4>
                </div>
                <ul className="text-red-700 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <CardContent className="p-8">
              {/* Step 1: Project Details */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Let's Start With the Basics
                    </h2>
                    <p className="text-gray-600">
                      Tell us about your project vision
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <Label
                        htmlFor="title"
                        className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Project Title
                      </Label>
                      <div className="relative">
                        <Input
                          id="title"
                          placeholder="e.g., Build a responsive e-commerce website with modern UI"
                          value={projectData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-1" />
                        Write a clear, compelling title that captures your
                        project's essence
                      </p>
                    </div>

                    <div className="group">
                      <Label
                        htmlFor="category"
                        className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                      >
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Category
                      </Label>
                      <div className="relative">
                        <Select
                          value={projectData.category}
                          onValueChange={(value) => {
                            handleInputChange("category", value);
                            handleInputChange("subcategory", ""); // Reset subcategory when category changes
                          }}
                        >
                          <SelectTrigger className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                            <SelectValue placeholder="Choose the best category for your project" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-200 shadow-2xl">
                            {categories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category}
                                className="rounded-lg"
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                    </div>

                    {projectData.category && (
                      <div className="group">
                        <Label
                          htmlFor="subcategory"
                          className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                        >
                          <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                          Subcategory
                        </Label>
                        <div className="relative">
                          <Select
                            value={projectData.subcategory}
                            onValueChange={(value) =>
                              handleInputChange("subcategory", value)
                            }
                          >
                            <SelectTrigger className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-pink-500 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                              <SelectValue placeholder="Select a more specific category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-200 shadow-2xl">
                              {subcategories[projectData.category]?.map(
                                (subcategory) => (
                                  <SelectItem
                                    key={subcategory}
                                    value={subcategory}
                                    className="rounded-lg"
                                  >
                                    {subcategory}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                      </div>
                    )}

                    <div className="group">
                      <Label
                        htmlFor="description"
                        className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Project Description
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="description"
                          placeholder="Describe your project in detail. What are you looking to accomplish? What's your vision?"
                          value={projectData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          rows={6}
                          className="text-base border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Sparkles className="w-4 h-4 mr-1" />
                          Minimum 100 characters. Be specific about your goals
                          and expectations.
                        </p>
                        <span
                          className={`text-sm ${
                            projectData.description.length >= 100
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {projectData.description.length}/100
                        </span>
                      </div>
                    </div>

                    <div className="group">
                      <Label
                        htmlFor="projectType"
                        className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Project Type
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            value: "one-time",
                            label: "One-time Project",
                            desc: "Single project with defined scope",
                            icon: "🎯",
                          },
                          {
                            value: "ongoing",
                            label: "Ongoing Work",
                            desc: "Long-term collaboration",
                            icon: "🔄",
                          },
                          {
                            value: "contract",
                            label: "Contract to Hire",
                            desc: "Project with potential for employment",
                            icon: "🤝",
                          },
                        ].map((type) => (
                          <div
                            key={type.value}
                            onClick={() =>
                              handleInputChange("projectType", type.value)
                            }
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              projectData.projectType === type.value
                                ? "border-orange-500 bg-orange-50 shadow-lg scale-105"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{type.icon}</div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {type.label}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {type.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Requirements & Preferences */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Define Your Requirements & Preferences
                    </h2>
                    <p className="text-gray-600">
                      What skills, experience, and working arrangements are you
                      looking for?
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <Label
                        htmlFor="requirements"
                        className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        Detailed Requirements
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="requirements"
                          placeholder="List specific requirements, deliverables, and technical specifications. What exactly do you need done?"
                          value={projectData.requirements}
                          onChange={(e) =>
                            handleInputChange("requirements", e.target.value)
                          }
                          rows={6}
                          className="text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Sparkles className="w-4 h-4 mr-1" />
                          Be specific about deliverables and expectations
                        </p>
                        <span
                          className={`text-sm ${
                            projectData.requirements.length >= 50
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {projectData.requirements.length}/50
                        </span>
                      </div>
                    </div>

                    <div className="group">
                      <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        Required Skills
                      </Label>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {projectData.skills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-purple-200 hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {skills
                            .filter(
                              (skill) => !projectData.skills.includes(skill)
                            )
                            .slice(0, 16)
                            .map((skill) => (
                              <Button
                                key={skill}
                                variant="outline"
                                size="sm"
                                onClick={() => addSkill(skill)}
                                className="justify-start text-sm hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-200"
                              >
                                + {skill}
                              </Button>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <Label
                        htmlFor="experienceLevel"
                        className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Experience Level Required
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            value: "entry",
                            label: "Entry Level",
                            desc: "New to this field",
                            icon: "🌱",
                          },
                          {
                            value: "intermediate",
                            label: "Intermediate",
                            desc: "Substantial experience",
                            icon: "🚀",
                          },
                          {
                            value: "expert",
                            label: "Expert Level",
                            desc: "Deep expertise required",
                            icon: "🏆",
                          },
                        ].map((level) => (
                          <div
                            key={level.value}
                            onClick={() =>
                              handleInputChange("experienceLevel", level.value)
                            }
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              projectData.experienceLevel === level.value
                                ? "border-green-500 bg-green-50 shadow-lg scale-105"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{level.icon}</div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {level.label}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {level.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="group">
                      <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                        Work Location Preference
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            value: "remote",
                            label: "Remote",
                            desc: "Work from anywhere",
                            icon: "🌍",
                          },
                          {
                            value: "onsite",
                            label: "On-site",
                            desc: "Work at your location",
                            icon: "🏢",
                          },
                          {
                            value: "hybrid",
                            label: "Hybrid",
                            desc: "Mix of remote and on-site",
                            icon: "🔄",
                          },
                        ].map((location) => (
                          <div
                            key={location.value}
                            onClick={() =>
                              handleInputChange("location", location.value)
                            }
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              projectData.location === location.value
                                ? "border-indigo-500 bg-indigo-50 shadow-lg scale-105"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">
                                {location.icon}
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {location.label}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {location.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="group">
                      <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                        Freelancer Type
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            value: "individual",
                            label: "Individual Freelancer",
                            desc: "Work with a single freelancer",
                            icon: <User className="w-6 h-6" />,
                          },
                          {
                            value: "team",
                            label: "Freelancer Team",
                            desc: "Work with a team of specialists",
                            icon: <Users className="w-6 h-6" />,
                          },
                        ].map((type) => (
                          <div
                            key={type.value}
                            onClick={() =>
                              handleInputChange("freelancerType", type.value)
                            }
                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              projectData.freelancerType === type.value
                                ? "border-teal-500 bg-teal-50 shadow-lg scale-105"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`p-3 rounded-xl ${
                                  projectData.freelancerType === type.value
                                    ? "bg-teal-500 text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {type.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {type.label}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {type.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="group">
                      <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Project Attachments (Optional)
                      </Label>
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-dashed border-orange-200">
                        <div
                          className="text-center mb-4 cursor-pointer"
                          onClick={() => {
                            console.log("Upload area clicked (outer)");
                            const fileInput = document.getElementById(
                              "file-upload"
                            ) as HTMLInputElement;
                            if (fileInput && !isUploadingFiles) {
                              console.log(
                                "Triggering file input click from outer area"
                              );
                              fileInput.click();
                            }
                          }}
                        >
                          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
                            <Upload className="w-8 h-8 text-orange-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            Upload Project Files
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Share documents, mockups, or reference materials
                            <br />
                            <span className="text-xs text-gray-500">
                              Accepted: PDF, DOC, DOCX, PNG, JPG, GIF, ZIP, TXT
                              • Max 5 files • 10MB each
                            </span>
                          </p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.zip,.txt"
                            onChange={(e) => {
                              console.log(
                                "Input onChange triggered",
                                e.target.files
                              );
                              handleFileUpload(e.target.files);
                            }}
                            className="hidden"
                            id="file-upload"
                            disabled={isUploadingFiles}
                            ref={(input) => {
                              // Store reference for programmatic trigger
                              if (input) {
                                (window as any).fileInput = input;
                              }
                            }}
                          />
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              console.log("Upload area clicked");
                              const fileInput = document.getElementById(
                                "file-upload"
                              ) as HTMLInputElement;
                              if (fileInput && !isUploadingFiles) {
                                console.log("Triggering file input click");
                                fileInput.click();
                              }
                            }}
                          >
                            <div
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full max-w-xs"
                              style={{
                                opacity: isUploadingFiles ? 0.5 : 1,
                                pointerEvents: isUploadingFiles
                                  ? "none"
                                  : "auto",
                              }}
                            >
                              {isUploadingFiles ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Choose Files
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Upload Progress */}
                        {isUploadingFiles &&
                          Object.keys(uploadProgress).length > 0 && (
                            <div className="space-y-2 mb-4">
                              <h5 className="font-medium text-gray-900 mb-2">
                                Uploading Files:
                              </h5>
                              {Object.entries(uploadProgress).map(
                                ([fileName, progress]) => (
                                  <div
                                    key={fileName}
                                    className="bg-white rounded-lg p-3 border border-orange-200"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        {fileName}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {Math.round(progress)}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-primary-blue h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                        {(projectData.attachments.length > 0 ||
                          uploadedFiles.length > 0) && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              Uploaded Files:
                            </h5>
                            {projectData.attachments.map((file, index) => {
                              const uploadedFile = uploadedFiles[index];
                              // Make sure we get the correct file size, prioritizing the file object's size property
                              // which we've correctly set in our modified code above
                              const fileSize =
                                file.size || uploadedFile?.size || 0;
                              const isExistingFile = isEditMode && uploadedFile;

                              // Format the file size appropriately
                              const formatFileSize = (
                                bytes: number
                              ): string => {
                                if (bytes === 0) return "0 Bytes";
                                const k = 1024;
                                const sizes = ["Bytes", "KB", "MB", "GB"];
                                const i = Math.floor(
                                  Math.log(bytes) / Math.log(k)
                                );
                                return (
                                  parseFloat(
                                    (bytes / Math.pow(k, i)).toFixed(2)
                                  ) +
                                  " " +
                                  sizes[i]
                                );
                              };

                              return (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between bg-white rounded-lg p-3 border ${
                                    isExistingFile
                                      ? "border-blue-200"
                                      : "border-green-200"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <FileText
                                      className={`w-5 h-5 ${
                                        isExistingFile
                                          ? "text-blue-600"
                                          : "text-green-600"
                                      }`}
                                    />
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-gray-900">
                                        {file.name || uploadedFile?.fileName}
                                      </span>
                                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <span>{formatFileSize(fileSize)}</span>
                                        {uploadedFile && (
                                          <>
                                            <span>•</span>
                                            <CheckCircle
                                              className={`w-3 h-3 ${
                                                isExistingFile
                                                  ? "text-blue-500"
                                                  : "text-green-500"
                                              }`}
                                            />
                                            <span
                                              className={`${
                                                isExistingFile
                                                  ? "text-blue-600"
                                                  : "text-green-600"
                                              }`}
                                            >
                                              {isExistingFile
                                                ? "Existing File"
                                                : "Uploaded to Firebase"}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      {uploadedFile && (
                                        <a
                                          href={uploadedFile.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1"
                                        >
                                          Preview file
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAttachment(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    disabled={
                                      isUploadingFiles || isDeletingFiles[index]
                                    }
                                  >
                                    {isDeletingFiles[index] ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <X className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Budget & Timeline */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Budget & Timeline
                    </h2>
                    <p className="text-gray-600">Set your project parameters</p>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <Label className="text-base font-semibold text-gray-900 mb-4 block flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        Budget Type
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                          onClick={() =>
                            handleInputChange("budgetType", "fixed")
                          }
                          className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            projectData.budgetType === "fixed"
                              ? "border-green-500 bg-green-50 shadow-lg scale-105"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <DollarSign className="w-8 h-8 text-green-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Fixed Price
                              </h3>
                              <p className="text-sm text-gray-600">
                                Pay a set amount for the entire project
                              </p>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={() =>
                            handleInputChange("budgetType", "hourly")
                          }
                          className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            projectData.budgetType === "hourly"
                              ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <Calendar className="w-8 h-8 text-blue-600" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Hourly Rate
                              </h3>
                              <p className="text-sm text-gray-600">
                                Pay based on hours worked
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {projectData.budgetType && (
                      <div className="space-y-4">
                        <div className="group">
                          <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            {projectData.budgetType === "fixed"
                              ? "Project Budget"
                              : "Hourly Rate Range"}
                          </Label>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label
                                htmlFor="budgetMin"
                                className="text-sm text-gray-600 mb-2 block"
                              >
                                Minimum ($)
                              </Label>
                              <Input
                                id="budgetMin"
                                type="number"
                                placeholder="500"
                                value={projectData.budgetMin}
                                onChange={(e) =>
                                  handleInputChange("budgetMin", e.target.value)
                                }
                                className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-200"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="budgetMax"
                                className="text-sm text-gray-600 mb-2 block"
                              >
                                Maximum ($)
                              </Label>
                              <Input
                                id="budgetMax"
                                type="number"
                                placeholder="1500"
                                value={projectData.budgetMax}
                                onChange={(e) =>
                                  handleInputChange("budgetMax", e.target.value)
                                }
                                className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-200"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="currency"
                                className="text-sm text-gray-600 mb-2 block"
                              >
                                Currency
                              </Label>
                              <Select
                                value={projectData.currency}
                                onValueChange={(value) =>
                                  handleInputChange("currency", value)
                                }
                              >
                                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-all duration-200">
                                  <SelectValue placeholder="USD" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="group">
                      <Label
                        htmlFor="timeline"
                        className="text-base font-semibold text-gray-900 mb-3 block flex items-center"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        Project Timeline
                      </Label>
                      <div className="space-y-4">
                        <Select
                          value={projectData.timeline}
                          onValueChange={(value) =>
                            handleInputChange("timeline", value)
                          }
                        >
                          <SelectTrigger className="h-14 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all duration-200">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="less-than-1-month">
                              Less than 1 month
                            </SelectItem>
                            <SelectItem value="1-3-months">
                              1 to 3 months
                            </SelectItem>
                            <SelectItem value="3-6-months">
                              3 to 6 months
                            </SelectItem>
                            <SelectItem value="more-than-6-months">
                              More than 6 months
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="startDate"
                              className="text-sm text-gray-600 mb-2 block"
                            >
                              Preferred Start Date
                            </Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={projectData.startDate}
                              onChange={(e) =>
                                handleInputChange("startDate", e.target.value)
                              }
                              className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all duration-200"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="endDate"
                              className="text-sm text-gray-600 mb-2 block"
                            >
                              Target End Date
                            </Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={projectData.endDate}
                              onChange={(e) =>
                                handleInputChange("endDate", e.target.value)
                              }
                              className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div
                          onClick={() =>
                            handleInputChange("isUrgent", !projectData.isUrgent)
                          }
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            projectData.isUrgent
                              ? "border-red-500 bg-red-50 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                projectData.isUrgent
                                  ? "bg-red-500"
                                  : "bg-gray-100"
                              }`}
                            >
                              <Zap
                                className={`w-5 h-5 ${
                                  projectData.isUrgent
                                    ? "text-white"
                                    : "text-gray-500"
                                }`}
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Urgent Project
                              </h4>
                              <p className="text-sm text-gray-600">
                                Mark this project as urgent to attract faster
                                responses
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                        Project Visibility
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            value: "public",
                            label: "Public",
                            desc: "Visible to all freelancers",
                            icon: <Globe className="w-6 h-6" />,
                          },
                          {
                            value: "private",
                            label: "Private",
                            desc: "Only you can see this project",
                            icon: <Lock className="w-6 h-6" />,
                          },
                          {
                            value: "invited_only",
                            label: "Invited Only",
                            desc: "Only invited freelancers can see",
                            icon: <Eye className="w-6 h-6" />,
                          },
                        ].map((visibility) => (
                          <div
                            key={visibility.value}
                            onClick={() =>
                              handleInputChange("visibility", visibility.value)
                            }
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              projectData.visibility === visibility.value
                                ? "border-cyan-500 bg-cyan-50 shadow-lg scale-105"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                          >
                            <div className="text-center">
                              <div
                                className={`flex items-center justify-center w-12 h-12 rounded-xl mx-auto mb-3 ${
                                  projectData.visibility === visibility.value
                                    ? "bg-cyan-500 text-white"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {visibility.icon}
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {visibility.label}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {visibility.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {projectData.budgetType === "fixed" && (
                      <div className="group">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="text-base font-semibold text-gray-900 flex items-center">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                            Project Milestones (Optional)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMilestone}
                            className="rounded-lg"
                          >
                            Add Milestone
                          </Button>
                        </div>
                        <div className="space-y-6">
                          {projectData.milestones.map((milestone, index) => (
                            <div
                              key={milestone.id}
                              className="border-2 border-gray-200 rounded-xl p-6 bg-white/50"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  Milestone {index + 1}
                                </h4>
                                {projectData.milestones.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMilestone(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    placeholder="Milestone title"
                                    value={milestone.title}
                                    onChange={(e) =>
                                      updateMilestone(
                                        index,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    className="rounded-lg"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Amount ($)"
                                    value={milestone.amount}
                                    onChange={(e) =>
                                      updateMilestone(
                                        index,
                                        "amount",
                                        e.target.value
                                      )
                                    }
                                    className="rounded-lg"
                                  />
                                </div>
                                <Textarea
                                  placeholder="Milestone description"
                                  value={milestone.description}
                                  onChange={(e) =>
                                    updateMilestone(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  rows={2}
                                  className="rounded-lg"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Input
                                    type="date"
                                    placeholder="Due date"
                                    value={milestone.dueDate}
                                    onChange={(e) =>
                                      updateMilestone(
                                        index,
                                        "dueDate",
                                        e.target.value
                                      )
                                    }
                                    className="rounded-lg"
                                  />
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">
                                      Deliverables
                                    </Label>
                                    <div className="space-y-2">
                                      {milestone.deliverables.map(
                                        (deliverable, deliverableIndex) => (
                                          <div
                                            key={deliverableIndex}
                                            className="flex items-center space-x-2"
                                          >
                                            <Input
                                              placeholder="Expected deliverable"
                                              value={deliverable}
                                              onChange={(e) =>
                                                updateDeliverable(
                                                  index,
                                                  deliverableIndex,
                                                  e.target.value
                                                )
                                              }
                                              className="rounded-lg flex-1"
                                            />
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                removeDeliverable(
                                                  index,
                                                  deliverableIndex
                                                )
                                              }
                                              className="text-red-500 hover:text-red-700"
                                            >
                                              <X className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        )
                                      )}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addDeliverable(index)}
                                        className="w-full rounded-lg"
                                      >
                                        Add Deliverable
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Review & Post */}
              {step === 4 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Review Your Project
                    </h2>
                    <p className="text-gray-600">
                      Almost ready to find your perfect freelancer!
                    </p>
                  </div>

                  <div className="bg-primary-blue/5 rounded-xl p-6 border border-primary-blue/20">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      Project Summary
                    </h3>

                    <div className="space-y-6">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {projectData.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {projectData.category}{" "}
                          {projectData.subcategory &&
                            `• ${projectData.subcategory}`}{" "}
                          • {projectData.projectType}
                        </p>
                        {projectData.isUrgent && (
                          <div className="flex items-center mt-2">
                            <Zap className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-sm text-red-600 font-medium">
                              Urgent Project
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Description
                        </h4>
                        <p className="text-sm text-gray-700">
                          {projectData.description}
                        </p>
                      </div>

                      {projectData.requirements && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Requirements
                          </h4>
                          <p className="text-sm text-gray-700">
                            {projectData.requirements}
                          </p>
                        </div>
                      )}

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Required Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {projectData.skills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-primary-blue text-white"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {projectData.attachments.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Attachments
                          </h4>
                          <div className="space-y-2">
                            {projectData.attachments.map((file, index) => {
                              const uploadedFile = uploadedFiles[index];
                              const fileSize =
                                file.size || uploadedFile?.size || 0;

                              // Format the file size appropriately
                              const formatFileSize = (
                                bytes: number
                              ): string => {
                                if (bytes === 0) return "";
                                const k = 1024;
                                const sizes = ["Bytes", "KB", "MB", "GB"];
                                const i = Math.floor(
                                  Math.log(bytes) / Math.log(k)
                                );
                                return ` (${parseFloat(
                                  (bytes / Math.pow(k, i)).toFixed(2)
                                )} ${sizes[i]})`;
                              };

                              return (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2 text-sm text-gray-700"
                                >
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span>
                                    {file.name}
                                    {formatFileSize(fileSize)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Budget
                          </h4>
                          <p className="text-sm text-gray-700">
                            {projectData.currency} {projectData.budgetMin} -{" "}
                            {projectData.budgetMax}
                            {projectData.budgetType === "hourly"
                              ? "/hour"
                              : " total"}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Timeline
                          </h4>
                          <p className="text-sm text-gray-700">
                            {projectData.timeline?.replace("-", " ")}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Experience Level
                          </h4>
                          <p className="text-sm text-gray-700 capitalize">
                            {projectData.experienceLevel}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Work Type
                          </h4>
                          <p className="text-sm text-gray-700 capitalize">
                            {projectData.freelancerType} •{" "}
                            {projectData.location}
                          </p>
                        </div>
                      </div>

                      {projectData.startDate && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {projectData.startDate && (
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                Start Date
                              </h4>
                              <p className="text-sm text-gray-700">
                                {new Date(
                                  projectData.startDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {projectData.endDate && (
                            <div className="bg-white rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                End Date
                              </h4>
                              <p className="text-sm text-gray-700">
                                {new Date(
                                  projectData.endDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Visibility
                            </h4>
                            <p className="text-sm text-gray-700 capitalize">
                              {projectData.visibility?.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      )}

                      {projectData.budgetType === "fixed" &&
                        projectData.milestones.some((m) => m.title) && (
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Milestones
                            </h4>
                            <div className="space-y-3">
                              {projectData.milestones
                                .filter((m) => m.title)
                                .map((milestone, index) => (
                                  <div
                                    key={milestone.id}
                                    className="border border-gray-200 rounded-lg p-3"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-gray-900">
                                        {milestone.title}
                                      </h5>
                                      <span className="text-sm font-medium text-green-600">
                                        {projectData.currency}{" "}
                                        {milestone.amount}
                                      </span>
                                    </div>
                                    {milestone.description && (
                                      <p className="text-sm text-gray-600 mb-2">
                                        {milestone.description}
                                      </p>
                                    )}
                                    {milestone.dueDate && (
                                      <p className="text-xs text-gray-500">
                                        Due:{" "}
                                        {new Date(
                                          milestone.dueDate
                                        ).toLocaleDateString()}
                                      </p>
                                    )}
                                    {milestone.deliverables.length > 0 && (
                                      <div className="mt-2">
                                        <p className="text-xs font-medium text-gray-700 mb-1">
                                          Deliverables:
                                        </p>
                                        <ul className="text-xs text-gray-600 space-y-1">
                                          {milestone.deliverables
                                            .filter((d) => d)
                                            .map((deliverable, idx) => (
                                              <li key={idx}>• {deliverable}</li>
                                            ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      What happens next?
                    </h3>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Your project will be posted and visible to freelancers
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        You'll start receiving proposals within hours
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Review proposals and interview your favorite freelancers
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Hire the best freelancer and start your project
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 hover:bg-blue-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                  </Button>
                </div>

                <div>
                  {step < 4 ? (
                    <Button
                      onClick={handleNext}
                      className="bg-primary-blue hover:bg-primary-blue-dark text-white flex items-center space-x-2 px-8 py-3 rounded-xl shadow-lg"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-green-400 hover:bg-primary-green-dark text-white flex items-center space-x-2 px-8 py-3 rounded-xl shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>
                            {isEditMode
                              ? "Updating Project..."
                              : "Posting Project..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-4 h-4" />
                          <span>
                            {isEditMode ? "Update Project" : "Post Project"}
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
