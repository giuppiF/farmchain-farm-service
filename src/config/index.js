const {dbSettings, serverSettings, uploadServiceSettings, productServiceSettings,authSettings,swaggerOptions,awsSettings} = require('./config')
const db = require('./mongo')
const authConfig = require('./auth')

module.exports = Object.assign({}, {dbSettings, serverSettings, db, uploadServiceSettings, productServiceSettings,authSettings,authConfig,swaggerOptions,awsSettings})