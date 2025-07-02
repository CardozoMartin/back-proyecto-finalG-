
//Aca iran todas las importaciones
import express from 'express'
import db from './config/database.js'
import dotenv from 'dotenv'
import routerProductos from './routes/producots.routes.js'
import routerProveedores from './routes/proveedores.routes.js'
import routerCategorias from './routes/categorias.routes.js'
import routerEmpleados from "./routes/empleados.routes.js"
import routerClientes from './routes/clientes.routes.js'
import routerLogin from './routes/login.routes.js'
import routerVentas from './routes/ventas.routes.js'
import cors from 'cors'
import routerMensajes from './routes/mensajes.routes.js'




//iniciamos dotenv para poder llamar las variables de entorn
dotenv.config() 


//creamos la conexion a la base de datos antes que inicie el servidor

db.connect((err) => {
  if (err) {
    console.error('Error de conexión: ❌', err);
    return;
  }
  console.log('✅ Conexión a MySQL exitosa 🚀');
});

// Inicializamos Express
const app = express();

// Configuramos CORS
app.use(cors({
  origin: 'http://localhost:5173', // Origen del frontend (Vite)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Añadimos PATCH
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuramos el puerto
const PORT = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Rutas
app.use('/api/productos', routerProductos);
app.use('/api/proveedores', routerProveedores);
app.use('/api/categorias', routerCategorias);
app.use('/api/clientes', routerClientes)
app.use('/api/empleados', routerEmpleados) 
app.use('/api/login',routerLogin)
app.use('/api/ventas', routerVentas)
app.use('/api/mensajes',routerMensajes)




// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} ✅`);
});