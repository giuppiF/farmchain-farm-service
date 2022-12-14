'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const config = require('./config')
const mediator = new EventEmitter()
const services = require('./services/')


mediator.on('db.ready', async (db) => {
    console.error('Database started!!')
    var repo = await repository.connect(db); 

    var storageService = await services.storageService.start({
        awsSettings: config.awsSettings
    })

    
    var productService = await services.productService.start({
        host: config.productServiceSettings.host,
        port: config.productServiceSettings.port
    })
    var kafkaService = await services.kafkaService.start({
        kafkaSettings: config.kafkaSettings,
        repo: repo,
    })

    var auth = await config.authConfig.start({
        secret: config.authSettings.JWTSecret,
        repo: repo
    })

    var app = await server.start({
        port:  config.serverSettings.port,
        repo: repo,
        storagePath: config.uploadServiceSettings.path,
        storageService: storageService,
        productService: productService,
        kafkaService: kafkaService,
        auth: auth,
        swaggerOptions: config.swaggerOptions,
    })

    
    app.on('close', () => {
        repo.disconnect()
      })
})

mediator.on('db.error', (err) => {
    console.error('Errore nello start del db '+err)
  })


config.db.connect(config.dbSettings, mediator)


mediator.emit('boot.ready');
