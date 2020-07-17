const { getConnection } = require("../../db");

async function getUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT id, registration_date, email, role, IFNULL(name, "Anónimo") AS name, IFNULL(image, "vacío") AS avatar
      FROM users
      WHERE id=?
    `,
      [id]
    );

    if (result.length === 0) {
      const error = new Error(`El usuario con id ${id} no existe`);
      error.httpStatus = 404;
      throw error;
    }

    const [userData] = result;

    const responseData = {
      registrationDate: userData.registration_date,
      name: userData.name,
      image: userData.avatar,
    };

    if (userData.id === req.auth.id || req.auth.role === "admin") {
      responseData.email = userData.email;
      responseData.role = userData.role;
    }

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
