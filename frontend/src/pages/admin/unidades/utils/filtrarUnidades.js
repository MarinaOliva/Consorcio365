import {
  etiquetaEstadoUnidad,
  normalizarEstadoUnidad,
} from "./normalizarEstadoUnidad";

function normalizarTexto(valor = "") {
  return String(valor).trim().toLowerCase();
}

export function filtrarUnidades(unidades = [], filtros = {}) {
  const estadoFiltro = filtros.estadoFiltro || "Todos";
  const busqueda = normalizarTexto(filtros.busqueda);

  return unidades.filter((unidad) => {
    const coincideEstado =
      estadoFiltro === "Todos" ||
      normalizarEstadoUnidad(unidad.estado) ===
        normalizarEstadoUnidad(estadoFiltro);

    const coincideBusqueda = normalizarTexto(unidad.numero).includes(busqueda);

    return coincideEstado && coincideBusqueda;
  });
}

export function opcionesEstadoUnidad() {
  return [
    { value: "Todos", label: "Todos los estados" },
    { value: etiquetaEstadoUnidad("Ocupada"), label: "Ocupada" },
    { value: etiquetaEstadoUnidad("Desocupada"), label: "Desocupada" },
    { value: etiquetaEstadoUnidad("En refacción"), label: "En refacción"},
  ];
}