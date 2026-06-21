// Helper que replica la validación del service de usuarios
function validarTelefono(telefono) {
  if (!telefono) return false;
  return /^[+]?[\d\s\-()]{7,}$/.test(telefono);
}

describe('Validación de teléfono', () => {
  test('acepta un número argentino válido con código de país', () => {
	expect(validarTelefono('+54 341 555-1234')).toBe(true);
  });

  test('acepta un número simple sin símbolos', () => {
	expect(validarTelefono('3415551234')).toBe(true);
  });

  test('acepta un número con paréntesis', () => {
	expect(validarTelefono('(341) 555-1234')).toBe(true);
  });

  test('rechaza un teléfono con letras', () => {
	expect(validarTelefono('341abc1234')).toBe(false);
  });

  test('rechaza un teléfono vacío', () => {
	expect(validarTelefono('')).toBe(false);
  });

  test('rechaza un teléfono demasiado corto', () => {
	expect(validarTelefono('12345')).toBe(false);
  });
});
