const { getConnection } = require("../../db");
const { addDays } = require("date-fns");
const {
  formatDateToDB,
  formatDateToUser,
  setZero,
  generateError,
} = require("../../helpers");

const {
  newReservationSchema,
} = require("../../validators/reservationValidators");

//Se podrán modificar las reservas antes de ser pagadas.

async function editReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await newReservationSchema.validateAsync(req.body);
    const { id } = req.params;
    const id_user = req.auth.id;
    const id_role = req.auth.role;

    const { visit, places, id_beach } = req.body;

    //⏩ comprobar que el usuario es el autor o el admin:
    const [current] = await connection.query(
      `
    SELECT id, user_id, cc_number
    FROM reservations
    WHERE id=?
  `,
      [id]
    );

    const [currentReserv] = current;

    if (currentReserv.user_id !== id_user && id_role !== "admin") {
      throw generateError("No tienes permisos para editar esta entrada", 403);
    }

    //⏩ comprobar que la reserva aún no está pagada (en ese caso tendría que anularla):

    if (currentReserv.cc_number !== null) {
      throw generateError(
        "No se pueden modificar las reservas ya confirmadas. Si lo deseas, puedes anularla",
        403
      );
    }

    //⏩ comprobar que no falta info en el body:

    if (!visit || !places || !id_beach) {
      {
        throw generateError(
          `Faltan datos en la pformatDateToUseretición. Debes cubrir
        visit: fecha y hora de la visita,
        places: nº de sitios a reservar,
        id_beach: número de playa`,
          400
        );
      }
    }

    const visitUtc = new Date(visit);
    const visitHour = visitUtc.getHours();
    console.log(visitUtc);
    console.log(visitHour);

    if (visitUtc <= new Date() || visitUtc > addDays(new Date(), 5)) {
      {
        throw generateError("La fecha no es válida", 403);
      }
    }

    //comprobamos fecha no pasada (en validación), que no hay otra reserva ese mismo día/fecha

    const [existingReservation] = await connection.query(
      `SELECT id
      FROM reservations
      WHERE id_user = ? AND visit = ?`,
      [id_user, formatDateToDB(visit)]
    );

    if (existingReservation.length !== 0) {
      {
        throw generateError(
          `Ya has realizado una reserva (número ${existingReservation[0].id}) para esa fecha y hora`,
          403
        );
      }
    }

    //⏩comprobar que la hora está incluida en el horario de la playa:
    //necesito la info de horarios de la playa ():

    const [schedule] = await connection.query(
      `
          SELECT start_time, end_time
          FROM beaches
          WHERE id=?
          `,
      [id_beach]
    );

    //proceso la hora de inicio y fin de la playa (están en horario local):

    const start = schedule[0].start_time;
    const startHour = Number(start.split(":")[0]);

    const end = schedule[0].end_time;
    const endHour = Number(end.split(":")[0]);

    //comparo visit con el horario (en local ambos):

    if (Number(visitHour) < startHour || Number(visitHour) >= endHour) {
      throw generateError(
        `Ya has realizado una reserva (número ${existingReservation[0].id}) para esa fecha y hora`,
        404
      );
    }
    //console.log("procesando");

    //⏩comprobar que hay plazas disponibles esa hora:

    const placesNumber = Number(places); //ya que places es un string
    //console.log(places);

    //aforo de la playa:
    const [result1] = await connection.query(
      `
          SELECT capacity, name
          FROM beaches
          WHERE id=?
          `,
      [id_beach]
    );

    const capacity = Number(result1[0].capacity);
    const beachName = result1[0].name;
    //console.log(result1[0].capacity); //20

    //ocupación en la hora indicada
    console.log("comprobando ocupacion");

    const [result] = await connection.query(
      `
        SELECT SUM(places) AS ocupation
        FROM reservations
        WHERE id_beach = ? AND visit = ? AND cc_number IS NOT NULL
      `,
      [id_beach, formatDateToDB(visit)]
    );
    const ocupation = Number(result[0].ocupation);
    console.log(ocupation + places); //8Es

    //comparar ambas

    //si aún no hay reservas en la playa nos da null, lo cambiamos a 0 (helpers)

    if (ocupation === null) {
      setZero(ocupation);
    }

    console.log(ocupation);

    //comprobamos que haya sitio libre

    if (ocupation + placesNumber > capacity) {
      throw generateError(
        `No hay suficientes plazas en la playa y horario indicado`,
        404
      );
    }
    //console.log(ocupation, places, capacity);

    //informamos de la ocupación
    const freeCapacity = capacity - ocupation;

    console.log(
      `Hay ${freeCapacity} plazas disponibles en la playa y horario indicados`
    );

    //⏩si todo ok, grabamos los nuevos datos de la reserva

    await connection.query(
      `
      UPDATE reservations SET visit=?, places=?, id_beach=?, id_user=?, lastUpdate=UTC_TIMESTAMP
      WHERE id=?
      `,
      [formatDateToDB(visit), places, id_beach, id_user, id]
    );

    // Devolver resultados
    res.send({
      status: "ok",
      message: `Se guardó la reserva para el usuario ${id_user}, en la playa ${id_beach}: (${beachName})
      para la fecha ${formatDateToUser(
        visit
      )} para ${places} personas.Nº reserva: ${id}.
      Debes pagar una fianza de 3 euros para confirmar la reserva.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editReservation;
