"use client";

import { useState, useEffect } from "react";
import { Star, X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "@/lib/redux/api/firebaseApi";

interface RateFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerPhotoURL?: string;
  clientId: string;
  existingReview?: any; // If editing existing review
}

interface RatingCategory {
  key: string;
  label: string;
  rating: number;
}

export function RateFreelancerModal({
  isOpen,
  onClose,
  contractId,
  projectId,
  freelancerId,
  freelancerName,
  freelancerPhotoURL,
  clientId,
  existingReview,
}: RateFreelancerModalProps) {
  const [categories, setCategories] = useState<RatingCategory[]>([
    { key: "communication", label: "Communication", rating: 0 },
    { key: "quality", label: "Work Quality", rating: 0 },
    { key: "timeliness", label: "Timeliness", rating: 0 },
    { key: "professionalism", label: "Professionalism", rating: 0 },
  ]);

  const [feedback, setFeedback] = useState("");
  const [isRecommended, setIsRecommended] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const [createReview, { isLoading: isCreating, isSuccess: createSuccess }] =
    useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating, isSuccess: updateSuccess }] =
    useUpdateReviewMutation();

  const isLoading = isCreating || isUpdating;
  const isSuccess = createSuccess || updateSuccess;

  // Load existing review data
  useEffect(() => {
    if (existingReview) {
      setCategories([
        {
          key: "communication",
          label: "Communication",
          rating: existingReview.rating.communication,
        },
        {
          key: "quality",
          label: "Work Quality",
          rating: existingReview.rating.quality,
        },
        {
          key: "timeliness",
          label: "Timeliness",
          rating: existingReview.rating.timeliness,
        },
        {
          key: "professionalism",
          label: "Professionalism",
          rating: existingReview.rating.professionalism,
        },
      ]);
      setFeedback(existingReview.feedback || "");
      setIsRecommended(existingReview.isRecommended ?? true);
      setIsPublic(existingReview.isPublic ?? true);
    }
  }, [existingReview]);

  // Close modal after successful submission
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
        // Reset form
        setCategories([
          { key: "communication", label: "Communication", rating: 0 },
          { key: "quality", label: "Work Quality", rating: 0 },
          { key: "timeliness", label: "Timeliness", rating: 0 },
          { key: "professionalism", label: "Professionalism", rating: 0 },
        ]);
        setFeedback("");
        setIsRecommended(true);
        setIsPublic(true);
      }, 1500);
    }
  }, [isSuccess, onClose]);

  const handleRatingClick = (categoryKey: string, rating: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.key === categoryKey ? { ...cat, rating } : cat))
    );
  };

  const calculateOverallRating = () => {
    const sum = categories.reduce((acc, cat) => acc + cat.rating, 0);
    return categories.length > 0 ? sum / categories.length : 0;
  };

  const handleSubmit = async () => {
    const overallRating = calculateOverallRating();

    if (overallRating === 0) {
      alert("Please provide ratings for all categories");
      return;
    }

    if (!feedback.trim()) {
      alert("Please provide feedback");
      return;
    }

    const reviewData = {
      contractId,
      projectId,
      reviewerId: clientId,
      revieweeId: freelancerId,
      type: "client_to_freelancer" as const,
      rating: {
        overall: Math.round(overallRating * 10) / 10,
        communication: categories.find((c) => c.key === "communication")!
          .rating,
        quality: categories.find((c) => c.key === "quality")!.rating,
        timeliness: categories.find((c) => c.key === "timeliness")!.rating,
        professionalism: categories.find((c) => c.key === "professionalism")!
          .rating,
      },
      feedback: feedback.trim(),
      isPublic,
      isRecommended,
    };

    try {
      if (existingReview) {
        await updateReview({
          reviewId: existingReview.reviewId,
          ...reviewData,
        }).unwrap();
      } else {
        await createReview(reviewData).unwrap();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const renderStars = (categoryKey: string, currentRating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = currentRating >= i;
      const isHalfFilled = currentRating >= i - 0.5 && currentRating < i;
      const isHovered =
        hoveredCategory === categoryKey && hoveredRating >= i - 0.5;

      stars.push(
        <div
          key={i}
          className="relative cursor-pointer"
          onMouseEnter={() => {
            setHoveredCategory(categoryKey);
            setHoveredRating(i);
          }}
          onMouseLeave={() => {
            setHoveredCategory(null);
            setHoveredRating(0);
          }}
        >
          {/* Left half */}
          <div
            className="absolute left-0 top-0 w-1/2 h-full z-10"
            onClick={() => handleRatingClick(categoryKey, i - 0.5)}
          />
          {/* Right half */}
          <div
            className="absolute right-0 top-0 w-1/2 h-full z-10"
            onClick={() => handleRatingClick(categoryKey, i)}
          />

          <Star
            className={`w-8 h-8 transition-all ${
              isFilled || isHovered
                ? "fill-yellow-400 text-yellow-400"
                : isHalfFilled
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            }`}
            style={
              isHalfFilled
                ? {
                    background:
                      "linear-gradient(90deg, #FBBF24 50%, transparent 50%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : undefined
            }
          />
        </div>
      );
    }
    return stars;
  };

  const overallRating = calculateOverallRating();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {existingReview ? "Edit Review" : "Rate & Review Freelancer"}
          </DialogTitle>
          <DialogDescription>
            Share your experience working with {freelancerName}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Review {existingReview ? "Updated" : "Submitted"} Successfully!
            </h3>
            <p className="text-gray-600 text-center">
              Thank you for taking the time to share your feedback.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Freelancer Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {freelancerPhotoURL ? (
                <img
                  src={freelancerPhotoURL}
                  alt={freelancerName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {freelancerName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-lg">{freelancerName}</h4>
                <p className="text-sm text-gray-600">
                  Contract: #{contractId.slice(-8)}
                </p>
              </div>
            </div>

            {/* Overall Rating Display */}
            <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Overall Rating</p>
              <div className="text-5xl font-bold text-gray-900">
                {overallRating > 0 ? overallRating.toFixed(1) : "0.0"}
              </div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      overallRating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-none text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Rating Categories */}
            <div className="space-y-6">
              <Label className="text-base font-semibold">
                Rate the following aspects:
              </Label>
              {categories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {category.label}
                    </Label>
                    <span className="text-sm font-semibold text-gray-700">
                      {category.rating > 0 ? category.rating.toFixed(1) : "0.0"}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {renderStars(category.key, category.rating)}
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-base font-semibold">
                Your Feedback <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="feedback"
                placeholder="Share your experience working with this freelancer. What did they do well? What could be improved?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Minimum 20 characters ({feedback.length}/20)
              </p>
            </div>

            {/* Recommendation */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="recommend"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="recommend"
                className="text-sm font-medium cursor-pointer"
              >
                I would recommend this freelancer to others
              </label>
            </div>

            {/* Public Review */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="public"
                className="text-sm font-medium cursor-pointer"
              >
                Make this review public (visible on freelancer's profile)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isLoading || overallRating === 0 || feedback.length < 20
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {existingReview ? "Updating..." : "Submitting..."}
                  </>
                ) : existingReview ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
