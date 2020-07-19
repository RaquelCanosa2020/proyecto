const { getConnection } = require("../../db");
const { formatDateToDB } = require("../../helpers");

//Nos da lista de playas según características y/o disponibilidad para una fecha y plazas determinadas.

async function searchBeaches(req, res, next) {
  let connection;
  let query;
  const params = [];
  const conditions = [];

  try {
    connection = await getConnection();
    if (req.body.visit) {//A. si usuario indica fecha 
      const {
        type,
        municipality,
        province,
        lifesaving,
        bar_restaurant,
        visit,
        places,
        disabled_access,
        parking,
        toilet,
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

      if (//A.1: usuario sólo indica fecha y personas, sin marcar ninguna opción
        !type &&
        !municipality &&
        !province &&
        !lifesaving &&
        !bar_restaurant &&
        !disabled_access &&
        !parking &&
        !toilet
      ) {
        //Por fecha/hora y no se elige ninguna otra condición:

        params.push(`${places}`);

        query = `SELECT beaches.id, beaches.name, beaches.capacity, beaches.start_time, beaches.end_time, beaches.start_month, beaches.end_month, IFNULL(SUM(reservations.places),0) AS occupation, (beaches.capacity - IFNULL(SUM(reservations.places),0)) AS free
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        WHERE (? BETWEEN start_time AND end_time) AND (? BETWEEN start_month AND end_month) AND active=1
        GROUP BY beaches.id
        HAVING capacity >= occupation + ? OR occupation IS NULL;`;
      }

      //A.2 Por fecha/hora y se elige una o varias condiciones:
      if (
        type ||
        municipality ||
        province ||
        lifesaving ||
        bar_restaurant ||
        disabled_access ||
        parking ||
        toilet
      ) {
        if (type) {
          conditions.push("type=?");
          params.push(`${type}`);
        }

        if (municipality) {
          conditions.push("municipality=?");
          params.push(`${municipality}`);
        }

        if (province) {
          conditions.push("province=?");
          params.push(`${province}`);
        }

        if (lifesaving) {
          conditions.push("lifesaving=?");
          params.push(true);
        }

        if (bar_restaurant) {
          conditions.push("bar_restaurant=?");
          params.push(true);
        }

        if (disabled_access) {
          conditions.push("disabled_access=?");
          params.push(true);
        }

        if (parking) {
          conditions.push("parking=?");
          params.push(true);
        }

        if (toilet) {
          conditions.push("toilet=?");
          params.push(true);
        }
        params.push(`${places}`);

        query = `SELECT beaches.id, beaches.name, beaches.capacity, beaches.start_time, beaches.end_time, beaches.start_month, beaches.end_month, IFNULL(SUM(reservations.places),0) AS occupation, (beaches.capacity - IFNULL(SUM(reservations.places),0)) AS free
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        WHERE (? BETWEEN start_time AND end_time) AND (? BETWEEN start_month AND end_month)
        AND ${conditions.join(` AND `)} AND active=1 GROUP BY beaches.id
        HAVING capacity >= occupation + ? OR occupation IS NULL`;
      }
    } else {//No se indica fecha/personas, se buscan playas por sus características
      const {
        type,
        municipality,
        province,
        lifesaving,
        bar_restaurant,
        disabled_access,
        parking,
        toilet,
      } = req.body;

      console.log("buscando según opciones, no se han indicado fecha/nºplazas");

      if (
        type ||
        municipality ||
        province ||
        lifesaving ||
        bar_restaurant ||
        disabled_access ||
        parking ||
        toilet
      ) {

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

        if (province) {
          conditions.push("province=?");
          params.push(`${province}`);
        }

        if (lifesaving) {
          conditions.push("lifesaving=?");
          params.push(true);
        }

        if (bar_restaurant) {
          conditions.push("bar_restaurant=?");
          params.push(true);
        }

        if (disabled_access) {
          conditions.push("disabled_access=?");
          params.push(true);
        }

        if (parking) {
          conditions.push("parking=?");
          params.push(true);
        }

        if (toilet) {
          conditions.push("toilet=?");
          params.push(true);
        }
      }
      query = `SELECT id, name, capacity, start_time, end_time, start_month, end_month from beaches
      WHERE ${conditions.join(` AND `)} AND active=1`;
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
