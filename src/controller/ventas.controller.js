import db from '../config/database.js';

// Crear una venta
export const crearVenta = async (req, res) => {
   const { idEmpleados, idClientes, productos } = req.body;
   console.log('ID Empleado:', idEmpleados);
   console.log('ID Cliente:', idClientes);
   console.log('Productos:', productos);

   try {
      // Verificar que el empleado exista
      const verificarEmpleado = 'SELECT * FROM Empleados WHERE idEmpleados = ?';
      db.query(verificarEmpleado, [idEmpleados], (errorEmpleado, resulEmpleado) => {
         if (errorEmpleado) {
            return res.status(500).json({ error: 'Error al verificar el empleado' });
         }
         if (resulEmpleado.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
         }
         console.log('Empleado verificado:', resulEmpleado[0]);

         // Verificar que el cliente exista
         const verificarCliente = 'SELECT * FROM Clientes WHERE idClientes = ?';
         db.query(verificarCliente, [idClientes], (errorCliente, resulCliente) => {
            if (errorCliente) {
               return res.status(500).json({ error: 'Error al verificar el cliente' });
            }
            if (resulCliente.length === 0) {
               return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            console.log('Cliente verificado:', resulCliente[0]);
            console.log('Productos a insertar:', productos);

            // Verificar que los productos existan
            const verificarProductos = `SELECT idProductos FROM Productos WHERE idProductos IN (?)`;
            const productoIds = productos.map((p) => p.idProducto);
            db.query(verificarProductos, [productoIds], (errorProductos, resulProductos) => {
               if (errorProductos) {
                  return res.status(500).json({ error: 'Error al verificar los productos' });
               }
               if (resulProductos.length !== productoIds.length) {
                  return res.status(404).json({ error: 'Uno o más productos no encontrados' });
               }

               // Iniciar la transacción
               db.beginTransaction((err) => {
                  if (err) {
                     return res.status(500).json({ error: 'Error al iniciar la transacción' });
                  }

                  // Insertar la venta con totalVenta en 0 y estado 'Completada'
                  const insertarVenta = `INSERT INTO Ventas (fechaVenta, totalVenta, estadoVentas, Empleados_idEmpleados, Clientes_idClientes) VALUES (NOW(), 0, 'Completada', ?, ?)`;
                  db.query(insertarVenta, [idEmpleados, idClientes], (errorVenta, resultadoVenta) => {
                     if (errorVenta) {
                        return db.rollback(() => {
                           res.status(500).json({ error: 'Error al insertar la venta' });
                        });
                     }
                     const idVenta = resultadoVenta.insertId;

                     // Insertar los productos en Ventas_has_Productos
                     const insertarDetalle = `INSERT INTO Ventas_has_Productos (Ventas_idVentas, Ventas_Empleados_idEmpleados, Ventas_Clientes_idClientes, Productos_idProductos, cantidad, precioUnitario) VALUES ?`;
                     const detalles = productos.map((p) => [
                        idVenta,
                        idEmpleados,
                        idClientes,
                        p.idProducto,
                        p.cantidad,
                        p.precioUnitario,
                     ]);
                     db.query(insertarDetalle, [detalles], (errorDetalle) => {
                        if (errorDetalle) {
                           return db.rollback(() => {
                              res.status(500).json({ error: 'Error al insertar los productos de la venta' });
                           });
                        }

                        // Calcular el total de la venta
                        const totalVenta = productos.reduce((acc, p) => acc + p.cantidad * p.precioUnitario, 0);

                        // Actualizar el totalVenta en la tabla Ventas
                        const actualizarTotal = 'UPDATE Ventas SET totalVenta = ? WHERE idVentas = ?';
                        db.query(actualizarTotal, [totalVenta, idVenta], (errorUpdate) => {
                           if (errorUpdate) {
                              return db.rollback(() => {
                                 res.status(500).json({ error: 'Error al actualizar el total de la venta' });
                              });
                           }

                           // Confirmar la transacción
                           db.commit((errCommit) => {
                              if (errCommit) {
                                 return db.rollback(() => {
                                    res.status(500).json({ error: 'Error al confirmar la venta' });
                                 });
                              }
                              res.status(201).json({ mensaje: 'Venta creada exitosamente', idVenta, totalVenta });
                           });
                        });
                     });
                  });
               });
            });
         });
      });
   } catch (error) {
      console.error('Error interno:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

// Obtener todas las ventas o filtrar por cliente
export const obtenerVentas = async (req, res) => {
   const { clienteId } = req.query;
   try {
      const query = `
         SELECT
            v.idVentas,
            v.fechaVenta,
            v.totalVenta,
            v.estadoVentas,
            c.idClientes,
            c.nombreCliente,
            c.apellidoCliente,
            c.telefonoCliente,
            c.emailCliente,
            c.domicilioCliente AS direccionCliente,
            c.estadoCliente,
            e.idEmpleados,
            e.nombreEmpleado,
            e.apellidoEmpleado,
            p.idProductos,
            p.nombreProducto,
            p.descripcion,
            vhp.cantidad,
            vhp.precioUnitario,
            (vhp.cantidad * vhp.precioUnitario) AS subtotal
         FROM Ventas v
         INNER JOIN Clientes c ON v.Clientes_idClientes = c.idClientes
         INNER JOIN Empleados e ON v.Empleados_idEmpleados = e.idEmpleados
         INNER JOIN Ventas_has_Productos vhp ON v.idVentas = vhp.Ventas_idVentas
         INNER JOIN Productos p ON vhp.Productos_idProductos = p.idProductos
         ${clienteId ? 'WHERE c.idClientes = ?' : ''}
         ORDER BY v.fechaVenta DESC, v.idVentas DESC;
      `;
      db.query(query, clienteId ? [clienteId] : [], (error, results) => {
         if (error) {
            console.error('Error al obtener las ventas:', error);
            return res.status(500).json({ error: 'Error al obtener las ventas' });
         }

         const ventas = {};
         results.forEach((row) => {
            if (!ventas[row.idVentas]) {
               ventas[row.idVentas] = {
                  idVentas: row.idVentas,
                  fechaVenta: row.fechaVenta,
                  totalVenta: row.totalVenta,
                  estadoVentas: row.estadoVentas,
                  idClientes: row.idClientes,
                  nombreCliente: row.nombreCliente,
                  apellidoCliente: row.apellidoCliente,
                  telefonoCliente: row.telefonoCliente,
                  emailCliente: row.emailCliente,
                  direccionCliente: row.direccionCliente,
                  estadoCliente: row.estadoCliente,
                  idEmpleados: row.idEmpleados,
                  nombreEmpleado: row.nombreEmpleado,
                  apellidoEmpleado: row.apellidoEmpleado,
                  productos: [],
               };
            }
            ventas[row.idVentas].productos.push({
               idProductos: row.idProductos,
               nombreProducto: row.nombreProducto,
               descripcion: row.descripcion,
               cantidad: row.cantidad,
               precioUnitario: row.precioUnitario,
               subtotal: row.subtotal,
            });
         });

         const ventasArray = Object.values(ventas);
         res.status(200).json(ventasArray);
      });
   } catch (error) {
      console.error('Error interno:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};

// Actualizar el estado de una venta
export const actualizarEstadoVenta = async (req, res) => {
   const { id } = req.params;
   const { estadoVentas } = req.body;

   const validEstados = ['Completada', 'Pendiente', 'Cancelada'];
   if (!validEstados.includes(estadoVentas)) {
      return res.status(400).json({ error: 'Estado no válido. Use: Completada, Pendiente, Cancelada' });
   }

   try {
      const query = 'UPDATE Ventas SET estadoVentas = ? WHERE idVentas = ?';
      db.query(query, [estadoVentas, id], (error, result) => {
         if (error) {
            console.error('Error al actualizar el estado:', error);
            return res.status(500).json({ error: 'Error al actualizar el estado de la venta' });
         }
         if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
         }
         res.status(200).json({ message: 'Estado actualizado correctamente' });
      });
   } catch (error) {
      console.error('Error interno:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
   }
};