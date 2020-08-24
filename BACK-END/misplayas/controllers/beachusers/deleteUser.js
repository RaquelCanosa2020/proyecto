const { getConnection } = require("../../db");
const { deleteUpload, generateError } = require("../../helpers");

//Borrado de usuarios sólo por admin. Se borrarán sus reservas, votos y fotos
//

async function deleteUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id } = req.params;

    //compruebo identidad admin, en isAdmin.js

    // Compruebo que existe el usuario
    const [current] = await connection.query(
      `
      SELECT id, image, email, name
      FROM users
      WHERE id=?
    `,
      [id]
    );

    if (current.length === 0) {
      throw generateError(`No existe ningún usuario con id ${id} en la base de datos`, 404)

    }

    if (id === '1') {
      throw generateError(`No se puede eliminar al administrador`, 403)

    }
    const [currentAvatar] = current;

    //Borramos su imagen en uploads, si la había
    console.log(currentAvatar.image)

    if (current[0].image) {
      await deleteUpload(currentAvatar.image);
    }


    //Ahora lo borramos. Se borran todos sus registros (on delete cascade en la BD)

    await connection.query(`
    DELETE FROM users
    WHERE id=?
    `, [id])

    res.send({
      status: "ok",
      message: `El usuario con id ${id} fue borrado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = deleteUser;
