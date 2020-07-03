//llamamos al .env:
require("dotenv").config();

//llamamos a los diferentes módulos que necesitamos:
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

//llamamos a los diferentes middlewares y funciones que están en otros js:
const beachExists = require("./middlewares/beachExists");
const reservationExists = require("./middlewares/reservationExists");

//Beaches controllers:

const listBeaches = require("./controllers/beach/listBeaches");
const getBeach = require("./controllers/beach/getBeach");
const getBeachVotes = require("./controllers/beach/getBeachVotes");
const getBeachPhotos = require("./controllers/beach/getBeachPhotos");
const uploadBeachPhotos = require("./controllers/beach/uploadBeachPhotos");

//Reservations controllers:

const getReservations = require("./controllers/reservation/getReservations");
const newReservation = require("./controllers/reservation/newReservation");
const payReservation = require("./controllers/reservation/payReservation");
const voteReservation = require("./controllers/reservation/voteReservation");
const editReservation = require("./controllers/reservation/editReservation");
const deleteReservation = require("./controllers/reservation/deleteReservation");

const app = express();

// Middlewares iniciales

// Log de peticiones a la consola
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Procesado de body tipo json
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());

/** 🌅ENDPOINTS DE PLAYAS🌅 (obvio las del admin: crear o modificar / borrar playas)*/

// Listar playas, incluidas búsquedas 🤔//PTE BÚSQUEDAS MÚLTIPLES Y SOLUCIONAR CONSULTA VALORACIÓN
// GET - /beaches
// Público
app.get("/beaches", listBeaches);

// Mostrar una sola playa 🔧
// GET - /beaches/:id
// Público
app.get("/beaches/:id", beachExists, getBeach);
//la media de votos sólo tiene en cuenta la última RESERVA de cada usuario. PENDIENTE (ahora hace media)

// Ver votos de una playa 🔧
// GET - /beaches/:id/votes
// Público
app.get("/beaches/:id/votes", getBeachVotes); //PTE sólo última RESERVA de cada usuario

// Ver fotos de una playa 🔧
// GET - /beaches/:id/photos
// Público
app.get("/beaches/:id/photos", getBeachPhotos);

// Subir fotos de una playa 🔧
// POST - /beaches/:id/photos
// Sólo usuarios registrados
app.post("/beaches/:id/photos", beachExists, uploadBeachPhotos);

/** ⌚ENDPOINTS DE RESERVAS⌚*/

// Ver reservas de un usuario (id usuario) 🔧
// GET - /reservations/:id
// Sólo usuarios registrados, el autor o admin--PENDIENTE
app.get("/reservations/:id", getReservations);

// Crear una nueva reserva 🔧
// POST - /reservations
// Sólo usuarios registrados --PENDIENTE
app.post("/reservations", newReservation);

// Confirmar y pagar una reserva 🔧
// POST - /reservations/:id
// Sólo usuarios registrados autor --PENDIENTE
app.post("/reservations/:id", payReservation);

// Cambiar una reserva (id reserva)
// PUT - /reservations/:id
// Sólo usuarios registrados, el autor o admin --PENDIENTE
app.put("/reservations/:id", reservationExists, editReservation);

// Anular una reserva (id reserva) 🔧
// DELETE - /reservations/:id
// Sólo usuarios registrados, el autor o admin --PENDIENTE
app.delete("/reservations/:id", reservationExists, deleteReservation);

//Votar una reserva 🔧
// POST - /reservations/:id/votes
// Sólo usuarios registrados --PENDIENTE
app.post("/reservations/:id/votes", reservationExists, voteReservation); //pte comprobación usuario y que existe reserva

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
