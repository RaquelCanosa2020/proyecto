//llamamos al .env:
require("dotenv").config();

//llamamos a los diferentes módulos que necesitamos:
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

//llamamos a los diferentes middlewares y funciones que están en otros js:
const beachExists = require("./middlewares/beachExists");

//Beaches controllers:

const listBeaches = require("./controllers/beach/listBeaches");
const getBeach = require("./controllers/beach/getBeach");
const voteReservation = require("./controllers/reservation/voteReservation");
const getBeachVotes = require("./controllers/beach/getBeachVotes");
const getBeachPhotos = require("./controllers/beach/getBeachPhotos");

//Reservations controllers:

const getReservations = require("./controllers/reservation/getReservations");
const newReservation = require("./controllers/reservation/newReservation");

const app = express();

// Middlewares iniciales

// Log de peticiones a la consola
app.use(morgan("dev"));

// Procesado de body tipo json
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());

/** 🌅ENDPOINTS DE PLAYAS🌅 (obvio las del admin: crear o modificar / borrar playas)*/

// Listar playas, incluidas búsquedas
// GET - /beaches
// Público
app.get("/beaches", listBeaches);

// Mostrar una sola playa
// GET - /beaches/:id
// Público
app.get("/beaches/:id", beachExists, getBeach);
//la media de votos sólo tiene en cuenta la última de cada usuario. PENDIENTE (ahora hace media)

// Ver votos de una playa
// GET - /beaches/:id/votes
// Público
app.get("/beaches/:id/votes", getBeachVotes); //PTE sólo último voto de cada usuario

// Ver fotos de una playa
// GET - /beaches/:id/photos
// Público
app.get("/beaches/:id/photos", getBeachPhotos);

/** ⌚ENDPOINTS DE RESERVAS⌚*/

// Ver reservas de un usuario (id usuario)
// GET - /reservations/:id
// Sólo usuarios registrados, el autor o admin--PENDIENTE
app.get("/reservations/:id", getReservations);

// Crear una nueva reserva (id usuario)
// POST - /reservations/:id
// Sólo usuarios registrados --PENDIENTE
app.post("/reservations/:id", beachExists, newReservation);

//Votar una reserva
// POST - /reservations/:id/votes
// Sólo usuarios registrados --PENDIENTE
app.post("/reservations/:id/votes", voteReservation); //pte comprobación usuario y que existe reserva

// Error middleware
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// Not found
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port} 🌀`);
});
