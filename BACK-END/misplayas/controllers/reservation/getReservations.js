const { getConnection } = require("../../db");

async function getReservations(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT reservations.*
      FROM reservations
      WHERE reservations.id_user = ?
      ORDER BY reservations.date DESC
    `,
      [id]
    );

    /*if (result.length === 0) {
      const error = new Error(
        `Aún no constan reservas a tu nombre en la base de datos`
      );
      error.httpStatus = 404;
      throw error;
    }*/

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getReservations;
