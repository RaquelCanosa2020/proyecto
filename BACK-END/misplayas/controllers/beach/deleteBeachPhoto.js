const { getConnection } = require("../../db");
const { generateError, deleteUpload } = require("../../helpers");

//Borrado de fotos que suben usuarios, sólo pueden borrar las suyas.
//no incluye la foto por defecto que aparecerá en el listado principal
//esa la pone la Admin y sólo se puede cambiar editando la playa.

async function deleteBeachPhoto(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id, imageID } = req.params;

    // Seleccionar la foto
    const [current] = await connection.query(
      `
      SELECT id, link, id_user, id_beach
      FROM photos
      WHERE id=? AND id_beach=?
    `,
      [imageID, id]
    );
    console.log(current);
    const [currentPhoto] = current;

    // Comprobar que existe la foto

    if (current.length === 0) {
      throw generateError("La imagen no existe", 404);
    }

    // Comprobar que el usuario puede editar esta foto
    if (current.id_user !== req.auth.id && req.auth.role !== "admin") {
      throw generateError(
        "No tienes permisos para borrar esta fotografía",
        403
      );
    }

    // Borrar la imagen en la base de datos
    await connection.query(
      `
      DELETE FROM photos
      WHERE id=? AND id_beach=?
    `,
      [imageID, id]
    );

    //Borrado del directorio static/uploads
    await deleteUpload(currentPhoto.link);

    res.send({
      status: "ok",
      message: "Imagen borrada",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteBeachPhoto;
