
//En este archivo tendremos distintas funciones auxiliares necesarias:

//Mödulos usados:
const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");
const crypto = require("crypto"); //módulo nativo. Para crear códigos únicos y seguros para que el usuario active su cuenta.

const sendgrid = require("@sendgrid/mail"); // instalamos esto para enviar mails a usuarios

const { format, addMinutes } = require("date-fns");
const { es } = require("date-fns/locale");

// Definimos directorio de subida de imágenes
const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

//1.A usamos date-fns para dar formato válido para la Base de Datos a las fechas que guardemos:

function formatDateToDB(date) {
  let internal_date;

  if (typeof date === "string") {
    internal_date = new Date(date);
  } else {
    internal_date = date;
  }

  const adjusted_date = addMinutes(
    internal_date,
    internal_date.getTimezoneOffset()
  );

  return format(adjusted_date, "yyyy-MM-dd HH:mm:ss");
}

//1.B usamos date-fns para dar transformar fechas UTC de la BD en locales y formato "amigable" a mostrar al usuario:

function formatDateToUser(date) {
  let dateToUser = `${format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: es,
  })} a las ${format(new Date(date), "p")} horas`;
  return dateToUser;
}
//1.C usamos date-fns para dar transformar fechas UTC en el formato que requiere la api Meteogalicia (en getBeach.js)

function formatNowToMeteo(date) {
  let nowToMeteo = `${format(new Date(date), "yyyy'-'MM'-'dd", {
    locale: es,
  })}T${format(new Date(date), "HH")}:00:00`;
  return nowToMeteo;
}


//2. función para procesar y guardar imágenes:

async function processAndSaveImage(uploadedImage) {
  // Creamos el directorio (con recursive: true por si hay subdirectorios y así no da error)
  await fs.mkdir(imageUploadPath, { recursive: true });

  // Leer la imagen que se subio
  const image = sharp(uploadedImage.data); //uploaded.data es el buffer

  // Saco información de la imagen
  const imageInfo = await image.metadata();

  // Cambiarle el tamaño si es necesario, para no tener fotos excesivamente grandes.
  if (imageInfo.width > 1000) {
    image.resize(1000);
  }

  // Guardar la imagen en el directorio de subidas
  const imageFileName = `${uuid.v4()}.jpg`; //usamos el módulo uuid para darle identificador único
  await image.toFile(path.join(imageUploadPath, imageFileName));

  // Devolver el nombre con el que fue guardada
  return imageFileName;
}

//3. Función para borrar imágenes (cuando se borran fotos de playas):

async function deleteUpload(uploadedImage) {
  await fs.unlink(path.join(imageUploadPath, uploadedImage));
}

//4. creamos función para generar códigos aleatorios que enviaremos
//en el correo electrónico para activación de usuarios:

function randomString(length = 20) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

//Nos devuelve un string de 20 caracteres que enviaremos al usuario y dónde deberá pinchar para activar cuenta.

//5. Función para enviar mails a usuarios:

async function sendMail({ email, title, content }) {
  // Configurar api key de sendgrid
  sendgrid.setApiKey(process.env.SENDGRID_KEY);

  // Configurar mensaje
  const message = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: title,
    text: content,
    html: `
      <div>
        <h1>${title}</h1>
        <p>${content}</p>
      </div>
    `,
  };

  // Enviar mensaje
  await sendgrid.send(message);
}

//6. Para pasar a cero valores null de la BD cuando necesitamos operar con ellos
//(realmente no es necesario, se puede utilizar la función ifnull de sql):

function setZero() {
  return 0;
}

//7. Función de generación de errores:

function generateError(message, code = 500) {
  const error = new Error(message);
  error.httpStatus = code;
  return error;
}

module.exports = {
  formatDateToDB,
  formatDateToUser,
  formatNowToMeteo,
  processAndSaveImage,
  deleteUpload,
  randomString,
  sendMail,
  setZero,
  generateError,
};
