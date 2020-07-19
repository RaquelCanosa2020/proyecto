const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getUserReservations(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;
    console.log(id);
    console.log(req.auth.id);

    //comprobamos que el usuario se corresponde:

    if (Number(id) !== req.auth.id && req.auth.role !== "admin") {
      throw generateError(
        "No tienes permisos para ver las reservas de este usuario",
        403
      );
    }

    //consulta con sus reservas y sus datos, incluyendo valoración si la hubiera.

    const [result] = await connection.query(
      `
      SELECT R.id, R.date, R.visit, R.places, R.id_beach, R.total_euros, IFNULL(ratings.value, "pendiente de valorar") AS value,IFNULL(ratings.comment, "sin comentar") AS comment 
      FROM reservations R
      LEFT JOIN ratings ON R.id=ratings.id_reservation
      WHERE R.id_user = ?
      ORDER BY R.date DESC
    `,
      [id]
    );
    //si aún no hubiera reservas de ese usuario

    if (result.length === 0) {
      throw generateError(
        `Aún no constan reservas a tu nombre en la base de datos`,
        404
      );
    }

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

module.exports = getUserReservations;
