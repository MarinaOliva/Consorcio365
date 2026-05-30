// src/pages/proveedor/Trabajos.jsx

import PaginaSimpleConLayout from "../../components/shared/PaginaSimpleConLayout";

function TrabajosProveedor() {
  return (
    <PaginaSimpleConLayout
      titulo="Mis Trabajos"
      subtitulo="Listado y seguimiento de trabajos asignados"
      descripcion="Acá vas a poder revisar tareas activas, estados, fechas, montos y detalles de cada trabajo."
    />
  );
}

export default TrabajosProveedor;