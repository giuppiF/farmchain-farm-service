'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, productService, auth} = options
   /**
   * @swagger
   * tags:
   *   name: FarmLots
   *   description: List Farm's Lots API
   */

     /**
   * @swagger
   * /farm/{farmId}/lot:
   *   post:
   *     summary: Create Farm's Lot
   *     description: API for farm's Lot creation
   *     tags: [FarmLots]
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
   *                     description: Lot's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Il bel lotto
   *                   description:
   *                     name: description
   *                     description: Lot's description
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Descrizione del lotto
   *                   image:
   *                     name: logo
   *                     description: Lot's image
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     format: binary
   *               required:
   *                    - name
   *                    - description
   *     responses:
   *             200:
   *                 description: Farm object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Lot not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Lot not created for a generic database error
   *                            
   */
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
    
                var filename = lot.name + '-' + image.originalFilename
                var pathname = path.join(req.originalUrl, lot._id.toString())
                
                var uploadfile = await storageService.uploadFileInS3(image.path, filename, pathname )
                lotData.image = path.join(pathname,filename)
            }
            
            var addLotImage = await repo.updateLot(req.params.farmID,lot._id,lotData) 
            res.status(status.OK).json(addLotImage)

        }catch (err) {
            res.status(400).json({msg: err.message})
        }

    })
     /**
   * @swagger
   * /farm/{farmId}/lot/{lotId}:
   *   put:
   *     summary: Create Farm's Lot
   *     description: API for farm's Lot update
   *     tags: [FarmLots]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - name: farmId
   *          in: path
   *          required: true
   *          description: Farm id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
   *        - name: lotId
   *          in: path
   *          required: true
   *          description: Lot id string
   *          schema:
   *             type : string
   *             format: byte
   *             minimum: 1
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
   *                     description: Lot's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Il bel lotto
   *                   description:
   *                     name: description
   *                     description: Lot's description
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Descrizione Lotto
   *                   image:
   *                     name: logo
   *                     description: Lot's logo
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     format: binary
   *               required:
   *                    - name
   *                    - description
   *                    - image
   *            application/json:
   *             schema:
   *               type: object
   *               properties:
   *                   name:
   *                     name: name
   *                     description: Lot's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Il bel lotto
   *                   description:
   *                     name: description
   *                     description: Lot's description
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Descrizione Lotto
   *                   image:
   *                     name: logo
   *                     description: Lotto's image
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: /product/5c56d364d7123300b6462ed5/1549194089941-logo_farmchain.JPG
   *               required:
   *                    - name
   *                    - description
   *                    - image
   *     responses:
   *             200:
   *                 description: Farm object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Lot not update for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Lot not updated for a generic database error
   *                            
   */
    router.put('/:farmID/lot/:lotID', auth.required,auth.isFarmAdmin,  async (req,res) => {

        var lotData = {
            _id: req.params.lotID,
            name: req.body.name,
            description: req.body.description
        }
        try{
            if(req.files.image){
                
                var pathname = req.originalUrl
                var lot = await repo.getLot(req.params.farmID,lotData._id)
                if(lot.image)
                    var deleteFile = await storageService.deleteFileFromS3(lot.image)            

                var image = req.files.image    
                var filename =lot.name + '-' + image.originalFilename
                
                var uploadfile = await storageService.uploadFileInS3(image.path, filename, pathname )
                lotData.image = path.join(pathname,filename)
                

            }else{
                lotData.image=req.body.image
            }

            var farm = await repo.updateLot(req.params.farmID,lotData._id,lotData) 
            var publishEvent =await options.kafkaService.publishEvent("service.farm","update.lot",lotData);
            

            farm ?
                res.status(status.OK).json(farm)
            :            
                res.status(404).send()

        } catch (err) {
            res.status(400).send({'msg' : err.message})
        }
    })
     /**
   * @swagger
   * /farm/{farmId}/lot/{lotId}:
   *   delete:
   *     summary: Delete Farm's Lot
   *     description: Delete a single lot
   *     security:
   *        - bearerAuth: []
   *     tags: [FarmLots]
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
   *        - name: lotId
   *          in: path
   *          required: true
   *          description: Lot id string
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
   *                 description: Lot not found
   */
    router.delete('/:farmID/lot/:lotID', auth.required,auth.isFarmAdmin, async (req,res) => {
        try{

            var lot = await repo.getLot(req.params.farmID,req.params.lotID)
            if(lot.image)
                var deleteFile = await storageService.deleteFileFromS3(lot.image)  
            var farm = await repo.deleteLot(req.params.farmID,req.params.lotID)
            var publishEvent =await options.kafkaService.publishEvent("service.farm","delete.lot",lot);
        
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