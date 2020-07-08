const { getConnection } = require("../../db");
const { getHours, parseISO, setMinutes, setSeconds } = require("date-fns");

async function searchBeaches(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const {
      type,
      municipality,
      lifesaving,
      bar_restaurant,
      visit,
      places,
    } = req.body;
    let query = `SELECT * from beaches`;
    const params = [];

    if (
      type ||
      municipality ||
      lifesaving ||
      bar_restaurant ||
      visit ||
      places
    ) {
      const conditions = [];

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

      /*if (visit) {
        conditions.push("");
        
        params.push(`${visit}`);
      }*/

      query = `${query} WHERE ${conditions.join(` AND `)}`;
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
