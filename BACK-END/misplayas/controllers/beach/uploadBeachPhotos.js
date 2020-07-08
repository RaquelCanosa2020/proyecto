const { getConnection } = require("../../db");
const { processAndSaveImage, formatDateToDB } = require("../../helpers");

async function uploadBeachPhotos(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Sacamos los datos
    const { date, description } = req.body;
    const { id } = req.params;
    const id_user = req.auth.id;
    console.log(id);

    let savedImageFileName;

    // Procesar la imagen si existe
    if (req.files && req.files.image) {
      try {
        // Procesar y guardar imagen nueva
        savedImageFileName = await processAndSaveImage(req.files.image);
      } catch (error) {
        const imageError = new Error(
          "No se pudo procesar la imagen. Inténtalo de nuevo"
        );
        imageError.httpStatus = 400;
        throw imageError;
      }
    } else {
      const notImageError = new Error("No has incluido ninguna imagen");
      notImageError.httpStatus = 400;
      throw notImageError;
    }

    // Ejecutar la query de inserción de la foto:
    await connection.query(
      `

            INSERT INTO photos (link, date, description, id_beach, id_user, lastUpdate)
      VALUES(? ,? ,? ,? ,? , UTC_TIMESTAMP)
    `,
      [savedImageFileName, formatDateToDB(date), description, id, id_user]
    );

    // Devolver resultados
    res.send({
      status: "ok",
      data: {
        id,
        id_user,
        date,
        description,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = uploadBeachPhotos;
