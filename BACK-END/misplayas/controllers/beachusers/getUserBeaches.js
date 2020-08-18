const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

//El usuario puede consultar las playas a las que ha ido:

async function getUserBeaches(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;
    console.log(id);
    console.log(req.auth.id);

    //comprobamos que el usuario se corresponde:

    if (Number(id) !== req.auth.id && req.auth.role !== "admin") {
      throw generateError(
        "No tienes permisos para ver las playas de este usuario",
        403
      );
    }
    //hacemos la consulta, incluyendo fecha de última visita, número de reservas y su valoración media de la playa:
    const [result] = await connection.query(
      `
        SELECT B.id, B.name, B.municipality, B.province, MAX(R.visit) AS lastVisit, COUNT(R.id) AS numberOfReservations, IFNULL(ROUND(AVG(RR.value),1),"sin valoraciones") AS yourAverageRating
        FROM reservations R, beaches B, ratings RR
        WHERE RR.id_reservation = R.id AND R.id_beach = B.id AND R.id_user = ?
        GROUP BY B.id;
    `,
      [id]
    );
    //si no hubiera visitado aún ninguna playa
    if (result.length === 0) {
      throw generateError(`Aún no constan visitas a playas a tu nombre en la base de datos`, 404)
    }

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

module.exports = getUserBeaches;
