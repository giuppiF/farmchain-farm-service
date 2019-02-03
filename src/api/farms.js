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
            description: req.body.description
        }

        try{
            var farm = await repo.createFarm(farmData)
            farmData._id = farm._id
            if(req.files.logo){
                var logo = req.files.logo
    
                var filename = Date.now()+ '-' + logo.originalFilename
                var pathname = path.join( req.originalUrl, farm._id.toString())
                var completePath = path.join(storagePath,pathname)
                var uploadfile = await storageService.saveToDir(logo.path, filename, completePath )
                farm.logo = path.join(pathname, filename)
                farm.save()
            }

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


            if(req.files.logo){
                
                var pathname = req.originalUrl
                var completePathname = path.join(storagePath, pathname)
                var farm = await repo.getFarm(req.params.farmID)
                if(farm.logo)
                    var deleteFile = await storageService.deleteFile(farm.logo,storagePath)            

                var logo = req.files.logo    
                var filename = Date.now()+ '-' + logo.originalFilename
                
                var uploadfile = await storageService.saveToDir(logo.path, filename, completePathname )
                farmData.logo = path.join(pathname,filename)
                

            }else{
                farmData.logo=req.body.logo
            }
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

            var pathname = path.join(storagePath, req.originalUrl)
            var farm = await repo.getFarm(req.params.farmID)
            if(farm.logo)
                var deleteFile = await storageService.deleteFile(farm.logo,storagePath)  
                var deleteDir = await storageService.deleteDir(pathname)  

            farm = await repo.deleteFarm(req.params.farmID)
            farm ?
                res.status(status.OK).json(farm)
            :
                res.status(404).send()
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

    return router;
}