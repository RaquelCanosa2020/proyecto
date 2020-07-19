const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Valida nueva reserva
const newReservationSchema = Joi.object().keys({
  visit: Joi.any()
    .required()
    .error(generateError("La fecha es obligatoria", 400)),

  places: Joi.number()
    .required()
    .integer()
    .min(1)
    .max(5)
    .error(
      generateError(
        "El campo places es obligatorio y debe estar entre 1 y 5",
        400
      )
    ),
  id_beach: Joi.number()
    .required()
    .integer()
    .error(
      generateError(
        "El campo id_beach es obligatorio y debe ser un número entero",
        400
      )
    ),
  cc_number: Joi.string()
    .required()
    .creditCard()
    .error(
      generateError(
        "No se ha indicado el número de tarjeta o no es un número válido",
        400
      )
    ),
});

//eEdición de reserva.

const editReservationSchema = Joi.object().keys({
  visit: Joi.any()
    .required()
    .error(generateError("La fecha es obligatoria", 400)),

  places: Joi.number()
    .required()
    .integer()
    .min(1)
    .max(5)
    .error(generateError("El campo places debe estar entre 1 y 5", 400)),
  id_beach: Joi.number()
    .integer()
    .required()
    .error(generateError("El campo id_beach debe ser un número entero", 400)),
});

const voteReservationSchema = Joi.object().keys({
  value: Joi.number()
    .min(1)
    .max(5)
    .required()
    .error(
      generateError(
        "El campo value debe existir y tener un valor entre 1 y 5 (incluídos)",
        400
      )
    ),
});

module.exports = {
  newReservationSchema,
  editReservationSchema,
  voteReservationSchema,
};
