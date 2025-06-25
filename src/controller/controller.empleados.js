import db from "../config/database.js";

export const crearEmpleado = async (req, res) => {
  try {
    // obtener los datos del body

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const domicilio = req.body.domicilio;
    const estado = req.body.estado;
    const idCat_empleado = req.body.idCat_empleado;

    const query =
      "INSERT INTO empleados (nombre, apellido, email, telefono, dni, domicilio, estado, idCat_empleados) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    //llamas ala base de datos para inser el cliente

    db.query(
      query,
      [
        nombre,
        apellido,
        email,
        telefono,
        dni,
        domicilio,
        estado,
        idCat_empleado,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al insertar el empleado:", error);
          return res
            .status(500)
            .json({ message: "Error al insertar el empleado" });
        }

        const datosEmpleados = results[0];
        //si todo esta okey
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
      SELECT e.*, c.Nombre AS categoriaNombre, c.Rol AS categoriaRol
      FROM empleados e
      INNER JOIN cat_empleados c ON e.idCat_empleados = c.idCat_empleados
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener los empleados:", error);
        return res.status(500).json({ message: "Error al obtener los empleados" });
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
    const id = req.params.id;
    const {
      nombre,
      apellido,
      dni,
      telefono,
      email,
      domicilio,
      estado,
      idCat_empleados
    } = req.body;



    const query = `
      UPDATE empleados
      SET nombre = ?, apellido = ?, dni = ?, telefono = ?, email = ?, domicilio = ?, estado = ?, idCat_empleados = ?
      WHERE idEmpleados = ?
    `;

    db.query(query, [nombre, apellido, dni, telefono, email, domicilio, estado, idCat_empleados, id], (error, results) => {
      if (error) {
        console.error("Error al actualizar el empleado:", error);
        return res.status(500).json({ message: "Error al actualizar el empleado" });
      }
      res.status(200).json({
        message: "Empleado actualizado exitosamente",
        empleado: { id, nombre, apellido, dni, telefono, email, domicilio, estado, idCat_empleados }
      });
    });
  } catch (error) {
    console.error("Error en la actualización del empleado:", error);
    res.status(500).json({ message: "Error en la actualización del empleado" });
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    const id = req.params.id;

    const query = "DELETE FROM empleados WHERE idEmpleados = ?";

    db.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error al eliminar el empleado:", error);
        return res.status(500).json({ message: "Error al eliminar el empleado" });
      }
      res.status(200).json({
        message: "Empleado eliminado exitosamente",
        empleado: { id },
      });
    });
  } catch (error) {
    console.error("Error en la eliminación del empleado:", error);
    res.status(500).json({ message: "Error en la eliminación del empleado" });
  }
};
