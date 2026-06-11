import PaginaSimpleConLayout from "../../components/shared/PaginaSimpleConLayout";

function ReclamosOcupante() {
  return (
    <PaginaSimpleConLayout
      titulo="Mis reclamos"
      subtitulo="Seguimiento y gestión de reclamos"
      descripcion="En esta sección vas a poder visualizar todos los reclamos, consultar su estado y realizar nuevas consultas o reclamos relacionados a tu unidad funcional."
    >
        {/* Acá iría el componente específico para mostrar los reclamos del ocupante */}
    </PaginaSimpleConLayout>
  );
}

export default ReclamosOcupante;