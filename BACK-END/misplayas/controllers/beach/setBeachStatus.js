const { getConnection } = require("../../db");
const { deleteUpload } = require("../../helpers");

async function setBeachStatus(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id } = req.params;

    //comprobación de que es admin en isAdmin.js

    //comprobación de que exite en beachExists.js

    //Planteo que, en vez de borrar la playa, siga en la base de datos, pero que los usuarios no la
    //puedan elegir en los buscadores, la paso a inactiva:

    const [currentStatus] = await connection.query(
      `SELECT active
      FROM beaches
     WHERE id=?
    `,
      [id]
    );
    console.log(currentStatus[0].active);
    if (currentStatus[0].active === 1) {
      await connection.query(
        `
      UPDATE beaches SET active = 0
      WHERE id=?
    `,
        [id]
      );
    }

    if (currentStatus[0].active === 0) {
      await connection.query(
        `
      UPDATE beaches SET active = 1
      WHERE id=?
    `,
        [id]
      );
    }

    const [newStatus] = await connection.query(
      `
      SELECT active
      FROM beaches
      where ID=?
      `,
      [id]
    );

    const estado = newStatus[0].active;

    res.send({
      status: "ok",
      message: `La Playa id ${id} ha cambiado de status. Ahora se encuentra ${
        estado === 1 ? "Activa" : "Inactiva"
      }`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = setBeachStatus;
