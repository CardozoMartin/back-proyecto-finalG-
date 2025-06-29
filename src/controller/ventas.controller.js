import db from '../config/database.js';


//funcion para crear una venta
/*
{
este es el modelo que tiene que llegar donde verificamos el empleado, cliente y productos
    "empleadoId": 1,
    "clienteId": 2,
    "productos": [
        {
            "idProducto": 1,
            "cantidad": 2,
            "precioUnitario": 25.50
        },
        {
            "idProducto": 3,
            "cantidad": 1,
            "precioUnitario": 15.75
        }
    ]
}
*/
export const crearVenta = async (req, res) => {

    //extramos los datos de los cuales vamos a verificar y crear la venta
    const { idEmpleados, idClientes, productos } = req.body;
    console.log("ID Empleado:", idEmpleados);
    console.log("ID Cliente:", idClientes);
    console.log("Productos:", productos);

    try {
        //verificamos que el empleado exista
        const verificarEmpleado = 'SELECT * FROM empleados WHERE idEmpleados = ?';
        db.query(verificarEmpleado, [idEmpleados], (errorEmpleado, resulEmpleado) => {
            if (errorEmpleado) {
                return res.status(500).json({ error: 'Error al verificar el empleado' });
            }
            if (resulEmpleado.length === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            console.log("Empleado verificado:", resulEmpleado[0]);
            //verificamos que el cliente exista
            const verificarCliente = 'SELECT * FROM clientes WHERE idClientes = ?';
            db.query(verificarCliente, [idClientes], (errorCliente, resulCliente) => {
                if (errorCliente) {
                    return res.status(500).json({ error: 'Error al verificar el cliente' });
                }
                if (resulCliente.length === 0) {
                    return res.status(404).json({ error: 'Cliente no encontrado' });
                }
                console.log("Cliente verificado:", resulCliente[0]);
                console.log("Productos a insertar:", productos);
                // Iniciamos la transacción
                db.beginTransaction(err => {
                    if (err) {
                        return res.status(500).json({ error: 'Error al iniciar la transacción' });
                    }
                    // Insertamos la venta con totalVenta en 0 y estado 'Completada'
                    const insertarVenta = `INSERT INTO Ventas (fechaVenta, totalVenta, estadoVentas, Empleados_idEmpleados, Clientes_idClientes) VALUES (NOW(), 0, 'Completada', ?, ?)`;
                    db.query(insertarVenta, [idEmpleados, idClientes], (errorVenta, resultadoVenta) => {
                        if (errorVenta) {
                            return db.rollback(() => {
                                res.status(500).json({ error: 'Error al insertar la venta' });
                            });
                        }
                        const idVenta = resultadoVenta.insertId;
                        // Insertamos los productos en Ventas_has_Productos
                        const insertarDetalle = `INSERT INTO Ventas_has_Productos (Ventas_idVentas, Ventas_Empleados_idEmpleados, Ventas_Clientes_idClientes, Productos_idProductos, cantidad, precioUnitario) VALUES ?`;
                        const detalles = productos.map(p => [idVenta, idEmpleados, idClientes, p.idProducto, p.cantidad, p.precioUnitario]);
                        db.query(insertarDetalle, [detalles], (errorDetalle) => {
                            if (errorDetalle) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: 'Error al insertar los productos de la venta' });
                                });
                            }
                            // Calculamos el total de la venta
                            const totalVenta = productos.reduce((acc, p) => acc + (p.cantidad * p.precioUnitario), 0);
                            // Actualizamos el totalVenta en la tabla Ventas
                            const actualizarTotal = 'UPDATE Ventas SET totalVenta = ? WHERE idVentas = ?';
                            db.query(actualizarTotal, [totalVenta, idVenta], (errorUpdate) => {
                                if (errorUpdate) {
                                    return db.rollback(() => {
                                        res.status(500).json({ error: 'Error al actualizar el total de la venta' });
                                    });
                                }
                                // Confirmamos la transacción
                                db.commit(errCommit => {
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
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const obtenerVentas = async (req, res) => {
    try {
        const query = `SELECT 
    v.idVentas,
    v.fechaVenta,
    v.totalVenta,
    c.idClientes,
    c.nombreCliente,
    c.apellidoCliente,
    e.idEmpleados,
    e.nombreEmpleado,
    e.apellidoEmpleado,
    p.idProductos,
    p.nombreProducto,
    p.descripcion,
    p.precioVenta,
    p.precioCosto,
    vhp.cantidad,
    vhp.precioUnitario
FROM Ventas v
INNER JOIN Clientes c ON v.Clientes_idClientes = c.idClientes
INNER JOIN Empleados e ON v.Empleados_idEmpleados = e.idEmpleados
INNER JOIN Ventas_has_Productos vhp ON v.idVentas = vhp.Ventas_idVentas
INNER JOIN Productos p ON vhp.Productos_idProductos = p.idProductos
-- SIN filtro de cliente para ver todas las ventas
ORDER BY v.fechaVenta DESC, v.idVentas DESC;`

        db.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Error al obtener las ventas' });
            }
            res.status(200).json(results);
        })
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}