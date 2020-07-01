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

    res.send({
      status: "ok",
      data: result[0],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeach;
