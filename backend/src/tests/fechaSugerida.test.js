const MESES_POR_FRECUENCIA = {
  mensual: 1,
  bimestral: 2,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

function calcularProximaFecha(fechaBase, frecuencia) {
  const meses = MESES_POR_FRECUENCIA[frecuencia];
  if (!meses) return null;

  const proxima = new Date(fechaBase);
  proxima.setMonth(proxima.getMonth() + meses);
  return proxima;
}

describe('Cálculo de próxima fecha sugerida de mantenimiento', () => {
  test('frecuencia mensual suma 1 mes', () => {
	const base = new Date(2025, 0, 15); // 15 de enero 2025
	const proxima = calcularProximaFecha(base, 'mensual');
	expect(proxima.getMonth()).toBe(1); // febrero (0-indexed)
	expect(proxima.getFullYear()).toBe(2025);
  });

  test('frecuencia trimestral suma 3 meses', () => {
	const base = new Date(2025, 0, 15); // 15 de enero 2025
	const proxima = calcularProximaFecha(base, 'trimestral');
	expect(proxima.getMonth()).toBe(3); // abril
	expect(proxima.getFullYear()).toBe(2025);
  });

  test('frecuencia anual suma 12 meses y cambia de año', () => {
	const base = new Date(2025, 5, 10); // 10 de junio 2025
	const proxima = calcularProximaFecha(base, 'anual');
	expect(proxima.getMonth()).toBe(5); // junio
	expect(proxima.getFullYear()).toBe(2026);
  });

  test('frecuencia semestral suma 6 meses cruzando año', () => {
	const base = new Date(2025, 9, 1); // 1 de octubre 2025
	const proxima = calcularProximaFecha(base, 'semestral');
	expect(proxima.getMonth()).toBe(3); // abril
	expect(proxima.getFullYear()).toBe(2026);
  });

  test('frecuencia inválida devuelve null', () => {
	const base = new Date(2025, 0, 15);
	const proxima = calcularProximaFecha(base, 'cada dos semanas');
	expect(proxima).toBe(null);
  });
});
