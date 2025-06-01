import apiClient from '../api/apiClient';

const authService = {
  // Get current authenticated user data
  // Used by useUserData.js
  getMe: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user data (/auth/me):', error);
      throw error; // Re-throw to be handled by the calling hook/component
    }
  },

  // Potential future functions:
  // login: async (credentials) => { ... }
  // logout: async () => { ... }
  // (Note: The current logout in MahasiswaVoting.jsx is a direct axios call.
  // If we want to centralize it, MahasiswaVoting.jsx would call authService.logout(),
  // and this service would make the apiClient.post('/auth/logout') call.)

};

export default authService;
