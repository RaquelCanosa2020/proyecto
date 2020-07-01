const { getConnection } = require("../../db");

//pte hablar Pablo, ¿podría cambiar BD y votar sólo playa y no reserva?

async function voteReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;
    const { vote, comment } = req.body; //añado user temporal antes de incluir control autoriz.

    const userVote = parseInt(vote);

    // Comprobar que el voto es correcto
    if (userVote > 5 || userVote < 1) {
      const error = new Error("Voto incorrecto debe ser entre 1 y 5");
      error.httpStatus = 400;
      throw error;
    }
    //comprobar que el usuario es el que hizo la reserva (PTE)
    // Comprobar que la reserva existe y si no dar un 404
    /*const [reservation] = await connection.query(
      `
      SELECT id
      FROM reservations
      WHERE id=?
    `,
      [id]
    );
    console.log();*/

    // Comprobar que no se ha votado ya
    const [existingVote] = await connection.query(
      `
      SELECT reservations.id
      FROM reservations, ratings
      WHERE ratings.id_reservation = reservations.id
      AND reservations.id = ?`,
      [id] //user en vez de req.auth.id antes de control de aut.
    );

    if (existingVote.length > 0) {
      const error = new Error(`Ya votaste la reserva "${id}" con tu usuario`);
      error.httpStatus = 403;
      throw error;
    }

    //Guardar el voto en la base de datos
    await connection.query(
      `
      INSERT INTO ratings(value, date, comment, id_reservation, lastUpdate)
      VALUES(?, NOW(), ?, id, NOW())
    `,
      [userVote, comment]
    );

    res.send({
      status: "ok",
      message: `Se guardó el voto (${userVote} puntos) a la reserva ${id}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = voteReservation;
