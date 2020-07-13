const { getConnection } = require("../../db");
const {
  processAndSaveImage,
  formatDateToDB,
  deleteUpload,
} = require("../../helpers");

async function editBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;

    // Sacamos los datos
    const {
      name,
      municipality,
      description,
      start_time,
      end_time,
      start_month,
      end_month,
      capacity,
      lifesaving,
      bar_restaurant,
    } = req.body;

    //la comprobación de que es el Admin ya se hace antes en isAdmin.js

    // Ejecutar la query de edición de la entrada
    await connection.query(
      `
      UPDATE beaches SET name=?, municipality=?, description=?, start_time=?, end_time=?, capacity, lifesaving=?, bar_restarurant=?, image, lastUpdate=UTC_TIMESTAMP()
      WHERE id=?
    `,
      [
        name,
        municipality,
        description,
        start_time,
        end_time,
        start_month,
        end_month,
        capacity,
        lifesaving,
        bar_restaurant,
      ]
    );

    // Devolver resultados
    res.send({
      status: "ok",
      data: `La playa ${name}, nº ${id} ha sido actualizada.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editBeach;
