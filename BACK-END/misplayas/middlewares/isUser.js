const jsonwebtoken = require("jsonwebtoken");
const { getConnection } = require("../db");
const { generateError } = require("../helpers");

async function isUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    // Extraer token de los headers de la petición
    const { authorization } = req.headers;

    if (!authorization) {
      throw generateError("Falta la cabecera de autorización", 401);


    }

    // Comprobar que el token es válido
    // y decodificar el contenido del token
    let tokenInfo;
    try {
      tokenInfo = jsonwebtoken.verify(authorization, process.env.SECRET);
    } catch (error) {
      throw generateError("El token no es válido", 401);

    }

    // Sacamos de la base de datos información de la última vez
    // que el usuario cambió su pass o email
    const [result] = await connection.query(
      `
      SELECT lastAuthUpdate
      FROM users
      WHERE id=?
    `,
      [tokenInfo.id]
    );

    if (result.length === 0) {
      throw generateError("El usuario no existe en la base de datos", 401);

    }

    const tokenCreatedAt = new Date(tokenInfo.iat * 1000);
    const userLastAuthUpdate = new Date(result[0].lastAuthUpdate);

    console.log(`fecha token: ${tokenCreatedAt}`);
    console.log(
      `fecha última actualización email / password: ${userLastAuthUpdate}`
    );

    if (tokenCreatedAt < userLastAuthUpdate) {
      throw generateError(
        "El token ya no es válido. Haz login para conseguir otro", 401
      );

    }

    // Meter ese contenido en el objeto de petición para futuro uso
    req.auth = tokenInfo;

    // Pasar al siguiente middleware
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isUser;
