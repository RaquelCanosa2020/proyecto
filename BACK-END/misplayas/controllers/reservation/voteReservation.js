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
    const { value, comment } = req.body;
    const id_user = req.auth.id;
    const id_role = req.auth.role;
    const userVote = parseInt(value);

    console.log(id_user);

    //comprobar que la reserva existe: en reservationExists.js

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
      throw generateError("No tienes permisos para votar esta reserva", 403);
    }
    // Comprobar que existe el registro de voto y no hubo ningún error al generarlo
    //hubo que crearlo con la reserva pq si no da fallo las FK

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
        throw generateError(
          `Ha habido un error al generar el registro de voto de la reserva ${id}`,
          403
        );
      }
    }
    console.log(existingRow[0].visit);

    //comprobar que ha pasado ya la fecha de visit

    const visitDate = new Date(existingRow[0].visit);

    if (visitDate > new Date()) {
      {
        throw generateError(
          "No se puede votar una reserva antes de la fecha de visita",
          403
        );
      }
    }

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
      throw generateError(
        `Ya votaste la reserva ${id} con tu usuario`,
        403
      );
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
