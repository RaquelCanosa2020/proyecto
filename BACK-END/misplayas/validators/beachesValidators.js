const Joi = require("@hapi/joi");
const { generateError } = require("../helpers");
const { toPlainObject } = require("lodash");

// Valida CAMBIOS PLAYA

const BeachSchema = Joi.object().keys({
  name: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        "El campo name debe existir y ser mayor de 2 caracteres",
        400
      )
    ),
  type: Joi.string()
    .max(100)
    .error(generateError("El campo type debe ser mayor de 2 caracteres", 400)),
  municipality: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        "El campo municipality debe existir y ser mayor de 2 caracteres",
        400
      )
    ),

  province: Joi.string()
    .max(100)
    .required()
    .error(
      generateError(
        "El campo province debe existir y ser mayor de 2 caracteres",
        400
      )
    ),
  description: Joi.string().max(10000).required(),

  start_time: Joi.number()
    .integer()
    .min(0)
    .max(23)
    .required()
    .error(generateError("El campo start_time debe estar entre 0 y 23", 400)),

  end_time: Joi.number()
    .integer()
    .min(0)
    .max(23)
    .required()
    .error(generateError("El campo start_time debe estar entre 0 y 23", 400)),
  start_month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required()
    .error(
      generateError("El campo start_month debe ser un número entre 1 y 12", 400)
    ),
  end_month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required()
    .error(
      generateError("El campo end_month debe ser un número entre 1 y 12", 400)
    ),
  capacity: Joi.number()
    .integer()
    .min(1)
    .required()
    .error(generateError("El campo capacity debe ser un número entero", 400)),
  lifesaving: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .error(
      generateError("El campo lifesaving debe ser 1(true) o 0(false)", 400)
    ),
  bar_restaurant: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .error(
      generateError("El campo bar_restaurant debe ser 1(true) o 0(false)", 400)
    ),
  disabled_access: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .error(
      generateError("El campo disabled_access debe ser 1(true) o 0(false)", 400)
    ),
  parking: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .error(generateError("El campo parking debe ser 1(true) o 0(false)", 400)),
  toilet: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .error(generateError("El campo toilet debe ser 1(true) o 0(false)", 400)),
});

module.exports = {
  BeachSchema,
};
