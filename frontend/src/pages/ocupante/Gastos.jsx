import PaginaSimpleConLayout from "../../components/shared/PaginaSimpleConLayout";

function GastosOcupante() {
  return (
    <PaginaSimpleConLayout
      titulo="Libro de Gastos"
      subtitulo="Consulta del libro de gastos del consorcio"
      descripcion="Acá podrás consultar el libro de gastos del consorcio, donde se detallan los gastos realizados, las fechas y los proveedores involucrados. Esta información te permitirá tener un mejor control y transparencia sobre los gastos del consorcio."
    >
        {/* Acá iría el componente específico para mostrar el libro de gastos del consorcio */}
    </PaginaSimpleConLayout>
  );
}

export default GastosOcupante;
