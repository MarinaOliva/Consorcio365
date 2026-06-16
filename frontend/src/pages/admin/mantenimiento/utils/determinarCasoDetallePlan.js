function normalizarTexto(valor = "") {
  return String(valor).trim().toLowerCase();
}

export function determinarCasoDetallePlan(plan = {}) {
  const estadoPlan = normalizarTexto(plan.estadoPlan);
  const estadoInstancia = normalizarTexto(plan.estadoInstancia);
  const instanciaProgramada = normalizarTexto(plan.instanciaProgramada);

  if (estadoPlan === "inactivo") {
    return "inactivo";
  }

  if (estadoPlan === "activo" && estadoInstancia === "en curso") {
    return "activo-en-curso";
  }

  if (
    estadoPlan === "activo" &&
    (
      instanciaProgramada === "a programar" ||
      instanciaProgramada === "---" ||
      instanciaProgramada === ""
    )
  ) {
    return "activo-a-programar";
  }

  if (estadoPlan === "activo" && estadoInstancia === "programado") {
    if (plan.varianteAccionFinal === "alternativa") {
      return "activo-programado-alternativo";
    }

    return "activo-programado";
  }

  return "desconocido";
}