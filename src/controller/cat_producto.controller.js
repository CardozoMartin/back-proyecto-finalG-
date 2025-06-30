import db from '../config/database.js';

export const postCategoria = async (req, res) => {
  console.log('Solicitud recibida en postCategoria:', req.body);
  const { nombreCategoriaProductos, imagenCategoriaProductos, estado } = req.body;

  if (!nombreCategoriaProductos) {
    return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
  }

  if (estado && !['activo', 'inactivo'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    const queryCategoria = 'SELECT idCat_productos FROM Cat_productos WHERE nombreCategoriaProductos = ?';
    db.query(queryCategoria, [nombreCategoriaProductos], (errorCategoria, resultsCategoria) => {
      if (errorCategoria) {
        console.error('Error al verificar la categoría:', errorCategoria.message);
        return res.status(500).json({ message: 'Error al verificar la categoría', error: errorCategoria.message });
      }

      if (resultsCategoria.length > 0) {
        return res.status(400).json({ message: 'La categoría ya existe' });
      }

      const queryInsert = 'INSERT INTO Cat_productos (nombreCategoriaProductos, imagenCategoriaProductos, estado) VALUES (?, ?, ?)';
      db.query(queryInsert, [nombreCategoriaProductos, imagenCategoriaProductos || null, estado || 'activo'], (errorInsert, resultsInsert) => {
        if (errorInsert) {
          console.error('Error al crear la categoría:', errorInsert.message);
          return res.status(500).json({ message: 'Error al crear la categoría', error: errorInsert.message });
        }

        res.status(201).json({
          message: 'Categoría creada exitosamente',
          id: resultsInsert.insertId,
          nombreCategoriaProductos,
          imagenCategoriaProductos: imagenCategoriaProductos || null,
          estado: estado || 'activo'
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
  const { nombreCategoriaProductos, imagenCategoriaProductos, estado } = req.body;

  if (!nombreCategoriaProductos) {
    return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
  }

  if (estado && !['activo', 'inactivo'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
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

      const queryUpdate = 'UPDATE Cat_productos SET nombreCategoriaProductos = ?, imagenCategoriaProductos = ?, estado = ? WHERE idCat_productos = ?';
      db.query(queryUpdate, [nombreCategoriaProductos, imagenCategoriaProductos || null, estado || 'activo', id], (errorUpdate, resultsUpdate) => {
        if (errorUpdate) {
          console.error('Error al actualizar la categoría:', errorUpdate);
          return res.status(500).json({ message: 'Error al actualizar la categoría' });
        }

        res.status(200).json({
          message: 'Categoría actualizada exitosamente',
          categoria: { idCat_productos: id, nombreCategoriaProductos, imagenCategoriaProductos: imagenCategoriaProductos || null, estado: estado || 'activo' }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

export const actualizarEstadoCategoria = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!['activo', 'inactivo'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
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

      const queryUpdate = 'UPDATE Cat_productos SET estado = ? WHERE idCat_productos = ?';
      db.query(queryUpdate, [estado, id], (errorUpdate, resultsUpdate) => {
        if (errorUpdate) {
          console.error('Error al actualizar el estado:', errorUpdate);
          return res.status(500).json({ message: 'Error al actualizar el estado' });
        }

        res.status(200).json({
          message: 'Estado actualizado exitosamente',
          categoria: { idCat_productos: id, estado }
        });
      });
    });
  } catch (error) {
    console.error('Error del servidor:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};