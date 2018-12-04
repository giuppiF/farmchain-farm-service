const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiFarmSchema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().valid('Frutta','Verdura').required()
});

var mongooseFarmSchema = new Mongoose.Schema(Joigoose.convert(joiFarmSchema));

module.exports = Mongoose.model('Farm', mongooseFarmSchema);