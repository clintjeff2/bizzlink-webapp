"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Briefcase,
  MapPin,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetProjectQuery } from "@/lib/redux/api/firebaseApi";
import Link from "next/link";
import Image from "next/image";
import FreelancerProjectAction from "@/components/freelancer-project-action";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { data: project, isLoading, error } = useGetProjectQuery(id as string);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The project you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user?.userId === project.clientId;
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-primary-blue/10 text-primary-blue",
    in_progress: "bg-primary-blue/20 text-primary-blue-dark",
    completed: "bg-primary-green/10 text-primary-green-dark",
    cancelled: "bg-red-100 text-red-800",
  };

  const formatBudget = (budget: any) => {
    if (budget.type === "fixed") {
      return `${budget.currency} ${budget.amount.toLocaleString()}`;
    }
    return `${budget.currency} ${budget.minAmount}-${budget.maxAmount}/hr`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500 text-white";
      case "active":
        return "bg-primary-blue text-white";
      case "in_progress":
        return "bg-primary-blue-dark text-white";
      case "completed":
        return "bg-primary-green-dark text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with Navigation and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-4 border-b border-gray-100">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-primary-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>

          <div className="flex items-center gap-2">
            <div className="text-right text-xs text-gray-500 hidden sm:block">
              Project ID:{" "}
              <span className="font-mono text-gray-700">
                {project.projectId}
              </span>
            </div>

            {isOwner && (
              <Link href={`/projects/post?edit=${project.projectId}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-blue/20 text-primary-blue hover:bg-primary-blue/5"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Edit Project
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Project Title and Summary Section */}
        <div className="mb-8 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="max-w-3xl">
              <div className="mb-3">
                <Badge className={`${getStatusColor(project.status)} mb-2`}>
                  {project.status.replace("_", " ").toUpperCase()}
                </Badge>
                {project.timeline?.isUrgent && (
                  <Badge className="bg-red-100 text-red-700 ml-2">URGENT</Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5 text-primary-blue/70" />
                Posted {new Date(project.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1.5 text-primary-blue/70" />
                {formatBudget(project.budget)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-primary-blue/70" />
                {project.timeline?.duration}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 text-primary-blue/70" />
                {project.category}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-primary-blue/70" />
                {project.proposalCount || 0} proposals
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-5 bg-primary-blue rounded-full mr-3"></span>
                Project Description
              </h2>

              <div className="text-gray-700 leading-relaxed">
                <p className="mb-6">{project.description}</p>

                {project.detailedRequirements && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-base font-medium text-gray-900 mb-3">
                      Detailed Requirements
                    </h3>
                    <p className="text-gray-700">
                      {project.detailedRequirements}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Required Skills */}
            {project.requirements?.skills &&
              project.requirements.skills.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-1 h-5 bg-primary-blue rounded-full mr-3"></span>
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.requirements.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-primary-blue/10 hover:bg-primary-blue/15 text-primary-blue border border-primary-blue/20 px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Project Attachments */}
            {project.requirements?.attachments &&
              project.requirements.attachments.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-1 h-5 bg-primary-blue rounded-full mr-3"></span>
                    Project Attachments
                  </h2>
                  <div className="space-y-3">
                    {project.requirements.attachments.map(
                      (attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary-blue/30 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <FileText className="w-5 h-5 text-primary-blue" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {attachment.fileName}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary-blue/10 text-primary-blue"
                            asChild
                          >
                            <a
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Project Requirements */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-5 bg-primary-blue rounded-full mr-3"></span>
                Project Requirements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">
                    Experience Level
                  </div>
                  <div className="font-medium text-primary-blue capitalize">
                    {project.requirements?.experienceLevel || "Any"}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">
                    Freelancer Type
                  </div>
                  <div className="font-medium text-primary-blue capitalize">
                    {project.requirements?.freelancerType || "Individual"}
                  </div>
                </div>
                <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-medium text-primary-blue capitalize">
                    {project.requirements?.location || "Remote"}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Milestones */}
            {project.milestones && project.milestones.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-1 h-5 bg-primary-blue rounded-full mr-3"></span>
                  Project Milestones
                </h2>
                <div className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="border border-gray-100 rounded-lg p-4 hover:border-primary-blue/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
                        <h3 className="text-base font-medium text-gray-900">
                          {milestone.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="font-semibold text-primary-green-dark">
                              ${milestone.amount.toLocaleString()}
                            </span>
                          </div>
                          <Badge
                            className={
                              milestone.status === "completed"
                                ? "bg-primary-green/10 text-primary-green-dark border border-primary-green/20"
                                : milestone.status === "in_progress"
                                ? "bg-primary-blue/10 text-primary-blue-dark border border-primary-blue/20"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }
                          >
                            {milestone.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        {milestone.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>
                          Due:{" "}
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Section */}
            {!isOwner && user?.role === "freelancer" && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Interested in this project?
                </h3>

                <div className="space-y-3">
                  <Button className="w-full bg-primary-blue hover:bg-primary-blue-dark text-white flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Contact Client
                  </Button>

                  <FreelancerProjectAction
                    projectId={project.projectId}
                    userId={user.userId}
                  />

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start mb-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-primary-green mt-0.5 mr-2 flex-shrink-0" />
                      <span>
                        Submit a detailed proposal tailored to project
                        requirements
                      </span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-primary-green mt-0.5 mr-2 flex-shrink-0" />
                      <span>Communicate directly with the client</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Client Info */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About the Client
              </h3>

              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                  <Image
                    src={
                      project.clientInfo?.photoURL || "/placeholder-user.jpg"
                    }
                    alt={project.clientInfo?.name || "Client"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {project.clientInfo?.name}
                  </div>
                  {project.clientInfo?.verificationStatus && (
                    <div className="flex items-center mt-1 text-sm text-primary-green">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Verified Client
                    </div>
                  )}
                </div>
              </div>

              {!isOwner && (
                <Button
                  variant="outline"
                  className="w-full border-primary-blue/20 text-primary-blue hover:bg-primary-blue/5 mt-2 mb-4"
                  size="sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  Message Client
                </Button>
              )}
            </div>

            {/* Project Overview */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Project Details
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Budget</span>
                  <span className="font-medium text-gray-900">
                    {formatBudget(project.budget)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Timeline</span>
                  <span className="font-medium text-gray-900">
                    {project.timeline?.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">
                    {project.category}
                  </span>
                </div>
                {project.subcategory && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Subcategory</span>
                    <span className="font-medium text-gray-900">
                      {project.subcategory}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Proposals</span>
                  <span className="font-medium text-gray-900">
                    {project.proposalCount || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Posted</span>
                  <span className="font-medium text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {project.timeline?.isUrgent && (
                <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-700">Urgent project</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
