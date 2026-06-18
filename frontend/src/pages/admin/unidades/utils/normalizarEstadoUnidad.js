export function normalizarEstadoUnidad(estado = "") {
  const valor = String(estado).trim().toLowerCase();

  if (valor === "ocupado" || valor === "ocupada") return "ocupada";
  if (valor === "desocupado" || valor === "desocupada") return "desocupada";

  return valor;
}

export function etiquetaEstadoUnidad(estado = "") {
  const normalizado = normalizarEstadoUnidad(estado);

  if (normalizado === "ocupada") return "Ocupada";
  if (normalizado === "desocupada") return "Desocupada";

  return estado;
}