'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const config = require('./config')
const mediator = new EventEmitter()


mediator.on('db.ready', async (db) => {
    var repo = await repository.connect(db);
    var app = await server.start({
        port:  config.serverSettings.port,
        repo: repo
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
