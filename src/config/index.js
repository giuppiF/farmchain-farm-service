const {dbSettings, serverSettings, uploadServiceSettings} = require('./config')
const db = require('./mongo')

module.exports = Object.assign({}, {dbSettings, serverSettings, db, uploadServiceSettings})