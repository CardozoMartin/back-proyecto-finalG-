import db from '../config/database.js';

export const obtenerMensaje = async (req, res) => {
    try {
        const querySelect = 'SELECT * FROM mensajes';

        db.query(querySelect, (errorSelect, resultsSelect) => {
            if (errorSelect) {
                console.error('Error al obtener los mensajes:', errorSelect);
                return res.status(500).json({ message: 'Error al obtener los mensajes' });
            }

            res.status(200).json(resultsSelect);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}
export const enviarMensaje = async (req, res) => {
    try {
        const { nombreMensaje, correoMensaje, telefonoMensaje, mensajeTexto } = req.body;

        // Validar campos vacíos
        if (!nombreMensaje || !correoMensaje || !telefonoMensaje || !mensajeTexto) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoMensaje)) {
            return res.status(400).json({ message: 'Correo electrónico no válido' });
        }

        // Validar teléfono: exactamente 10 dígitos numéricos
        const telefonoRegex = /^\d{10}$/;
        if (!telefonoRegex.test(telefonoMensaje)) {
            return res.status(400).json({ message: 'El teléfono debe tener exactamente 10 dígitos numéricos' });
        }

        const queryInsert = 'INSERT INTO mensajes (nombreMensaje, correoMensaje, telefonoMensaje, mensajeTexto) VALUES (?, ?, ?, ?)';
        const values = [nombreMensaje, correoMensaje, telefonoMensaje, mensajeTexto];

        db.query(queryInsert, values, (errorInsert, resultsInsert) => {
            if (errorInsert) {
                console.error('Error al enviar el mensaje:', errorInsert);
                return res.status(500).json({ message: 'Error al enviar el mensaje' });
            }

            res.status(201).json({ message: 'Mensaje enviado exitosamente', id: resultsInsert.insertId });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}
export const marcarMensajeComoVisto = async (req, res) => {
  try {
    const { id } = req.params;
    const queryUpdate = `UPDATE mensajes SET estadoMensaje = 'VISTO' WHERE idMensaje = ?`;
    db.query(queryUpdate, [id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error al actualizar el estado del mensaje' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Mensaje no encontrado' });
      }
      res.status(200).json({ message: 'Mensaje marcado como VISTO correctamente' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error inesperado', error: error.message });
  }
};
