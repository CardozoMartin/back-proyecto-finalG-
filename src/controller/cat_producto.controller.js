import db from '../config/database.js';
export const postCategoria = async (req, res) => {
  const { nombreCategoriaProductos } = req.body;

  if (!nombreCategoriaProductos) {
    return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
  }

  try {
    const queryCategoria = 'SELECT idCat_productos, nombreCategoriaProductos FROM Cat_productos WHERE nombreCategoriaProductos = ?';
    db.query(queryCategoria, [nombreCategoriaProductos], (errorCategoria, resultsCategoria) => {
      if (errorCategoria) {
        console.error('Error al verificar la categoría:', errorCategoria.message, errorCategoria.sql);
        return res.status(500).json({ message: 'Error al verificar la categoría', error: errorCategoria.message });
      }
      // ...
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
  const { id } = req.params;

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

      const queryProductos = 'SELECT idProductos FROM productos WHERE Cat_productos_idCat_productos = ?';
      db.query(queryProductos, [id], (errorProductos, resultsProductos) => {
        if (errorProductos) {
          console.error('Error al verificar productos asociados:', errorProductos);
          return res.status(500).json({ message: 'Error al verificar productos asociados' });
        }

        if (resultsProductos.length > 0) {
          return res.status(400).json({ message: 'No se puede eliminar la categoría porque tiene productos asociados' });
        }

        const queryDelete = 'DELETE FROM Cat_productos WHERE idCat_productos = ?';
        db.query(queryDelete, [id], (errorDelete, resultsDelete) => {
          if (errorDelete) {
            console.error('Error al eliminar la categoría:', errorDelete);
            return res.status(500).json({ message: 'Error al eliminar la categoría' });
          }

          res.status(200).json({ message: 'Categoría eliminada exitosamente' });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};