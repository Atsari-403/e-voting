import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManajemenMahasiswa from "./pages/admin/ManajemenMahasiswa";
import ManajemenKandidat from "./pages/admin/ManajemenKandidat";
import HasilVoting from "./pages/admin/HasilVoting";
import MahasiswaVoting from "./pages/MahasiswaVoting";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Redirect default */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

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
              <HasilVoting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mahasiswa/voting"
          element={
            <ProtectedRoute roleAllowed="mahasiswa">
              <MahasiswaVoting />
            </ProtectedRoute>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
