const { getConnection } = require("../../db");

async function getBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT beaches.*, AVG(ratings.value) AS voteAverage
      FROM beaches
      LEFT JOIN reservations ON beaches.id = reservations.id_beach
      LEFT JOIN ratings ON reservations.id = ratings.id_reservation
      WHERE beaches.id=?
    `,
      [id]
    );

    const [ocupation] = await connection.query(
      `
        SELECT SUM(places) AS ocupation
        FROM reservations
        WHERE id_beach = ? AND reservations.visit = "2020-07-16 22:10:00" AND reservations.cc_number <> 'null'
      `,
      [id]
    );
    const free = Number(result[0].capacity) - Number(ocupation[0].ocupation);

    //funciona pero tengo que hacerlo sólo con horas en punto.

    res.send({
      status: "ok",
      data: {
        información: result[0],
        "plazas disponibles": free,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeach;
