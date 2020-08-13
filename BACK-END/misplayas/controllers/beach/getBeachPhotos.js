const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getBeachPhotos(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    // Ejecutar query para sacar lista de fotos
    const [photos] = await connection.query(
      `
      SELECT P.id, P.description, P.link, P.date, (IFNULL(U.name,"ANÓNIMO")) AS name
      FROM photos P, users U
      WHERE U.id = P.id_user AND P.id_beach = ?
      ORDER BY date DESC
      `,
      [id]
    );
    if (photos.length === 0) {
      throw generateError(
        "Todavía no hay ninguna foto de esta playa subida por los usuarios ",
        404
      );
    }

    res.send({
      status: "ok",
      data: photos,
    });

    // devolver la lista en la respuesta
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeachPhotos;
