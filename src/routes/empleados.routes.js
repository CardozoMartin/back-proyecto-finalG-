import Router from 'express';
import { crearEmpleado, obtenerTodosLosEmpleados, actualizarEmpleado, eliminarEmpleado } from '../controller/controller.empleados.js'; 

const router = Router();


//rutas empleados
router.post('/CrearEmpleados', crearEmpleado);
router.get('/ObtenerEmpleados', obtenerTodosLosEmpleados);
router.put('/ActualizarEmpleados/:id', actualizarEmpleado);
router.delete('/EliminarEmpleados/:id', eliminarEmpleado);

export default router;
