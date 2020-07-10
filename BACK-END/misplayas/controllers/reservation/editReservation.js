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
  editReservationSchema,
} = require("../../validators/reservationValidators");

//Se podrán modificar las reservas antes 12 horas de visit.

async function editReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await editReservationSchema.validateAsync(req.body);
    const { id } = req.params;
    const id_user = req.auth.id;
    const id_role = req.auth.role;

    const { visit, places, id_beach } = req.body;

    //⏩ comprobar que el usuario es el autor o el admin:
    const [current] = await connection.query(
      `
    SELECT id, id_user, visit
    FROM reservations
    WHERE id=?
  `,
      [id]
    );

    const [currentReserv] = current;

    if (currentReserv.user_id !== id_user && id_role !== "admin") {
      throw generateError("No tienes permisos para editar esta entrada", 403);
    }

    //Comprobamos que en el momento no faltan 1 día o menos para visit

    const currentVisit = new Date(currentReserv.user_id);

    if (currentVisit < addDays(new Date(), 1)) {
      {
        throw generateError(
          "No puedes cambiar la reserva, faltan menos 24 horas para la fecha reservada",
          403
        );
      }
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

    //procesamos día y hora, comprobamos fecha no pasada o posterior a
    //5 días (máximo para reservar)
    const visitUtc = new Date(visit);
    const visitHour = visitUtc.getHours();
    console.log(visitUtc);
    console.log(visitHour);

    if (visitUtc <= new Date() || visitUtc > addDays(new Date(), 5)) {
      {
        throw generateError("La fecha no es válida", 403);
      }
    }

    //comprobamos que no hay otra reserva ese mismo día/fecha

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

    const [infoBeach] = await connection.query(
      `
          SELECT start_time, end_time, name, capacity
          FROM beaches
          WHERE id=?
          `,
      [id_beach]
    );

    //proceso la hora de inicio y fin de la playa (están en horario local):

    const start = infoBeach[0].start_time;
    const startHour = Number(start.split(":")[0]);

    const end = infoBeach[0].end_time;
    const endHour = Number(end.split(":")[0]);

    //comparo visit con el horario (en local ambos):

    if (Number(visitHour) < startHour || Number(visitHour) >= endHour) {
      throw generateError(
        `Esta playa dispone de horario entre las ${startHour} horas y las ${endHour} `,
        404
      );
    }
    //console.log("procesando");

    //⏩comprobar que hay plazas disponibles esa hora:

    const placesNumber = Number(places); //ya que places es un string
    //console.log(places);

    //aforo de la playa:
    const capacity = Number(infoBeach[0].capacity);
    const beachName = infoBeach[0].name;
    //console.log(result1[0].capacity); //20

    //ocupación en la hora indicada
    console.log("comprobando ocupacion");

    //console.log(result1[0].capacity); //20

    //ocupación en la hora indicada
    console.log("comprobando ocupacion");

    const [result] = await connection.query(
      `
        SELECT SUM(places) AS occupation
        FROM reservations
        WHERE id_beach = ? AND visit = ? AND cc_number IS NOT NULL
      `,
      [id_beach, formatDateToDB(visit)]
    );
    const occupation = Number(result[0].occupation);
    console.log(occupation);
    console.log(occupation + places); //8Es

    //comparar ambas

    //si aún no hay reservas en la playa nos da null, lo cambiamos a 0 (helpers)

    if (occupation === null) {
      setZero(occupation);
    }

    //comprobamos que haya sitio libre

    if (occupation + placesNumber > capacity) {
      throw generateError(
        `No hay suficientes plazas en la playa y horario indicado`,
        404
      );
    }
    //console.log(occupation, places, capacity);

    //informamos de la ocupación
    const availability = capacity - occupation;

    console.log(
      `Hay ${availability} plazas disponibles en la playa y horario indicados`
    );
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

    //⏩si todo ok, grabamos los nuevos datos de la reserva

    await connection.query(
      `
      UPDATE reservations SET visit=?, places=?, id_beach=?, id_user=?, lastUpdate=UTC_TIMESTAMP
      WHERE id=?
      `,
      [formatDateToDB(visit), places, id_beach, id_user, id]
    );

    //⏩ envío de correo confirmando la reserva:

    const nowDateUser = formatDateToUser(new Date());
    const dateToUser = formatDateToUser(visit);

    try {
      await sendMail({
        email: userEmail,
        title: "Reserva de espacio en playa.",
        content: `Se confirma la modificación de la reserva realizada con los siguientes datos:
          Reserva realizada por: ${userName} (usuario nº: ${id_user})
          Playa: ${beachName} (nº ${id_beach})
          Fecha y hora reservada (1 hora): ${dateToUser} 
          Nº plazas: ${places} personas.
          Fianza: 3 euros.
          Nº reserva: ${id}
          Reserva confirmada y pagada el ${nowDateUser}
          
          Sólo se permiten cambios y anulaciones hasta 24 horas antes de la fecha/hora reservada. `,
      });
    } catch (error) {
      const emailError = new Error("Error de envío de mail");
      throw emailError;
    }

    res.send({
      status: "ok",
      message: `Se modificó la reserva para ${userName} (usuario nº: ${id_user}), en la playa ${beachName} (nº ${id_beach})
      para la fecha ${formatDateToUser(
        visit
      )} para ${places} personas. Nº reserva: ${id}.
      Pagada fianza de 3 euros.`,
    });

    //Falta: alguna comprobación más ( reservas y plazas máx; )
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editReservation;
