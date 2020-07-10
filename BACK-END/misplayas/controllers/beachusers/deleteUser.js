const { getConnection } = require("../../db");
const { deleteUpload } = require("../../helpers");

async function deleteUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id } = req.params;

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
      const error = new Error(
        `No existe ningún usuario con id ${id} en la base de datos`
      );
      error.httpStatus = 404;
      throw error;
    }

    if (current[0].image) {
      await deleteUpload(current[0].image);
    }

    //Primero pasamos su id al id 2 de usuario anónimo (sus reservas nos saldrán con este usuario)

    await connection.query(
      `
      UPDATE users id=2
      WHERE id=?
    `,
      [id]
    );

    //Ahora lo borramos (por nombre y email, puesto que su id ya no existe)

    await connection.query(
      `
      DELETE FROM users
      WHERE email=?, name=?
    `,
      [current[0].email, current[0].name]
    );

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
