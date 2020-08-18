const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getBeachVotes(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    // Ejecutar query para sacar lista de votos
    const [votes] = await connection.query(
      `
      SELECT ratings.value, ratings.date, IFNULL(comment,"     ") AS comment, IFNULL(users.name,"ANÓNIMO") AS name, users.id
      FROM ratings, reservations, users
      WHERE reservations.id_beach=? AND reservations.id = ratings.id_reservation AND ratings.value IS NOT NULL
      AND reservations.id_user = users.id
      ORDER BY ratings.id DESC
    `,
      [id]
    );

    if (votes.length === 0) {
      throw generateError("Todavía no hay valoraciones de esta playa ", 401);
    }
    // Ejecutar query para dar valoración media y número de votos:
    const [rating] = await connection.query(
      `
      SELECT ROUND(AVG(ratings.value),1) AS voteAverage, COUNT(ratings.id) AS voteNumber FROM ratings, reservations
WHERE ratings.id_reservation = reservations.id AND ratings.value IS NOT NULL
AND reservations.id_beach = ?
    `,
      [id]
    );

    res.send({
      status: "ok",
      rating: `Valoración media de ${rating[0].voteAverage}, de ${rating[0].voteNumber} votos.`,
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
