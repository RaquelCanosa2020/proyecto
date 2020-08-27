const { getConnection } = require("../../db");
const { setMinutes, setSeconds } = require("date-fns");
const { formatDateToDB, formatDateToUser, formatNowToMeteo, setZero, generateError } = require("../../helpers");
const axios = require("axios");

async function getBeach(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    //saco el id de params:

    const { id } = req.params;

    console.log("buscando info");

    //hago la consulta a la bd:

    const [result] = await connection.query(
      `
      SELECT beaches.*, ROUND(AVG(ratings.value),1) AS voteAverage
      FROM beaches
      LEFT JOIN reservations ON beaches.id = reservations.id_beach
      LEFT JOIN ratings ON reservations.id = ratings.id_reservation
      WHERE beaches.id=?
    `,
      [id]
    );

    //saco la info que necesito utilizar:
    const startHour = result[0].start_time;
    const endHour = result[0].end_time;
    const startMonth = result[0].start_month;
    const endMonth = result[0].end_month;
    console.log(startHour, endHour, startMonth, endMonth);
    const name = result[0].name;

    //Si el usuario no indica nada en body, se da la disponibilidad en el momento actual
    //PUede incluir una fecha en el body (visit) y se calcula la disponibilidad para esa fecha
    //Definimos las variables a utilizar y que hacen falta de forma global:

    let free;//plazas libres
    let aviso;//aviso si hora o mes no están dentro del establecido
    let visitUser;//fechahora visita en formato para el usuario (local)
    let visitDate;// fechahora visita en formato para la bd (utc)
    let visitMeteo;// fechahora visita en formato para meteogalicia (consulta info tiempo, local)
    let visitHour;// hora visita (local)
    let visitMonth;// mes visita



    if (req.body.visit) {//si el usuario indica una fecha/hora, la proceso:
      const { visit } = req.body;
      visitDate = formatDateToDB(visit);
      visitUser = formatDateToUser(visit); //formato "amable" para la respuesta
      visitHour = new Date(visit).getHours(); //saco la hora de la visita
      visitMonth = new Date(visit).getMonth() + 1; //saco el mes de la visita
      console.log("visit: ", visit);
      console.log(`hora: ${visitHour}, mes: {visitMonth}`);
      console.log(`visitDate ${visitDate}`);
      console.log(`visitDate ${visitUser}`);
      visitMeteo = visit + ":00";
      console.log(`visitmeteo ${visit}`);


    } else {//si no indica una hora, se dá la disponibilidad en el momento actual
      const now = new Date(); //actual en UTC
      const nowZeroMinutes = setMinutes(now, 0);
      const nowZero = setSeconds(nowZeroMinutes, 0); //paso la hora actual a 0 minutos y 0 segundos, para poder comparar con las horas de reserva
      console.log(nowZero);
      visitHour = now.getHours(); //saco la hora de la visita
      visitMonth = now.getMonth() + 1; //saco el mes de la visita
      visitDate = formatDateToDB(nowZero);
      visitUser = formatDateToUser(now);
      visitMeteo = formatNowToMeteo(nowZero);
      console.log(`visitmeteo ${visitMeteo}`);
    }

    //Compruebo que mes y hora están dentro del horario, si no, saldrá un aviso
    //en front ya no deja seleccionar esa horafecha, pero si el usuario consulta fuera de ellos
    //pej, de madrugada, y no incluye una fechahora de visita, saldrá el aviso.

    if (visitMonth < startMonth || visitMonth > endMonth) {
      //compruebo primero el mes
      aviso = "para el mes indicado no es necesario reservar";
    } else {//si el mes es correcto , compruebo la hora:
      if (visitHour < startHour || visitHour > endHour - 1) {
        //si el mes ok compruebo la hora
        aviso =
          "la hora indicada no está dentro del horario de esta playa en los meses que es necesario reservar";
      }
    }
    console.log(`buscando datos de disponibilidad a fecha ${visitDate}`);

    //compruebo la disponibilidad en la playa para "visitDate"

    const [occupation] = await connection.query(
      `
        SELECT SUM(places) AS occupation
        FROM reservations
        WHERE id_beach = ? AND reservations.visit = ?
      `,
      [id, visitDate]
    );

    if (occupation[0].occupation === null) {
      //si no hay ocupación, pasamos null a cero para operar
      setZero(occupation[0].occupation);
    }
    //plazas libres:
    free = Number(result[0].capacity) - Number(occupation[0].occupation);

    console.log(`aforo máximo ${Number(result[0].capacity)}, ocupación: ${Number(occupation[0].occupation)}, plazas: ${free}`)

    //en front el usuario no puede acceder a las playas inactivas:
    if (result[0].active === 0) {
      free = "PLAYA INACTIVA";
      aviso = "playa inactiva en la web de reservas. Pregunte disponibilidad en el correspondiente Ayuntamiento."
    }

    //OBTENEMOS EL PARTE METEOROLÓGICO DE METEOGALICIA

    //Para los nombres con espacios debemos cambiarlos por _, como está en esta api.
    const nameLetters = name.split(" ");
    const nameMeteo = nameLetters.join('_');
    let infoSkyState;
    let temperature;

    //Primero sacamos el identificador de la playa con el nombre:
    try {
      const response = await axios.get(
        "http://servizos.meteogalicia.es/apiv3/findPlaces?types=beach&location=" + `${nameMeteo}` + "&API_KEY=" +
        `${process.env.METEOKEY}`
      );

      const idMeteo = await response.data.features[0].properties.id;

      //Ahora hacemos la solicitud con el identificador y la fecha correspondiente:

      const response1 = await axios.get(
        "http://servizos.meteogalicia.es/apiv3/getNumericForecastInfo?startTime=" + `${visitMeteo}` + "&endTime=" + `${visitMeteo}` + "&locationIds=" +
        `${idMeteo}` +
        "&variables=temperature,sky_state&API_KEY=" +
        `${process.env.METEOKEY}`
      );
      //estado del cielo (icono)
      infoSkyState =
        response1.data.features[0].properties.days[0].variables[0].values[0]
          .iconURL;

      //temperatura:
      temperature =
        response1.data.features[0].properties.days[0].variables[1].values[0]
          .value;

    } catch (error) {
      throw generateError(
        "No se pudo acceder a la información meterorológica",
        400
      );
    }


    res.send({
      status: "ok",
      data: {
        info: result[0],
        disponibilidad: `Disponibilidad fecha ${visitUser}: ${free} plazas`,
        aviso: aviso, //aviso en caso de que hora o mes no se corresponda
        estado: infoSkyState,
        temperatura: temperature

      },
    });
  } catch (error) {
    throw generateError(
      "No se pudo acceder a la información de la playa",
      400
    );
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getBeach;
