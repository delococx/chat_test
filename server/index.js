import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const port = process.env.PORT ?? 3000;

const app = express();

// Crear servidor HTTP
const server = createServer(app);

// Crear instancia de Socket.IO sobre el servidor HTTP
const io = new Server(server);

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  console.log("User has connected");

  socket.on('disconnect', () => {
    console.log('A user has disconnected');

  });

  socket.on('chat message', (msg) => {
    io.emit('chat message',msg)
});
});

// Middleware para logging
app.use(logger('dev'));

// Ruta principal para servir el archivo HTML
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

// Iniciar el servidor HTTP, no el servidor Express
server.listen(port, () => {
  console.log("Server running on port", port);
});
