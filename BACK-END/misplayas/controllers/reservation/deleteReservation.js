const { getConnection } = require("../../db");
const { formatDateToUser, sendMail } = require("../../helpers");

async function deleteReservation(req, res, next) {
  let connection;

  //Anulación de reservas pagadas y borrado de reservas en general

  try {
    connection = await getConnection();
    const { id } = req.params; //id de la reserva

    //obtenemos info que necesitaremos de la reserva:

    const [reservInformation] = await connection.query(
      `
        
        SELECT date, visit, places, id_beach, id_user, cc_number, name, email
      FROM reservations, users
      WHERE reservations.id = ? AND reservations.id_user = users.id
      
        `,
      [id]
    );

    const reservDate = reservInformation[0].date; //para info
    const reservIdUser = reservInformation[0].id_user; //necesitaré para comprobar user
    const cc_number = reservInformation[0].cc_number; //necesario para el abono
    const reservUserName = reservInformation[0].name; //para info
    const userEmail = reservInformation[0].email; //si le mandamos email

    //PTE comprobaciones usuario

    //comprobar si la reserva está pagada y recoger dato de la tarjeta para abono

    const [paidReservation] = await connection.query(
      `
      SELECT reservations.cc_number
      FROM reservations
      WHERE reservations.cc_number <> 'null' AND reservations.id = ?`,
      [id]
    );

    //PTE COMPROBACIÓN FECHA (sólo se pueden anular hasta 24 horas antes  )

    //y le enviaremos correo de confirmación de la anulación

    if (paidReservation.length !== 0) {
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
    }

    // Borrar la entrada de la tabla (sería mejor anular..)
    await connection.query(
      `
      DELETE FROM reservations
      WHERE id=?
    `,
      [id]
    );

    // Borrar votos asociados a esa entrda en la tabla ratings (que aún no tiene voto)
    //Incluyo en la FK de la tabla de ratings que borre en cascada (funciona)

    res.send({
      status: "ok",
      message: `La reserva ${id} ha sido eliminada. 
      En caso de reserva pagada, se ha enviado correo de anulación y abono a  ${userEmail} `,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteReservation;
