import Router from 'express';
import { obtenerTodosLosProductos, postProducto } from '../controller/producto.controller.js';
import { crearCliente } from '../controller/cliente.controller.js';

const router = Router();



router.post('/crearProducto', postProducto);
router.get('/obtenerProductos', obtenerTodosLosProductos)
router.post('/crearCliente', crearCliente )


export default router;