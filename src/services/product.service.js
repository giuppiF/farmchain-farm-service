const axios = require('axios')


const productService = (options) => {

    
    const updateProductLot = async (productId,lot,serviceToken) => {
        try{
            const url = `http://${options.host}:${options.port}/product/${productId}/lot/${lot._id}`
            let config = {
                headers: {
                "Content-Type" : "application/json",
                "Authorization" : serviceToken
                }
            }
            var response = await axios.put(url,lot,config)
            return response;
        } catch (err){
            throw  Error(err.response.status)
        }
    }

    const deleteProductLot = async (productId,lotId,serviceToken) => {
        try{
            const url = `http://${options.host}:${options.port}/product/${productId}/lot/${lotId}`
            let config = {
                headers: {
                "Content-Type" : "application/json",
                "Authorization" : serviceToken
                }
            }
            var response = await axios.delete(url,config)
            return response;
        } catch (err){
            throw  Error(err.response.status)
        }
    }
    
    const updateProductDealer = async (productId,dealer,serviceToken) => {
        try{
            const url = `http://${options.host}:${options.port}/product/${productId}/dealer/${dealer._id}`
            let config = {
                headers: {
                "Content-Type" : "application/json",
                "Authorization" : serviceToken
                }
            }
            var response = await axios.put(url,dealer,config)
            return response;
        } catch (err){
            throw  Error(err.response.status)
        }
    }
    const deleteProductDealer = async (productId,dealerId,serviceToken) => {
        try{
            const url = `http://${options.host}:${options.port}/product/${productId}/dealer/${dealerId}`
            let config = {
                headers: {
                "Content-Type" : "application/json",
                "Authorization" : serviceToken
                }
            }
            var response = await axios.delete(url,config)
            return response;
        } catch (err){
            throw  Error(err.response.status)
        }
    }


    const updateProductFarm = async (productId,farm,serviceToken) => {
        try{
            const url = `http://${options.host}:${options.port}/product/${productId}/farm`
            let config = {
                headers: {
                "Content-Type" : "application/json",
                "Authorization" : serviceToken
                }
            }
            var response = await axios.put(url,farm,config)
            return response;
        } catch (err){
            throw  Error(err.response.status)
        }
    }

    return Object.create({
        updateProductLot,
        deleteProductLot,
        updateProductDealer,
        deleteProductDealer,
        updateProductFarm
    })
}

const start = (options) => {
    return new Promise((resolve, reject) => {

      if (!options) {
        reject(new Error('options settings not supplied!'))
      }

      resolve(productService(options))
    })
  }

module.exports = Object.assign({}, {start})