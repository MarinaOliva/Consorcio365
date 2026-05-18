import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import DashboardAdmin from "./pages/admin/Dashboard";
import DashboardOcupante from "./pages/ocupante/Dashboard";
import DashboardProveedor from "./pages/proveedor/Dashboard";
import UsuariosAdmin from "./pages/admin/Usuarios";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { ROLES } from "./utils/roles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <UsuariosAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ocupante"
          element={
            <ProtectedRoute allowedRoles={[ROLES.OCUPANTE]}>
              <DashboardOcupante />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedor"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PROVEEDOR]}>
              <DashboardProveedor />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App