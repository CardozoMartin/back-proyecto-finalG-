import Router from 'express';
import { obtenerTodosLosProductos, postProducto } from '../controller/producto.controller.js';


const router = Router();



router.post('/crearProducto', postProducto);
router.get('/obtenerProductos', obtenerTodosLosProductos)



export default router;