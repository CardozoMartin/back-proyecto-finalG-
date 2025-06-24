import db from '../config/database.js';


export const crearCliente = async (req, res) => {
    try {
        // obtener los datos del body
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const email = req.body.email;
        const telefono = req.body.telefono;

        const query = 'INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)';

        //llamas ala base de datos para inser el cliente

        db.query(query,[nombre, apellido, email, telefono], (error, results) => {
            if(error){
                console.error('Error al insertar el cliente:', error);
                return res.status(500).json({ message: 'Error al insertar el cliente' });
            }

            const datosCLientes = results[0]
            //si todo esta okey
            res.status(201).json({
                message: 'Cliente creado exitosamente',
                cliente: datosCLientes 
            });
        });
    
          
    } catch (error) {
        
    }
}