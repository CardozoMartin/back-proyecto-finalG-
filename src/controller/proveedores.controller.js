import db from '../config/database.js';

export const postProveedor = async (req, res) => {

    const { nombreProveedores, telefonoProveedores, emailProveedores,domicilioProveedores } = req.body;

    if (!nombreProveedores || !telefonoProveedores || !emailProveedores || !domicilioProveedores) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const queryInsert = 'INSERT INTO proveedores (nombreProveedores, telefonoProveedores, emailProveedores, domicilioProveedores) VALUES (?, ?, ?, ?)';

        db.query(queryInsert, [nombreProveedores, telefonoProveedores, emailProveedores, domicilioProveedores], (errorInsert, resultsInsert) => {
            if (errorInsert) {
                console.error('Error al insertar el proveedor:', errorInsert);
                return res.status(500).json({ message: 'Error al insertar el proveedor' });
            }

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
        const querySelect = 'SELECT * FROM proveedores';

        db.query(querySelect, (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener los proveedores:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener los proveedores' });
            }

            res.status(200).json(resultsSelect);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProveedorPorId = async (req, res) => {
    const { idProveedores } = req.params;

    try {
        const querySelect = 'SELECT * FROM proveedores WHERE idProveedores = ?';

        db.query(querySelect, [idProveedores], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }


            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }

            res.status(200).json(resultsSelect[0]);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}   

export const obtenerProveedorPorTel = async (req, res) => {
    const { telefonoProveedores } = req.params;

    try {
        const querySelect = 'SELECT * FROM proveedores WHERE telefonoProveedores = ?';

        db.query(querySelect, [telefonoProveedores], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }

            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }

            res.status(200).json(resultsSelect[0]);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProveedorPorEmail = async (req, res) => {
    const { emailProveedores } = req.params;
    try {
        const querySelect = 'SELECT * FROM proveedores WHERE emailProveedores = ?';
        db.query(querySelect, [emailProveedores], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }
            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }   
            res.status(200).json(resultsSelect[0]);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProveedorPorNombre = async (req, res) => {
    const { nombreProveedores } = req.params;
    try {
        const querySelect = 'SELECT * FROM proveedores WHERE nombreProveedores = ?';
        db.query(querySelect, [nombreProveedores], (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener el proveedor:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener el proveedor' });
            }
            if (resultsSelect.length === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }   
            res.status(200).json(resultsSelect[0]);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const actualizarProveedor = async (req, res) => {
    const { idProveedores } = req.params;
    const { nombreProveedores, telefonoProveedores, emailProveedores, domicilioProveedores } = req.body;

    if (!nombreProveedores || !telefonoProveedores || !emailProveedores || !domicilioProveedores) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const queryUpdate = 'UPDATE proveedores SET nombreProveedores = ?, telefonoProveedores = ?, emailProveedores = ?, domicilioProveedores = ? WHERE idProveedores = ?';

        db.query(queryUpdate, [nombreProveedores, telefonoProveedores, emailProveedores, domicilioProveedores, idProveedores], (errorUpdate, resultsUpdate) => {
            
            if (errorUpdate) {
                console.error('Error al actualizar el proveedor:', errorUpdate);
                return res.status(500).json({ message: 'Error al actualizar el proveedor' });
            }
            if (resultsUpdate.affectedRows === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }
            
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
        const queryDelete = 'DELETE FROM proveedores WHERE idProveedores = ?';

        db.query(queryDelete, [idProveedores], (errorDelete, resultsDelete) => {
            if (errorDelete) {
                console.error('Error al eliminar el proveedor:', errorDelete);
                return res.status(500).json({ message: 'Error al eliminar el proveedor' });
            }

            res.status(200).json({
                message: 'Proveedor eliminado exitosamente',
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}