import db from '../config/database.js';
import bcrypt from 'bcryptjs';


export const crearCliente = async (req, res) => {
    try {
        // obtener los datos del body
        const { nombreCliente, apellidoCliente, DNI, telefonoCliente, emailCliente, domicilioCliente,contraseña} = req.body;

        //validamos que los datos no esten vacios
        if (!nombreCliente || !apellidoCliente || !DNI || !telefonoCliente || !emailCliente || !domicilioCliente) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Encriptar la contraseña antes de guardarla
        const saltRounds = 10;
        const constraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);




        const query = 'INSERT INTO clientes (nombreCliente,apellidoCliente,DNI,telefonoCliente,emailCliente,domicilioCliente,contraseña) VALUES (?, ?, ?, ?, ?, ?,?)';

        //llamas ala base de datos para inser el cliente

        db.query(query, [nombreCliente, apellidoCliente, DNI, telefonoCliente, emailCliente, domicilioCliente, constraseñaEncriptada], (error, results) => {
            if (error) {
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

export const ObtenerTodosLosClientes = async (req, res) => {
    try {
        const query = 'SELECT * FROM Clientes';
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error al obtener los Clientes:', error);
                return res.status(500).json({ message: 'Error al obtener los clientes' });
            }

            // si la consulta fue exitosa, devolvemos los resultados
            res.status(200).json({
                message: 'Clientes obtenidos exitosamente',
                Clientes: results
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const EliminarCliente = async (req, res) => {
    try {
        const { idClientes } = req.params;

        // Verificar si el ID es válido
        if (!idClientes) {
            return res.status(400).json({ message: 'ID de cliente es requerido' });
        }

        const query = 'DELETE FROM Clientes WHERE idClientes = ?';

        db.query(query, [idClientes], (error, results) => {
            if (error) {
                console.error('Error al eliminar el cliente:', error);
                return res.status(500).json({ message: 'Error al eliminar el cliente' });
            }

            // Verificar si se eliminó algún registro
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            // usar length

            res.status(200).json({ message: 'Cliente eliminado exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const ActualizarCliente = async (req, res) => {
    try {
        const { idClientes } = req.params;
        const { nombreCliente, apellidoCliente, DNI, telefonoCliente, emailCliente, domicilioCliente } = req.body;

        // Validar que el ID y los datos no estén vacíos
        if (!idClientes || !nombreCliente || !apellidoCliente || !DNI || !telefonoCliente || !emailCliente || !domicilioCliente) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const query = 'UPDATE Clientes SET nombreCliente = ?, apellidoCliente = ?, DNI = ?, telefonoCliente = ?, emailCliente = ?, domicilioCliente = ?, WHERE idClientes = ?';

        db.query(query, [nombreCliente, apellidoCliente, DNI, telefonoCliente, emailCliente, domicilioCliente, idClientes], (error, results) => {
            if (error) {
                console.error('Error al actualizar el cliente:', error);
                return res.status(500).json({ message: 'Error al actualizar el cliente' });
            }

            // Verificar si se actualizó algún registro
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.status(200).json({ message: 'Cliente actualizado exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}