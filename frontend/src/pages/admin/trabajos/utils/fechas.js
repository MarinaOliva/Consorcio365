export function normalizarTexto(valor) {
  return String(valor ?? "").toLowerCase().trim();
}

export function convertirFechaArgentinaADate(fecha) {
  if (!fecha) return null;

  const [dia, mes, anio] = fecha.split("/").map(Number);

  if (!dia || !mes || !anio) return null;

  return new Date(anio, mes - 1, dia);
}

export function estaDentroDelRango(fecha, filtro) {
  if (filtro === "Todos") return true;

  const fechaTrabajo = convertirFechaArgentinaADate(fecha);

  if (!fechaTrabajo) return false;

  const hoy = new Date();
  const diasFiltro = Number(filtro);
  const fechaLimite = new Date();

  fechaLimite.setDate(hoy.getDate() - diasFiltro);

  return fechaTrabajo >= fechaLimite && fechaTrabajo <= hoy;
}