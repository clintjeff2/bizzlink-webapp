# Proposal Feature Implementation

## Overview

This document provides an explanation of the implementation of the Proposal feature in the BizzLink application. The feature allows freelancers to manage their project proposals with real-time updates from Firebase.

## Architecture

The feature follows a Redux-based architecture with the following key components:

1. **Redux Slice**: A `proposalSlice.ts` file contains all Redux state management for proposals, including:
   - State structure for proposals
   - Actions and reducers for managing proposal state
   - Async thunks for Firebase operations
   - Real-time subscription functions for Firebase data

2. **Selectors**: A set of dedicated selectors in `proposalSelectors.ts` that provide easy access to proposal-related data from the Redux store.

3. **UI Components**: 
   - The proposals listing page at `/freelancer/proposals`
   - Individual proposal detail page at `/freelancer/proposals/[id]`

## Firebase Integration

The proposal feature integrates with Firebase/Firestore for data persistence:

- **Collection**: Uses the `proposals` collection in Firestore
- **Document Structure**: Follows the schema defined in FIREBASE_SCHEMA.md
- **Real-time Updates**: Implements real-time listeners using Firebase's `onSnapshot` 

## Key Functionality

The proposal feature provides the following functionality:

1. **View Proposals**: Lists all proposals submitted by the freelancer
2. **View Proposal Details**: Shows detailed information about a specific proposal
3. **Filter and Sort**: Filter proposals by status and sort by various criteria
4. **Withdraw Proposals**: Ability to withdraw a submitted proposal
5. **Status Tracking**: Visual indicators for different proposal statuses (submitted, shortlisted, accepted, etc.)
6. **Stats Overview**: Summary statistics of proposal status

## Redux State Management

The Redux state for proposals is structured as follows:

```typescript
interface ProposalState {
  proposals: Proposal[];
  currentProposal: Proposal | null;
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    submitted: number;
    shortlisted: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
  };
}
```

## Key Redux Operations

1. **Fetching Proposals**: 
   - `fetchFreelancerProposals`: Thunk to fetch all proposals for a freelancer
   - `subscribeToFreelancerProposals`: Sets up real-time listener for proposals

2. **Individual Proposal Operations**:
   - `fetchProposal`: Thunk to fetch a specific proposal by ID
   - `subscribeToProposal`: Sets up real-time listener for a specific proposal
   - `updateProposalStatus`: Thunk to update a proposal's status
   - `withdrawProposal`: Thunk to withdraw a proposal

## Usage in Components

Components use the Redux store via hooks:

```typescript
// Get the dispatch function
const dispatch = useAppDispatch();

// Access proposal data using selectors
const proposals = useAppSelector(selectAllProposals);
const currentProposal = useAppSelector(selectCurrentProposal);
const stats = useAppSelector(selectProposalStats);

// Dispatch actions
dispatch(subscribeToFreelancerProposals(user.uid));
dispatch(withdrawProposal(proposalId));
```

## Status Management

Proposal statuses are mapped as follows:

- `submitted` → "pending" in UI
- `shortlisted` → "interviewing" in UI
- `accepted` → "accepted" in UI
- `rejected` → "rejected" in UI
- `withdrawn` → "withdrawn" in UI

## Error Handling

The implementation includes comprehensive error handling:

- Errors during Firebase operations are caught and stored in the Redux state
- UI components display appropriate error messages to users
- Console logging for debugging purposes

## Future Enhancements

Potential enhancements for the proposal feature:

1. Offline support with local caching
2. Batch operations for managing multiple proposals
3. Enhanced filtering and search capabilities
4. Notification system for proposal status changes
