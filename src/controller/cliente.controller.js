import db from '../config/database.js';



export const crearCliente = async (req, res) => {
    try {
        // obtener los datos del body
        const { nombreCliente, apellidoCliente, DNI, telefonoCliente, emailCliente, domicilioCliente,contraseña} = req.body;

        //validamos que los datos no esten vacios
        if (!nombreCliente || nombreCliente.trim() === '' ||
            !apellidoCliente || apellidoCliente.trim() === '' ||
            !DNI || DNI.toSting().trim() === '' ||
            !telefonoCliente || telefonoCliente.toString().trim() === '' ||
            !emailCliente || emailCliente.trim() === '' ||
            !domicilioCliente || domicilioCliente.trim() === '' )
            {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }


        const query = 'INSERT INTO Clientes (nombreCliente, apellidoCliente, DNI, telefonoCliente, emailCliente, domicilioCliente, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?)';
 
        // validar email duplicado
        const emailQuery = 'SELECT * FROM Clientes WHERE emailCliente = ?';
        db.query(emailQuery, [emailCliente], (error, results) => {
            if (error) {
                console.error('Error al verificar el email:', error);
                return res.status(500).json({ message: "Error al verificar el email" });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: "Email ya existe" });
            }
        });
        // validar DNI duplicado
        const dniQuery = 'SELECT * FROM Clientes WHERE DNI = ?';
        db.query(dniQuery, [DNI], (error, results) => {
            if (error) {
                console.error('Error al verificar el DNI:', error);
                return res.status(500).json({ message: "Error al verificar el DNI" });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: "DNI ya existe" });
            }
        });
        // validar telefono duplicado
        const telefonoQuery = 'SELECT * FROM Clientes WHERE telefonoCliente = ?';
        db.query(telefonoQuery, [telefonoCliente], (error, results) => {  
            if (error) {
                console.error('Error al verificar el telefono:', error);
                return res.status(500).json({ message: "Error al verificar el telefono" });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: "Telefono ya existe" });
            }
        });

        //llamas ala base de datos para inser el cliente
        db.query(query, [nombreCliente, apellidoCliente, DNI, telefonoCliente, emailCliente, domicilioCliente,contraseña], (error, results) => {

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