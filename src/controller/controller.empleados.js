import db from "../config/database.js";

export const crearEmpleado = async (req, res) => {
  try {
    // obtener los datos del body
    const nombreEmpleado = req.body.nombreEmpleado;
    const apellidoEmpleado = req.body.apellidoEmpleado;
    const DNI = req.body.DNI;
    const telefonoEmpleado = req.body.telefonoEmpleado;
    const emailEmpleado = req.body.emailEmpleado;
    const domicilioEmpleado = req.body.domicilioEmpleado;
    const estadoEmpleado = req.body.estadoEmpleado;
    const idCat_empleados = 1;

    // Validación de campos vacíos o solo espacios
    if (
      !nombreEmpleado || nombreEmpleado.trim() === "" ||
      !apellidoEmpleado || apellidoEmpleado.trim() === "" ||
      !DNI || DNI.toString().trim() === "" ||
      !telefonoEmpleado || telefonoEmpleado.toString().trim() === "" ||
      !emailEmpleado || emailEmpleado.trim() === "" ||
      !domicilioEmpleado || domicilioEmpleado.trim() === "" ||
      !estadoEmpleado || estadoEmpleado.trim() === ""
    ) {
      return res.status(400).json({ message: "No se permiten campos vacíos" });
    }

    const query = `
      INSERT INTO empleados 
        (nombreEmpleado, apellidoEmpleado, DNI, telefonoEmpleado, emailEmpleado, domicilioEmpleado, estadoEmpleado, idCat_empleados) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        nombreEmpleado,
        apellidoEmpleado,
        DNI,
        telefonoEmpleado,
        emailEmpleado,
        domicilioEmpleado,
        estadoEmpleado,
        idCat_empleados,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al insertar el empleado:", error);
          return res
            .status(500)
            .json({ message: "Error al insertar el empleado" });
        }

        res.status(201).json({
          message: "Empleado creado exitosamente",
          idInsertado: results.insertId,
        });
      }
    );
  } catch (error) {
    console.error("Error en la creación del empleado:", error);
    res.status(500).json({ message: "Error en la creación del empleado" });
  }
};

export const obtenerTodosLosEmpleados = async (req, res) => {
  try {
    const query = `
   SELECT 
  e.idEmpleados,
  e.nombreEmpleado,
  e.apellidoEmpleado,
  e.DNI,
  e.telefonoEmpleado,
  e.emailEmpleado,
  e.domicilioEmpleado,
  e.estadoEmpleado,
  c.nombreCategoriaEmpleado,
  c.rol AS categoriaRol
FROM Empleados e
INNER JOIN Cat_empleados c 
  ON e.idCat_empleados = c.idCat_empleados;

    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener los empleados:", error);
        return res
          .status(500)
          .json({ message: "Error al obtener los empleados" });
      }
      res.status(200).json({
        message: "Empleados obtenidos exitosamente",
        empleados: results,
      });
    });
  } catch (error) {
    console.error("Error en la obtención de empleados:", error);
    res.status(500).json({ message: "Error en la obtención de empleados" });
  }
};

