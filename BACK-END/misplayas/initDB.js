//Este js no depende de express. Lo tenemos para resetear la BD cuando hagamos pruebas
//Ojo, que nos borra las tablas que hayamos metido.

require("dotenv").config(); //llamamos al .env

const faker = require("faker/locale/es"); //para introducir datos de prueba
const { getConnection } = require("./db");
const { formatDateToDB } = require("./helpers");
const { random } = require("lodash");
const uuid = require("uuid");
const { add, startOfHour } = require("date-fns");

let connection;

async function main() {
  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    await connection.query(`
  
    
      SET FOREIGN_KEY_CHECKS = 0;`);

    // Borrar las tablas si existen (diary, diary_votes)
    console.log("Borrando tablas");
    await connection.query("DROP TABLE IF EXISTS photos");
    await connection.query("DROP TABLE IF EXISTS ratings");
    await connection.query("DROP TABLE IF EXISTS payments");
    await connection.query("DROP TABLE IF EXISTS reservations");
    await connection.query("DROP TABLE IF EXISTS beaches");
    await connection.query("DROP TABLE IF EXISTS users");

    // Crear las tablas de nuevo
    console.log("Creando tablas");

    await connection.query(`

      CREATE TABLE users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        registration_date DATETIME NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TINYTEXT NOT NULL,
        role ENUM("normal", "admin") DEFAULT "normal" NOT NULL,
        name TINYTEXT,
        image TINYTEXT,
        active BOOLEAN DEFAULT false,
        registration_code TINYTEXT,
        lastUpdate DATETIME NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE beaches (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        creation_date DATETIME NOT NULL,
        name VARCHAR(50),
        municipality VARCHAR(50),
        description TEXT,
        start_time TIME,
        end_time TIME,
        capacity INT,
        lastUpdate DATETIME NOT NULL
      );
    `);

    await connection.query(`
      CREATE TABLE reservations (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        date DATETIME NOT NULL,
        visit DATETIME NOT NULL,
        places INT NOT NULL,
        id_beach INT UNSIGNED,
        id_user INT UNSIGNED,
        lastUpdate DATETIME NOT NULL,
        FOREIGN KEY (id_beach) REFERENCES beaches (id),
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE SET NULL
      );
    `);

    await connection.query(`
      CREATE TABLE payments (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR (50) UNIQUE NOT NULL,
        payment_datetime DATETIME NOT NULL,
        entity VARCHAR(50),
        user_name VARCHAR(50),
        concept TINYTEXT,
        total_euros DECIMAL(2,1),
        cc_number VARCHAR(50),
        id_reservation INT UNSIGNED,
        lastUpdate DATETIME NOT NULL,
        FOREIGN KEY (id_reservation) REFERENCES reservations (id)
      );
    `);

    await connection.query(`
      CREATE TABLE ratings (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        value FLOAT,
        date DATETIME NOT NULL,
        comment TEXT,
        id_reservation INT UNSIGNED,
        lastUpdate DATETIME NOT NULL,
        FOREIGN KEY (id_reservation) REFERENCES reservations (id)
      )
    `);

    await connection.query(`
      CREATE TABLE photos(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        link VARCHAR(50),
        description TINYTEXT,
        date DATETIME NOT NULL,
        id_user INT UNSIGNED,
        id_beach INT UNSIGNED,
        lastUpdate DATETIME NOT NULL,
        FOREIGN KEY (id_beach) REFERENCES beaches (id),
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE SET NULL
      )
      
    `);

    await connection.query(`
    SET FOREIGN_KEY_CHECKS = 1;`);

    // Meter datos de prueba en las tablas

    //el usuario addor lo metemos manualmente, sin faker, ya q debemos controlar sus datos
    //y, en especial la contraseña:

    console.log("Creando usuario administrador");

    await connection.query(
      `
      INSERT INTO users(registration_date, email, password, role, name, active, lastUpdate)
      VALUES(NOW(), "denebolaleo1@gmail.com", SHA2("${process.env.DEFAULT_ADMIN_PASSWORD}", 512), "admin", "Raquel", true, NOW())
    `
    );

    console.log("Metiendo datos de prueba en users");
    const users = 10;

    for (let index = 0; index <= users; index++) {
      const email = faker.internet.email();
      const name = faker.name.findName();

      await connection.query(
        `
        INSERT INTO users(registration_date, email, password, role, name, active, lastUpdate)
        VALUES(NOW(), "${email}", SHA2("${faker.internet.password()}",512), "normal", "${name}", false, NOW())
      `
      );
    }

    console.log("Metiendo datos de prueba en beaches");
    const beaches = 5;

    for (let index = 0; index < beaches; index++) {
      const playas = ["Barrañán", "Pedra do Sal", "Caión", "Baldaio", "Ares"];
      const municipios = [
        "Carballo",
        "Carballo",
        "A Laracha",
        "Arteixo",
        "Ares",
      ];
      const name = playas[index];
      const municipality = municipios[index];

      await connection.query(
        `
        INSERT INTO beaches(creation_date, name, municipality, description, start_time, end_time, capacity, lastUpdate)
        VALUES(NOW(), "${name}", "${municipality}", "${faker.lorem.paragraph()}", "09:00:00", "22:00:00", 20, NOW())
      `
      );
    }
    //en capacity indico un aforo general de 20 a todas, para hacer pruebas.

    console.log("Metiendo datos de prueba en reservations");

    const numberOfReservations = 20;

    for (let index = 0; index < numberOfReservations; index++) {
      const date = faker.date.recent();
      const visitDate = add(date, { days: 3 });
      const visitHour = startOfHour(visitDate);

      const formatDate = formatDateToDB(date);
      const formatVisitDate = formatDateToDB(visitHour);

      await connection.query(`
        INSERT INTO reservations(date, visit, places, id_beach, id_user, lastUpdate)
        VALUES(
          "${formatDate}",
          "${formatVisitDate}", 
          "${random(1, 5)}",
          "${random(1, 5)}",
          "${random(2, users + 1)}",
          NOW())

          
      `);
    }

    //Añadimos el user_id, referencia al usuario que introduce la entrada. Como número aleatorio entre 2(ya que el 1 es el addor
    //y users+1, si tenemos 10 usuarios en realidad tenemos 11, por la misma razón, el addor es el 1.

    console.log("Metiendo datos de prueba en payments");

    const numberOfPayments = 15;

    for (let index = 0; index < numberOfPayments; index++) {
      const cc = faker.finance.iban();
      const date = formatDateToDB(faker.date.recent());
      await connection.query(`
        INSERT INTO payments(code, payment_datetime, entity, total_euros, cc_number, id_reservation, lastUpdate)
        VALUES (
          "${uuid.v4()}",
          "${date}",
          "Playas de Galicia",
          "3.0", 
          "${cc}",
          "${random(1, 20)}", 
          NOW())
      `);
    }

    console.log("Metiendo datos de prueba en ratings");

    const numberOfRatings = 15;

    for (let index = 0; index < numberOfRatings; index++) {
      const date = formatDateToDB(faker.date.recent());

      await connection.query(`
        INSERT INTO ratings(value, date, comment, id_reservation, lastUpdate)
        VALUES (
          "${random(1, 5)}",
          "${date}",
          "${faker.lorem.paragraph()}",
          "${random(1, 20)}", 
          NOW())
      `);
    }

    console.log("Metiendo datos de prueba en photos");

    const numberOfPhotos = 20;

    for (let index = 0; index < numberOfPhotos; index++) {
      const date = formatDateToDB(faker.date.recent());
      await connection.query(`
        INSERT INTO photos(link, description, date, id_beach, id_user, lastUpdate)
        VALUES (
          "${faker.lorem.sentence(5)}",
          "${faker.lorem.paragraph(1)}",
          "${date}",
          "${random(1, 5)}",
          "${random(1, 10)}", 
          NOW())
      `);
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (connection) connection.release();
    process.exit();
  }
}

main();
