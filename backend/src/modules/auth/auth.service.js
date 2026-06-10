
const crypto = require('crypto');

const Usuario = require('../../models/Usuario');
const { generateToken } = require('../../utils/jwt');
const sendMail = require('../../utils/mailer');
const { ESTADOS_USUARIO } = require('../../constants/estados');

// Reglas de password:
const validarPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;   // mayúscula
  if (!/[a-z]/.test(password)) return false;   // minúscula
  if (!/[0-9]/.test(password)) return false;   // número
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false; // especial
  return true;
};

// Para no filtrar si un mail existe o no (seguridad)
const respuestaGenericaRecuperacion = {
  success: true,
  message: 'Si el email existe, recibirá instrucciones para recuperar la contraseña.'
};

const login = async ({ email, password }) => {
  if (!email || !password) {
	const err = new Error('Email y password son requeridos');
	err.status = 400;
	throw err;
  }

  const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });
  if (!usuario) {
	const err = new Error('Credenciales inválidas');
	err.status = 401;
	throw err;
  }

  // Solo los inactivos no pueden loguearse, los pendientes sí (para que puedan cambiar su password temporal)
  if (usuario.estado === 'INACTIVO') {
	const err = new Error('Usuario desactivado, contacte al administrador');
	err.status = 403;
	throw err;
  }

  const ok = await usuario.verificarPassword(password);
  if (!ok) {
	const err = new Error('Credenciales inválidas');
	err.status = 401;
	throw err;
  }

  const payload = {
	id: usuario._id,
	tipo: usuario.tipo
  };

  // Token de sesión
  const token = generateToken(payload, '8h');

  return {
	success: true,
	token,
	usuario: {
  	id: usuario._id,
  	nombre: usuario.nombre,
  	apellido: usuario.apellido,
  	email: usuario.email,
  	tipo: usuario.tipo,
  	estado: usuario.estado,
  	debeCambiarPassword: usuario.debeCambiarPassword
	}
  };
};

const recuperar = async ({ email }) => {
  if (!email) {
	const err = new Error('Email es requerido');
	err.status = 400;
	throw err;
  }

  const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });

  // Siempre respuesta genérica
  if (!usuario) {
	console.log(`Intento de recuperación de contraseña para email no registrado: ${email}`);
	return respuestaGenericaRecuperacion;
  }

  // Generar token random + expiración 1h
  const tokenPlano = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(tokenPlano).digest('hex');

  usuario.tokenRecuperacion = tokenHash;
  usuario.expiracionToken = new Date(Date.now() + 60 * 60 * 1000); // 1h
  await usuario.save();

  // APUNTAR A FRONTEND CUANDO ESTE LA PANTALLA
  const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
  const linkReset = `${frontend}/reset-password?token=${tokenPlano}`;

  console.log('Token de reset:', tokenPlano); // Para pruebas
  console.log('Link de reset:', linkReset);   // Para pruebas

  const subject = 'Recuperación de contraseña - Consorcio365';
  const html = `
	<div style="font-family: Arial, sans-serif;">
  	<h2>Recuperación de contraseña</h2>
  	<p>Hola ${usuario.nombre},</p>
  	<p>Recibimos una solicitud para restablecer su contraseña.</p>
  	<p>Haga click en este enlace para crear una nueva contraseña (válido por 1 hora):</p>
  	<p>${linkReset}</p>
  	<p>Si no fue usted, puede ignorar este correo.</p>
	</div>
  `;

  // Try catch por si el mail falla
  try {
	await sendMail(usuario.email, subject, html);
	console.log('✅ Mail enviado a:', usuario.email);
  } catch (e) {
	console.warn('No se pudo enviar mail. Link de reset:', linkReset);
	console.error('>>> ERROR REAL:', e);
  }

  return respuestaGenericaRecuperacion;
};

const resetPassword = async ({ token, nuevaPassword }) => {
  if (!token || !nuevaPassword) {
	const err = new Error('Token y nuevaPassword son requeridos');
	err.status = 400;
	throw err;
  }

  if (!validarPassword(nuevaPassword)) {
	const err = new Error('La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
	err.status = 400;
	throw err;
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const usuario = await Usuario.findOne({
	tokenRecuperacion: tokenHash,
	expiracionToken: { $gt: new Date() }
  });

  if (!usuario) {
	const err = new Error('Token inválido o expirado');
	err.status = 400;
	throw err;
  }

  // Setear nueva contraseña (hasheado en el hook de pre-save del modelo)
  usuario.passwordHash = nuevaPassword;
  usuario.debeCambiarPassword = false;

  // Si estaba pendiente, se activa automaticamente al recuperar la contraseña
  if (usuario.estado === 'PENDIENTE') {
	usuario.estado = ESTADOS_USUARIO.ACTIVO;
  }

  usuario.tokenRecuperacion = null;
  usuario.expiracionToken = null;

  await usuario.save();

  return {
	success: true,
	message: 'Contraseña actualizada correctamente'
  };
};

const cambiarPassword = async ({ usuarioId, passwordActual, nuevaPassword }) => {
  if (!passwordActual || !nuevaPassword) {
	const err = new Error('La contraseña actual y la nueva contraseña son requeridas');
	err.status = 400;
	throw err;
  }

  if (!validarPassword(nuevaPassword)) {
	const err = new Error('La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
	err.status = 400;
	throw err;
  }

  const usuario = await Usuario.findById(usuarioId);
  if (!usuario) {
	const err = new Error('Usuario no encontrado');
	err.status = 404;
	throw err;
  }

  const ok = await usuario.verificarPassword(passwordActual);
  if (!ok) {
	const err = new Error('Contraseña actual incorrecta');
	err.status = 401;
	throw err;
  }

  usuario.passwordHash = nuevaPassword;
  usuario.debeCambiarPassword = false;

  if (usuario.estado === 'PENDIENTE') {
	usuario.estado = ESTADOS_USUARIO.ACTIVO;
  }

  await usuario.save();

  return {
	success: true,
	message: 'Contraseña cambiada correctamente'
  };
};

module.exports = {
  login,
  recuperar,
  resetPassword,
  cambiarPassword
};

