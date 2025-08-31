import { RootState } from '../store';

export const selectAllProposals = (state: RootState) => state.proposals.proposals;
export const selectCurrentProposal = (state: RootState) => state.proposals.currentProposal;
export const selectProposalLoading = (state: RootState) => state.proposals.loading;
export const selectProposalError = (state: RootState) => state.proposals.error;
export const selectProposalStats = (state: RootState) => state.proposals.stats;

// Helper selectors for specific status types
export const selectSubmittedProposals = (state: RootState) => 
  state.proposals.proposals.filter(p => p.status === 'submitted');

export const selectShortlistedProposals = (state: RootState) => 
  state.proposals.proposals.filter(p => p.status === 'shortlisted');

export const selectAcceptedProposals = (state: RootState) => 
  state.proposals.proposals.filter(p => p.status === 'accepted');

export const selectRejectedProposals = (state: RootState) => 
  state.proposals.proposals.filter(p => p.status === 'rejected');

export const selectWithdrawnProposals = (state: RootState) => 
  state.proposals.proposals.filter(p => p.status === 'withdrawn');
