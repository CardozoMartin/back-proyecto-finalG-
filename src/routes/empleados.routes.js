import Router from 'express';
import { crearEmpleado, obtenerTodosLosEmpleados, actualizarEmpleado, eliminarEmpleado, obtenerEmpleadoPorId  } from '../controller/controller.empleados.js'; 

const router = Router();


//rutas empleados
router.post('/CrearEmpleados', crearEmpleado);
router.get('/ObtenerEmpleados', obtenerTodosLosEmpleados);
router.put('/ActualizarEmpleados/:idEmpleados', actualizarEmpleado);
router.delete('/EliminarEmpleados/:idEmpleados', eliminarEmpleado);
router.get('/ObtenerEmpleados/:idEmpleados', obtenerEmpleadoPorId);


export default router;
