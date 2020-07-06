const { getConnection } = require("../../db");
const {
  formatISO,
  getHours,
  getDays,
  parseISO,
  setMinutes,
  setSeconds,
} = require("date-fns");
const { formatUtc, setZero, generateError } = require("../../helpers");
const {
  newReservationSchema,
} = require("../../validators/reservationValidators");

async function newReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const id_user = req.auth.id;

    await newReservationSchema.validateAsync(req.body);

    const { visit_date, visit_hour, places, id_beach } = req.body;

    //⏩ comprobar que no falta info en el body:

    if (!visit_date || !visit_hour || !places || !id_beach) {
      //pte control que es usuario registrado
      {
        throw generateError(
          `Faltan datos en la petición. Debes cubrir
        visit: fecha y hora de la visita,
        places: nº de sitios a reservar,
        id_beach: número de playa`,
          400
        );
      }
    }

    //procesamos día y hora

    const visit = formatUtc(visit_date, visit_hour);
    const dateISO = formatISO(new Date(visit));

    if (dateISO.getDays < new Date().getDay) {
      {
        throw generateError("La fecha no es válida", 403);
      }
    }

    //comprobamos fecha no pasada (en validación), que no hay otra reserva ese mismo día

    const [existingReservation] = await connection.query(
      `SELECT id
      FROM reservations
      WHERE id_user = ? AND visit = ?`,
      [id_user, visit]
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

    if (Number(visit_hour) < startHour || Number(visit_hour) >= endHour) {
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
    //console.log("comprobando ocupacion");

    const [result] = await connection.query(
      `
        SELECT SUM(places) AS ocupation
        FROM reservations
        WHERE id_beach = ? AND reservations.visit = ? AND reservations.cc_number <> 'null'
      `,
      [id_beach, visit]
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

    //⏩si todo ok, grabamos la reserva

    const [finalResult] = await connection.query(
      `
      INSERT INTO reservations(date, visit, places, id_beach, id_user, lastUpdate)
      VALUES(UTC_TIMESTAMP, ?, ?, ?, ?, UTC_TIMESTAMP)
    `,
      [visit, places, id_beach, id_user]
    );

    const reservationNumber = finalResult.insertId;

    res.send({
      status: "ok",
      message: `Se guardó la reserva para el usuario ${id_user}, en la playa nº ${id_beach}: (${beachName})
      para la fecha ${visit_date} y hora ${visit_hour} para ${places} personas. Nº reserva: ${reservationNumber}.
      Debes pagar una fianza de 3 euros para confirmar la reserva.`,
    });

    //Falta: alguna comprobación más ( reservas y plazas máx; )
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newReservation;
