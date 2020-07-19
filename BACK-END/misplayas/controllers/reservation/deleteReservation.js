const { addDays } = require("date-fns");
const { getConnection } = require("../../db");
const { formatDateToUser, sendMail, generateError } = require("../../helpers");

async function deleteReservation(req, res, next) {
  let connection;

  //Se permite anulación de reservas antes de 24 h de visita.

  try {
    connection = await getConnection();
    const { id } = req.params; //id de la reserva
    const id_user = req.auth.id;
    const id_role = req.auth.role;

    //obtenemos info que necesitaremos de la reserva y comprobamos que es el usuario autor:

    const [current] = await connection.query(
      `
        
        SELECT date, visit, places, id_beach, id_user, cc_number, name, email
      FROM reservations, users
      WHERE reservations.id = ? AND reservations.id_user = users.id
      
        `,
      [id]
    );

    const [currentReserv] = current;
    console.log(current);
    console.log(currentReserv);

    //Comprobación de usuario autorizado

    if (currentReserv.id_user !== id_user && id_role !== "admin") {
      throw generateError("No tienes permisos para anular esta reserva", 403);
    }

    const reservDate = currentReserv.date; //para info
    const cc_number = currentReserv.cc_number; //aunque aquí no lo usamos, se necesitaría para el abono
    const reservUserName = currentReserv.name; //para info
    const userEmail = currentReserv.email; //le mandamos email de anulación

    //Comprobamos que en el momento no faltan 1 día o menos para visit

    const currentVisit = new Date(currentReserv.visit);

    if (currentVisit < addDays(new Date(), 1)) {
      {
        throw generateError(
          "No puedes anular la reserva, faltan menos 24 horas para la fecha reservada",
          403
        );
      }
    }
    //y le enviaremos correo de confirmación de la anulación

    try {
      await sendMail({
        email: userEmail,
        title: "Anulación de reserva de espacio en playa.",
        content: `Se confirma la ANULACIÓN de la reserva realizada con los siguientes datos:
          Reserva realizada por: ${reservUserName} 
          Realizada en fecha: ${formatDateToUser(reservDate)}
          Nº reserva: ${id}
          Reserva anulada el ${formatDateToUser(
          new Date()
        )} Se ha procedido al reintegro del importe a la misma tarjeta que hizo el pago.
         `,
      });
    } catch (error) {
      const emailError = new Error("Error de envío de mail");
      throw emailError;
    }

    // Borrar la entrada de la tabla 
    await connection.query(
      `
      DELETE FROM reservations
      WHERE id=?
    `,
      [id]
    );

    // Borrar votos asociados a esa entrda en la tabla ratings (que aún no tiene voto)
    //Incluyo en la FK de la tabla de ratings que borre en cascada 

    res.send({
      status: "ok",
      message: `La reserva ${id} ha sido eliminada. 
      Se ha enviado correo de anulación y abono a  ${userEmail} `,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteReservation;
