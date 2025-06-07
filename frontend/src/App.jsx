import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManajemenMahasiswa from "./pages/admin/ManajemenMahasiswa";
import ManajemenKandidat from "./pages/admin/ManajemenKandidat";
import HasilVotingPage from "./pages/admin/HasilVotingPage";
import MahasiswaVoting from "../src/pages/mahasiswaVoting/MahasiswaVoting";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Redirect default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protect login page - redirect if already authenticated */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roleAllowed="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manajemen/mahasiswa"
          element={
            <ProtectedRoute roleAllowed="admin">
              <ManajemenMahasiswa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manajemen/kandidat"
          element={
            <ProtectedRoute roleAllowed="admin">
              <ManajemenKandidat />
            </ProtectedRoute>
          }
        />

        <Route
          path="hasil/voting"
          element={
            <ProtectedRoute roleAllowed="admin">
              <HasilVotingPage />
            </ProtectedRoute>
          }
        />

        {/* Route voting mahasiswa - redirect jika bukan mahasiswa */}
        <Route
          path="/mahasiswa/voting"
          element={
            <ProtectedRoute roleAllowed="mahasiswa" blockNavigation={true}>
              <MahasiswaVoting />
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
