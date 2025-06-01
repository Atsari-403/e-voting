import apiClient from '../api/apiClient';

const votingService = {
  // Submit a user's vote
  // Originally from useVoteSubmission.js
  submitVote: async (candidateId) => {
    // The original hook also had a 'timeExpired' parameter, but it was used
    // to prevent the call, not passed to the API. The service method should be clean.
    // The hook using this service will be responsible for checking timeExpired before calling.
    try {
      const response = await apiClient.post('/users/vote-candidate', { candidateId });
      return response.data;
    } catch (error) {
      console.error('Error submitting vote:', error);
      throw error; // Re-throw to be handled by the calling hook/component
    }
  },

  // Get current voting results
  // Originally from useVotingResults.js
  getVoteResults: async () => {
    try {
      const response = await apiClient.get('/users/vote-results', {
        // The original hook had: headers: { 'Content-Type': 'application/json' }
        // Generally, axios sets this by default for GET requests if data is an object,
        // and for POST if data is an object. For GET, it's often not needed explicitly.
        // apiClient might have defaults, or we can add it if required.
        // For now, let's assume default headers are fine for a GET request.
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vote results:', error);
      throw error; // Re-throw to be handled by the calling hook/component
    }
  },
};

export default votingService;
