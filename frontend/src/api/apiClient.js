import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // Note: useNavigate can only be called in functional components or custom hooks. This might need adjustment.

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Handle 401 Unauthorized
        // Option 1: Redirect using window.location (if useNavigate is problematic outside component context)
        console.error('Unauthorized access - 401 from apiClient. Redirecting to login is responsibility of caller.');
        // window.location.href = '/login'; // This causes a full page reload

        // Option 2: Throw a specific error type or rely on components/hooks to handle 401
        // For now, we'll just log and let the calling code handle it,
        // as direct navigation here can be tricky.
        // A more robust solution might involve an event bus or a shared auth context.
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
