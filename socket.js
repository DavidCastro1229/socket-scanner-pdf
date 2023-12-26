const express = require('express');
const moment = require('moment');
const dotenv = require('dotenv');
const cors = require("cors");
const morgan = require("morgan")
const Axios = require("axios");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
dotenv.config()
const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"]
  }
})
app.use(cors());
app.use(morgan("dev"))
app.use(express.json());

const path = require('path');
const fs = require('fs')
const carpetaEnElEscritorio = path.join('C:', 'Users', 'David', 'Desktop', 'docs');

io.on('connection', (socket) => {

  console.log('a user connected');

const visualizar = ()=>{

  fs.watch(carpetaEnElEscritorio, (evento, nombreArchivo) => {
    const rutaArchivo = `${carpetaEnElEscritorio}/${nombreArchivo}`;
  
    if (evento === 'rename') {
      // Se agregó o eliminó un archivo
      fs.stat(rutaArchivo, (error, stats) => {
        if (error) {
          io.to(socket.id).emit('pdfEliminado', nombreArchivo)
          console.error(`Se eliminó el archivo: ${nombreArchivo}`);
        } else {
          io.to(socket.id).emit('pdfCreado', nombreArchivo)
          console.log(`Se agregó el archivo: ${nombreArchivo}`);
        }
      });
    }
  });
} 
visualizar()
});


server.listen(process.env.PORT || 4000, () => {
  console.log('Socket Activo');
});


