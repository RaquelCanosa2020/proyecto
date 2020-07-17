//llamamos al .env:
require("dotenv").config();

//llamamos a los diferentes módulos que necesitamos:
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

//llamamos a los diferentes middlewares y funciones que están en otros js:
const beachExists = require("./middlewares/beachExists");
const isActive = require("./middlewares/isActive");
const reservationExists = require("./middlewares/reservationExists");
const isUser = require("./middlewares/isUser");
const isAdmin = require("./middlewares/isAdmin");

//Beaches controllers:

const listBeaches = require("./controllers/beach/listBeaches");
const getBeach = require("./controllers/beach/getBeach");
const searchBeaches = require("./controllers/beach/searchBeaches");
const getBeachVotes = require("./controllers/beach/getBeachVotes");
const getBeachPhotos = require("./controllers/beach/getBeachPhotos");
const uploadBeachPhotos = require("./controllers/beach/uploadBeachPhotos");
const newBeach = require("./controllers/beach/newBeach");
const editBeach = require("./controllers/beach/editBeach");
const deleteBeachPhoto = require("./controllers/beach/deleteBeachPhoto");
const setBeachStatus = require("./controllers/beach/setBeachStatus");

//Reservations controllers:

const newReservation = require("./controllers/reservation/newReservation");
//const payReservation = require("./controllers/reservation/payReservation");
//quito esto y lo incluyo en el anterior.
const voteReservation = require("./controllers/reservation/voteReservation");
const editReservation = require("./controllers/reservation/editReservation");
const deleteReservation = require("./controllers/reservation/deleteReservation");

//users controllers:

const newUser = require("./controllers/beachusers/newUser");
const validateUser = require("./controllers/beachusers/validateUser");
const loginUser = require("./controllers/beachusers/loginUser");
const getUser = require("./controllers/beachusers/getUser");
const editUser = require("./controllers/beachusers/editUser");
const deleteUser = require("./controllers/beachusers/deleteUser");
const editUserPassword = require("./controllers/beachusers/editUserPassword");
const recoverUserPassword = require("./controllers/beachusers/recoverUserPassword");
const resetUserPassword = require("./controllers/beachusers/resetUserPassword");
const getUserReservations = require("./controllers/beachusers/getUserReservations");
const getUserBeaches = require("./controllers/beachusers/getUserBeaches");

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

/** 🌅ENDPOINTS DE PLAYAS🌅 (obvio DE MOMENTO las del admin: crear o modificar / borrar playas)*/

// Listar playas, incluidas búsquedas por nombre de playa o municipio 🔧//PTE incluir alguna foto?
// Público
app.get("/beaches", listBeaches);

// Buscar playas, buscador avanzado por fecha, plazas y/o opciones 🔧
// Público
app.get("/beaches/search", searchBeaches);

// Mostrar una sola playa 🔧
// GET - /beaches/:id
// Público
app.get("/beaches/:id", beachExists, getBeach);
//Incluye la disponibilidad en este momento o en la fecha que indique el usuario en el body

// Ver votos de una playa 🔧
// GET - /beaches/:id/votes
// Público
app.get("/beaches/:id/votes", beachExists, getBeachVotes);

// Ver fotos de una playa 🔧
// GET - /beaches/:id/photos
// Público
app.get("/beaches/:id/photos", beachExists, getBeachPhotos);

// Subir fotos de una playa por los usuarios 🔧 //
// POST - /beaches/:id/photos
// Sólo usuarios registrados
app.post("/beaches/:id/photos", isUser, beachExists, uploadBeachPhotos);

// Borrar fotos de una playa por los usuarios 🔧 //
// POST - /beaches/:id/photos
// Sólo usuarios registrados, el autor o admin
app.delete(
  "/beaches/:id/photos/:imageID",
  isUser,
  beachExists,
  deleteBeachPhoto
);
// INcluir una playa 🔧
// POST - /beaches
// Sólo administrador
app.post("/beaches", isUser, isAdmin, newBeach);

// Modificar datos de una playa 🔧
// PUT - /beaches
// Sólo administrador
app.put("/beaches/:id", isUser, isAdmin, beachExists, editBeach);

// Activar/inactivar una playa (en vez de borrar) 🔧
// DELETE - /beaches
// Sólo administrador
app.delete("/beaches/:id", isUser, isAdmin, beachExists, setBeachStatus);

/** ⌚ENDPOINTS DE RESERVAS⌚*/

// Crear una nueva reserva para una playa 👣
// POST - /reservations
// Sólo usuarios registrados --PENDIENTE
app.post("/reservations", isUser, isActive, newReservation); //pte isUser

// Confirmar y pagar una reserva 🔧 NO LO VOY A HACER. El usuario paga al hacer reserva
// POST - /reservations/:id
// Sólo usuarios registrados autor --PENDIENTE
////app.post("/reservations/:id", isUser, reservationExists, payReservation);

// Cambiar una reserva (id reserva) 👣
// PUT - /reservations/:id
// Sólo usuarios registrados, el autor o admin --PENDIENTE
app.put(
  "/reservations/:id",
  isUser,
  reservationExists,
  isActive,
  editReservation
); //pte isUser

// Anular una reserva (id reserva) 🔧
// DELETE - /reservations/:id
// Sólo usuarios registrados, el autor o admin --PENDIENTE
app.delete("/reservations/:id", isUser, reservationExists, deleteReservation); //pte isUser

//Votar una reserva 🔧
// POST - /reservations/:id/votes
// Sólo usuarios registrados --PENDIENTE
app.post("/reservations/:id/votes", isUser, reservationExists, voteReservation); //pte isUser

/** 👣ENDPOINTS DE USUARIOS👣**/

// Registro de usuarios 🔧
// POST - /beachusers
// Público
app.post("/beach/users", newUser);

// Validación de usuarios registrados 🔧
// GET - /beachusers/validate/:code
// Público
app.get("/beach/users/validate/:code", validateUser);

// Login de usuarios 🔧
// POST - /beachusers/login
// Público
app.post("/beach/users/login", loginUser);

// Ver información de un usuario 🔧
// GET - /beachusers/:id
// Sólo para usuarios registrados
// Pero si el usuario es el mismo o admin debería mostrar toda la información
app.get("/beach/users/:id", isUser, getUser);

// Editar datos de usuario: email, name, avatar 🔧
// PUT - /beachusers/:id
// Sólo el propio usuario o el usuario admin
app.put("/beach/users/:id", isUser, editUser);

// Borrar un usuario 🔧
// DELETE- /beachusers/:id
// Sólo el usuario admin
app.delete("/beach/users/:id", isUser, isAdmin, deleteUser);

// Editar password de usuario 🔧
// POST - /beachusers/:id/password
// Sólo el propio usuario
app.post("/beach/users/:id/password", isUser, editUserPassword);

// Enviar código de reset de password 🔧
// POST - /beachusers/recover-password
// Público
app.post("/beach/users/recover-password", recoverUserPassword);

// Resetear password de usuario 🔧
// POST - /beachusers/reset-password
// Público
app.post("/beach/users/reset-password", resetUserPassword);

// Ver reservas de un usuario (id usuario) 🔧
// GET - /reservations/:id
// Sólo usuarios registrados, el autor o admin--PENDIENTE
app.get("/beach/users/:id/reservations", isUser, getUserReservations); //

// Ver playas de un usuario (id usuario) 🔧
// GET - /reservations/:id
// Sólo usuarios registrados, el autor o admin--PENDIENTE
app.get("/beach/users/:id/beaches", isUser, getUserBeaches); //

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
