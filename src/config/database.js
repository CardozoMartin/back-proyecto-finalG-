import mysql from 'mysql2'
import dotenv from 'dotenv'


//iniciamos dotenv para poder llamar las variables de entorno
dotenv.config()

// Crear conexión usando las variables de entorno
const connection = mysql.createConnection({
  host: process.env.DB_HOST, //son variales que solamente existe en el .env de forma global
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export default connection;
