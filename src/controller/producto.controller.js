//importamos la bae de datos
import db from '../config/database.js';
//funciones para crear un procuto, eliminarlo, actualizarlo y obtenerlo

export const postProducto = async (req, res) => {

    //obtener los datos del body
    const { nombre_producto, precio_costo, descripcion, precio_venta, nombre_categoria, cantidad_producto } = req.body;


    //validamos que los datos no esten vacios
    if (!nombre_producto || !precio_costo || !descripcion || !precio_venta || !nombre_categoria || !cantidad_producto) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        //verificamos que exista la categoria del producto
        const queryCategoria = 'SELECT idCat_productos, nombre_categoria FROM cat_productos WHERE nombre_categoria = ?';

        //ejecutamos la consulta para verificar la categoria
        db.query(queryCategoria, [nombre_categoria], (errorCategoria, resultsCategoria) => {
            if (errorCategoria) {
                console.error('Error al verificar la categoría:', errorCategoria);
                return res.status(500).json({ message: 'Error al verificar la categoría' });

            }

            //si no existe la categoria devolvemos un error
            if (resultsCategoria.length === 0) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }

            //obtener el id de la categoria encontrada
            const Cat_productos_idCat_productos = resultsCategoria[0].idCat_productos;

            //insertamos el producto en la base de datos
            const queryInsert = 'INSERT INTO productos (nombre_producto, precio_costo, descripcion, precio_venta, Cat_productos_idCat_productos, cantidad_producto) VALUES (?, ?, ?, ?, ?, ?)';

            //ejecutamos la consulta para insertar el producto
            db.query(queryInsert, [nombre_producto, precio_costo, descripcion, precio_venta, Cat_productos_idCat_productos, cantidad_producto], (errorInsert, resultsInsert) => {
                if (errorInsert) {
                    console.error('Error al insertar el producto:', errorInsert);
                    return res.status(500).json({ message: 'Error al insertar el producto' });
                }

                //si la insercion fue exitosa devolvemos el producto insertado
                res.status(201).json({
                    message: 'Producto creado exitosamente',
                });
            }
            );


        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }


}

