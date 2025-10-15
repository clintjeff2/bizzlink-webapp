"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  User,
  Target,
  Briefcase,
  GraduationCap,
  Award,
  DollarSign,
  MapPin,
  Globe,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface ProfileCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completionRate: number;
  sections: {
    basicInfo: { completed: boolean; weight: number };
    skills: { completed: boolean; weight: number };
    portfolio: { completed: boolean; weight: number };
    education: { completed: boolean; weight: number };
    employment: { completed: boolean; weight: number };
    certifications: { completed: boolean; weight: number };
    hourlyRate: { completed: boolean; weight: number };
    bio: { completed: boolean; weight: number };
    location: { completed: boolean; weight: number };
    socialLinks: { completed: boolean; weight: number };
  };
  completedSections: number;
  totalSections: number;
}

const sectionConfig = {
  basicInfo: {
    icon: User,
    label: "Basic Information",
    description: "Name, title, and professional summary",
    link: "/freelancer/profile",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  skills: {
    icon: Target,
    label: "Skills & Expertise",
    description: "At least 3 professional skills",
    link: "/freelancer/profile",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  portfolio: {
    icon: Briefcase,
    label: "Portfolio Projects",
    description: "Showcase your work with at least 1 project",
    link: "/freelancer/profile",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  education: {
    icon: GraduationCap,
    label: "Education",
    description: "Your educational background",
    link: "/freelancer/profile",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  employment: {
    icon: Briefcase,
    label: "Work Experience",
    description: "Your professional work history",
    link: "/freelancer/profile",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  certifications: {
    icon: Award,
    label: "Certifications",
    description: "Professional certifications and achievements",
    link: "/freelancer/profile",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  hourlyRate: {
    icon: DollarSign,
    label: "Hourly Rate",
    description: "Set your competitive hourly rate",
    link: "/freelancer/profile",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  bio: {
    icon: FileText,
    label: "Professional Bio",
    description: "Detailed overview (at least 50 characters)",
    link: "/freelancer/profile",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
  },
  location: {
    icon: MapPin,
    label: "Location & Timezone",
    description: "Where you're based and your timezone",
    link: "/freelancer/profile",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  socialLinks: {
    icon: Globe,
    label: "Professional Links",
    description: "LinkedIn, website, or GitHub profile",
    link: "/freelancer/profile",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
};

export function ProfileCompletionModal({
  open,
  onOpenChange,
  completionRate,
  sections,
  completedSections,
  totalSections,
}: ProfileCompletionModalProps) {
  const getCompletionLevel = () => {
    if (completionRate >= 90)
      return { label: "Excellent", color: "text-green-600" };
    if (completionRate >= 70) return { label: "Good", color: "text-blue-600" };
    if (completionRate >= 50)
      return { label: "Fair", color: "text-yellow-600" };
    return { label: "Needs Work", color: "text-red-600" };
  };

  const level = getCompletionLevel();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Profile Completion</DialogTitle>
          <DialogDescription>
            Complete your profile to increase visibility and attract more
            clients
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Progress */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {completionRate}%
                </h3>
                <p className="text-sm text-gray-600">
                  {completedSections} of {totalSections} sections complete
                </p>
              </div>
              <Badge
                variant="outline"
                className={`${level.color} border-current text-sm px-3 py-1`}
              >
                {level.label}
              </Badge>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Why complete your profile?
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Appear higher in search results</li>
              <li>• Build trust with potential clients</li>
              <li>• Showcase your full expertise</li>
              <li>• Increase your chances of getting hired</li>
            </ul>
          </div>

          {/* Section Breakdown */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Profile Sections
            </h4>
            <div className="space-y-3">
              {Object.entries(sections).map(([key, section]) => {
                const config = sectionConfig[key as keyof typeof sectionConfig];
                const Icon = config.icon;

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      section.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${config.bgColor} ${config.color} mt-0.5`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium text-gray-900">
                            {config.label}
                          </h5>
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0"
                          >
                            {section.weight}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      {section.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <>
                          <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                          <Link href={config.link}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center space-x-1"
                            >
                              <span className="text-xs">Complete</span>
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4 border-t">
            <Link
              href="/freelancer/profile"
              onClick={() => onOpenChange(false)}
            >
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Go to Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
