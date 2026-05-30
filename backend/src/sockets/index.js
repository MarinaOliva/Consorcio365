const setupSockets = (io) => {
  io.on('connection', (socket) => {
	console.log('Cliente conectado:', socket.id);

	socket.on('join', ({ tipo, usuarioId }) => {
  	if (tipo) {
    	socket.join(`tipo:${tipo}`);
    	console.log(`Socket ${socket.id} se unió a room tipo:${tipo}`);
  	}
  	if (usuarioId) {
    	socket.join(`user:${usuarioId}`);
  	}
	});

	socket.on('disconnect', () => {
  	console.log('Cliente desconectado:', socket.id);
	});
  });
};

module.exports = setupSockets;

