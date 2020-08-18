//Este js no depende de express. Lo tenemos para resetear la BD cuando hagamos pruebas

require("dotenv").config(); //llamamos al .env

const faker = require("faker/locale/es"); //para introducir datos de prueba
const { getConnection } = require("./db");
const { formatDateToDB } = require("./helpers");
const { random, sample } = require("lodash");
const uuid = require("uuid");
const { add, startOfHour } = require("date-fns");

//axios lo uso para sacar datos de las playas
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
    //Desactivo primero las foreign keys para que no me de errores.

    // Borrar las tablas si existen (no borro ni acutalizo las playas pq tarda un par de minutos)
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
        name VARCHAR(50) NOT NULL,
        municipality VARCHAR(50) NOT NULL,
        province VARCHAR(50) NOT NULL,
        description TEXT,
        start_time INT UNSIGNED NOT NULL,
        end_time INT UNSIGNED NOT NULL,
        start_month INT UNSIGNED NOT NULL,
        end_month INT UNSIGNED NOT NULL,
        capacity INT UNSIGNED NOT NULL,
        lifesaving BOOLEAN DEFAULT FALSE,
        bar_restaurant BOOLEAN DEFAULT FALSE,
        disabled_access BOOLEAN DEFAULT FALSE,
        parking BOOLEAN DEFAULT FALSE,
        toilet BOOLEAN DEFAULT FALSE,
        image TINYTEXT,
        active BOOLEAN DEFAULT TRUE,
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
        description TEXT,
        date DATETIME NOT NULL,
        id_user INT UNSIGNED,
        id_beach INT UNSIGNED,
        lastUpdate DATETIME NOT NULL,
        FOREIGN KEY (id_beach) REFERENCES beaches (id),
        FOREIGN KEY (id_user) REFERENCES users (id) ON DELETE CASCADE
      )
      
    `);
    //una vez creadas las tablas, vuelvo a activar las FK:
    await connection.query(`
    SET FOREIGN_KEY_CHECKS = 1;`);

    // Meter datos de prueba en las tablas

    //el usuario addor lo metemos manualmente;

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
    //tarda un par de minutos:
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
            toilet, disabled_access, active, lastUpdate)
          VALUES(UTC_TIMESTAMP(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, UTC_TIMESTAMP())
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
          replace(data.Acceso_dis)
        ]
      );
    }*/

    console.log("Metiendo datos de prueba en reservations y en ratings");
    //incluyo las dos tablas a la vez para que me cuadren las fechas (fecha de valoración
    // > a fecha de visita.)

    const numberOfReservations = 20;

    for (let index = 0; index < numberOfReservations; index++) {
      const date = faker.date.recent(10);



      const visitDate = add(date, { days: 3 });
      const visitHour = startOfHour(visitDate); //para obtener horas en punto.
      const ratingDate = add(visitDate, { days: 2 });

      const formatDate = formatDateToDB(date);
      const formatVisitDate = formatDateToDB(visitHour);
      const formatRatingDate = formatDateToDB(ratingDate);
      const id_user = random(2, users + 1)
      const [user] = await connection.query(`
      SELECT name
      FROM users
      WHERE id =?`, [id_user]);
      const user_name = user[0].name

      await connection.query(`
          INSERT INTO reservations(date, visit, places, id_beach, id_user, user_name, total_euros, cc_number,lastUpdate)
          VALUES(
            "${formatDate}",
            "${formatVisitDate}", 
            "${random(1, 5)}",
            "${random(1, 5)}",
            "${id_user}",
            "${user_name}",
            3,
            "${faker.finance.account(16)}",
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


    /*console.log("Metiendo datos de prueba en photos");

    //Al incluir una ruta ficticia que no está en la carpeta, no se puede llegar
    //al punto final de borrar la foto de la carpeta. Prefiero subir algunas de prueba manualmente
    //de paso que pruebo el endpoint de subir fotos.
 
     const numberOfPhotos = 20;
 
     for (let index = 0; index < numberOfPhotos; index++) {
       const date = formatDateToDB(faker.date.recent());
       const link = uuid.v4();
       await connection.query(`
         INSERT INTO photos(link, description, date, id_beach, id_user, lastUpdate)
         VALUES (
           "${link}",
           "${faker.lorem.sentence(1)}",
           "${date}",
           "${random(1, 5)}",
           "${random(1, 10)}", 
           UTC_TIMESTAMP())
       `);
     }*/
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (connection) connection.release();
    process.exit();
  }
}

main();
