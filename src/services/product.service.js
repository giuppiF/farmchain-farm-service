const axios = require('axios')


const productService = (options) => {

    const serviceToken = "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiY2lyY29sb0BsZXR0b3JpLml0IiwiaWQiOiI1Y2RlYzVkNzJjN2UzZTAwMGY0YTk3OGQiLCJmYXJtIjoiNWMwODFiN2ZiNjc4MTcwMDBlMDc4Y2E5IiwiZXhwIjoxNTYzMjg4MTE1LCJpYXQiOjE1NTgxMDQxMTV9.2ZkA0WqRiHt1RDqBrMPDaux-vjkkpVuXOsHcgJ-QA3o"

    const updateProductLot = async (productId,lot) => {
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

    const deleteProductLot = async (productId,lotId) => {
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
    
    const updateProductDealer = async (productId,dealer) => {
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
    const deleteProductDealer = async (productId,dealerId) => {
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


    const updateProductFarm = async (productId,farm) => {
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