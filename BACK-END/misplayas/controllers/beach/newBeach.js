const { getConnection } = require("../../db");
const {
  processAndSaveImage,
  formatDateToDB,
  deleteUpload,
  generateError,
} = require("../../helpers");
const { BeachSchema } = require("../../validators/beachesValidators");

//Editar y cambiar datos de una playa, sólo el administrador.

async function newBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    console.log(req.body);

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
    //comprobar que no hay otra playa con mismo nombre/municipio:

    const [current] = await connection.query(
      `
      SELECT id, name, municipality
      FROM beaches
      WHERE name=? AND municipality=?`,
      [req.body.name, req.body.municipality]
    );
    if (current[0] !== 0) {
      generateError(
        "Ya hay una playa con el mismo nombre en ese municipio",
        409
      );
    }

    // Procesar la imagen si existe (como es la foto por defecto de la playa, subida
    //por el administrador, en este caso sólo 1 foto que aparecerá junto a la playa en el
    //listado de playas)

    let savedImageFileName;

    if (req.files && req.files.image) {
      try {
        // Procesar y guardar imagen
        savedImageFileName = await processAndSaveImage(req.files.image);
      } catch (error) {
        throw generateError(
          "No se pudo procesar la imagen. Inténtalo de nuevo",
          400
        );
      }
    }

    // Ejecutar la query de inserción de la playa con lsus datos:
    const [newBeach] = await connection.query(
      `
       INSERT INTO beaches (creation_date, name, type, municipality, province, description, start_time, end_time, start_month, end_month,
        capacity, lifesaving, bar_restaurant, disabled_access, parking, toilet, image, lastUpdate)
        VALUES(UTC_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())
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
      ]
    );

    // Devolver resultados
    res.send({
      status: "ok",
      data: `La playa ${name}, ha sido creada con el nº ${newBeach.insertId}.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newBeach;
