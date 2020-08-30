const { getConnection } = require("../../db");
const { formatDateToDB, generateError } = require("../../helpers");
const { addDays } = require("date-fns");


//Nos da lista de playas según características y/o disponibilidad para una fecha y plazas determinadas.

async function searchBeaches(req, res, next) {
  let connection;

  const { order, direction } = req.query;

  // Proceso la dirección de orden
  const orderDirection =
    (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

  // Proceso el campo de orden
  let orderBy;

  switch (order) {

    case "municipality":
      orderBy = "municipality";
      break;
    case "province":
      orderBy = "province";
      break;
    case "voteAverage":
      orderBy = "voteAverage";
      break;
    case "name":
      orderBy = "name";
      break;
    default:
      orderBy = "id";
  }


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

      const visitUtc = new Date(visit);
      console.log(visit, visitUtc);
      if (visitUtc <= new Date() || visitUtc >= addDays(new Date(), 5)) {
        {
          throw generateError(
            "La fecha no es válida, la fecha de visita debe ser como mínimo hoy y como máximo dentro de 5 días",
            403
          );
        }
      }

      const visitDate = formatDateToDB(visit);
      const visitHour = new Date(visit).getHours();
      const visitMonth = new Date(visit).getMonth() + 1;

      console.log(`hora fecha: ${visitDate}`);
      console.log(`hora: ${visitHour}`);
      console.log(`mes: ${visitMonth}`);


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

        query = `SELECT beaches.id, beaches.name, beaches.municipality, beaches.province, beaches.description, beaches.capacity, 
        beaches.start_time, beaches.end_time, beaches.start_month, beaches.end_month, IFNULL(SUM(reservations.places),0) AS occupation,
        (beaches.capacity - IFNULL(SUM(reservations.places),0)) AS free, beaches.image, ROUND(rating_beaches.voteAverage,1) AS voteAverage
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        LEFT OUTER JOIN rating_beaches ON beaches.id = rating_beaches.id
        WHERE (? BETWEEN start_time AND end_time) AND (? BETWEEN start_month AND end_month) AND active=1
        GROUP BY beaches.id
        HAVING capacity >= occupation + ? OR occupation IS NULL
        ORDER BY ${orderBy} ${orderDirection};`;
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
          conditions.push("beaches.type=?");
          params.push(`${type}`);
        }

        if (municipality) {
          conditions.push("beaches.municipality=?");
          params.push(`${municipality}`);
        }

        if (province) {
          conditions.push("beaches.province=?");
          params.push(`${province}`);
        }

        if (lifesaving) {
          conditions.push("beaches.lifesaving=?");
          params.push(true);
        }

        if (bar_restaurant) {
          conditions.push("beaches.bar_restaurant=?");
          params.push(true);
        }

        if (disabled_access) {
          conditions.push("beaches.disabled_access=?");
          params.push(true);
        }

        if (parking) {
          conditions.push("beaches.parking=?");
          params.push(true);
        }

        if (toilet) {
          conditions.push("beaches.toilet=?");
          params.push(true);
        }
        params.push(`${places}`);

        query = `SELECT beaches.id, beaches.name, beaches.municipality, beaches.province, beaches.description, 
        beaches.capacity, beaches.start_time, beaches.end_time, beaches.start_month, beaches.end_month, 
        IFNULL(SUM(reservations.places),0) AS occupation, (beaches.capacity - IFNULL(SUM(reservations.places),0))
        AS free, beaches.image, ROUND(rating_beaches.voteAverage,1) AS voteAverage
        FROM beaches
        LEFT OUTER JOIN reservations ON beaches.id = reservations.id_beach AND reservations.visit = ?
        LEFT OUTER JOIN rating_beaches ON beaches.id = rating_beaches.id
        WHERE (? BETWEEN start_time AND end_time) AND (? BETWEEN start_month AND end_month)
        AND ${conditions.join(` AND `)} AND active = 1 GROUP BY beaches.id
        HAVING capacity >= occupation + ? OR occupation IS NULL
        ORDER BY ${orderBy} ${orderDirection}`;
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
        console.log("buscando según opciones, no se han indicado fecha/nºplazas");
        //const params = [];
        //const conditions = [];

        if (type) {
          conditions.push("beaches.type=?");
          params.push(`${type}`);
        }

        if (municipality) {
          conditions.push("beaches.municipality=?");
          params.push(`${municipality}`);
        }

        if (province) {
          conditions.push("beaches.province=?");
          params.push(`${province}`);
        }

        if (lifesaving) {
          conditions.push("beaches.lifesaving=?");
          params.push(true);
        }

        if (bar_restaurant) {
          conditions.push("beaches.bar_restaurant=?");
          params.push(true);
        }

        if (disabled_access) {
          conditions.push("beaches.disabled_access=?");
          params.push(true);
        }

        if (parking) {
          conditions.push("beaches.parking=?");
          params.push(true);
        }

        if (toilet) {
          conditions.push("beaches.toilet=?");
          params.push(true);
        }

        query = `SELECT beaches.id, beaches.name, beaches.municipality, beaches.province, beaches.description, beaches.capacity, beaches.start_time,
        beaches.end_time, beaches.start_month, beaches.end_month, beaches.image, ROUND(rating_beaches.voteAverage,1) AS voteAverage from beaches
        LEFT OUTER JOIN rating_beaches ON beaches.id = rating_beaches.id
      WHERE ${conditions.join(` AND `)} AND beaches.active = 1 GROUP BY beaches.id
      ORDER BY ${orderBy} ${orderDirection}`;
      } else {
        console.log("no se han indicado criterios de búsqueda");
        query = `SELECT beaches.id, beaches.name, beaches.municipality, beaches.province,
        beaches.description, beaches.capacity, beaches.start_time, beaches.end_time, beaches.start_month,
        beaches.end_month, beaches.image, ROUND(AVG(ratings.value),1) AS voteAverage
        FROM beaches LEFT JOIN reservations ON beaches.id = reservations.id_beach
        LEFT JOIN ratings ON reservations.id = ratings.id_reservation
        WHERE beaches.active = 1
        GROUP BY beaches.id ORDER BY ${orderBy} ${orderDirection}`
      }

    }

    const [queryResults] = await connection.query(query, params);



    console.log(query, params);
    console.log(req.params);
    console.log(req.body);
    console.log(process.env.SENDGRID_FROM)

    if (queryResults.length === 0) {
      throw generateError("No hay resultados para la búsqueda", 400);

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
