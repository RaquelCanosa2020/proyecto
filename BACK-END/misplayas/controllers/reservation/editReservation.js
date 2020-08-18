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

//Se podrán modificar las reservas antes 1día  de visit.

async function editReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await editReservationSchema.validateAsync(req.body);
    const { id } = req.params;
    const id_user = req.auth.id;

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
    console.log(req.auth.id);
    console.log(req.auth.role);

    const [currentReserv] = current;

    console.log(currentReserv.id_user);

    if (currentReserv.id_user !== req.auth.id && req.auth.role !== "admin") {
      throw generateError("No tienes permisos para editar esta reserva", 403);
    }

    //Comprobamos que en el momento no faltan 1 día o menos para visit

    const currentVisit = new Date(currentReserv.visit);

    if (currentVisit < addDays(new Date(), 1)) {
      {
        throw generateError(
          "No puedes cambiar la reserva, faltan menos 24 horas para la fecha reservada",
          403
        );
      }
    }

    //⏩ comprobar que no falta info en el body: validator
    //⏩ comprobar que la playa está activa: isActiva.js

    //procesamos día y hora, comprobamos fecha no pasada o posterior a
    //5 días (máximo para reservar)
    const visitUtc = new Date(visit);
    const visitHour = visitUtc.getHours();
    const visitMonth = visitUtc.getMonth() + 1;
    console.log(visitUtc);
    console.log(visitHour);

    if (visitUtc <= new Date() || visitUtc >= addDays(new Date(), 5)) {
      {
        throw generateError(
          "La fecha no es válida, reservas con antelación máxima de 5 días",
          403
        );
      }
    }

    //comprobamos que no hay otra reserva ese mismo día/fecha

    const [existingReservation] = await connection.query(
      `SELECT id, date
      FROM reservations
      WHERE id_user = ? AND visit = ? AND id <> ?`,
      [id_user, formatDateToDB(visit), id]
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
    //console.log(places);

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

    console.log(occupation);
    console.log(occupation + placesNumber); //8Es

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

    // ocupación
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
    console.log(userEmail);

    //⏩si todo ok, grabamos los nuevos datos de la reserva

    await connection.query(
      `
      UPDATE reservations SET visit=?, places=?, id_beach=?, id_user=?, lastUpdate=UTC_TIMESTAMP
      WHERE id=?
      `,
      [formatDateToDB(visit), places, id_beach, id_user, id]
    );

    //⏩ envío de correo confirmando el cambio de reserva:

    const nowDateUser = formatDateToUser(new Date());
    const dateToUser = formatDateToUser(visit);

    try {
      await sendMail({
        email: userEmail,
        title: "Reserva de espacio en playa.",
        content: `Se confirma la reserva nº${id} modificada con los siguientes datos:
       👣 Usuario: ${userName} (usuario nº: ${id_user}).

       🌅 Playa: ${beachName} (nº ${id_beach}).

       📅 Fecha y hora: ${dateToUser} 

       👥 Plazas: ${places} personas.

       💶 Fianza de 3 euros (pagado).

          
          Reserva modificada el ${nowDateUser},
          
          Sólo se permiten cambios y anulaciones hasta 24 horas antes de la fecha/hora reservada. `,
      });
    } catch (error) {
      const emailError = new Error("Error de envío de mail");
      throw emailError;
    }

    res.send({
      status: "ok",
      message: `Se modificó la reserva nº${id}. Datos de la reserva:

       👣 Usuario: ${userName} (usuario nº: ${id_user}).

       🌅 Playa: ${beachName} (nº ${id_beach}).

       📅 Fecha y hora: ${dateToUser} 

       👥 Plazas: ${places} personas.

       
       
       📨 Se ha enviado correo de confirmación.`,
    });

    //Falta: alguna comprobación más ( reservas y plazas máx; )
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editReservation;
