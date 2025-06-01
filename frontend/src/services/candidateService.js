import apiClient from '../api/apiClient';

const candidateService = {
  // Fetch all candidates
  // Used by useCandidates.js and useMahasiswaCandidates.js
  getAllCandidates: async () => {
    try {
      const response = await apiClient.get('/candidates');
      return response.data;
    } catch (error) {
      console.error('Error fetching all candidates:', error);
      throw error; // Re-throw to be handled by the calling hook/component
    }
  },

  // Create a new candidate (handles multipart/form-data)
  // Used by useKandidatForm.js
  // This version is more generic if Design-Type is not always needed or handled differently.
  createCandidate: async (formDataObj) => {
    try {
      const response = await apiClient.post('/candidates', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  },

  // This version specifically handles the Design-Type header as per original useKandidatForm.js
  createCandidateWithDesignType: async (formDataObj, designType) => {
    try {
      const response = await apiClient.post('/candidates', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Design-Type': designType, // Explicitly set the Design-Type header
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating candidate with design type:', error);
      throw error;
    }
  },

  // Delete a candidate
  // Used by useCandidates.js
  deleteCandidate: async (id) => {
    try {
      const response = await apiClient.delete(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting candidate with ID ${id}:`, error);
      throw error;
    }
  },

  // Add other candidate-related API calls if any are discovered later
  // e.g., getCandidateById, updateCandidate
};

export default candidateService;
