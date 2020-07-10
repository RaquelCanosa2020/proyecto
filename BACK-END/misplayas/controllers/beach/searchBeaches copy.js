const { getConnection } = require("../../db");
const { getHours, parseISO, setMinutes, setSeconds } = require("date-fns");
const { formatDateToDB } = require("../../helpers");

async function searchBeaches(req, res, next) {
  let connection;

  let query;
  const params = [];
  const conditions = [];

  try {
    connection = await getConnection();
    if (req.body.visit && req.body.places) {
      const {
        type,
        municipality,
        lifesaving,
        bar_restaurant,
        visit,
        places,
      } = req.body;

      const visitDate = formatDateToDB(visit);
      params.push(`${visitDate}`);

      //Por fecha/hora y no se elige ninguna otra condición:

      /*if (visit && (!type || !municipality || !lifesaving || !bar_restaurant)) {
        query = `SELECT B.id, B.name, B.capacity, SUM(R.places) AS occupation from beaches B
       LEFT JOIN reservations R ON B.id = R.id_beach AND R.visit = ?
       GROUP BY B.id`;
        params.push(`${visitDate}`);
      }*/
      if (!type && !municipality && !lifesaving && !bar_restaurant) {
        params.push(`${places}`);
        query = `SELECT beaches.id, beaches.name, beaches.capacity, SUM(reservations.places) AS occupation
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        GROUP BY beaches.id
        HAVING (capacity + ?) > occupation OR occupation IS NULL`;
      }

      //Por fecha/hora y se elige una o varias condiciones:
      if (type || municipality || lifesaving || bar_restaurant) {
        if (type) {
          conditions.push("B.type=?");
          params.push(`${type}`);
        }

        if (municipality) {
          conditions.push("B.municipality=?");
          params.push(`${municipality}`);
        }

        if (lifesaving) {
          conditions.push("B.lifesaving=?");
          params.push(`1`);
        }

        if (bar_restaurant) {
          conditions.push("B.bar_restaurant=?");
          params.push(`1`);
        }
        params.push(`${places}`);

        query = `SELECT B.id, B.name, B.capacity, SUM(R.places) AS occupation
        FROM beaches B
        LEFT OUTER JOIN reservations R ON B.id = R.id_beach AND R.visit = ?
        WHERE ${conditions.join(` AND `)} GROUP BY B.id
        HAVING (capacity + ?) > occupation OR occupation IS NULL`;
      }
    } else {
      const { type, municipality, lifesaving, bar_restaurant } = req.body;

      if (type || municipality || lifesaving || bar_restaurant) {
        const { type, municipality, lifesaving, bar_restaurant } = req.body;

        //const params = [];
        //const conditions = [];

        if (type) {
          conditions.push("type=?");
          params.push(`${type}`);
        }

        if (municipality) {
          conditions.push("municipality=?");
          params.push(`${municipality}`);
        }

        if (lifesaving) {
          conditions.push("lifesaving=?");
          params.push(`1`);
        }

        if (bar_restaurant) {
          conditions.push("bar_restaurant=?");
          params.push(`1`);
        }
      }
      query = `SELECT id, name, capacity from beaches
      WHERE ${conditions.join(` AND `)}`;
    }

    const [queryResults] = await connection.query(query, params);

    console.log(query, params);
    console.log(req.params);

    if (queryResults.length === 0) {
      const error = new Error("No hay resultados para la búsqueda");
      error.httpStatus = 400;
      throw error;
    }
    // Extraigo los resultados del resultado de la query
    //const [result] = queryResults;

    // Mando la respuesta
    res.send({
      status: "ok",
      data: queryResults,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = searchBeaches;
