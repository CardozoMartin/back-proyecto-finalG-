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

    // PASO 1: Extraemos los datos que llegan del frontend
    // idEmpleados: ID del empleado que está haciendo la venta
    // idClientes: ID del cliente que está comprando
    // productos: Array con los productos a vender (cada uno tiene idProducto, cantidad, precioUnitario)
    const { idEmpleados, idClientes, productos } = req.body;
    console.log("ID Empleado:", idEmpleados);
    console.log("ID Cliente:", idClientes);
    console.log("Productos:", productos);

    try {
        // PASO 2: Verificamos que el empleado exista en la base de datos
        // Esto es importante para mantener la integridad de los datos
        const verificarEmpleado = 'SELECT * FROM empleados WHERE idEmpleados = ?';
        db.query(verificarEmpleado, [idEmpleados], (errorEmpleado, resulEmpleado) => {
            // Si hay error en la consulta SQL
            if (errorEmpleado) {
                return res.status(500).json({ error: 'Error al verificar el empleado' });
            }
            // Si no encontramos ningún empleado con ese ID
            if (resulEmpleado.length === 0) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
            console.log("Empleado verificado:", resulEmpleado[0]);
            
            // PASO 3: Solo si el empleado existe, verificamos que el cliente también exista
            // Usamos callbacks anidados (patrón común en Node.js con MySQL)
            const verificarCliente = 'SELECT * FROM clientes WHERE idClientes = ?';
            db.query(verificarCliente, [idClientes], (errorCliente, resulCliente) => {
                // Si hay error al buscar el cliente
                if (errorCliente) {
                    return res.status(500).json({ error: 'Error al verificar el cliente' });
                }
                // Si no encontramos el cliente
                if (resulCliente.length === 0) {
                    return res.status(404).json({ error: 'Cliente no encontrado' });
                }
                console.log("Cliente verificado:", resulCliente[0]);
                console.log("Productos a insertar:", productos);
                
                // PASO 4: INICIAMOS UNA TRANSACCIÓN
                // ¿Por qué? Porque vamos a hacer 3 operaciones que TODAS deben ser exitosas:
                // 1. Insertar la venta
                // 2. Insertar los productos de la venta
                // 3. Actualizar el total de la venta
                // Si una falla, queremos deshacer todo para mantener consistencia
                db.beginTransaction(err => {
                    if (err) {
                        return res.status(500).json({ error: 'Error al iniciar la transacción' });
                    }
                    
                    // PASO 5: Insertamos el registro principal de la venta
                    // Empezamos con totalVenta = 0 porque lo calcularemos después
                    // fechaVenta = NOW() para usar la fecha/hora actual
                    // estadoVentas = 'Completada' porque asumimos que la venta se completa inmediatamente
                    const insertarVenta = `INSERT INTO Ventas (fechaVenta, totalVenta, estadoVentas, Empleados_idEmpleados, Clientes_idClientes) VALUES (NOW(), 0, 'Completada', ?, ?)`;
                    db.query(insertarVenta, [idEmpleados, idClientes], (errorVenta, resultadoVenta) => {
                        if (errorVenta) {
                            // Si falla, hacemos ROLLBACK para deshacer todo lo que se hizo en la transacción
                            return db.rollback(() => {
                                res.status(500).json({ error: 'Error al insertar la venta' });
                            });
                        }
                        
                        // PASO 6: Obtenemos el ID de la venta que se acaba de crear
                        // Este ID lo necesitamos para relacionar los productos con esta venta
                        const idVenta = resultadoVenta.insertId;
                        
                        // PASO 7: Preparamos los datos para insertar en la tabla intermedia
                        // La tabla Ventas_has_Productos es una tabla de muchos a muchos que conecta:
                        // - Una venta puede tener muchos productos
                        // - Un producto puede estar en muchas ventas
                        // Por eso necesitamos esta tabla intermedia
                        const insertarDetalle = `INSERT INTO Ventas_has_Productos (Ventas_idVentas, Ventas_Empleados_idEmpleados, Ventas_Clientes_idClientes, Productos_idProductos, cantidad, precioUnitario) VALUES ?`;
                        
                        // Transformamos el array de productos en el formato que necesita la consulta SQL
                        // Cada elemento del array será: [idVenta, idEmpleado, idCliente, idProducto, cantidad, precio]
                        const detalles = productos.map(p => [idVenta, idEmpleados, idClientes, p.idProducto, p.cantidad, p.precioUnitario]);
                        
                        // PASO 8: Insertamos todos los productos de la venta de una vez
                        // Usamos VALUES ? para insertar múltiples filas en una sola consulta (más eficiente)
                        db.query(insertarDetalle, [detalles], (errorDetalle) => {
                            if (errorDetalle) {
                                // Si falla la inserción de productos, deshacemos todo
                                return db.rollback(() => {
                                    res.status(500).json({ error: 'Error al insertar los productos de la venta' });
                                });
                            }
                            
                            // PASO 9: Calculamos el total de la venta
                            // Sumamos (cantidad × precioUnitario) de cada producto
                            // reduce() itera sobre todos los productos y va acumulando la suma
                            const totalVenta = productos.reduce((acc, p) => acc + (p.cantidad * p.precioUnitario), 0);
                            
                            // PASO 10: Actualizamos el registro de la venta con el total calculado
                            // Anteriormente pusimos totalVenta = 0, ahora lo actualizamos con el valor real
                            const actualizarTotal = 'UPDATE Ventas SET totalVenta = ? WHERE idVentas = ?';
                            db.query(actualizarTotal, [totalVenta, idVenta], (errorUpdate) => {
                                if (errorUpdate) {
                                    // Si falla la actualización del total, deshacemos todo
                                    return db.rollback(() => {
                                        res.status(500).json({ error: 'Error al actualizar el total de la venta' });
                                    });
                                }
                                
                                // PASO 11: COMMIT - Confirmamos la transacción
                                // Solo llegamos aquí si TODAS las operaciones fueron exitosas:
                                // ✅ Venta insertada
                                // ✅ Productos insertados en tabla intermedia
                                // ✅ Total de venta actualizado
                                // COMMIT hace que todos estos cambios sean permanentes
                                db.commit(errCommit => {
                                    if (errCommit) {
                                        // Si por alguna razón falla el commit, deshacemos todo
                                        return db.rollback(() => {
                                            res.status(500).json({ error: 'Error al confirmar la venta' });
                                        });
                                    }
                                    
                                    // PASO 12: ¡Éxito! Devolvemos respuesta positiva al frontend
                                    // En este punto la venta ya está guardada completamente en la base de datos
                                    res.status(201).json({ mensaje: 'Venta creada exitosamente', idVenta, totalVenta });
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        // Capturamos cualquier error inesperado que no hayamos manejado específicamente
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const obtenerVentas = async (req, res) => {
    try {
        const query = `SELECT 
    v.idVentas,
    v.fechaVenta,
    v.totalVenta,
    v.estadoVentas,
    c.idClientes,
    c.nombreCliente,
    c.domicilioCliente,
    c.telefonoCliente,
    c.emailCliente,
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