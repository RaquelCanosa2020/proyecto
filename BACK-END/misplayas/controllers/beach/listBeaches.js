const { getConnection } = require("../../db");

async function listBeaches(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    // Sacamos las posibles opciones del querystring:
    //  search: para listar solo las entradas que contengan su valor en name o municipality
    //  order: para ordernar el listado por voteAverage, municipality, province o name
    //  direction: para la dirección de la ordenación desc o asc
    const { search, order, direction } = req.query;

    // Proceso la dirección de orden
    const orderDirection =
      (direction && direction.toLowerCase()) === "desc" ? "DESC" : "ASC";

    // Proceso el campo de orden
    let orderBy;
    switch (order) {
      case "voteAverage":
        orderBy = "voteAverage";
        break;
      case "municipality":
        orderBy = "municipality";
        break;
      case "province":
        orderBy = "province";
        break;
      default:
        orderBy = "name";
    }

    // Ejecuto la query en base a si existe querystring de search o no
    let queryResults;

    if (search) {
      queryResults = await connection.query(
        `
        SELECT beaches.id, beaches.name, beaches.municipality, beaches.province, beaches.description, beaches.image, ROUND(AVG(ratings.value),1) AS voteAverage
        FROM beaches LEFT JOIN reservations ON beaches.id = reservations.id_beach
        LEFT JOIN ratings ON reservations.id = ratings.id_reservation
        WHERE active=1 AND (name LIKE ? OR municipality LIKE ?)
        GROUP BY beaches.id
        ORDER BY ${orderBy} ${orderDirection}
        `,
        [`%${search}%`, `%${search}%`]
      );

      if (queryResults[0].length === 0) {
        const error = new Error(`No hay resultados para la búsqueda`);
        error.httpStatus = 400;
        throw error;
      }
    } else {
      queryResults = await connection.query(
        `
        SELECT beaches.id, beaches.name, beaches.municipality, beaches.province, beaches.description, beaches.image, ROUND(AVG(ratings.value),1) AS voteAverage
        FROM beaches LEFT JOIN reservations ON beaches.id = reservations.id_beach
        LEFT JOIN ratings ON reservations.id = ratings.id_reservation
        WHERE beaches.active=1
        GROUP BY beaches.id
        
        ORDER BY ${orderBy} ${orderDirection}`
      );
    }

    // Extraigo los resultados reales del resultado de la query
    const [result] = queryResults;

    // Mando la respuesta
    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = listBeaches;
