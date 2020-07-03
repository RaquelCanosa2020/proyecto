const { getConnection } = require("../../db");
const {
  getHours,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
} = require("date-fns");
const { sendMail } = require("../../helpers");

//Las reservas una vez pagadas no pueden modificarse.

async function payReservation(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const { cc_number } = req.body;

    console.log(id);

    console.log(cc_number);

    //⏩ comprobar que no falta info en el body:

    if (!cc_number) {
      //pte control que es usuario registrado
      const error = new Error(
        `Faltan datos en la petición. Debes cubrir
        cc_number: nº de tarjeta de débito o crédito
        `
      );
      error.httpStatus = 400;
      throw error;
    }

    //⏩ccomprobaciones PTES :

    //⏩obtenemos la información de la reserva:

    const [reservInformation] = await connection.query(
      `
        
        SELECT date, visit, places, id_beach, id_user, name, email
      FROM reservations, users
      WHERE reservations.id = ? AND reservations.id_user = users.id
      
        `,
      [id]
    );

    const reservVisitDate = reservInformation[0].visit;
    const reservNumberOfPlaces = reservInformation[0].places;
    const reservBeach = reservInformation[0].id_beach;
    const reservUserName = reservInformation[0].name;
    const userEmail = reservInformation[0].email;

    console.log(reservNumberOfPlaces);
    console.log(reservBeach);

    //⏩incluimos en la reserva la info del pago:

    await connection.query(
      `
      UPDATE reservations
      SET user_name = ?, total_euros = 3, cc_number = ?, lastUpdate = NOW()
      WHERE id = ?
      
    `,
      [reservUserName, cc_number, id]
    );

    //pendiente "humanizar" fechas en mensaje.

    //⏩por cuestión de las FK tengo que crear ya la entrada en ratings (sólo en caso de que no exista)

    const [existRating] = await connection.query(
      `
    SELECT id
    FROM ratings
    WHERE id_reservation=?
  `,
      [id]
    );

    if (existRating.length === 0) {
      await connection.query(
        `
      INSERT INTO ratings(date, id_reservation, lastUpdate)
      VALUES(NOW(), ?, NOW())
    `,
        [id]
      );
    }

    //⏩ envío de correo confirmando la reserva:

    try {
      await sendMail({
        email: userEmail,
        title: "Reserva de espacio en playa.",
        content: `Se confirma la reserva realizada con los siguientes datos:
          Reserva realizada por: ${reservUserName} 
          Playa: ${reservBeach}
          Fecha y hora reservada (1 hora): ${reservVisitDate} 
          Nº plazas: ${reservNumberOfPlaces} personas.
          Fianza: 3 euros.
          Nº reserva: ${id}
          Reserva confirmada y pagada el ${new Date()}
          
          Sólo se permiten anulaciones hasta 24 horas antes de la fecha/hora reservada. `,
      });
    } catch (error) {
      const emailError = new Error("Error de envío de mail");
      throw emailError;
    }

    res.send({
      status: "ok",
      message: `Se confirma la reserva para el usuario ${reservUserName}, en la playa ${reservBeach}
      para la fecha y hora ${reservVisitDate} para ${reservNumberOfPlaces} personas. Nº reserva: ${id}.
      Reserva pagada el ${new Date()}. Se ha enviado correo de confirmación al correo ${userEmail}.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = payReservation;
