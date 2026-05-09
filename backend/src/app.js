const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar que el servidor responde
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'Servidor funcionando' });
});

// Acá irán las rutas de cada módulo más adelante
// app.use('/api/auth',      require('./modules/auth/auth.routes'));
// app.use('/api/usuarios',  require('./modules/usuarios/usuarios.routes'));
// etc.

module.exports = app;