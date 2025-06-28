import Router from 'express';
import { crearVenta, obtenerVentas } from '../controller/ventas.controller.js';

const router = Router();

router.post('/', crearVenta)
router.get('/',obtenerVentas)

export default router;