export function normalizarEstadoUnidad(estado = "") {
  const valor = String(estado).trim().toLowerCase();

  if (valor === "ocupado" || valor === "ocupada") return "ocupada";
  if (valor === "desocupado" || valor === "desocupada" || valor === "vacia")
	return "desocupada";
  if (
	valor === "en refacción" ||
	valor === "en refaccion" ||
	valor === "refacción" ||
	valor === "refaccion"
  )
	return "en refacción";

  return valor;
}

export function etiquetaEstadoUnidad(estado = "") {
  const normalizado = normalizarEstadoUnidad(estado);

  if (normalizado === "ocupada") return "Ocupada";
  if (normalizado === "desocupada") return "Desocupada";
  if (normalizado === "en refacción") return "En refacción";

  return estado;
}