export const actualizarEmpleado = async (req, res) => {
  try {
    const { idEmpleados } = req.params;
    const {
      nombreEmpleado,
      apellidoEmpleado,
      DNI,
      telefonoEmpleado,
      emailEmpleado,
      domicilioEmpleado,
      estadoEmpleado,
      idCat_empleados,
    } = req.body;

    if (
      !nombreEmpleado ||
      !apellidoEmpleado ||
      !DNI ||
      !telefonoEmpleado ||
      !emailEmpleado ||
      !domicilioEmpleado ||
      !estadoEmpleado ||
      !idCat_empleados
    ) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const query = `
      UPDATE empleados
      SET nombreEmpleado = ?, apellidoEmpleado = ?, DNI = ?, telefonoEmpleado = ?, emailEmpleado= ?, domicilioEmpleado = ?, estadoEmpleado = ?, idCat_empleados = ?
      WHERE idEmpleados = ?
    `;

    db.query(
      query,
      [
        nombreEmpleado,
        apellidoEmpleado,
        DNI,
        telefonoEmpleado,
        emailEmpleado,
        domicilioEmpleado,
        estadoEmpleado,
        idCat_empleados,
        idEmpleados,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al actualizar el empleado:", error);
          return res
            .status(500)
            .json({ message: "Error al actualizar el empleado" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Empleado no encontrado" });
        }
        res.status(200).json({
          message: "Empleado actualizado exitosamente",
          empleado: {
            idEmpleados,
            nombreEmpleado,
            apellidoEmpleado,
            DNI,
            telefonoEmpleado,
            emailEmpleado,
            domicilioEmpleado,
            estadoEmpleado,
            idCat_empleados,
          },
        });
      }
    );
  } catch (error) {
    console.error("Error en la actualización del empleado:", error);
    res.status(500).json({ message: "Error en la actualización del empleado" });
  }
};

export const eliminarEmpleado = async (req, res) => {
  const { idEmpleados } = req.params;

  const query = "DELETE FROM empleados WHERE idEmpleados = ?";

  db.query(query, [idEmpleados], (error, results) => {
    if (error) {
      console.error("Error al eliminar el empleado:", error);
      return res.status(500).json({ message: "Error al eliminar el empleado" });
    }

    if (results.affectedRows === 0) {
      
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    return res.status(200).json({
      message: "Empleado eliminado exitosamente",
      idEliminado: idEmpleados,
    });
  });
};

export const obtenerEmpleadoPorId = async (req, res) => {
  const { idEmpleados } = req.params;

  const query = `
    SELECT 
      e.idEmpleados,
      e.nombreEmpleado,
      e.apellidoEmpleado,
      e.DNI,
      e.telefonoEmpleado,
      e.emailEmpleado,
      e.domicilioEmpleado,
      e.estadoEmpleado,
      c.nombreCategoriaEmpleado,
      c.rol AS categoriaRol
    FROM Empleados e
    INNER JOIN Cat_empleados c 
      ON e.idCat_empleados = c.idCat_empleados
    WHERE e.idEmpleados = ?
  `;

  db.query(query, [idEmpleados], (error, results) => {
    if (error) {
      console.error("Error al obtener el empleado:", error);
      return res.status(500).json({ message: "Error al obtener el empleado" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.status(200).json({
      message: "Empleado obtenido exitosamente",
      empleado: results[0],
    });
  });
};

export const obtenerEmpleadosPorCategoria = async (req, res) => {
  const { idCat_empleados } = req.params;

  const query = `
    SELECT 
      e.idEmpleados,
      e.nombreEmpleado,
      e.apellidoEmpleado,
      e.DNI,
      e.telefonoEmpleado,
      e.emailEmpleado,
      e.domicilioEmpleado,
      e.estadoEmpleado,
      c.nombreCategoriaEmpleado,
      c.rol AS categoriaRol
    FROM Empleados e
    INNER JOIN Cat_empleados c 
      ON e.idCat_empleados = c.idCat_empleados
    WHERE c.idCat_empleados = ?
  `;

  db.query(query, [idCat_empleados], (error, results) => {
    if (error) {
      console.error("Error al obtener los empleados por categoría:", error);
      return res.status(500).json({ message: "Error al obtener los empleados por categoría" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No se encontraron empleados para esta categoría" });
    }

    res.status(200).json({
      message: "Empleados obtenidos exitosamente",
      empleados: results,
    });
  });
}

export const obtenerEmpleadosPorDNI = async (req, res) => {
  const { DNI } = req.params;

  const query = `
    SELECT 
      e.idEmpleados,
      e.nombreEmpleado,
      e.apellidoEmpleado,
      e.DNI,
      e.telefonoEmpleado,
      e.emailEmpleado,
      e.domicilioEmpleado,
      e.estadoEmpleado,
      c.nombreCategoriaEmpleado,
      c.rol AS categoriaRol
    FROM Empleados e
    INNER JOIN Cat_empleados c 
      ON e.idCat_empleados = c.idCat_empleados
    WHERE e.DNI = ?
  `;

  db.query(query, [DNI], (error, results) => {
    if (error) {
      console.error("Error al obtener el empleado por DNI:", error);
      return res.status(500).json({ message: "Error al obtener el empleado por DNI" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.status(200).json({
      message: "Empleado obtenido exitosamente",
      empleado: results[0],
    });
  });
}
export const obtenerEmpleadosPorNombre = async (req, res) => {
  const { nombreEmpleado } = req.params;

  const query = `
    SELECT 
      e.idEmpleados,
      e.nombreEmpleado,
      e.apellidoEmpleado,
      e.DNI,
      e.telefonoEmpleado,
      e.emailEmpleado,
      e.domicilioEmpleado,
      e.estadoEmpleado,
      c.nombreCategoriaEmpleado,
      c.rol AS categoriaRol
    FROM Empleados e
    INNER JOIN Cat_empleados c 
      ON e.idCat_empleados = c.idCat_empleados
    WHERE e.nombreEmpleado LIKE ?
  `;

  db.query(query, [`%${nombreEmpleado}%`], (error, results) => {
    if (error) {
      console.error("Error al obtener el empleado por nombre:", error);
      return res.status(500).json({ message: "Error al obtener el empleado por nombre" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.status(200).json({
      message: "Empleado obtenido exitosamente",
      empleado: results[0],
    });
  });
}