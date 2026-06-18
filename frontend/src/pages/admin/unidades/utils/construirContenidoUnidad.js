export function construirUsuariosRelacionados(unidad, { editable = false } = {}) {
  const usuarios = unidad?.usuarios || [];

  if (usuarios.length) return usuarios;

  const valorVacio = editable ? "" : "-";

  return [
    ...(unidad?.ocupanteActual && unidad.ocupanteActual !== "-"
      ? [
          {
            id: "ocupante",
            nombre: unidad.ocupanteActual,
            rol: "Inquilino",
            desde: valorVacio,
            hasta: valorVacio,
          },
        ]
      : []),
    {
      id: "propietario",
      nombre: unidad?.propietario || "-",
      rol: "Propietario",
      desde: valorVacio,
      hasta: valorVacio,
    },
  ];
}

export function construirIncidencias(unidad) {
  const incidencias = unidad?.incidencias || [];

  if (incidencias.length) return incidencias;

  return [
    {
      id: "empty",
      titulo: "Sin incidencias registradas",
      fecha: "-",
      estado: "Cerrada",
    },
  ];
}

export function construirHistorialOcupacion(unidad) {
  const historialOcupacion = unidad?.historialOcupacion || [];

  if (historialOcupacion.length) return historialOcupacion;

  return [
    {
      id: "empty",
      ocupante: "Sin registros",
      rol: "-",
      desde: "-",
      hasta: "-",
      estado: "Finalizado",
    },
  ];
}