const storageService = require('./storage.service')
const productService = require('./product.service')
const kafkaService = require('./kafka.service')
module.exports = Object.assign({}, {storageService, productService,kafkaService})
