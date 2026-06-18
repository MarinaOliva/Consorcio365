import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/shared/ProtectedRoute";


import PerfilAdmin from "./pages/admin/Perfil";
import PerfilOcupante from "./pages/ocupante/Perfil";
import PerfilProveedor from "./pages/proveedor/Perfil";

// Admin
import DashboardAdmin from "./pages/admin/Dashboard";
import UsuariosAdmin from "./pages/admin/Usuarios";
import UnidadesAdmin from "./pages/admin/unidades/Unidades";
import IncidenciasAdmin from "./pages/admin/incidencias/Incidencias";
import TrabajosAdmin from "./pages/admin/trabajos/Trabajos";
import GastosAdmin from "./pages/admin/Gastos";
import MantenimientoAdmin from "./pages/admin/mantenimiento/Mantenimiento";
import DetallePlanMantenimiento from "./pages/admin/mantenimiento/DetallePlanMantenimiento";
import DocumentosAdmin from "./pages/admin/documentos/Documentos";
import AvisosAdmin from "./pages/admin/avisos/Avisos";


// Ocupante
import DashboardOcupante from "./pages/ocupante/Dashboard";
import ReclamosOcupante from "./pages/ocupante/Reclamos";
import GastosOcupante from "./pages/ocupante/Gastos";
import DocumentosOcupante from "./pages/ocupante/Documentos";
import AvisosOcupante from "./pages/ocupante/Avisos";

// Proveedor
import DashboardProveedor from "./pages/proveedor/Dashboard";
import TrabajosProveedor from "./pages/proveedor/Trabajos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsuariosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/unidades"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UnidadesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/incidencias"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <IncidenciasAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/trabajos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TrabajosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gastos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <GastosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mantenimiento"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MantenimientoAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mantenimiento/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DetallePlanMantenimiento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/documentos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DocumentosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/avisos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AvisosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/perfil"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PerfilAdmin />
            </ProtectedRoute>
          }
        />

        {/* Ocupante */}
        <Route
          path="/ocupante"
          element={
            <ProtectedRoute allowedRoles={["ocupante"]}>
              <DashboardOcupante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocupante/reclamos"
          element={
            <ProtectedRoute allowedRoles={["ocupante"]}>
              <ReclamosOcupante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocupante/gastos"
          element={
            <ProtectedRoute allowedRoles={["ocupante"]}>
              <GastosOcupante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocupante/documentos"
          element={
            <ProtectedRoute allowedRoles={["ocupante"]}>
              <DocumentosOcupante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocupante/avisos"
          element={
            <ProtectedRoute allowedRoles={["ocupante"]}>
              <AvisosOcupante />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ocupante/perfil"
          element={
            <ProtectedRoute allowedRoles={["ocupante"]}>
              <PerfilOcupante />
            </ProtectedRoute>
          }
        />

        {/* Proveedor */}
        <Route
          path="/proveedor"
          element={
            <ProtectedRoute allowedRoles={["proveedor"]}>
              <DashboardProveedor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proveedor/trabajos"
          element={
            <ProtectedRoute allowedRoles={["proveedor"]}>
              <TrabajosProveedor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proveedor/perfil"
          element={
            <ProtectedRoute allowedRoles={["proveedor"]}>
              <PerfilProveedor />
            </ProtectedRoute>
          }
        />

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;