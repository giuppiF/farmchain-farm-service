'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, productService, auth} = options

    router.post('/:farmID/lot', auth.required,auth.isFarmAdmin,  async (req,res) => {
        try{
            var lotData = {
                name: req.body.name,
                description: req.body.description
            }
            var lot = await repo.addLot(req.params.farmID,lotData)
            lotData._id = lot._id
            if(req.files.image){
                var image = req.files.image
    
                var filename = Date.now()+ '-' + image.originalFilename
                var pathname = path.join(req.originalUrl, lot._id.toString())
                var completePath = path.join(storagePath,pathname)
                var uploadfile = await storageService.saveToDir(image.path, filename, completePath )
                lotData.image = path.join(pathname,filename)
            }
            
            var addLotImage = await repo.updateLot(req.params.farmID,lot._id,lotData) 
            res.status(status.OK).json(addLotImage)

        }catch (err) {
            res.status(400).json({msg: err.message})
        }

    })

    router.put('/:farmID/lot/:lotID', auth.required,auth.isFarmAdmin,  async (req,res) => {

        var lotData = {
            _id: req.params.lotID,
            name: req.body.name,
            description: req.body.description
        }
        try{
            if(req.files.image){
                
                var pathname = req.originalUrl
                var completePathname = path.join(storagePath, pathname)
                var lot = await repo.getLot(req.params.farmID,lotData._id)
                if(lot.image)
                    var deleteFile = await storageService.deleteFile(lot.image,storagePath)            

                var image = req.files.image    
                var filename = Date.now()+ '-' + image.originalFilename
                
                var uploadfile = await storageService.saveToDir(image.path, filename, completePathname )
                lotData.image = path.join(pathname,filename)
                

            }else{
                lotData.image=req.body.image
            }

            var farm = await repo.updateLot(req.params.farmID,lotData._id,lotData) 

            var updateProductsLots = farm.products.map( async (product) => {
                try{
                    await productService.updateProductLot(product._id, lotData)
                } catch (err) {
                    if(err.message != 404 ){
                        res.status(400).send({'msg' : err})
                        return
                    }
                }
                
            })
            Promise.all(updateProductsLots).then( async ()=>{
                farm ?
                    res.status(status.OK).json(farm)
                :            
                    res.status(404).send()
            })
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    router.delete('/:farmID/lot/:lotID', auth.required,auth.isFarmAdmin, async (req,res) => {
        try{
            var pathname = path.join(storagePath, req.originalUrl)
            var lot = await repo.getLot(req.params.farmID,req.params.lotID)
            if(lot.image)
                var deleteFile = await storageService.deleteFile(lot.image,storagePath)  
                var deleteDir = await storageService.deleteDir(pathname)  
            var farm = await repo.deleteLot(req.params.farmID,req.params.lotID)

            var deleteProductsLot = farm.products.map( async (product) => {
                try{
                    await productService.deleteProductLot(product._id, req.params.lotID)
                } catch (err) {
                    if(err.message != 404 ){
                        res.status(400).send({'msg' : err})
                        return
                    }
                }
                
            })
            Promise.all(deleteProductsLot).then( async ()=>{
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