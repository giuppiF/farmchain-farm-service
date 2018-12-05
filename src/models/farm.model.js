const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiProductSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    lastUpdate: Joi.date(),
    status:  Joi.string(),
});
var joiDealerSchema = Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    mail: Joi.string(),
});

var joiUserSchema = Joi.object().keys({
    mail: Joi.string().email(),
});

const joiWebSiteSchema = Joi.object().keys({
    isActive: Joi.boolean().default(false),
    content: Joi.object()
        .keys({
            title: Joi.string(),
            description: Joi.string(),
            image: Joi.string(),
        })
})

const joiAdvSchema = Joi.object().keys({
    products: Joi.array().items({
        id: Joi.string()
    }),
    templateType: Joi.number()
})

var joiFarmSchema = Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    mail: Joi.string().email().required(),
    phone: Joi.string().required(),
    dealers: Joi.array().items(joiDealerSchema),
    products: Joi.array().items(joiProductSchema),
    users: Joi.array().items(joiUserSchema),
    website: joiWebSiteSchema,
    advs: Joi.array().items(joiAdvSchema),
});

var mongooseFarmSchema = new Mongoose.Schema(Joigoose.convert(joiFarmSchema));


module.exports = Mongoose.model('Farm', mongooseFarmSchema);