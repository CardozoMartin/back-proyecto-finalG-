import db from '../config/database.js';

export const postProveedor = async (req, res) => {

    //obtener los datos del body
    const { NombreProveedor, TelefonoProveedor, EmailProveedor,DomicilioProveedor } = req.body;

    //validamos que los datos no esten vacios
    if (!NombreProveedor || !TelefonoProveedor || !EmailProveedor || !DomicilioProveedor) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        //insertamos el proveedor en la base de datos
        const queryInsert = 'INSERT INTO proveedores (NombreProveedor, TelefonoProveedor, EmailProveedor, DomicilioProveedor) VALUES (?, ?, ?, ?)';

        //ejecutamos la consulta para insertar el proveedor
        db.query(queryInsert, [NombreProveedor, TelefonoProveedor, EmailProveedor, DomicilioProveedor], (errorInsert, resultsInsert) => {
            if (errorInsert) {
                console.error('Error al insertar el proveedor:', errorInsert);
                return res.status(500).json({ message: 'Error al insertar el proveedor' });
            }

            //si la insercion fue exitosa devolvemos el proveedor insertado
            res.status(201).json({
                message: 'Proveedor creado exitosamente',
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerTodosLosProveedores = async (req, res) => {
    try {
        //consulta para obtener todos los proveedores
        const querySelect = 'SELECT * FROM proveedores';

        //ejecutamos la consulta para obtener los proveedores
        db.query(querySelect, (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener los proveedores:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener los proveedores' });
            }

            //si la consulta fue exitosa devolvemos los proveedores
            res.status(200).json(resultsSelect);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProveedorPorId = async (req, res) => {
    const { idProveedores } = req.params;

    try {
        //consulta para obtener un proveedor por su id
        const querySelect = 'SELECT * FROM proveedores WHERE idProveedores = ?';

        //ejecutamos la consulta para obtener el proveedor
        db.query(querySelect, [idProveedores], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }

            //si no se encuentra el proveedor devolvemos un error
            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }

            //si la consulta fue exitosa devolvemos el proveedor
            res.status(200).json(resultsSelect[0]);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}   

export const obtenerProveedorPorTel = async (req, res) => {
    const { TelefonoProveedor } = req.params;

    try {
        //consulta para obtener un proveedor por su telefono
        const querySelect = 'SELECT * FROM proveedores WHERE TelefonoProveedor = ?';

        //ejecutamos la consulta para obtener el proveedor
        db.query(querySelect, [TelefonoProveedor], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }

            //si no se encuentra el proveedor devolvemos un error
            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }

            //si la consulta fue exitosa devolvemos el proveedor
            res.status(200).json(resultsSelect[0]);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProveedorPorEmail = async (req, res) => {
    const { EmailProveedor } = req.params;
    try {
        //consulta para obtener un proveedor por su email
        const querySelect = 'SELECT * FROM proveedores WHERE EmailProveedor = ?';
        //ejecutamos la consulta para obtener el proveedor
        db.query(querySelect, [EmailProveedor], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }
            //si no se encuentra el proveedor devolvemos un error
            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }   
            //si la consulta fue exitosa devolvemos el proveedor
            res.status(200).json(resultsSelect[0]);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProveedorPorNombre = async (req, res) => {
    const { NombreProveedor } = req.params;
    try {
        //consulta para obtener un proveedor por su nombre
        const querySelect = 'SELECT * FROM proveedores WHERE NombreProveedor = ?';
        //ejecutamos la consulta para obtener el proveedor
        db.query(querySelect, [NombreProveedor], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }
            //si no se encuentra el proveedor devolvemos un error
            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }   
            //si la consulta fue exitosa devolvemos el proveedor
            res.status(200).json(resultsSelect[0]);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const actualizarProveedor = async (req, res) => {
    const { idProveedores } = req.params;
    const { NombreProveedor, TelefonoProveedor, EmailProveedor, DomicilioProveedor } = req.body;

    //validamos que los datos no esten vacios
    if (!NombreProveedor || !TelefonoProveedor || !EmailProveedor || !DomicilioProveedor) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        //consulta para actualizar un proveedor por su id
        const queryUpdate = 'UPDATE proveedores SET NombreProveedor = ?, TelefonoProveedor = ?, EmailProveedor = ?, DomicilioProveedor = ? WHERE idProveedores = ?';

        //ejecutamos la consulta para actualizar el proveedor
        db.query(queryUpdate, [NombreProveedor, TelefonoProveedor, EmailProveedor, DomicilioProveedor, idProveedores], (errorUpdate, resultsUpdate) => {
            
            if (errorUpdate) {
                console.error('Error al actualizar el proveedor:', errorUpdate);
                return res.status(500).json({ message: 'Error al actualizar el proveedor' });
            }
            if (resultsUpdate.affectedRows === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }
            
            //si la actualizacion fue exitosa devolvemos el proveedor actualizado
            res.status(200).json({
                message: 'Proveedor actualizado exitosamente',
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const eliminarProveedor = async (req, res) => {
    const { idProveedores } = req.params;

    try {
        //consulta para eliminar un proveedor por su id
        const queryDelete = 'DELETE FROM proveedores WHERE idProveedores = ?';

        //ejecutamos la consulta para eliminar el proveedor
        db.query(queryDelete, [idProveedores], (errorDelete, resultsDelete) => {
            if (errorDelete) {
                console.error('Error al eliminar el proveedor:', errorDelete);
                return res.status(500).json({ message: 'Error al eliminar el proveedor' });
            }

            //si la eliminacion fue exitosa devolvemos un mensaje de exito
            res.status(200).json({
                message: 'Proveedor eliminado exitosamente',
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}