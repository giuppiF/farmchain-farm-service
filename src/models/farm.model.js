const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose);
const Joi = require('joi');
  /**
   * @swagger
   * components:
   *  schemas:
   *   FarmProduct:
   *     properties:
   *       _id:
   *         name: _id
   *         description: Product's id
   *         in: formData
   *         required: true
   *         type: string
   *         example: 5c56d37fd7123300b6462ed6
   *       name:
   *         name: name
   *         description: Product's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: La Fragola
   *       image:
   *         name: image
   *         description: Product's image storage path
   *         in: formData
   *         required: true
   *         type: string
   *         example: /product/5c56d364d7123300b6462ed5/1549194089941-logo_farmchain.JPG
   *       category:
   *         name: category
   *         description: Product's category
   *         in: formData
   *         required: true
   *         type: string
   *         enum: [Frutta, Verdura]
   *         example: Frutta
   *       updatedAt:
   *         name: updatedAt
   *         description: Product's udate timestamp
   *         in: formData
   *         required: false
   *         type: string
   *         example: 2019-02-03T11:41:51.133Z
   *       status:
   *         name: status
   *         description: Product's status
   *         in: formData
   *         required: false
   *         type: string
   *         enum: [In Progress, Completed]
   */
 
var joiProductSchema = Joi.object().keys({
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    name: Joi.string(),
    image: Joi.string(),
    category: Joi.string().valid("Frutta","Verdura"),
    updatedAt: Joi.date(),
    status:  Joi.string(),
});

 /**
   * @swagger
   * components:
   *  schemas:
   *   FarmDealer:
   *     properties:
   *       name:
   *         name: name
   *         description: Dealer's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: Il bel distributore
   *       address:
   *         name: address
   *         description: Dealer's address
   *         in: formData
   *         required: true
   *         type: string
   *         example: Via Roma 10 - 10100  Torino
   *       mail:
   *         name: mail
   *         description: Dealer's mail
   *         in: formData
   *         required: true
   *         type: string
   *         format: email
   *         example: mail@mail.it
   *       phone:
   *         name: phone
   *         description: Dealer's phone
   *         in: formData
   *         required: true
   *         type: string
   *         example: 333 1223321
   *       image:
   *         name: image
   *         description: Dealer's logo
   *         in: formData
   *         required: false
   *         type: string
   *         format: binary
   *       site:
   *         name: site
   *         description: Dealer's website URL
   *         in: formData
   *         required: false
   *         type: string
   */
 

var joiDealerSchema = Joi.object().keys({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string().allow(''),
    mail: Joi.string().allow(''),
    site: Joi.string().allow(''),
    image:  Joi.string(),
});

 /**
   * @swagger
   * components:
   *  schemas:
   *   FarmUser:
   *     properties:
   *       mail:
   *         name: mail
   *         description: User's mail
   *         in: formData
   *         required: true
   *         type: string
   *         format: email
   *         example: mail@mail.it
   */
var joiUserSchema = Joi.object().keys({
    mail: Joi.string().email(),
});
 /**
   * @swagger
   * components:
   *  schemas:
   *   FarmWebSite:
   *     properties:
   *       isActive:
   *         name: isActive
   *         description: Boolean for site builder activation
   *         in: formData
   *         required: true
   *         type: boolean
   *         example: true
   *       content:
   *         name: content
   *         description: Site builder content
   *         in: formData
   *         required: true
   *         type: object
   *         properties:
   *            title:
   *                name: title
   *                description: Site title
   *                in: formData
   *                required: false
   *                type: string
   *            description:
   *                name: description
   *                description: Site description
   *                in: formData
   *                required: false
   *                type: string
   *            image:
   *                name: image
   *                description: Site image
   *                in: formData
   *                required: false
   *                type: string
   *                format: binary
   *            
   */
const joiWebSiteSchema = Joi.object().keys({
    isActive: Joi.boolean().default(false),
    content: Joi.object()
        .keys({
            title: Joi.string(),
            description: Joi.string(),
            image: Joi.string(),
        })
})

 /**
   * @swagger
   * components:
   *  schemas:
   *   FarmLot:
   *     properties:
   *       name:
   *           name: name
   *           description: Lot's name
   *           in: formData
   *           required: true
   *           type: string
   *           example: Lotto
   *       description:
   *           name: description
   *           description: Lot's description
   *           in: formData
   *           required: false
   *           type: string
   *       image:
   *           name: image
   *           description: Lot's image
   *           in: formData
   *           required: false
   *           type: string
   *           format: binary
   */

const joiLotSchema = Joi.object().keys({
    name: Joi.string(),
    image:  Joi.string(),
    description: Joi.string(),
})


 /**
   * @swagger
   * components:
   *  schemas:
   *   FarmAdvs:
   *     properties:
   *       products:
   *         name: content
   *         description: Farm 
   *         in: formData
   *         required: true
   *         type: object
   *         properties:
   *            id:
   *                name: id
   *                description: Product's id
   *                in: formData
   *                required: false
   *                type: string
   */

const joiAdvSchema = Joi.object().keys({
    products: Joi.array().items({
        id: Joi.string()
    }),
    templateType: Joi.number()
})
 /**
   * @swagger
   * components:
   *  schemas:
   *   Farm:
   *     required:
   *        - name
   *        - address
   *        - mail
   *        - phone
   *     properties:
   *       name:
   *         name: name
   *         description: Farm's name
   *         in: formData
   *         required: true
   *         type: string
   *         example: La bella Fattoria
   *       address:
   *         name: address
   *         description: Farm's address
   *         in: formData
   *         required: true
   *         type: string
   *         example: Via Roma 10 - 10100  Torino
   *       mail:
   *         name: mail
   *         description: Farm's mail
   *         in: formData
   *         required: true
   *         type: string
   *         format: email
   *         example: mail@mail.it
   *       phone:
   *         name: phone
   *         description: Farm's phone
   *         in: formData
   *         required: true
   *         type: string
   *         example: 333 1223321
   *       logo:
   *         name: logo
   *         description: Farm's logo
   *         in: formData
   *         required: false
   *         type: string
   *         format: binary
   *       websiteURL:
   *         name: websiteURL
   *         description: Farm's website URL
   *         in: formData
   *         required: false
   *         type: string
   *       description:
   *         name: description
   *         description: Farm's description
   *         in: formData
   *         required: false
   *         type: string
   *       dealers:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/FarmDealer'
   *       products:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/FarmProduct'
   *       lots:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/FarmLot'
   *       users:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/FarmUser'
   *       siteBuilder:
   *         type: object
   *         schema:
   *            $ref: '#/components/schemas/FarmWebSite'
   *       advs:
   *         type: array
   *         items:
   *         $ref: '#/components/schemas/FarmAdvs'
   */
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