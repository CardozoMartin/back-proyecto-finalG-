//Aca iran todas las importaciones
import express from 'express'
import db from './config/database.js'
import dotenv from 'dotenv'


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



// creamos el puerto
const PORT = process.env.PORT || 3000

//dejamos la app configurada para leer archivos json y otras configuraciones que indicaremos mas adelante
app.use(express.json())


//importamos las rutas



//Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} ✅`)
})