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

export const obtenerTodosLosProductos = async (req,res)=>{
    try {
        const query = 'SELECT * FROM productos';
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error al obtener los productos:', error);
                return res.status(500).json({ message: 'Error al obtener los productos' });
            }
            //todos los codigos 200 son exitosos
            res.status(200).json({message: 'Productos obtenidos exitosamente', productos: results});
        });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
}

 