//Este js no depende de express. Lo tenemos para resetear la BD cuando hagamos pruebas
//Ojo, que nos borra las tablas que hayamos metido.

require("dotenv").config(); //llamamos al .env

const faker = require("faker/locale/es"); //para introducir datos de prueba
const { getConnection } = require("./db");
const { formatDateToDB } = require("./helpers");
const { random, sample } = require("lodash");
const uuid = require("uuid");
const { add, startOfHour } = require("date-fns");

//axios lo uso para sacar datos de las playas lo más reales posibles
//hago la función replace porque los booleanos me los da en Sí y No, para pasarlos a true/false
const axios = require("axios");

function replace(value) {
  if (value === "Sí") {
    return true;
  } else {
    return false;
  }
}

let connection;

async function main() {
  try {
    // Conseguir conexión a la base de datos
    connection = await getConnection();

    await connection.query(`
  
    
      SET FOREIGN_KEY_CHECKS = 0;`);

    // Borrar las tablas si existen (
    console.log("Borrando tablas");
    await connection.query("DROP TABLE IF EXISTS photos");
    await connection.query("DROP TABLE IF EXISTS ratings");
    await connection.query("DROP TABLE IF EXISTS payments");
    await connection.query("DROP TABLE IF EXISTS reservations");
    //await connection.query("DROP TABLE IF EXISTS beaches");
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
        passwordUpdateCode TINYTEXT,
        lastUpdate DATETIME NOT NULL,
        lastAuthUpdate DATETIME NOT NULL
      );
    `);

    /*await connection.query(`
      CREATE TABLE beaches (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        creation_date DATETIME NOT NULL,
        type VARCHAR(50),
        name VARCHAR(50),
        municipality VARCHAR(50),
        province VARCHAR(50),
        description TEXT,
        start_time INT UNSIGNED,
        end_time INT UNSIGNED,
        start_month INT UNSIGNED,
        end_month INT UNSIGNED,
        capacity INT UNSIGNED,
        lifesaving BOOLEAN,
        bar_restaurant BOOLEAN,
        disabled_access BOOLEAN,
        parking BOOLEAN,
        toilet BOOLEAN,
        image TINYTEXT,
        lastUpdate DATETIME NOT NULL
      );
    `);*/

    await connection.query(`
      CREATE TABLE reservations (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        date DATETIME NOT NULL,
        visit DATETIME NOT NULL,
        places INT NOT NULL,
        id_beach INT UNSIGNED,
        id_user INT UNSIGNED,
        user_name VARCHAR(50),
        total_euros DECIMAL(2,1),
        cc_number TINYTEXT,
        lastUpdate DATETIME NOT NULL,
        FOREIGN KEY (id_beach) REFERENCES beaches (id),
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE
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
        FOREIGN KEY (id_reservation) REFERENCES reservations (id) ON DELETE CASCADE
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
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE
      )
      
    `);

    await connection.query(`
    SET FOREIGN_KEY_CHECKS = 1;`);

    // Meter datos de prueba en las tablas

    //el usuario addor lo metemos manualmente, sin faker, yamunicipality q debemos controlar sus datos
    //y, en especial la contraseña:

    console.log("Creando usuario administrador");

    await connection.query(
      `
      INSERT INTO users(registration_date, email, password, role, name, active, lastUpdate, lastAuthUpdate)
      VALUES(UTC_TIMESTAMP(), "denebolaleo1@gmail.com", SHA2("${process.env.DEFAULT_ADMIN_PASSWORD}", 512), "admin", "Raquel", true, UTC_TIMESTAMP(), UTC_TIMESTAMP())
    `
    );

    console.log("Metiendo datos de prueba en users");
    const users = 10;

    for (let index = 0; index <= users; index++) {
      const email = faker.internet.email();
      const name = faker.name.findName();

      await connection.query(
        `
        INSERT INTO users(registration_date, email, password, role, name, active, lastUpdate, lastAuthUpdate)
        VALUES(UTC_TIMESTAMP(), "${email}", SHA2("${faker.internet.password()}",512), "normal", "${name}", false, UTC_TIMESTAMP(), UTC_TIMESTAMP())
      `
      );
    }
    //lo comento ya que tarda algo en cargar los datos y siempre van a ser las mismas:
    /*console.log("Metiendo datos de prueba en beaches");

    const playas = [
      "Arealonga",
      "Pedra do Sal",
      "Baldaio",
      "Ares",
      "A Lanzada",
    ];

    for (const playa of playas) {
      const response = await axios.get(
        "https://opendata.arcgis.com/datasets/84ddbc8cf4104a579d579f6441fcaa8a_0.geojson"
      );
      const dataKeys = response.data.features;

      const dataPlaya = dataKeys.filter(
        (element) => element.properties.Nombre === playa
      );

      const data = dataPlaya[0].properties;

      const start_time = sample([8, 9]);
      const end_time = sample([21, 22]);
      const start_month = sample([5, 6]);
      const end_month = sample([9, 10]);
      const capacity = sample([200, 300, 20]);

      await connection.query(
        `INSERT INTO beaches(creation_date, name, type, municipality, province, description, start_time, end_time,
          start_month, end_month, capacity, parking, lifesaving, bar_restaurant,
          toilet, disabled_access, lastUpdate)
        VALUES(UTC_TIMESTAMP(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())
      `,
        [
          data.Nombre,
          data.Grado_urba,
          data.Término_Mu,
          data.Provincia,
          data.Descripció,
          start_time,
          end_time,
          start_month,
          end_month,
          capacity,
          replace(data.Aparcamien),
          replace(data.Auxilio_y_),
          replace(data.Establecim),
          replace(data.Aseos),
          replace(data.Acceso_dis),
        ]
      );
    }*/

    console.log("Metiendo datos de prueba en reservations y en ratings");

    const numberOfReservations = 20;

    for (let index = 0; index < numberOfReservations; index++) {
      const date = faker.date.recent(10);

      const visitDate = add(date, { days: 3 });
      const visitHour = startOfHour(visitDate); //para obtener horas en punto.
      const ratingDate = add(visitDate, { days: 2 });

      const formatDate = formatDateToDB(date);
      const formatVisitDate = formatDateToDB(visitHour);
      const formatRatingDate = formatDateToDB(ratingDate);

      await connection.query(`
        INSERT INTO reservations(date, visit, places, id_beach, id_user, lastUpdate)
        VALUES(
          "${formatDate}",
          "${formatVisitDate}", 
          "${random(1, 5)}",
          "${random(1, 5)}",
          "${random(2, users + 1)}",
          UTC_TIMESTAMP());
                 
      `);
      await connection.query(`
      INSERT INTO ratings(value, date, comment, id_reservation, lastUpdate)
      VALUES(
        "${random(1, 5)}",
        "${formatRatingDate}",
        "${faker.lorem.paragraph()}",
        "${index + 1}",
        UTC_TIMESTAMP());
        `);
    }

    console.log("Metiendo datos de prueba en photos");

    const numberOfPhotos = 20;

    for (let index = 0; index < numberOfPhotos; index++) {
      const date = formatDateToDB(faker.date.recent());
      await connection.query(`
        INSERT INTO photos(link, description, date, id_beach, id_user, lastUpdate)
        VALUES (
          "${faker.lorem.sentence(1)}",
          "${faker.lorem.sentence(1)}",
          "${date}",
          "${random(1, 5)}",
          "${random(1, 10)}", 
          UTC_TIMESTAMP())
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
