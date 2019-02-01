const {dbSettings, serverSettings, uploadServiceSettings, productServiceSettings} = require('./config')
const db = require('./mongo')

module.exports = Object.assign({}, {dbSettings, serverSettings, db, uploadServiceSettings, productServiceSettings})