const { getConnection } = require("../../db");

async function voteReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;
    const { vote, comment } = req.body; //añado user temporal antes de incluir control autoriz.

    const userVote = parseInt(vote);

    console.log("comprobando value");

    // Comprobar que el voto es correcto
    if (userVote > 5 || userVote < 1) {
      const error = new Error("Voto incorrecto debe ser entre 1 y 5");
      error.httpStatus = 400;
      throw error;
    }
    //comprobar que el usuario es el que hizo la reserva (PTE)
    // Comprobar que existe el registro de voto (pq la reserva está pagada)

    const [existingRow] = await connection.query(
      `
      SELECT ratings.value
      FROM reservations, ratings
      WHERE ratings.id_reservation = reservations.id
      AND ratings.id_reservation = ?`,
      [id] //user en vez de req.auth.id antes de control de aut.
    );

    if (existingRow.length === 0) {
      const error = new Error(`La reserva ${id} aún no está confirmada`);
      error.httpStatus = 403;
      throw error;
    }

    //comprobar que ha pasado ya la fecha de visit
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
      SELECT ratings.value
      FROM ratings
      WHERE ratings.value <> 'null' AND ratings.id_reservation = ?`,
      [id] //user en vez de req.auth.id antes de control de aut.
    );
    console.log(existingVote);
    if (existingVote.length !== 0) {
      const error = new Error(`Ya votaste la reserva ${id} con tu usuario`);
      error.httpStatus = 403;
      throw error;
    }

    console.log("puedes votar");

    //Guardar el voto en los ratings
    await connection.query(
      `
      UPDATE ratings
      SET value = ?, comment = ?, lastUpdate = UTC_TIMESTAMP
      WHERE id_reservation = ?
    `,
      [Number(userVote), comment, id]
    );

    res.send({
      status: "ok",
      message: `Se guardó el voto (${userVote} puntos) a la reserva ${id}`,
    });

    console.log("voto guardado");
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = voteReservation;
