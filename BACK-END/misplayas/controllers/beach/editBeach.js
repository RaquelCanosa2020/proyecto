const { getConnection } = require("../../db");
const {
  processAndSaveImage,
  deleteUpload,
  generateError,
} = require("../../helpers");
const { BeachSchema } = require("../../validators/beachesValidators");

//Editar y cambiar datos de una playa, sólo el administrador.

async function editBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    const { id } = req.params;
    await BeachSchema.validateAsync(req.body);

    // Sacamos los datos
    const {
      name,
      type,
      municipality,
      province,
      description,
      start_time,
      end_time,
      start_month,
      end_month,
      capacity,
      lifesaving,
      bar_restaurant,
      disabled_access,
      parking,
      toilet,
    } = req.body;

    //la comprobación de que es el Admin ya se hace antes en isAdmin.js
    //datos actuales:

    const [current] = await connection.query(
      `
      SELECT id, name, type, municipality, province, description, start_time, end_time, start_month, end_month, capacity,
      lifesaving, bar_restaurant, disabled_access, parking, toilet
      FROM beaches
      WHERE id=?`,
      [id]
    );
    const [currentEntry] = current;
    console.log(currentEntry);
    console.log(req.body);

    let savedImageFileName;

    // Procesar la imagen si existe (como es la foto por defecto de la playa, subida
    //por el administrador, en este caso sólo 1 foto que aparecerá junto a la playa en el
    //listado de playas)

    if (req.files && req.files.image) {
      try {
        // Procesar y guardar imagen
        savedImageFileName = await processAndSaveImage(req.files.image);

        if (currentEntry.image) await deleteUpload(currentEntry.image);
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Inténtalo de nuevo",
          400
        );
      }
    } else {
      savedImageFileName = currentEntry.image;
    }

    // Ejecutar la query de edición de la playa con los nuevos datos:
    await connection.query(
      `
      UPDATE beaches SET name=?, type=?, municipality=?, province=?, description=?, start_time=?, end_time=?, 
      start_month=?, end_month=?, capacity=?, lifesaving=?, bar_restaurant=?, disabled_access=?, parking=?, toilet=?, image=?, lastUpdate=UTC_TIMESTAMP()
      WHERE id=?
    `,
      [
        name,
        type,
        municipality,
        province,
        description,
        start_time,
        end_time,
        start_month,
        end_month,
        capacity,
        lifesaving,
        bar_restaurant,
        disabled_access,
        parking,
        toilet,
        savedImageFileName,
        id,
      ]
    );

    // Devolver resultados
    res.send({
      status: "ok",
      data: `La playa ${currentEntry.name}, nº ${id} ha sido actualizada.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editBeach;
