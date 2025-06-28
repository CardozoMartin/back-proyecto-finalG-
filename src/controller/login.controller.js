import db from '../config/database.js';

export const login = async (req, res) =>{
    const { emailCliente, contraseña } = req.body;
    try {
        const verificaremailCliente = 'SELECT * FROM clientes WHERE emailCliente = ?';

        //ejecutamos la consulta para verificar el emailCliente
        db.query(verificaremailCliente, [emailCliente], (error, results) => {
            if(error){
                console.error('Error al verificar el emailCliente:', error);
                return res.status(500).json({ message: 'Contraseña o emila invalidos' });
            }

            if(results.length === 0){
                return res.status(404).json({ message: 'emailCliente o contraseña incorrecta' });
            }

            //vamos a verificar la contraseña
            const cliente = results[0];

            if(cliente.contraseña !== contraseña){
                return res.status(401).json({ message: 'emailCliente o contraseña incorrecta' });
            }
            const clienteSinContraseña = { ...cliente, contraseña: undefined };
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                cliente: clienteSinContraseña
            });
        });
    } catch (error) {
        console.error('Error en el proceso de inicio de sesión:', error);
        return res.status(500).json({ message: 'Error en el proceso de inicio de sesión' });
    }
}