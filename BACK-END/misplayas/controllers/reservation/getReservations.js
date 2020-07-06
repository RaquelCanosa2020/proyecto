const { getConnection } = require("../../db");

async function getReservations(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT R.id, R.date, R.visit, R.places, R.id_beach, R.total_euros, ratings.value
      FROM reservations R
      LEFT JOIN ratings ON R.id=ratings.id_reservation
      WHERE R.id_user = ?
      ORDER BY R.date DESC
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
