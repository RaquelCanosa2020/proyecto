//llamamos al .env:
require("dotenv").config();

//llamamos a los diferentes módulos que necesitamos:
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require('cors');


//llamamos a los diferentes middlewares complementarios que están en otros js:
const beachExists = require("./middlewares/beachExists");//si existe o no una playa
const isActive = require("./middlewares/isActive");//si la playa está activa o no
const reservationExists = require("./middlewares/reservationExists");//si existe la reserva
const isUser = require("./middlewares/isUser");//si quien hace la petición es usuario registrado
const isAdmin = require("./middlewares/isAdmin");//si quien hace la petición es el administrador.

//Beaches controllers:

const listBeaches = require("./controllers/beach/listBeaches");
const searchBeaches = require("./controllers/beach/searchBeaches");
const getBeach = require("./controllers/beach/getBeach");
const getBeachVotes = require("./controllers/beach/getBeachVotes");
const getBeachPhotos = require("./controllers/beach/getBeachPhotos");
const uploadBeachPhotos = require("./controllers/beach/uploadBeachPhotos");
const newBeach = require("./controllers/beach/newBeach");
const editBeach = require("./controllers/beach/editBeach");
const deleteBeachPhoto = require("./controllers/beach/deleteBeachPhoto");
const setBeachStatus = require("./controllers/beach/setBeachStatus");
const getMunicipalities = require("./controllers/beach/getMunicipalities")
const getMeteo = require("./controllers/beach/meteo")

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
const getUserPhotos = require("./controllers/beachusers/getUserPhotos")
const listUsers = require("./controllers/beachusers/users");

const app = express();


app.use(cors());
app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://servizos.meteogalicia.es");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});



app.use(express.static("static"));

// Middlewares iniciales

// Log de peticiones a la consola
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Procesado de body tipo json
app.use(bodyParser.json());

// Procesado de body tipo form-data
app.use(fileUpload());

/** 🌅ENDPOINTS DE PLAYAS🌅 **/

// Listar playas, incluidas búsquedas por nombre de playa o municipio
// Listado para el administrador
app.get("/beaches", listBeaches);

// Lista de municipios/provincia (para buscador de front)

app.get("/beaches/municipalities", getMunicipalities);

// Buscar playas, buscador avanzado por fecha, plazas y/u opciones
// Público
app.post("/beaches/search", searchBeaches);

// Mostrar una sola playa
// GET - /beaches/:id
// Público
app.post("/beaches/:id/show", beachExists, getBeach);
//Incluye la disponibilidad en este momento o en la fecha que indique el usuario en el body

// Ver votos de una playa
// GET - /beaches/:id/votes
// Público
app.get("/beaches/:id/votes", beachExists, getBeachVotes);

// Ver fotos de una playa
// GET - /beaches/:id/photos
// Público
app.get("/beaches/:id/photos", beachExists, getBeachPhotos);

// Subir fotos de una playa por los usuarios (de una en una, un máximo de 3 usuario y playa)
// POST - /beaches/:id/photos
// Sólo usuarios registrados pero de cualquier playa
app.post("/beaches/:id/photos", isUser, beachExists, uploadBeachPhotos);

// Borrar fotos de una playa por los usuarios
// POST - /beaches/:id/photos
// Sólo usuarios registrados, el autor de la foto o admin
app.delete(
  "/beaches/photos/:imageID",
  isUser,
  deleteBeachPhoto
);
// INcluir una nueva playa
// POST - /beaches
// Sólo administrador
app.post("/beaches", isUser, isAdmin, newBeach);

// Modificar datos de una playa
// PUT - /beaches
// Sólo administrador
app.put("/beaches/:id", isUser, isAdmin, beachExists, editBeach);

// Activar/inactivar una playa (en vez de borrar)
// DELETE - /beaches
// Sólo administrador
app.delete("/beaches/:id", isUser, isAdmin, beachExists, setBeachStatus);

//endpoint de prueba:
app.get("/beach/meteo", getMeteo);

/** ⌚ENDPOINTS DE RESERVAS⌚*/

// Crear una nueva reserva para una playa
// POST - /reservations
// Sólo usuarios registrados
app.post("/reservations", isUser, isActive, newReservation);

// Confirmar y pagar una reserva ❌ ANULADO. El usuario paga al hacer reserva
/***En principio la plaza no estaba ocupada hasta el pago, pero creo que es innecesario
 * El usuario selecciona la playa, va a la pantalla de esa playa y, si la quiere reservar
 * incluye los datos *** */
// POST - /reservations/:id
// Sólo usuarios registrados autor
////app.post("/reservations/:id", isUser, reservationExists, payReservation);

// Cambiar una reserva (id reserva)
// PUT - /reservations/:id
// Sólo usuarios registrados, el autor o admin
app.put(
  "/reservations/:id",
  isUser,
  reservationExists,
  isActive,
  editReservation
); //pte isUser

// Anular una reserva (id reserva)
// DELETE - /reservations/:id
// Sólo usuarios registrados, el autor o admin --PENDIENTE
app.delete("/reservations/:id", isUser, reservationExists, deleteReservation);

//Votar una reserva
// POST - /reservations/:id/votes
// Sólo usuarios registrados --PENDIENTE
app.post("/reservations/:id/votes", isUser, reservationExists, voteReservation);

/** 👣ENDPOINTS DE USUARIOS👣**/

// Registro de usuarios
// POST - /beach/users
// Público
app.post("/beach/users", newUser);

// Validación de usuarios registrados
// GET - /beach/users/validate/:code
// Público
app.get("/beach/users/validate/:code", validateUser);

// Login de usuarios
// POST - /beach/users/login
// Público
app.post("/beach/users/login", loginUser);

// Ver información de un usuario
// GET - /beach/users/:id
// Sólo para usuarios registrados
// Si la info es del usuario que accede o admin muestra toda la información
app.get("/beach/users/:id", isUser, getUser);

// Editar datos de usuario: email, name, avatar
// PUT - /beach/users/:id
// Sólo el propio usuario o el usuario admin
app.put("/beach/users/:id", isUser, editUser);

// Borrar un usuario
// DELETE- /beach/users/:id
// Sólo el usuario admin
app.delete("/beach/users/:id", isUser, isAdmin, deleteUser);

// Editar password de usuario
// POST - /beach/users/:id/password
// Sólo el propio usuario
app.post("/beach/users/:id/password", isUser, editUserPassword);

// Enviar código de reset de password
// POST - /beach/users/recover-password
// Público
app.post("/beach/users/recover-password", recoverUserPassword);

// Resetear password de usuario
// POST - /beach/users/reset-password
// Público
app.post("/beach/users/reset-password", resetUserPassword);

// Ver reservas de un usuario (id usuario)
// GET - /beach/users/:id/reservations
// Sólo usuarios registrados, el autor o admin
app.get("/beach/users/:id/reservations", isUser, getUserReservations); //

// Ver playas de un usuario (id usuario)
// GET - //beach/users/:id/beaches
// Sólo usuarios registrados, el autor o admin
app.get("/beach/users/:id/beaches", isUser, getUserBeaches); //

// Ver fotos de un usuario (id usuario)
// GET - //beach/users/:id/photos
// Sólo usuarios registrados, el autor o admin
app.get("/beach/users/:id/photos", isUser, getUserPhotos); //

// Ver LISTA DE USUARIOS
// GET - //beach/users
// Sólo admin
app.get("/beach/users", isUser, isAdmin, listUsers); //

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



