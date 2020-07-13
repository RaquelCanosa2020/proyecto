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
      const visitHour = new Date(visitDate).getHours();
      const visitMonth = new Date(visitDate).getMonth() + 1;

      params.push(`${visitDate}`);
      params.push(`${visitHour}`);
      params.push(`${visitMonth}`);
      console.log(
        "buscando disponibilidad para la fecha y nº plazas indicadas"
      );

      if (!type && !municipality && !lifesaving && !bar_restaurant) {
        //Por fecha/hora y no se elige ninguna otra condición:

        console.log("no se han seleccionado opciones");
        params.push(`${places}`);
        /*query = `SELECT beaches.id, beaches.name, beaches.capacity, SUM(reservations.places) AS occupation
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        GROUP BY beaches.id
        HAVING (capacity + ?) > occupation OR occupation IS NULL`;*/

        query = `SELECT beaches.id, beaches.name, beaches.capacity, beaches.start_time, beaches.start_month, IFNULL(SUM(reservations.places),0) AS occupation, (beaches.capacity - IFNULL(SUM(reservations.places),0)) AS free
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        WHERE (? BETWEEN start_time AND end_time) AND (? BETWEEN start_month AND end_month)
        GROUP BY beaches.id
        HAVING (capacity > occupation OR occupation IS NULL);`;
      }

      //Por fecha/hora y se elige una o varias condiciones:
      if (type || municipality || lifesaving || bar_restaurant) {
        console.log("seleccionando las opciones indicadas");
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
        params.push(`${places}`);

        query = `SELECT beaches.id, beaches.name, beaches.capacity, beaches.start_time, beaches.start_month, IFNULL(SUM(reservations.places),0) AS occupation, (beaches.capacity - IFNULL(SUM(reservations.places),0)) AS free
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        WHERE (? BETWEEN start_time AND end_time) AND (? BETWEEN start_month AND end_month)
        AND ${conditions.join(` AND `)} GROUP BY beaches.id
        HAVING (capacity + ?) > occupation OR occupation IS NULL`;
      }
    } else {
      const { type, municipality, lifesaving, bar_restaurant } = req.body;
      console.log("buscando según opciones, no se han indicado fecha/nºplazas");

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
