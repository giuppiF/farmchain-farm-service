'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, productService, auth} = options

   /**
   * @swagger
   * tags:
   *   name: Farm
   *   description: Farm API list
   */
   /**
   * @swagger
   * components:
   *   securitySchemes:
   *     bearerAuth:            # arbitrary name for the security scheme
   *       type: http
   *       scheme: bearer
   *       bearerFormat: JWT
   */

   /**
   * @swagger
   * /farm:
   *   get:
   *     summary: Get All Farms
   *     description: Lists all farms
   *     tags: [Farm]
   *     produces:
   *       - application/json
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   */
    router.get('/', async (req,res) => {
        var farms = await repo.getAllFarms();
        res.status(status.OK).json(farms)
    })
  /**
   * @swagger
   * /farm:
   *   post:
   *     summary: Create Farm
   *     description: API for farm creation
   *     tags: [Farm]
   *     produces:
   *       - application/json
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               properties:
   *                   name:
   *                     name: name
   *                     description: Farm's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: La bella Fattoria
   *                   address:
   *                     name: address
   *                     description: Farm's address
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Via Roma 10 - 10100  Torino
   *                   mail:
   *                     name: mail
   *                     description: Farm's mail
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: mail@mail.it
   *                   phone:
   *                     name: phone
   *                     description: Farm's phone
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: 321 23132312
   *                   logo:
   *                     name: logo
   *                     description: Farm's logo
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     format: binary
   *                   websiteURL:
   *                     name: websiteURL
   *                     description: Farm's website URL
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: www.farm.it
   *                   description:
   *                     name: description
   *                     description: Farm's description
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Descrizione della farm
   *               required:
   *                    - name
   *                    - address
   *                    - mail
   *                    - phone
   *     responses:
   *             200:
   *                 description: Farm created object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Farm not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Farm not created for a generic database error
   *                            
   */


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

     /**
   * @swagger
   * /farm/{farmId}:
   *   get:
   *     summary: Get Farm
   *     description: Get a single farm
   *     security:
   *        - bearerAuth: []
   *     tags: [Farm]
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: farmId
   *          in: path
   *          required: true
   *          description: Farm id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Farm not found
   */

    router.get('/:farmID',auth.required,auth.isFarmAdmin, async (req,res) => {
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
     /**
   * @swagger
   * /farm/{farmId}:
   *   put:
   *     summary: Update Farm
   *     description: Update a farm
   *     tags: [Farm]
   *     security:
   *        - bearerAuth: []
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: farmId
   *          in: path
   *          required: true
   *          description: Farm id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     requestBody:
   *        content:
   *            multipart/form-data:
   *             schema:
   *               type: object
   *               properties:
   *                   name:
   *                     name: name
   *                     description: Farm's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: La bella Fattoria
   *                   address:
   *                     name: address
   *                     description: Farm's address
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Via Roma 10 - 10100  Torino
   *                   mail:
   *                     name: mail
   *                     description: Farm's mail
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: mail@mail.it
   *                   phone:
   *                     name: phone
   *                     description: Farm's phone
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: 321 23132312
   *                   logo:
   *                     name: logo
   *                     description: Farm's logo
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     format: binary
   *                   websiteURL:
   *                     name: websiteURL
   *                     description: Farm's website URL
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: www.farm.it
   *                   description:
   *                     name: description
   *                     description: Farm's description
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Descrizione della farm
   *               required:
   *                    - name
   *                    - address
   *                    - mail
   *                    - phone
   *            application/json:
   *             schema:
   *               type: object
   *               properties:
   *                   name:
   *                     name: name
   *                     description: Farm's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: La bella Fattoria
   *                   address:
   *                     name: address
   *                     description: Farm's address
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Via Roma 10 - 10100  Torino
   *                   mail:
   *                     name: mail
   *                     description: Farm's mail
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: mail@mail.it
   *                   phone:
   *                     name: phone
   *                     description: Farm's phone
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: 321 23132312
   *                   logo:
   *                     name: logo
   *                     description: Farm's logo
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: /product/5c56d364d7123300b6462ed5/1549194089941-logo_farmchain.JPG
   *                   websiteURL:
   *                     name: websiteURL
   *                     description: Farm's website URL
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: www.farm.it
   *                   description:
   *                     name: description
   *                     description: Farm's description
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Descrizione della farm
   *               required:
   *                    - name
   *                    - address
   *                    - mail
   *                    - phone
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Farm not found
   */
    router.put('/:farmID',auth.required,auth.isFarmAdmin,  async (req,res) => {
        const farmData = {
            name: req.body.name,
            address: req.body.address,
            mail: req.body.mail,
            phone: req.body.phone,
            logo: req.body.logo,
            websiteURL: req.body.websiteURL,
            description: req.body.description
        }

        const productFarmData = {
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

            productFarmData._id = farm._id

            farm.products.map(
                async (product) => {
                    const { headers: { authorization } } = req;
                    var product = await productService.updateProductFarm(product.id, productFarmData,authorization)
                }
            )
            


            farm ?
                res.status(status.OK).json(farm)
            :
                res.status(404).send()
                
        } catch (err) {
            res.status(400).send({'msg': err.message})
        }
    })

     /**
   * @swagger
   * /farm/{farmId}:
   *   delete:
   *     summary: Delete Farm
   *     description: Delete a single farm
   *     security:
   *        - bearerAuth: []
   *     tags: [Farm]
   *     produces:
   *       - application/json
   *     parameters:
   *        - name: farmId
   *          in: path
   *          required: true
   *          description: Farm id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *     responses:
   *             200:
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Application error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Farm not found
   */
    router.delete('/:farmID',  async (req,res) => {
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