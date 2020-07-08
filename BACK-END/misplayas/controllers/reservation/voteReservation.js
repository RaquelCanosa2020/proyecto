const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

const {
  voteReservationSchema,
} = require("../../validators/reservationValidators");

async function voteReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await voteReservationSchema.validateAsync(req.body);

    const { id } = req.params;
    const { value, comment } = req.body; //añado user temporal antes de incluir control autoriz.
    const id_user = req.auth.id;
    const id_role = req.auth.role;
    const userVote = parseInt(value);

    console.log(id_user);

    //comprobar que el usuario es el que hizo la reserva

    const [current] = await connection.query(
      `
    SELECT id, id_user, visit
    FROM reservations
    WHERE id=?
  `,
      [id]
    );
    const [currentReserv] = current;

    if (currentReserv.id_user !== id_user && id_role !== "admin") {
      throw generateError("No tienes permisos para editar esta entrada", 403);
    }
    // Comprobar que existe el registro de voto (pq la reserva está pagada)

    const [existingRow] = await connection.query(
      `
      SELECT reservations.visit, ratings.value
      FROM reservations, ratings
      WHERE ratings.id_reservation = reservations.id
      AND ratings.id_reservation = ?`,
      [id]
    );

    if (existingRow.length === 0) {
      {
        throw generateError(`La reserva ${id} aún no está confirmada`, 403);
      }
    }
    console.log(existingRow[0].visit);

    //comprobar que ha pasado ya la fecha de visit

    const visitDate = currentReserv.visit;
    console.log(visitDate);
    //pendiente tuto Berto

    // Comprobar que no se ha votado ya
    const [existingVote] = await connection.query(
      `
      SELECT ratings.value
      FROM ratings
      WHERE ratings.value IS NOT NULL AND ratings.id_reservation = ?`,
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
