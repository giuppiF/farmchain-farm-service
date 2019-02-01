const axios = require('axios')


const productService = (options) => {

    const addProductToFarm = async (farmId,product) => {
        try{
            const url = `http://${options.host}:${options.port}/farm/${farmId}/product`
            let config = {
                headers: {
                  "Content-Type" : "application/json",
                }
              }
            var response = await axios.post(url,product,config)
            return response;
        } catch (err){
            throw  Error(err)
        }
    }

    const updateProductLot = async (farmId,productId,lot) => {
        try{
            const url = `http://${options.host}:${options.port}/product/${productId}/lot/${lot._id}`
            let config = {
                headers: {
                "Content-Type" : "application/json",
                }
            }
            var response = await axios.put(url,lot,config)
            return response;
        } catch (err){
            throw  Error(err.response.status)
        }
    }

    const deleteProductToFarm = async (farmId,productId) => {
        try{
            const url = `http://${options.host}:${options.port}/farm/${farmId}/product/${productId}`
            console.log(url)
            let config = {
                headers: {
                "Content-Type" : "application/json",
                }
            }
            var response = await axios.delete(url,config)
            return response;
        } catch (err){
            throw  Error(err)
        }
    }

    return Object.create({
        updateProductLot
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