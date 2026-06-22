require('dns').setDefaultResultOrder('ipv4first'); 

require('dotenv').config();
const http = require('http');
const app  = require('./src/app');
const connectDB = require('./src/config/db');
const { Server }  = require('socket.io');
const setupSockets = require('./src/sockets');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:  process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Configurar eventos de socket
setupSockets(io);

// Hacer io accesible desde cualquier controller con req.app.get('io')
app.set('io', io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});