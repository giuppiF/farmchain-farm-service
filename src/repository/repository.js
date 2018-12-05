'use strict'
const Farm = require('../models/farm.model')

const repository = () => {
    
  const getAllFarms = () => {
    return new Promise( (resolve, reject) => {
      let farms = Farm.find();
      resolve(farms);
    })
  }

  const getFarm = (id) => {
    return new Promise( (resolve,reject) =>{
      let farm =  Farm.findById(id);
      if(!farm) reject()
      resolve(farm)
    })
  }
  const createFarm = (payload) => {
    return new Promise((resolve, reject) => {
      let farm = new Farm(payload);
      farm.save((err,data) => {
        console.log(err)
        if(err) reject(err)
        resolve(data)
      })
    })
  }

  const updateFarm = (id, farmBody) => {
    return new Promise((resolve,reject) =>{
      let farm = Farm.findByIdAndUpdate(id,farmBody,{new: true});
      if(!farm) reject()
      resolve(farm)
    })
  }

  const deleteFarm = (id) => {
    return new Promise((resolve,reject) =>{
      let farm = Farm.findByIdAndRemove(id);
      if(!farm) reject()
      resolve(farm)
    })
  }

  return Object.create({
    getAllFarms,
    getFarm,
    createFarm,
    updateFarm,
    deleteFarm
  })
}

const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (!connection) {
      reject(new Error('connection db not supplied!'))
    }
    
    resolve(repository(connection))
  })
}

module.exports = Object.assign({}, {connect})
