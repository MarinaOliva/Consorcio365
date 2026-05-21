// src/data/unitsData.js

export const buildingUnitsLong = [
  "Piso 1 - Unidad A",
  "Piso 1 - Unidad B",
  "Piso 1 - Unidad C",
  "Piso 2 - Unidad A",
  "Piso 2 - Unidad B",
  "Piso 2 - Unidad C",
  "Piso 3 - Unidad A",
  "Piso 3 - Unidad B",
  "Piso 3 - Unidad C",
];

// Versión corta tipo 1A, 3C, 6B
export const buildingUnitsShort = [
  "1A", "1B", "1C",
  "2A", "2B", "2C",
  "3A", "3B", "3C",
];

// Si querés generar muchas unidades sin escribir a mano:
export const makeUnitsShort = (floors = 10, letters = ["A", "B", "C"]) =>
  Array.from({ length: floors }, (_, i) => {
    const floor = i + 1;
    return letters.map((l) => `${floor}${l}`);
  }).flat();

export const makeUnitsLong = (floors = 10, letters = ["A", "B", "C"]) =>
  Array.from({ length: floors }, (_, i) => {
    const floor = i + 1;
    return letters.map((l) => `Piso ${floor} - Unidad ${l}`);
  }).flat();