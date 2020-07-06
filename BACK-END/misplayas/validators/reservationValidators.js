const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");

// Valida nueva entrada en el diario
const newReservationSchema = Joi.object().keys({
  //Joi.date().greater("now"),
  visit_date: Joi.any(),

  visit_hour: Joi.number()
    .integer()
    .min(0)
    .max(23)
    .error(generateError("El campo hour debe ser una hora entre 0 y 23", 400)),
  places: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .error(generateError("El campo places debe estar entre 1 y 5", 400)),
  id_beach: Joi.number()
    .integer()
    .error(generateError("El campo id_beach debe ser un número entero", 400)),
});

/*
const editEntrySchema = Joi.object().keys({
  place: Joi.string()
    .min(3)
    .max(100)
    .required()
    .error(
      generateError(
        "El campo place debe existir y ser mayor de 2 caracteres",
        400
      )
    ),
  description: Joi.string()
    .max(10000)
    .required()
    .error(
      generateError(
        "El campo description debe existir y ser menos de 10000 caracteres",
        400
      )
    ),
  date: Joi.string()
    .required()
    .error(generateError("El campo date debe existir", 400)),
});

const voteEntrySchema = Joi.object().keys({
  vote: Joi.number()
    .min(1)
    .max(5)
    .required()
    .error(
      generateError(
        "El campo voto debe existir y tener un valor entre 1 y 5 (incluídos)",
        400
      )
    ),
});*/

module.exports = {
  newReservationSchema,
  //editEntrySchema,
  //voteEntrySchema,
};
