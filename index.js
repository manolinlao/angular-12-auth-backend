const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// contenido de process.env,
// al hacer el dotenv.config se incorpora la info de .env
// console.log(process.env);

// Crear el servidor/aplicación de Express
const app = express();

// Conexión a la DB
dbConnection();

// Directorio Público
app.use( express.static('public') );

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Levantar la app de Express
// lo hacemos en un puerto que no sea 4200, que es el que usa Angular
app.listen(process.env.PORT, ()=>{
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
});