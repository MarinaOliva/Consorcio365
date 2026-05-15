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
// app.use('/api/auth',          
// app.use('/api/usuarios',      
// app.use('/api/edificios',     
// app.use('/api/unidades',      
// app.use('/api/incidencias',   
// app.use('/api/trabajos',      
// app.use('/api/gastos',        
// app.use('/api/mantenimiento', 
// app.use('/api/avisos',        
// app.use('/api/documentos',   

// --- Manejo de errores ---
app.use(errorHandler);

module.exports = app;