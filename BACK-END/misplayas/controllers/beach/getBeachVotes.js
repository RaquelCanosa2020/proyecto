const { getConnection } = require("../../db");

async function getBeachVotes(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    // Ejecutar query para sacar lista de votos
    const [votes] = await connection.query(
      `
      SELECT ratings.value, ratings.date, comment, users.name
      FROM ratings, reservations, users
      WHERE reservations.id_beach=? AND reservations.id = ratings.id_reservation
      AND reservations.id_user = users.id
    `,
      [id]
    );

    res.send({
      status: "ok",
      data: votes,
    });

    // devolver la lista en la respuesta
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeachVotes;
