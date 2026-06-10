const Edificio = require('../../models/Edificio');

const makeError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const listar = async () => {
  const edificios = await Edificio.find().sort({ createdAt: -1 });
  return { success: true, total: edificios.length, edificios };
};

const obtener = async (id) => {
  const edificio = await Edificio.findById(id);
  if (!edificio) throw makeError(404, 'Edificio no encontrado');
  return { success: true, edificio };
};

const actualizar = async (id, data) => {
  const edificio = await Edificio.findById(id);
  if (!edificio) throw makeError(404, 'Edificio no encontrado');

  // Campos permitidos
  const permitidos = ['nombre', 'direccion', 'amenities'];

  permitidos.forEach((campo) => {
    if (data[campo] !== undefined) edificio[campo] = data[campo];
  });

  // Validaciones básicas
  if (!edificio.nombre || !edificio.direccion) {
    throw makeError(400, 'nombre y direccion son requeridos');
  }

  if (data.amenities !== undefined && !Array.isArray(data.amenities)) {
    throw makeError(400, 'amenities debe ser un array de strings');
  }

  await edificio.save();
  return { success: true, edificio };
};

module.exports = {
  listar,
  obtener,
  actualizar
};