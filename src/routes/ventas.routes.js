import { Router } from 'express';
import { crearVenta, obtenerVentas, actualizarEstadoVenta } from '../controller/ventas.controller.js';

const router = Router();

router.post('/', crearVenta);
router.get('/', obtenerVentas);
router.put('/:id', actualizarEstadoVenta);

export default router;