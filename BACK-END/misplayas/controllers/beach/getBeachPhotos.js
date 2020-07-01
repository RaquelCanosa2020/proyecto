const { getConnection } = require("../../db");

async function getBeachPhotos(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    // Ejecutar query para sacar lista de votos
    const [photos] = await connection.query(
      `
      SELECT description, link, date, id_user
      FROM photos
      WHERE id_beach = ?
      ORDER BY date
      `,
      [id]
    );

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
