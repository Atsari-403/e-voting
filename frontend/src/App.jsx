import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManajemenMahasiswa from "./pages/admin/ManajemenMahasiswa";
import ManajemenKandidat from "./pages/admin/ManajemenKandidat";
import HasilVoting from "./pages/admin/HasilVoting";
import MahasiswaVoting from "./pages/MahasiswaVoting";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manajemen/mahasiswa"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManajemenMahasiswa />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manajemen/kandidat"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManajemenKandidat />
          </ProtectedRoute>
        }
      />

      <Route
        path="hasil/voting"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <HasilVoting />
          </ProtectedRoute>
        }
      />

      {/* Mahasiswa routes */}
      <Route
        path="/mahasiswa/voting"
        element={
          <ProtectedRoute allowedRoles={["mahasiswa"]}>
            <MahasiswaVoting />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
