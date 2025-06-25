import Router from 'express';
import { ActualizarCliente, crearCliente, EliminarCliente, ObtenerTodosLosClientes } from '../controller/cliente.controller.js';



const router = Router();

router.post('/crearCliente', crearCliente )
router.get('/ObtenerTodosLosClientes', ObtenerTodosLosClientes)
router.delete('/EliminarCliente/:idClientes', EliminarCliente);
router.put('/ActualizarCliente/:idClientes', ActualizarCliente)

export default router;