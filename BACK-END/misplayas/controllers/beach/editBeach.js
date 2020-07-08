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

    // Sacamos los datos
    const {
      name,
      municipality,
      description,
      start_time,
      end_time,
      capacity,
      lifesaving,
      bar_restaurant,
    } = req.body;
    const id_user = req.auth.id;
    const { id } = req.params;

    // Seleccionar datos actuales de la entrada (en FII incluimos user_id)
    const [current] = await connection.query(
      `
    SELECT id, name, municipality, description, start_time, end_time, capacity, lifesaving, bar_restaurant
    FROM beaches
    WHERE id=?
  `,
      [id]
    );

    const [currentEntry] = current;

    //añadimos comprobación de que el usuario que edita es el addor:

    if (req.auth.role !== "admin") {
      const error = new Error("No tienes permisos para editar esta entrada");
      error.httpStatus = 403;
      throw error;
    }

    //console.log(current);

    /* let savedImageFileName;

        // Procesar la imagen si existe
        if (req.files && req.files.image) {
            try {
                // Procesar y guardar imagen nueva
                savedImageFileName = await processAndSaveImage(req.files.image);

                //si hay imagen anterior, borrarla:
                if (currentEntry.image) await deleteUpload(currentEntry.image);
            } catch (error) {
                const imageError = new Error(
                    "No se pudo procesar la imagen. Inténtalo de nuevo"
                );
                imageError.httpStatus = 400;
                throw imageError;
            }
        } else {
            savedImageFileName = currentEntry.image;
        }*/

    // Ejecutar la query de edición de la entrada
    await connection.query(
      `
      UPDATE beaches SET name=?, municipality=?, description=?, start_time=?, end_time=?, capacity, lifesaving=?, bar_restarurant=?, lastUpdate=UTC_TIMESTAMP()
      WHERE id=?
    `,
      [formatDateToDB(date), place, description, savedImageFileName, id]
    );

    // Devolver resultados
    res.send({
      status: "ok",
      data: {
        id,
        date,
        place,
        description,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = editEntry;
