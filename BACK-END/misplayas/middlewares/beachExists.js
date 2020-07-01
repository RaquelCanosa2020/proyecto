//Para ahorrar código, hacemos este middl para comprobar que un determinado registro existe
//haremos referencia en las app que lo necesiten en server.js.

const { getConnection } = require("../db");

async function beachExists(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { id } = req.params;

    console.log("comprobando que en la tabla de playas hay una entrada id", id);

    // Comprobar que la entrada que queremos editar exista en la base de datos
    const [current] = await connection.query(
      `
    SELECT id
    FROM beaches
    WHERE id=?
  `,
      [id]
    );

    if (current.length === 0) {
      const error = new Error(
        `La playa con id ${id} no existe en la base de datos`
      );
      error.httpStatus = 404;
      throw error;
    } else {
      next();
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = beachExists;
