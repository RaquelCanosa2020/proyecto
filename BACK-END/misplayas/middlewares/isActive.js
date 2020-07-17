const { getConnection } = require("../db");

async function isActive(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    console.log("comprobando que la playa está activa");

    // Comprobar que la entrada que queremos editar exista en la base de datos
    const [beach] = await connection.query(
      `
    SELECT id, active
    FROM beaches
    WHERE id=?
  `,
      [req.body.id_beach]
    );

    if (beach[0].active === 0 || beach[0].active === 0) {
      const error = new Error(
        `La playa con id ${req.body.id_beach} no existe o no está activa para reservas en estos momentos`
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

module.exports = isActive;
