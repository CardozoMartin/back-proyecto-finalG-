import Router from 'express';
import { actualizarProducto, eliminarProducto, obtenerProductosPorCategoria, obtenerProductosPorID, obtenerTodosLosProductos, postProducto } from '../controller/producto.controller.js';


const router = Router();


//metodos post
router.post('/crearProducto', postProducto);

//metodos get
router.get('/obtenerProductos', obtenerTodosLosProductos)
router.get('/obtenerProductos/:id', obtenerProductosPorID )
router.get('/obtenerProductos/categoria/:nombre_categoria', obtenerProductosPorCategoria); 


//metodos put
router.put('/actualizarProducto/:id', actualizarProducto)

//metodos delete
router.delete('/eliminarProducto/:id', eliminarProducto)

export default router;