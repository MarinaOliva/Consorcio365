import PaginaSimpleConLayout from "../../components/shared/PaginaSimpleConLayout";

function IncidenciasAdmin() {
  return (
    <PaginaSimpleConLayout
      titulo="Incidencias"
      subtitulo="Seguimiento de incidencias del sistema"
      descripcion="Acá vas a poder consultar incidencias, estados, responsables, prioridades y fechas."
    />
  );
}

export default IncidenciasAdmin;