//Aca iran todas las importaciones
import express from 'express'
import db from './config/database.js'
import dotenv from 'dotenv'
import routerProductos from './routes/producots.routes.js'
import cors from 'cors'

//iniciamos dotenv para poder llamar las variables de entorn
dotenv.config() 


//creamos la conexion a la base de datos antes que inicie el servidor
db.connect((err) => {
    if (err) {
        console.error('Error de conexión: ❌', err);
        return;
    }
    console.log('✅Conexión a MySQL exitosa 🚀');
})


//inicializamos la variable express
const app = express()

//configuramos los cors para los permisos de acceso
app.use(cors({
    origin: '*', // Permite todas las solicitudes de origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));


// creamos el puerto
const PORT = process.env.PORT || 3000

//dejamos la app configurada para leer archivos json y otras configuraciones que indicaremos mas adelante
app.use(express.json())


//importamos las rutas

app.use('/api/productos', routerProductos)
app.use('/api/clientes', routerProductos) // Asegúrate de que esta ruta sea correcta

//Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} ✅`)
})