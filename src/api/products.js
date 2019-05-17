'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, auth} = options

    router.post('/:farmID/product', auth.required,auth.isFarmAdmin, async (req,res, next) => {
        const productData = {
            _id: req.body._id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            updatedAt: req.body.updatedAt,
            status:  req.body.status,
        }
        try{
            var farm = await repo.addProduct(req.params.farmID,productData)
            farm ?
                res.status(status.OK).json(farm)
            :            
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }

    })

    router.put('/:farmID/product/:productID', auth.required,auth.isFarmAdmin, async (req,res) => {
        const productData = {
            _id: req.body._id,
            name: req.body.name,
            image: req.body.image,
            updatedAt: req.body.updatedAt,
            status:  req.body.status,
            category: req.body.category
        } 
        
        try{
            var farm = await repo.updateProduct(req.params.farmID,req.params.productID,productData)
            farm ?
                res.status(status.OK).json(farm)
            :            
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    router.delete('/:farmID/product/:productID', auth.required,auth.isFarmAdmin, async (req,res) => {
        try{
            var farm = await repo.deleteProduct(req.params.farmID,req.params.productID)
            farm ?
                res.status(status.OK).json(farm)
            :            
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })

    return router;
}