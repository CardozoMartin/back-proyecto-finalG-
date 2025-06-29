import Router from 'express';
import { crearEmpleado, obtenerTodosLosEmpleados, actualizarEmpleado, eliminarEmpleado, obtenerEmpleadoPorId , obtenerEmpleadosPorCategoria ,obtenerEmpleadosPorDNI,obtenerEmpleadosPorNombre } from '../controller/controller.empleados.js'; 

const router = Router();


//rutas empleados
router.post('/CrearEmpleados', crearEmpleado);
router.get('/ObtenerEmpleados', obtenerTodosLosEmpleados);
router.put('/ActualizarEmpleados/:idEmpleados', actualizarEmpleado);
router.delete('/EliminarEmpleados/:idEmpleados', eliminarEmpleado);
router.get('/ObtenerEmpleados/categoria/:idCat_empleados', obtenerEmpleadosPorCategoria);
router.get('/ObtenerEmpleados/:idEmpleados', obtenerEmpleadoPorId);
router.get('/ObtenerEmpleados/DNI/:DNI', obtenerEmpleadosPorDNI);
router.get('/ObtenerEmpleados/nombre/:nombreEmpleado', obtenerEmpleadosPorNombre);
export default router;
