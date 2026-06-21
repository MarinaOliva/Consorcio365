const TRANSICIONES_VALIDAS = {
  CREADO:   	['ASIGNADO', 'CANCELADO'],
  ASIGNADO: 	['EN_EJECUCION', 'CANCELADO'],
  EN_EJECUCION: ['FINALIZADO', 'CANCELADO'],
  FINALIZADO:   ['CERRADO', 'EN_EJECUCION'],
  CERRADO:  	[],
  CANCELADO:	[],
};

function esTransicionValida(estadoActual, estadoNuevo) {
  const permitidas = TRANSICIONES_VALIDAS[estadoActual];
  if (!permitidas) return false;
  return permitidas.includes(estadoNuevo);
}

describe('Validación de transiciones de estado de un trabajo', () => {
  test('permite CREADO → ASIGNADO', () => {
	expect(esTransicionValida('CREADO', 'ASIGNADO')).toBe(true);
  });

  test('permite ASIGNADO → EN_EJECUCION', () => {
	expect(esTransicionValida('ASIGNADO', 'EN_EJECUCION')).toBe(true);
  });

  test('permite EN_EJECUCION → FINALIZADO', () => {
	expect(esTransicionValida('EN_EJECUCION', 'FINALIZADO')).toBe(true);
  });

  test('permite FINALIZADO → CERRADO', () => {
	expect(esTransicionValida('FINALIZADO', 'CERRADO')).toBe(true);
  });

  test('permite FINALIZADO → EN_EJECUCION (admin pide correcciones)', () => {
	expect(esTransicionValida('FINALIZADO', 'EN_EJECUCION')).toBe(true);
  });

  test('rechaza ASIGNADO → CERRADO (salto inválido)', () => {
	expect(esTransicionValida('ASIGNADO', 'CERRADO')).toBe(false);
  });

  test('rechaza CREADO → FINALIZADO (no se puede saltar pasos)', () => {
	expect(esTransicionValida('CREADO', 'FINALIZADO')).toBe(false);
  });

  test('rechaza cualquier transición desde CERRADO (estado final)', () => {
	expect(esTransicionValida('CERRADO', 'ASIGNADO')).toBe(false);
	expect(esTransicionValida('CERRADO', 'EN_EJECUCION')).toBe(false);
  });

  test('rechaza cualquier transición desde CANCELADO (estado final)', () => {
	expect(esTransicionValida('CANCELADO', 'ASIGNADO')).toBe(false);
  });

  test('rechaza estado actual inexistente', () => {
	expect(esTransicionValida('INVENTADO', 'ASIGNADO')).toBe(false);
  });
});

