"use client";

import { useState } from "react";
import { Star, X, Loader2, MessageSquare } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUpdateReviewMutation } from "@/lib/redux/api/firebaseApi";
import { format } from "date-fns";

interface ViewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: any;
  freelancerName: string;
  clientName: string;
  canRespond?: boolean; // Whether the current user can respond to this review
}

export function ViewReviewModal({
  isOpen,
  onClose,
  review,
  freelancerName,
  clientName,
  canRespond = false,
}: ViewReviewModalProps) {
  const [responseText, setResponseText] = useState(
    review?.response?.text || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  const [updateReview, { isLoading }] = useUpdateReviewMutation();

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !review) return;

    try {
      await updateReview({
        reviewId: review.reviewId,
        response: {
          text: responseText.trim(),
          respondedAt: new Date().toISOString(),
        },
      }).unwrap();

      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response. Please try again.");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              rating >= star
                ? "fill-yellow-400 text-yellow-400"
                : rating >= star - 0.5
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (!review) return null;

  const hasResponse = review.response?.text;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Client Review
          </DialogTitle>
          <DialogDescription>
            Review from {clientName} for {freelancerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overall Rating */}
          <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Overall Rating</p>
            <div className="text-5xl font-bold text-gray-900 mb-3">
              {review.rating.overall.toFixed(1)}
            </div>
            <div className="flex justify-center">
              {renderStars(review.rating.overall)}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Rating Breakdown</Label>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Communication
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {review.rating.communication.toFixed(1)}
                  </span>
                  {renderStars(review.rating.communication)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Work Quality
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {review.rating.quality.toFixed(1)}
                  </span>
                  {renderStars(review.rating.quality)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Timeliness
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {review.rating.timeliness.toFixed(1)}
                  </span>
                  {renderStars(review.rating.timeliness)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Professionalism
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {review.rating.professionalism.toFixed(1)}
                  </span>
                  {renderStars(review.rating.professionalism)}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation & Visibility */}
          <div className="flex gap-4">
            {review.isRecommended && (
              <Badge className="bg-green-100 text-green-800">
                ✓ Recommended
              </Badge>
            )}
            <Badge
              className={
                review.isPublic
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {review.isPublic ? "Public" : "Private"}
            </Badge>
          </div>

          <Separator />

          {/* Feedback */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Client Feedback</Label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {review.feedback}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Reviewed on{" "}
              {format(new Date(review.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>

          <Separator />

          {/* Response Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Your Response
              </Label>
              {hasResponse && canRespond && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Response
                </Button>
              )}
            </div>

            {hasResponse && !isEditing ? (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 whitespace-pre-wrap mb-2">
                  {review.response.text}
                </p>
                <p className="text-xs text-gray-500">
                  Responded on{" "}
                  {format(
                    new Date(review.response.respondedAt),
                    "MMMM d, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
            ) : canRespond ? (
              <>
                <Textarea
                  placeholder="Thank your client for the review and share your thoughts about the project..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Your response will be visible to the client
                  {review.isPublic && " and on your public profile"}
                </p>
              </>
            ) : (
              !hasResponse && (
                <p className="text-sm text-gray-500 italic">No response yet</p>
              )
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {canRespond && (isEditing || !hasResponse) ? (
              <>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setResponseText(review.response?.text || "");
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleSubmitResponse}
                  disabled={isLoading || !responseText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : hasResponse ? (
                    "Update Response"
                  ) : (
                    "Submit Response"
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={onClose}>Close</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
