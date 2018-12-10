const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');

var joiProductSchema = Joi.object().keys({
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    name: Joi.string(),
    image: Joi.string(),
    category: Joi.string().valid("Frutta","Verdura"),
    updatedAt: Joi.date(),
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

const joiLotSchema = Joi.object().keys({
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
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
    logo: Joi.string(),
    websiteURL: Joi.string(),
    description: Joi.string(),
    dealers: Joi.array().items(joiDealerSchema),
    products: Joi.array().items(joiProductSchema),
    users: Joi.array().items(joiUserSchema),
    lots: Joi.array().items(joiLotSchema),
    siteBuilder: joiWebSiteSchema,
    advs: Joi.array().items(joiAdvSchema),
});

var mongooseFarmSchema = new Mongoose.Schema(Joigoose.convert(joiFarmSchema));


module.exports = Mongoose.model('Farm', mongooseFarmSchema);