import { Router } from 'express';
import { postCategoria, obtenerTodasLasCategorias, obtenerCategoriaPorId, actualizarCategoria, actualizarEstadoCategoria } from '../controller/cat_producto.controller.js';

const router = Router();

router.post('/crearCategoria', postCategoria);
router.get('/obtenerTodasLasCategorias', obtenerTodasLasCategorias);
router.get('/obtenerCategoriaPorId/:id', obtenerCategoriaPorId);
router.put('/actualizarCategoria/:id', actualizarCategoria);
router.patch('/actualizarCategoria/:id', actualizarEstadoCategoria);

export default router;