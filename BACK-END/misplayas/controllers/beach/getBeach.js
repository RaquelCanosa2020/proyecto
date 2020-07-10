const { getConnection } = require("../../db");
const { getHours, parseISO, setMinutes, setSeconds } = require("date-fns");
const { formatDateToDB, formatDateToUser, setZero } = require("../../helpers");

async function getBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    console.log("buscando info");

    const [result] = await connection.query(
      `
      SELECT beaches.*, AVG(ratings.value) AS voteAverage
      FROM beaches
      LEFT JOIN reservations ON beaches.id = reservations.id_beach
      LEFT JOIN ratings ON reservations.id = ratings.id_reservation
      WHERE beaches.id=?
    `,
      [id]
    );

    let visitUser;
    let visitDate;

    if (req.body.visit) {
      const { visit } = req.body;
      visitDate = formatDateToDB(visit);
      visitUser = formatDateToUser(visit);
    } else {
      const now = new Date(); //actual en UTC
      const nowZeroMinutes = setMinutes(now, 0);
      const nowZero = setSeconds(nowZeroMinutes, 0); //paso la hora actual a 0 minutos y 0 segundos, para poder comparar con las horas de reserva
      console.log(nowZero);
      visitDate = formatDateToDB(nowZero);
      visitUser = formatDateToUser(now);
    }
    console.log(`buscando datos de disponibilidad a fecha utc  ${visitDate}`);

    const [occupation] = await connection.query(
      `
        SELECT SUM(places) AS occupation
        FROM reservations
        WHERE id_beach = ? AND reservations.visit = ?
      `,
      [id, visitDate]
    );

    if (occupation[0].occupation === null) {
      setZero(occupation[0].occupation);
    }

    const free = Number(result[0].capacity) - Number(occupation[0].occupation);

    res.send({
      status: "ok",
      data: {
        información: result[0],
        disponibilidad: `plazas disponibles actualmente en fecha ${visitUser}: ${free}`,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeach;
