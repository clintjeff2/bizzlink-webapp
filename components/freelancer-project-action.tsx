"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";

interface FreelancerProjectActionProps {
  projectId: string;
  userId: string;
}

export default function FreelancerProjectAction({
  projectId,
  userId,
}: FreelancerProjectActionProps) {
  console.log("FreelancerProjectAction - Component mounted with props:", {
    projectId,
    userId,
  });
  const [hasProposal, setHasProposal] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkExistingProposal() {
      console.log("FreelancerProjectAction - Checking proposal for:", {
        projectId,
        userId,
      });

      if (!userId || !projectId) {
        console.log(
          "FreelancerProjectAction - Missing userId or projectId, skipping check"
        );
        setLoading(false);
        return;
      }

      try {
        // Query by both freelancerId and projectId fields, which is more reliable
        const q = query(
          collection(db, "proposals"),
          where("freelancerId", "==", userId),
          where("projectId", "==", projectId)
        );

        console.log("FreelancerProjectAction - Executing query with filters:", {
          freelancerId: userId,
          projectId: projectId,
        });

        const querySnapshot = await getDocs(q);
        console.log(
          "FreelancerProjectAction - Found proposals count:",
          querySnapshot.size
        );

        if (!querySnapshot.empty) {
          // Found at least one proposal for this project from this freelancer
          const proposalDoc = querySnapshot.docs[0];
          console.log(
            "FreelancerProjectAction - Found existing proposal with ID:",
            proposalDoc.id
          );
          setHasProposal(true);
          setProposalId(proposalDoc.id);
        } else {
          console.log("FreelancerProjectAction - No existing proposal found");
          setHasProposal(false);
          setProposalId(null);
        }
      } catch (error) {
        console.error(
          "FreelancerProjectAction - Error checking existing proposal:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    checkExistingProposal();
  }, [projectId, userId]);

  if (loading) {
    return (
      <Button
        disabled
        style={{ backgroundColor: "#6b7280" }}
        className="w-full text-white font-bold py-4 text-base shadow-lg"
      >
        Checking...
      </Button>
    );
  }

  if (hasProposal) {
    return (
      <Link
        href={`/projects/${projectId}/proposal?edit=true&proposalId=${proposalId}`}
        className="w-full block"
      >
        <Button
          style={{ backgroundColor: "#0055ff" }}
          className="w-full hover:opacity-90 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Edit Proposal
        </Button>
      </Link>
    );
  }

  return (
    <Link href={`/projects/${projectId}/proposal`} className="w-full block">
      <Button
        style={{ backgroundColor: "#00d455" }}
        className="w-full hover:opacity-90 text-white font-bold py-4 text-base shadow-lg hover:shadow-xl transition-all duration-200"
      >
        Apply Now
      </Button>
    </Link>
  );
}
