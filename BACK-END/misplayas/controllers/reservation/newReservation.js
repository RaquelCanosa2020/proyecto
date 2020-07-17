const { getConnection } = require("../../db");
const { addDays } = require("date-fns");
const {
  formatDateToDB,
  formatDateToUser,
  setZero,
  sendMail,
  generateError,
} = require("../../helpers");
const {
  newReservationSchema,
} = require("../../validators/reservationValidators");

async function newReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await newReservationSchema.validateAsync(req.body);

    const id_user = req.auth.id;

    const { visit, places, id_beach, cc_number } = req.body;

    //⏩ comprobar que no falta info en el body: en validación

    //procesamos mes y hora de la visita,

    const visitUtc = new Date(visit);
    const visitHour = visitUtc.getHours();
    const visitMonth = visitUtc.getMonth() + 1;

    console.log(`horaUTC: ${visitUtc}`);
    console.log(`hora local: ${visitHour}`);
    console.log(`mes: ${visitMonth}`);

    //comprobamos que la fecha no es pasada o más allá de 5 días:

    if (visitUtc <= new Date() || visitUtc > addDays(new Date(), 5)) {
      {
        throw generateError(
          "La fecha no es válida, reservas con antelación máxima de 5 días",
          403
        );
      }
    }

    //comprobamos que no hay otra reserva ese mismo día/fecha para ese usuario

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

    //⏩comprobar que la hora/mes están incluidos en el horario de la playa:
    //necesito la info de la playa ():

    const [infoBeach] = await connection.query(
      `
          SELECT start_time, end_time, start_month, end_month, name, capacity
          FROM beaches
          WHERE id=?
          `,
      [id_beach]
    );

    //proceso la hora de inicio y fin de la playa (están en horario local):

    const startHour = infoBeach[0].start_time;
    const endHour = infoBeach[0].end_time;
    const startMonth = infoBeach[0].start_month;
    const endMonth = infoBeach[0].end_month;

    //comparo visit con el horario (en local ambos):
    if (visitMonth < startMonth || visitMonth > endMonth) {
      //compruebo primero el mes
      throw generateError(`para el mes indicado no es necesario reservar`, 404);
    } else {
      if (visitHour < startHour || visitHour > endHour - 1) {
        //si el mes ok compruebo la hora
        throw generateError(
          "la hora indicada no está dentro del horario de esta playa en los meses que es necesario reservar"
        );
      }
    }

    //console.log("procesando");

    //⏩comprobar que hay plazas disponibles esa hora:

    const placesNumber = Number(places); //ya que places es un string
    console.log(`plazas solicitadas: ${places}`);

    //aforo de la playa:
    const capacity = Number(infoBeach[0].capacity);
    const beachName = infoBeach[0].name;
    //console.log(result1[0].capacity); //20

    //ocupación en la hora indicada
    console.log("comprobando ocupacion");

    const [result] = await connection.query(
      `
        SELECT SUM(places) AS occupation
        FROM reservations
        WHERE id_beach = ? AND visit = ?
      `,
      [id_beach, formatDateToDB(visit)]
    );
    const occupation = Number(result[0].occupation);

    console.log(`plazas ya ocupadas: ${occupation}`);

    //comparar ambas

    //si aún no hay reservas en la playa nos da null, lo cambiamos a 0 (helpers)

    if (occupation === null) {
      setZero(occupation);
    }
    // ocupación
    const availability = capacity - occupation;

    console.log(
      `Hay ${availability} plazas disponibles en la playa y horario indicados`
    );
    console.log(`ocupadas+solicitadas: ${occupation + placesNumber}`);

    //comprobamos que haya sitio libre

    if (occupation + placesNumber > capacity) {
      throw generateError(
        `No hay suficientes plazas en la playa y horario indicado`,
        404
      );
    }
    //console.log(occupation, places, capacity);

    // obtenemos el nombre del usuario

    const [userInfo] = await connection.query(
      `
      SELECT name, email
        FROM users
        WHERE id = ?
      `,
      [id_user]
    );
    const userName = userInfo[0].name;
    const userEmail = userInfo[0].email;

    //⏩si todo ok, grabamos la reserva

    const [newReservation] = await connection.query(
      `
      INSERT INTO reservations(date, visit, places, id_beach, id_user, user_name, total_euros, cc_number, lastUpdate)
      VALUES(UTC_TIMESTAMP, ?, ?, ?, ?, ?, 3, SHA2(?, 512), UTC_TIMESTAMP)
    `,
      [formatDateToDB(visit), places, id_beach, id_user, userName, cc_number]
    );

    const reservationNumber = newReservation.insertId;

    //⏩por cuestión de las FK tengo que crear ya la entrada en ratings (sólo en caso de que no exista)

    const [existRating] = await connection.query(
      `
    SELECT id
    FROM ratings
    WHERE id_reservation=?
  `,
      [reservationNumber]
    );
    if (existRating.length === 0) {
      await connection.query(
        `
      INSERT INTO ratings(date, id_reservation, lastUpdate)
      VALUES(UTC_TIMESTAMP, ?, UTC_TIMESTAMP)
    `,
        [reservationNumber]
      );
    }

    //⏩ envío de correo confirmando la reserva:

    const nowDateUser = formatDateToUser(new Date());
    const dateToUser = formatDateToUser(visit);

    try {
      await sendMail({
        email: userEmail,
        title: "Reserva de espacio en playa.",
        content: `Se confirma la reserva nº${reservationNumber} realizada con los siguientes datos:
       👣 Usuario: ${userName} (usuario nº: ${id_user}).

       🌅 Playa: ${beachName} (nº ${id_beach}).

       📅 Fecha y hora: ${dateToUser} 

       👥 Plazas: ${places} personas.

       💶 Fianza de 3 euros (pagado).

          Reserva confirmada y pagada el ${nowDateUser}
          
          Sólo se permiten cambios y anulaciones hasta 24 horas antes de la fecha/hora reservada. `,
      });
    } catch (error) {
      const emailError = new Error("Error de envío de mail");
      throw emailError;
    }

    res.send({
      status: "ok",
      message: `Se guardó la reserva nº${reservationNumber}. Datos de la reserva:

       👣 Usuario: ${userName} (usuario nº: ${id_user}).

       🌅 Playa: ${beachName} (nº ${id_beach}).

       📅 Fecha y hora: ${dateToUser} 

       👥 Plazas: ${places} personas.

       💶 Fianza de 3 euros (pagado).
       
       📨 Se ha enviado correo de confirmación.`,
    });

    //Falta: alguna comprobación más ( reservas y plazas máx; )
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newReservation;
