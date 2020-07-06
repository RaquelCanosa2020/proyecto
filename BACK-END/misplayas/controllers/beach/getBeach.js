const { getConnection } = require("../../db");
const { getHours, parseISO, setMinutes, setSeconds } = require("date-fns");
const { formatDateToDB } = require("../../helpers");

async function getBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

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

    const now = new Date(); //actual en UTC
    const nowZeroMinutes = setMinutes(now, 0);
    const nowZero = setSeconds(nowZeroMinutes, 0); //paso la hora actual a 0 minutos y 0 segundos, para poder comparar con las horas de reserva
    console.log(nowZero);

    const [ocupation] = await connection.query(
      `
        SELECT SUM(places) AS ocupation
        FROM reservations
        WHERE id_beach = ? AND reservations.visit = ? AND reservations.cc_number <> 'null'
      `,
      [id, formatDateToDB(nowZero)]
    );
    const free = Number(result[0].capacity) - Number(ocupation[0].ocupation);

    res.send({
      status: "ok",
      data: {
        información: result[0],
        "plazas disponibles": free,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeach;
