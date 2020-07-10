const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Valida nueva reserva
const newReservationSchema = Joi.object().keys({
  visit: Joi.any().error(generateError("La fecha es obligatoria", 400)),

  places: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .error(generateError("El campo places debe estar entre 1 y 5", 400)),
  id_beach: Joi.number()
    .integer()
    .error(generateError("El campo id_beach debe ser un número entero", 400)),
  cc_number: Joi.string()
    .creditCard()
    .error(generateError("El número de tarjeta no es válido", 400)),
});

//eEdición de reserva.

const editReservationSchema = Joi.object().keys({
  visit: Joi.any().error(generateError("La fecha es obligatoria", 400)),

  places: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .error(generateError("El campo places debe estar entre 1 y 5", 400)),
  id_beach: Joi.number()
    .integer()
    .error(generateError("El campo id_beach debe ser un número entero", 400)),
});

const payReservationSchema = Joi.object().keys({
  cc_number: Joi.string()
    .creditCard()
    .error(generateError("El número de tarjeta no es válido", 400)),
});

const voteReservationSchema = Joi.object().keys({
  value: Joi.number()
    .min(1)
    .max(5)
    .required()
    .error(
      generateError(
        "El campo voto debe existir y tener un valor entre 1 y 5 (incluídos)",
        400
      )
    ),
});

module.exports = {
  newReservationSchema,
  editReservationSchema,
  payReservationSchema,
  voteReservationSchema,
};
