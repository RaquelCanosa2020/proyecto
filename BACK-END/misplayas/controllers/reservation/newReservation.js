const { getConnection } = require("../../db");
const {
  getHours,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
} = require("date-fns");
const { formatDateToDB, setZero } = require("../../helpers");

async function newReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const { visit, places, id_user } = req.body;

    //⏩ comprobar que no falta info en el body:

    if (!visit || !places || !id_user) {
      //pte control que es usuario registrado
      const error = new Error(
        `Faltan datos en la petición. Debes cubrir
        visit: fecha y hora de la visita,
        places: nº de sitios a reservar,
        id_user: número de usuario`
      );
      error.httpStatus = 400;
      throw error;
    }

    //⏩comprobar que la hora está incluida en el horario de la playa:
    //necesito la info de horarios de la playa:

    const [schedule] = await connection.query(
      `
          SELECT start_time, end_time
          FROM beaches
          WHERE id=?
          `,
      [id]
    );

    //proceso la hora de inicio y fin de la playa:

    const start = schedule[0].start_time;
    const startHour = Number(start.split(":")[0]);

    console.log(startHour);

    const end = schedule[0].end_time;
    const endHour = Number(end.split(":")[0]);

    //saco la hora de visit

    const visitDateHour = parseISO(visit); //pq visit es un string
    const localVisitHour = getHours(visitDateHour) - 2; //parseISO da UTC, pte arreglar.
    console.log(localVisitHour);

    //comparo visit con el horario:

    if (localVisitHour < startHour || localVisitHour > endHour) {
      {
        const error = new Error(
          `Horario no válido, Debe estar entre las ${start} horas y
           las ${end} horas`
        );
        error.httpStatus = 404;
        throw error;
      }
    }
    console.log("procesando");

    //⏩comprobar que hay plazas disponibles esa hora:

    const placesNumber = Number(places); //ya que places es un string
    console.log(places);

    //aforo de la playa:
    const [result1] = await connection.query(
      `
          SELECT capacity
          FROM beaches
          WHERE id=?
          `,
      [id]
    );

    const capacity = Number(result1[0].capacity);
    console.log(result1[0].capacity); //20

    //ocupación en la hora indicada
    console.log("comprobando ocupacion");

    const [result] = await connection.query(
      `
        SELECT SUM(places) AS ocupation
        FROM reservations
        WHERE id_beach = ? AND reservations.visit = ?
      `,
      [id, visit]
    );
    const ocupation = Number(result[0].ocupation);
    console.log(ocupation + places); //8

    //comparar ambas

    //si aún no hay reservas en la playa nos da null, lo cambiamos a 0 (helpers)

    if (ocupation === null) {
      setZero(ocupation);
    }
    console.log(ocupation);

    //comprobamos que haya sitio libre

    if (ocupation + placesNumber > capacity) {
      {
        const error = new Error(
          `No hay suficientes plazas en la playa y horario indicado`
        );
        error.httpStatus = 404;
        throw error;
      }
    }
    //console.log(ocupation, places, capacity);

    //informamos de la ocupación
    const freeCapacity = capacity - ocupation;

    console.log(
      `Hay ${freeCapacity} plazas disponibles en la playa y horario indicados`
    );

    //⏩si todo ok, grabamos la reserva

    const visitFormat = formatDateToDB(visit);

    const [finalResult] = await connection.query(
      `
      INSERT INTO reservations(date, visit, places, id_beach, id_user, lastUpdate)
      VALUES(NOW(), ?, ?, ?, ?, NOW())
    `,
      [visitFormat, places, id, id_user]
    );

    const reservationNumber = finalResult.insertId;

    res.send({
      status: "ok",
      message: `Se guardó la reserva para el usuario ${id_user}, en la playa ${id}
      para la fecha y hora ${visit} para ${places} personas. Nº reserva: ${reservationNumber}`,
    });

    //pendiente "humanizar" visit en mensaje.

    //Falta: alguna comprobación más (época año, reservas y plazas máx; el pago y envío de correo)
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newReservation;
