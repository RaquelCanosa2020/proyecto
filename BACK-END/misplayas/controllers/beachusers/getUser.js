const { getConnection } = require("../../db");
const { generateError } = require("../../helpers");

async function getUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    if (Number(id) !== req.auth.id || req.auth.role !== "admin") {
      generateError(403, "no autorizado")
    }

    //query para obtener los datos

    const [result] = await connection.query(
      `
      SELECT id, registration_date, email, role, IFNULL(name, "Anónimo") AS name, image, active
      FROM users
      WHERE id=?
    `,
      [id]
    );
    //comprobamos que existe
    if (result.length === 0) {
      throw generateError(`El usuario con id ${id} no existe`, 404)

    }

    const [userData] = result;

    //elaboramos la respuesta con los datos a visualizar

    const responseData = {
      registrationDate: userData.registration_date,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      image: userData.image,
      active: userData.active,
    };
    //si el que consulta es el propio usuario o admin, damos más datos


    res.send({
      status: "ok",
      data: responseData,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getUser;
