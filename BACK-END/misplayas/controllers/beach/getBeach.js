const { getConnection } = require("../../db");
const { setMinutes, setSeconds } = require("date-fns");
const { formatDateToDB, formatDateToUser, setZero } = require("../../helpers");

async function getBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    console.log("buscando info");

    const [result] = await connection.query(
      `
      SELECT beaches.*, ROUND(AVG(ratings.value),1) AS voteAverage
      FROM beaches
      LEFT JOIN reservations ON beaches.id = reservations.id_beach
      LEFT JOIN ratings ON reservations.id = ratings.id_reservation
      WHERE beaches.id=?
    `,
      [id]
    );
    const startHour = result[0].start_time;
    const endHour = result[0].end_time;
    const startMonth = result[0].start_month;
    const endMonth = result[0].end_month;
    console.log(startHour, endHour, startMonth, endMonth);

    //Si el usuario no indica nada en body, se da la disponibilidad en el momento actual
    //PUede incluir una fecha en el body (visit) y se calcula la disponibilidad para esa fecha

    let free;
    let aviso;
    let visitUser;
    let visitDate;



    if (req.body.visit) {//si el usuario indica una hora
      const { visit } = req.body;
      visitDate = formatDateToDB(visit);
      visitUser = formatDateToUser(visit); //formato "amable" para la respuesta
      const visitHour = new Date(visit).getHours(); //saco la hora de la visita
      const visitMonth = new Date(visit).getMonth() + 1; //saco el mes de la visita
      console.log(`hora: ${visitHour}, mes: {visitMonth}`);
      console.log(`visitDate ${visitDate}`);
      console.log(`visitDate ${visitUser}`);

      if (visitMonth < startMonth || visitMonth > endMonth) {
        //compruebo primero el mes
        aviso = "para el mes indicado no es necesario reservar";
      } else {//si el mes es correcto , compruebo la hora:
        if (visitHour < startHour || visitHour > endHour - 1) {
          //si el mes ok compruebo la hora
          aviso =
            "la hora indicada no está dentro del horario de esta playa en los meses que es necesario reservar";
        }
      }
    } else {//si no indica una hora, se dá la disponibilidad en el momento actual
      const now = new Date(); //actual en UTC
      const nowZeroMinutes = setMinutes(now, 0);
      const nowZero = setSeconds(nowZeroMinutes, 0); //paso la hora actual a 0 minutos y 0 segundos, para poder comparar con las horas de reserva
      console.log(nowZero);
      visitDate = formatDateToDB(nowZero);
      visitUser = formatDateToUser(now);
    }
    console.log(`buscando datos de disponibilidad a fecha ${visitDate}`);

    const [occupation] = await connection.query(
      `
        SELECT SUM(places) AS occupation
        FROM reservations
        WHERE id_beach = ? AND reservations.visit = ?
      `,
      [id, visitDate]
    );

    if (occupation[0].occupation === null) {
      //si no hay ocupación, pasamos null a cero para operar
      setZero(occupation[0].occupation);
    }

    free = Number(result[0].capacity) - Number(occupation[0].occupation);

    console.log(`aforo máximo ${Number(result[0].capacity)}, ocupación: ${Number(occupation[0].occupation)}, plazas: ${free}`)

    if (result[0].active === 0) {
      free = "PLAYA INACTIVA";
      aviso = "playa inactiva en la web de reservas. Pregunte disponibilidad en el correspondiente Ayuntamiento."
    }

    res.send({
      status: "ok",
      data: {
        info: result[0],
        disponibilidad: `plazas disponibles actualmente para la fecha ${visitUser}: ${free} plazas`,
        aviso, //aviso en caso de que hora o mes no se corresponda
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeach;
