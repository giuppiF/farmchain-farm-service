'use strict'
const Farm = require('../models/farm.model')

const repository = () => {
    
  const getAllFarms = async () => {
    try {
      let farms = await Farm.find();
      return farms
    } catch (error) {
      throw Error(error);
    }
  }

  const getFarm = async (id) =>
  {
    try {
      let farm = await Farm.findById(id);
      return farm
    } catch (error){
      throw Error(error);
    }
  }

  const createFarm = async (payload) => {
    try{
      let farm = await new Farm(payload)
      await farm.save()   
      return farm
    } catch (error) {
      throw Error(error)
    }
  }
    
  const updateFarm = async (id, farmBody) => {
    try{
      let farm = await Farm.findByIdAndUpdate(id,farmBody,{new: true,runValidators: true})
      return farm
    } catch (error) {
      throw Error(error)
    }
  }

  const deleteFarm = async (id) => {
    try{
      let farm = await Farm.findByIdAndRemove(id)
      return farm
    } catch (error) {
      throw Error(error)
    }
  }

  const addProduct = async (farmId, product) => {
    try{
      let farm = await Farm.findByIdAndUpdate(farmId,{ $push: { products: product }},{new: true,runValidators: true})
      return farm
    } catch (error) {
      throw Error(error)
    }
  }


  const updateProduct= async (farmId, productId, productData) => {
      try {
        let farm = await Farm.findOneAndUpdate(
          {_id: farmId, "products._id" : productId}, 
          { "products.$" : productData }, 
          { new: true,runValidators: true })
        return farm
      } catch (error){
        throw Error(error)
      }
  }

  const deleteProduct = async (farmId, productId) => {
      try{
        let farm = await Farm.findOneAndUpdate(
          {_id: farmId, "products._id" : productId},
          {$pull: {products: {_id: productId }}},
          { new: true,runValidators: true })
        return farm
      } catch (error){
        throw Error(error)
      }
  }

  const getLot = async (farmId,lotId) =>
  {
    try {
      let farm = await Farm.findById(farmId)
      return farm.lots.id(lotId)
    } catch (error){
      throw Error(error);
    }
  }

  const addLot = async (farmId, lot) => {
    try{
      let farm = await Farm.findByIdAndUpdate(farmId,{ $push: { lots: lot }},{new: true,runValidators: true})
      let farm_udpated = await Farm.findById(farmId)
      let position = farm_udpated.lots.length - 1
      return farm.lots[position]
    } catch (error) {
      throw Error(error)
    }
  }

  const updateLot= async (farmId, lotId, lotData) => {
    try {
      let farm = await Farm.findOneAndUpdate(
        {_id: farmId, "lots._id" : lotId}, 
        { "lots.$" : lotData }, 
        { new: true,runValidators: true })

      return farm
    } catch (error){
      throw Error(error)
    }
  }

  const deleteLot = async (farmId, lotId) => {
    try{
      let farm = await Farm.findOneAndUpdate(
        {_id: farmId, "lots._id" : lotId},
        {$pull: {lots: {_id: lotId }}},
        { new: true,runValidators: true })
      return farm
    } catch (error){
      throw Error(error)
    }
  }


  const getDealer = async (farmId,dealerId) =>
  {
    try {
      let farm = await Farm.findById(farmId)
      return farm.dealers.id(dealerId)
    } catch (error){
      throw Error(error);
    }
  }

  const addDealer = async (farmId, dealer) => {
    try{
      let farm = await Farm.findByIdAndUpdate(farmId,{ $push: { dealers: dealer }},{new: true,runValidators: true})
      let farm_udpated = await Farm.findById(farmId)
      let position = farm_udpated.dealers.length - 1
      return farm.dealers[position]
    } catch (error) {
      throw Error(error)
    }
  }

  const updateDealer= async (farmId, dealerId, dealerData) => {
    try {
      let farm = await Farm.findOneAndUpdate(
        {_id: farmId, "dealers._id" : dealerId}, 
        { "dealers.$" : dealerData }, 
        { new: true,runValidators: true })

      return farm
    } catch (error){
      throw Error(error)
    }
  }

  const deleteDealer = async (farmId, dealerId) => {
    try{
      let farm = await Farm.findOneAndUpdate(
        {_id: farmId, "dealers._id" : dealerId},
        {$pull: {dealers: {_id: dealerId }}},
        { new: true,runValidators: true })
      return farm
    } catch (error){
      throw Error(error)
    }
  }


  return Object.create({
    getAllFarms,
    getFarm,
    createFarm,
    updateFarm,
    deleteFarm,
    addProduct,
    updateProduct,
    deleteProduct,
    getLot,
    addLot,
    updateLot,
    deleteLot,
    getDealer,
    addDealer,
    updateDealer,
    deleteDealer
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