export const obtenerTodosLosProductos = async (req, res) => {
    try {
        //obtener todos los productos y traer el nombre de la categoria
        const query = 'SELECT p.idProductos, p.nombre_producto, p.precio_costo, p.descripcion, p.precio_venta, c.nombre_categoria, p.cantidad_producto FROM productos p JOIN cat_productos c ON p.Cat_productos_idCat_productos = c.idCat_productos';
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error al obtener los productos:', error);
                return res.status(500).json({ message: 'Error al obtener los productos' });
            }
            //todos los codigos 200 son exitosos
            res.status(200).json({ message: 'Productos obtenidos exitosamente', productos: results });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProductosPorID = async (req, res) => {
    //obtenemos el id del producto que queres mostrar
    const { id } = req.params;

    try {

        //verificamos que el id sea un numero
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número' });
        }

        //creamos la query para obtener el producto por id

        const obtenerProductoPorID = 'SELECT p.idProductos, p.nombre_producto, p.precio_costo, p.descripcion, p.precio_venta, c.nombre_categoria, p.cantidad_producto FROM productos p JOIN cat_productos c ON p.Cat_productos_idCat_productos = c.idCat_productos WHERE p.idProductos = ?';
        //ejecutamos la consulta
        db.query(obtenerProductoPorID, [id], (error, results) => {
            if (error) {
                console.error('Error al obtener el producto por ID:', error);
                return res.status(500).json({ message: 'Error al obtener el producto' });
            }
            //verificamos si el producto existe
            if (results.length === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            //si el producto existe devolvemos el producto
            res.status(200).json({ message: 'Producto obtenido exitosamente', producto: results[0] });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const obtenerProductosPorCategoria = async (req, res) => {
    //obtenemos el nombre de la categoria que queres mostrar
    const { nombre_categoria } = req.params;

    //verificamos que el nombre de la categoria no este vacio
    if (!nombre_categoria) {
        return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
    }

    try {
        //verificamos que la categoria exista en la base de datos
        const verificarCategoria = 'SELECT idCat_productos FROM cat_productos WHERE nombre_categoria = ?';

        db.query(verificarCategoria, [nombre_categoria], (error, results) => {
            if (error) {
                console.error('Error al verificar la categoría:', error);
                return res.status(500).json({ message: 'Error al verificar la categoría' });
            }

            //verificamos si la categoria existe
            if (results.length === 0) {
                return res.status(404).json({ message: 'Categoría no encontrada' });
            }

            //creamos la query para obtener los productos por categoria
            const productosPorCategoria = `SELECT p.idProductos, p.nombre_producto, p.precio_costo, p.descripcion, p.precio_venta, c.nombre_categoria, p.cantidad_producto
            FROM productos p
            JOIN cat_productos c ON p.Cat_productos_idCat_productos = c.idCat_productos
            WHERE c.nombre_categoria = ?`;

            //ejecutamos la consulta para obtener productos
            db.query(productosPorCategoria, [nombre_categoria], (errorProductos, resultsProductos) => {
                if (errorProductos) {
                    console.error('Error al obtener productos por categoría:', errorProductos);
                    return res.status(500).json({
                        message: 'Error al obtener los productos por categoria',
                        error: errorProductos.message
                    });
                }

                //verificamos si existen productos en la categoria
                if (resultsProductos.length === 0) {
                    return res.status(404).json({ message: 'No se encontraron productos en esta categoría' });
                }

                //si existen productos en la categoria devolvemos los productos
                res.status(200).json({ 
                    message: 'Productos obtenidos exitosamente', 
                    productos: resultsProductos 
                });
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const actualizarProducto = async (req,res)=>{
    //primero traemos el id del producto que quremos actualizar
    const { id} = req.params;
    //obtenemos los datos a actualizar del body
    const { nombre_producto, precio_costo, descripcion, precio_venta, nombre_categoria, cantidad_producto } = req.body;
    try {
        //generamos la query para verificar que exista el producto

        const verificamosProducto = 'select idProductos from productos where idProductos = ?';

        //ejecutamos la consulta para verificar el producto

        db.query(verificamosProducto, [id], (errorVerificacion, resultsVerificacion) => {
            //verificamossi hubo un error
            if(errorVerificacion){
                console.error('Error al verificar el producto:', errorVerificacion);
                return res.status(500).json({ message: 'Error al verificar el producto' });
            }
            // verificamos si el producto existe
            if (resultsVerificacion.length === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            //si todo esta  bien, procedemos a actualizar el producto
            const queryActualizarProducto = 'update productos set nombre_producto = ?, precio_costo = ?, descripcion = ?, precio_venta = ?, cantidad_producto = ? where idProductos = ?';

            //ejecutamos la consulta para actualizar el producto
            db.query(queryActualizarProducto, [nombre_producto, precio_costo, descripcion, precio_venta, cantidad_producto, id], (errorActualizar, resultsActualizar) => {
                if (errorActualizar) {
                    console.error('Error al actualizar el producto:', errorActualizar);
                    return res.status(500).json({ message: 'Error al actualizar el producto' });
                }
                //si la actualizacion fue exitosa devolvemos el producto actualizado
                res.status(200).json({ message: 'Producto actualizado exitosamente' });
            });
    })
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

export const eliminarProducto = async(req,res)=>{
    //obtenemos el id del producto que queremos eliminar
    const { id } = req.params;

    try {
        //verificamos que el id sea un numero
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número' });
        }

        //creamos la query para verificar que exista el producto
        const verificarProducto = 'SELECT idProductos FROM productos WHERE idProductos = ?';

        //ejecutamos la consulta para verificar el producto
        db.query(verificarProducto, [id], (errorVerificacion, resultsVerificacion) => {
            if (errorVerificacion) {
                console.error('Error al verificar el producto:', errorVerificacion);
                return res.status(500).json({ message: 'Error al verificar el producto' });
            }

            //verificamos si el producto existe
            if (resultsVerificacion.length === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            //si el producto existe, procedemos a eliminarlo
            const queryEliminarProducto = 'DELETE FROM productos WHERE idProductos = ?';

            //ejecutamos la consulta para eliminar el producto
            db.query(queryEliminarProducto, [id], (errorEliminar, resultsEliminar) => {
                if (errorEliminar) {
                    console.error('Error al eliminar el producto:', errorEliminar);
                    return res.status(500).json({ message: 'Error al eliminar el producto' });
                }

                //si la eliminacion fue exitosa devolvemos un mensaje de exito
                res.status(200).json({ message: 'Producto eliminado exitosamente' });
            });
        });

    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

