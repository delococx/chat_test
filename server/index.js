import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'
dotenv.config()
const port = process.env.PORT ?? 3000;




const app = express();

// Crear servidor HTTP
const server = createServer(app);

// Crear instancia de Socket.IO sobre el servidor HTTP
const io = new Server(server);
const db = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.API_KEY
  })
await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT)`)
  

// Manejo de conexiones Socket.IO
io.on('connection', async (socket) => {
  console.log("User has connected");

  socket.on('disconnect', () => {
    console.log('A user has disconnected');

  });

  socket.on('chat message', async (msg) => {
    let result

    try{
        result = await db.execute({
            sql:'INSERT INTO messages (content) VALUES (:msg)',
            args: { msg }


        })

    }catch(e){
        console.error(e)
    }
    io.emit('chat message',msg,result.lastInsertRowid.toString( ))
});
  if(!socket.recovered){

    try{

      const result = await db.execute({


      })

    }
    catch (e){

    }
    
  }


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
