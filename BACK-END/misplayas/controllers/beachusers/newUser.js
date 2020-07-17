const { getConnection } = require("../../db");
const { randomString, sendMail, generateError } = require("../../helpers");

const { newUserSchema } = require("../../validators/userValidators");

async function newUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await newUserSchema.validateAsync(req.body);

    const { email, password } = req.body;

    // comprobar que no existe un usuario con ese mismo email en la base de datos
    const [existingUser] = await connection.query(
      `
      SELECT id 
      FROM users
      WHERE email=?
    `,
      [email]
    );

    if (existingUser.length > 0) {
      throw generateError(
        "Ya existe un usuario en la base de datos con ese email",
        409
      );
    }

    // enviar un mensaje de confirmación de registro al email indicado

    const registration_code = randomString(40);
    const validationURL = `${process.env.PUBLIC_HOST}/beachusers/validate/${registration_code}`;

    //Enviamos la url anterior por mail
    try {
      await sendMail({
        email,
        title:
          "Valida tu cuenta de usuario en la app de reserva de espacio en playas",
        content: `Para validar tu cuenta de usuario en la app de reserva de espacio en playas haz click aquí: ${validationURL}`,
      });
    } catch (error) {
      throw generateError("Error en el envío de mail", 500);
    }

    // meter el nuevo usuario en la base de datos sin activar
    await connection.query(
      `
      INSERT INTO users(registration_date, email, password, registration_code, lastUpdate, lastAuthUpdate)
      VALUES(UTC_TIMESTAMP, ?, SHA2(?, 512), ?, UTC_TIMESTAMP, UTC_TIMESTAMP)
    `,
      [email, password, registration_code]
    );

    res.send({
      status: "ok",
      message:
        "Usuario registrado. Mira tu email para activarlo. Mira en la carpeta de SPAM si no lo encuentras",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = newUser;
