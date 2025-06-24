import Router from 'express';
import { obtenerProductosPorCategoria, obtenerProductosPorID, obtenerTodosLosProductos, postProducto } from '../controller/producto.controller.js';


const router = Router();


//metodos post
router.post('/crearProducto', postProducto);

//metodos get
router.get('/obtenerProductos', obtenerTodosLosProductos)
router.get('/obtenerProductos/:id', obtenerProductosPorID )
router.get('/obtenerProductos/categoria/:nombre_categoria', obtenerProductosPorCategoria); 


//metodos put


//metodos delete


export default router;