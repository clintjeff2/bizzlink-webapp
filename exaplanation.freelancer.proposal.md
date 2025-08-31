# Freelancer Proposals Page

## Overview
The Freelancer Proposals page displays all proposals submitted by a freelancer for various projects. It allows freelancers to track, manage, and take actions on their proposals throughout the bidding process.

## Data Structure
This page integrates with the Firebase `proposals` collection as outlined in the Firebase schema:

```typescript
interface Proposal {
  proposalId: string;
  projectId: string;
  freelancerId: string;
  freelancerInfo: {
    name: string;
    photoURL: string;
    title: string;
    rating: number;
    completedJobs: number;
  };
  
  bid: {
    amount: number;
    currency: string;
    type: "fixed" | "hourly";
    timeline: string;
    deliveryDate: Timestamp;
  };
  
  coverLetter: string;
  attachments: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
  
  questions: Array<{
    question: string;
    answer: string;
  }>;
  
  status: "submitted" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
  isInvited: boolean;
  submittedAt: Timestamp;
  updatedAt: Timestamp;
  respondedAt: Timestamp;
}
```

## Proposal Status Flow
1. **Submitted**: Initial state when a proposal is first sent
2. **Shortlisted**: Client has reviewed and shortlisted the proposal for further consideration
3. **Accepted**: Client has accepted the proposal and is ready to create a contract
4. **Rejected**: Client has declined the proposal
5. **Withdrawn**: Freelancer has withdrawn their proposal

## Status Interpretation
- **isInvited: true**: The client specifically invited this freelancer to submit a proposal for the project
- **Shortlisted**: This status represents the "interviewing" phase, where the client is actively considering the proposal and may conduct interviews

## Available Actions
Different actions are available based on the proposal's status:

| Status      | Available Actions                          |
|-------------|-------------------------------------------|
| Submitted   | Edit, Withdraw                            |
| Shortlisted | Edit, Withdraw, Message Client            |
| Accepted    | View Contract, Message Client             |
| Rejected    | No actions (view only)                    |
| Withdrawn   | No actions (view only)                    |

## Implementation Features
1. **Real-time Updates**: Using Firebase listeners to show up-to-date proposal statuses
2. **Filtering/Sorting**: Allows freelancers to filter proposals by status or sort by date
3. **Status Badges**: Clear visual indicators of proposal status
4. **Action Buttons**: Context-aware action buttons based on proposal status
5. **Detail View**: Ability to view complete proposal details

## Firebase Integration
- **Queries**: Fetch proposals where `freelancerId` matches the current user's ID
- **Updates**: Allow updating proposal status (e.g., to "withdrawn")
- **Listeners**: Real-time subscription to proposal changes

## Page Structure
1. **Header**: Page title, filters, and sorting options
2. **Proposal Cards**: Cards displaying key proposal information
3. **Action Buttons**: Context-sensitive buttons for each proposal
4. **Status Indicators**: Visual badges showing current status
5. **Empty State**: Shown when freelancer has no proposals

## Future Enhancements
- Integration with contract management when a proposal is accepted
- Notification system for status changes
- Analytics for proposal success rates
