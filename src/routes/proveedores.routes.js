import Router from 'express';
import { actualizarProveedor, eliminarProveedor, obtenerProveedorPorEmail, obtenerProveedorPorId, obtenerProveedorPorNombre, obtenerProveedorPorTel, obtenerTodosLosProveedores, postProveedor } from '../controller/proveedores.controller.js';


const router = Router();

router.get('/obtenerProveedor', obtenerTodosLosProveedores);
router.get('/obtenerProveedorPorId/:idProveedores', obtenerProveedorPorId);
router.get('/obtenerProveedorPorTel/telefono/:TelefonoProveedor', obtenerProveedorPorTel);
router.get('/obtenerProveedorPorEmail/email/:EmailProveedor', obtenerProveedorPorEmail);
router.get('/obtenerProveedorPorNombre/nombre/:NombreProveedor', obtenerProveedorPorNombre);
router.post('/insertarProveedor', postProveedor);
router.delete('/eliminarProveedor/:idProveedores', eliminarProveedor);
router.put('/actualizarProveedor/:idProveedores', actualizarProveedor);

export default router;
