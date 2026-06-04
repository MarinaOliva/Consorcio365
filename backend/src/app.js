const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Middlewares globales ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    status: 'OK',
    mensaje: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  });
});

// --- Rutas ---
app.use('/api/auth', require ('./modules/auth/auth.routes') );         
app.use('/api/usuarios', require('./modules/usuarios/usuarios.routes'));     
app.use('/api/edificios', require('./modules/edificios/edificios.routes'));    
app.use('/api/unidades', require('./modules/unidades/unidades.routes'));
app.use('/api/incidencias', require('./modules/incidencias/incidencias.routes'));
app.use('/api/trabajos', require('./modules/trabajos/trabajos.routes'));
app.use('/api/gastos', require('./modules/gastos/gastos.routes'));
app.use('/api/mantenimiento', require('./modules/mantenimiento/mantenimiento.routes'));
// app.use('/api/avisos',        
// app.use('/api/documentos',   

// --- Manejo de errores ---
app.use(errorHandler);

module.exports = app;