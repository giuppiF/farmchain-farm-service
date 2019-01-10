
const fs = require('fs')
var mkdirp = require('mkdirp');

const storageService = (options) => {

  const storageInit =  (filesDir) => {
    return true
  }


  return Object.create({
    storageInit
  })
}

const start = (options) => {
  return new Promise((resolve, reject) => {

    if (!options) {
      reject(new Error('options settings not supplied!'))
    }

    resolve(storageService(options))
  })
}

module.exports = Object.assign({}, {start})