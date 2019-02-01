'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath} = options

    router.get('/', async (req,res) => {
        var farms = await repo.getAllFarms();
        res.status(status.OK).json(farms)
    })

    router.post('/', async (req,res) => {
        const farmData = {
            name: req.body.name,
            address: req.body.address,
            mail: req.body.mail,
            phone: req.body.phone,
            logo: req.body.logo,
            websiteURL: req.body.websiteURL,
            description: req.body.description,
            dealers: req.body.dealers,
            users: req.body.users,
            lots: req.body.lots,
            siteBuilder: req.body.siteBuilder,
            advs: req.body.advs
        }

        try{
            var farm = await repo.createFarm(farmData)
            farm ?
                res.status(status.OK).json(farm)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

    router.get('/:farmID', async (req,res) => {
        try{
            var farm = await repo.getFarm(req.params.farmID)
            farm ?
                res.status(status.OK).json(farm)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

    router.put('/:farmID', async (req,res) => {
        const farmData = {
            name: req.body.name,
            address: req.body.address,
            mail: req.body.mail,
            phone: req.body.phone,
            logo: req.body.logo,
            websiteURL: req.body.websiteURL,
            description: req.body.description
        }
        try{
            var farm = await repo.updateFarm(req.params.farmID,farmData)
            farm ?
                res.status(status.OK).json(farm)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

    router.delete('/:farmID', async (req,res) => {
        try{
            var farm = await repo.deleteFarm(req.params.farmID)
            farm ?
                res.status(status.OK).json(farm)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

    router.post('/:farmID/lot', async (req,res) => {
        try{
            var lotData = {
                name: req.body.name,
                description: req.body.description,
                images: []
            }
            var lot = await repo.addLot(req.params.farmID,lotData)
            lotData._id= lot._id
            var images = req.files.images.map( async (image)=> {
                try{
                    var filename = Date.now()+ '-' + image.originalFilename
                    var pathname = path.join(storagePath, req.originalUrl, lot._id.toString())
                    var imagefile = await storageService.saveToDir(image.path, filename, pathname )

                    lotData.images.push({filename: filename})
                }catch (err) {
                    res.status(400).json({msg: err.message})
                }
            })
            Promise.all(images).then( async ()=>{
                try{
                    var addLotImage = await repo.updateLot(req.params.farmID,lot._id,lotData) 
                    res.status(status.OK).json(addLotImage)
                }catch (err) {
                    res.status(400).json({msg: err.message})
                }
            })
        }catch (err) {
            res.status(400).json({msg: err})
        }

    })

    router.put('/:farmID/lot/:lotID', async (req,res) => {
        const productData = {
            _id: req.body._id,
            name: req.body.name,
            images: req.body.images,
            category: req.body.category,
            updatedAt: req.body.updatedAt,
            status:  req.body.status,
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

    router.delete('/:farmID/lot/:lotID', async (req,res) => {
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

    router.post('/:farmID/product', async (req,res, next) => {
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

    router.put('/:farmID/product/:productID', async (req,res) => {
        const productData = {
            _id: req.body._id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            updatedAt: req.body.updatedAt,
            status:  req.body.status,
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

    router.delete('/:farmID/product/:productID', async (req,res) => {
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