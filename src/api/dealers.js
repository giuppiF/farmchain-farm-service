'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, productService} = options

    router.post('/:farmID/dealer', async (req,res) => {
        try{
            var dealerData = {
                name: req.body.name,
                phone: req.body.phone,
                mail: req.body.mail,
                address: req.body.address,
                image: ''
            }
            var dealer = await repo.addDealer(req.params.farmID,dealerData)
            dealerData._id = dealer._id
            if(req.files.image){
                var image = req.files.image
    
                var filename = Date.now()+ '-' + image.originalFilename
                var pathname = path.join(req.originalUrl, dealer._id.toString())
                var completePathname = path.join(storagePath, pathname)
                var uploadfile = await storageService.saveToDir(image.path, filename, completePathname )
                dealerData.image = path.join(pathname, filename)
            }
            
            var addDealerImage = await repo.updateDealer(req.params.farmID,dealer._id,dealerData) 
            res.status(status.OK).json(addDealerImage)

        }catch (err) {
            res.status(400).json({msg: err.message})
        }

    })

    router.put('/:farmID/dealer/:dealerID', async (req,res) => {

        var dealerData = {
            _id: req.params.dealerID,
            name: req.body.name,
            phone: req.body.phone,
            mail: req.body.mail,
            address: req.body.address
        }
        try{
            if(req.files.image){
                
                var pathname = req.originalUrl
                var completePathname = path.join(storagePath, pathname)
                var dealer = await repo.getDealer(req.params.farmID,req.params.dealerID)
                if(dealer.image)
                    var deleteFile = await storageService.deleteFile(dealer.image,storagePath)            

                var image = req.files.image    
                var filename = Date.now()+ '-' + image.originalFilename
                
                var uploadfile = await storageService.saveToDir(image.path, filename, completePathname )
                dealerData.image = path.join(pathname,filename)
                

            }else{
                dealerData.image=req.body.image
            }

            var farm = await repo.updateDealer(req.params.farmID,req.params.dealerID,dealerData) 

            var updateProductsDealers = farm.products.map( async (product) => {
                try{
                    await productService.updateProductDealer(product._id, dealerData)
                } catch (err) {
                    if(err.message != 404 ){
                        res.status(400).send({'msg' : err.message})
                        return
                    }
                }
                
            })
            Promise.all(updateProductsDealers).then( async ()=>{
                farm ?
                    res.status(status.OK).json(farm)
                :            
                    res.status(404).send()
            })
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    router.delete('/:farmID/dealer/:dealerID', async (req,res) => {
        try{
            var pathname = path.join(storagePath, req.originalUrl)
            var dealer = await repo.getDealer(req.params.farmID,req.params.dealerID)
            if(dealer.image)
                var deleteFile = await storageService.deleteFile(dealer.image,storagePath)  
                var deleteDir = await storageService.deleteDir(pathname)  
            var farm = await repo.deleteDealer(req.params.farmID,req.params.dealerID)
            var deleteProductsDealer = farm.products.map( async (product) => {
                try{
                    await productService.deleteProductDealer(product._id, req.params.dealerID)
                } catch (err) {
                    if(err.message != 404 ){
                        res.status(400).send({'msg' : err})
                        return
                    }
                }
                
            })
            Promise.all(deleteProductsDealer).then( async ()=>{
                farm ?
                    res.status(status.OK).json(farm)
                :            
                    res.status(404).send()
            })
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    return router;
}