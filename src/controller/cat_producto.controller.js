import db from '../config/database.js';

export const postCategoria = async (req, res) => {
  console.log('Solicitud recibida en postCategoria:', req.body); // Log para depurar
  const { nombreCategoriaProductos } = req.body;

  if (!nombreCategoriaProductos) {
    return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
  }

  try {
    const queryCategoria = 'SELECT idCat_productos, nombreCategoriaProductos FROM Cat_productos WHERE nombreCategoriaProductos = ?';
    db.query(queryCategoria, [nombreCategoriaProductos], (errorCategoria, resultsCategoria) => {
      if (errorCategoria) {
        console.error('Error al verificar la categoría:', errorCategoria.message);
        return res.status(500).json({ message: 'Error al verificar la categoría', error: errorCategoria.message });
      }

      if (resultsCategoria.length > 0) {
        return res.status(400).json({ message: 'La categoría ya existe' });
      }

      const queryInsert = 'INSERT INTO Cat_productos (nombreCategoriaProductos) VALUES (?)';
      db.query(queryInsert, [nombreCategoriaProductos], (errorInsert, resultsInsert) => {
        if (errorInsert) {
          console.error('Error al crear la categoría:', errorInsert.message);
          return res.status(500).json({ message: 'Error al crear la categoría', error: errorInsert.message });
        }

        res.status(201).json({
          message: 'Categoría creada exitosamente',
          id: resultsInsert.insertId,
          nombreCategoriaProductos
        });
      });
    });
  } catch (error) {
    console.error('Error del servidor:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const obtenerTodasLasCategorias = async (req, res) => {
  try {
    const query = 'SELECT * FROM Cat_productos';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error al obtener las categorías:', error);
        return res.status(500).json({ message: 'Error al obtener las categorías' });
      }
      res.status(200).json({ message: 'Categorías obtenidas exitosamente', categorias: results });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const obtenerCategoriaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM Cat_productos WHERE idCat_productos = ?';
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error al obtener la categoría:', error);
        return res.status(500).json({ message: 'Error al obtener la categoría' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      res.status(200).json({ message: 'Categoría obtenida exitosamente', categoria: results[0] });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombreCategoriaProductos } = req.body;

  if (!nombreCategoriaProductos) {
    return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
  }

  try {
    const queryCategoria = 'SELECT idCat_productos FROM Cat_productos WHERE idCat_productos = ?';
    db.query(queryCategoria, [id], (errorCategoria, resultsCategoria) => {
      if (errorCategoria) {
        console.error('Error al verificar la categoría:', errorCategoria);
        return res.status(500).json({ message: 'Error al verificar la categoría' });
      }

      if (resultsCategoria.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      const queryUpdate = 'UPDATE Cat_productos SET nombreCategoriaProductos = ? WHERE idCat_productos = ?';
      db.query(queryUpdate, [nombreCategoriaProductos, id], (errorUpdate, resultsUpdate) => {
        if (errorUpdate) {
          console.error('Error al actualizar la categoría:', errorUpdate);
          return res.status(500).json({ message: 'Error al actualizar la categoría' });
        }

        res.status(200).json({
          message: 'Categoría actualizada exitosamente',
          categoria: { idCat_productos: id, nombreCategoriaProductos }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const eliminarCategoria = async (req, res) => {
  console.log('Solicitud recibida en eliminarCategoria:', req.params); // Log para depurar
  const { id } = req.params;

  try {
    // Verificar si la categoría existe
    const queryCategoria = 'SELECT idCat_productos FROM Cat_productos WHERE idCat_productos = ?';
    db.query(queryCategoria, [id], (errorCategoria, resultsCategoria) => {
      if (errorCategoria) {
        console.error('Error al verificar la categoría:', errorCategoria.message);
        return res.status(500).json({ message: 'Error al verificar la categoría', error: errorCategoria.message });
      }

      if (resultsCategoria.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      // Verificar si hay productos asociados
      const queryProductos = 'SELECT idProductos FROM productos WHERE Cat_productos_idCat_productos = ?';
      db.query(queryProductos, [id], (errorProductos, resultsProductos) => {
        if (errorProductos) {
          console.error('Error al verificar productos asociados:', errorProductos.message);
          return res.status(500).json({ message: 'Error al verificar productos asociados', error: errorProductos.message });
        }

        if (resultsProductos.length > 0) {
          return res.status(400).json({ message: 'No se puede eliminar la categoría porque tiene productos asociados' });
        }

        // Eliminar la categoría
        const queryDelete = 'DELETE FROM Cat_productos WHERE idCat_productos = ?';
        db.query(queryDelete, [id], (errorDelete, resultsDelete) => {
          if (errorDelete) {
            console.error('Error al eliminar la categoría:', errorDelete.message);
            return res.status(500).json({ message: 'Error al eliminar la categoría', error: errorDelete.message });
          }

          res.status(200).json({ message: 'Categoría eliminada exitosamente' });
        });
      });
    });
  } catch (error) {
    console.error('Error del servidor:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};