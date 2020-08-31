const { getConnection } = require("../../db");
const {
  processAndSaveImage,
  formatDateToDB,
  generateError,
} = require("../../helpers");

//para que los usuarios suban fotos de las playas (us. registrado pero no necesario
//que tenga reserva de esa playa)

async function uploadBeachPhotos(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Sacamos los datos
    const { date, description } = req.body;
    const { id } = req.params;
    const id_user = req.auth.id;
    console.log(id);

    //ponemos un máx de 3 fotos por playa y usuario. comprobamos:

    const [images] = await connection.query(
      `
      SELECT id
      FROM photos
      WHERE id_beach=? AND id_user=?
    `,
      [id, id_user]
    );

    if (images.length >= 3) {
      throw generateError(
        "No se pueden subir más de 3 fotos por usuario a esta playa, borra alguna primero",
        406
      );
    }

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
    const [newPhoto] = await connection.query(
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
        "nºfoto": `Se ha guardado tu foto con el nº: ${newPhoto.insertId}`,
        "nombre": savedImageFileName,
        "playa": id,
        "usuario": id_user,
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
