'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, productService, auth} = options
   /**
   * @swagger
   * tags:
   *   name: FarmDealers
   *   description: List Farm's Dealers API
   */

   /**
   * @swagger
   * /farm/{farmId}/dealer:
   *   post:
   *     summary: Create Farm's Dealer
   *     description: API for farm's dealer creation
   *     tags: [FarmDealers]
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
   *                     description: Dealer's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Il bel distributore
   *                   address:
   *                     name: address
   *                     description: Dealer's address
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Via Roma 10 - 10100  Torino
   *                   mail:
   *                     name: mail
   *                     description: Dealer's mail
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: mail@mail.it
   *                   phone:
   *                     name: phone
   *                     description: Dealer's phone
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: 321 23132312
   *                   image:
   *                     name: logo
   *                     description: Dealer's logo
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     format: binary
   *                   site:
   *                     name: site
   *                     description: Dealer's website URL
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: www.Dealer.it
   *                   description:
   *                     name: description
   *                     description: Dealer's description
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Descrizione del distributore
   *               required:
   *                    - name
   *                    - address
   *                    - mail
   *                    - phone
   *                    - site
   *                    - description
   *     responses:
   *             200:
   *                 description: Farm object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Dealer not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Dealer not created for a generic database error
   *                            
   */
    router.post('/:farmID/dealer',auth.required,auth.isFarmAdmin, async (req,res) => {
        try{
            var dealerData = {
                name: req.body.name,
                phone: req.body.phone,
                mail: req.body.mail,
                address: req.body.address,
                site: req.body.site,
                description: req.body.description,
                image: 'placeholder'
            }
            var dealer = await repo.addDealer(req.params.farmID,dealerData)
            dealerData._id = dealer._id
            if(req.files.image){
                var image = req.files.image
    
                var filename = dealer.name + '-' + image.originalFilename
                var pathname = path.join(req.originalUrl, dealer._id.toString())
                var uploadfile = await storageService.uploadFileInS3(image.path, filename, pathname )
                dealerData.image = path.join(pathname, filename)
            }
            
            var addDealerImage = await repo.updateDealer(req.params.farmID,dealer._id,dealerData) 
            res.status(status.OK).json(addDealerImage)

        }catch (err) {
            res.status(400).json({msg: err.message})
        }

    })
     /**
   * @swagger
   * /farm/{farmId}/dealer/{dealerId}:
   *   put:
   *     summary: Create Farm's Dealer
   *     description: API for farm's dealer update
   *     tags: [FarmDealers]
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
   *        - name: dealerId
   *          in: path
   *          required: true
   *          description: Dealer id string
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
   *                     description: Dealer's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Il bel distributore
   *                   address:
   *                     name: address
   *                     description: Dealer's address
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Via Roma 10 - 10100  Torino
   *                   mail:
   *                     name: mail
   *                     description: Dealer's mail
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: mail@mail.it
   *                   phone:
   *                     name: phone
   *                     description: Dealer's phone
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: 321 23132312
   *                   image:
   *                     name: logo
   *                     description: Dealer's logo
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     format: binary
   *                   site:
   *                     name: site
   *                     description: Dealer's website URL
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: www.Dealer.it
   *               required:
   *                    - name
   *                    - address
   *                    - mail
   *                    - phone
   *                    - site
   *                    - description
   *                    - image
   *            application/json:
   *             schema:
   *               type: object
   *               properties:
   *                   name:
   *                     name: name
   *                     description: Dealer's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Il bel distributore
   *                   address:
   *                     name: address
   *                     description: Dealer's address
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: Via Roma 10 - 10100  Torino
   *                   mail:
   *                     name: mail
   *                     description: Dealer's mail
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: mail@mail.it
   *                   phone:
   *                     name: phone
   *                     description: Dealer's phone
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: 321 23132312
   *                   image:
   *                     name: logo
   *                     description: Dealer's logo
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: /product/5c56d364d7123300b6462ed5/1549194089941-logo_farmchain.JPG
   *                   site:
   *                     name: site
   *                     description: Dealer's website URL
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: www.Dealer.it
   *               required:
   *                    - name
   *                    - address
   *                    - mail
   *                    - phone
   *                    - site
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
   *                 description: Dealer not updated for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Dealer not updated for a generic database error
   *                            
   */
    router.put('/:farmID/dealer/:dealerID', auth.required,auth.isFarmAdmin,async (req,res) => {

        var dealerData = {
            _id: req.params.dealerID,
            name: req.body.name,
            phone: req.body.phone,
            mail: req.body.mail,
            site: req.body.site,
            address: req.body.address
        }
        try{
            if(req.files.image){
                
                var pathname = req.originalUrl
                
                var dealer = await repo.getDealer(req.params.farmID,req.params.dealerID)
                if(dealer.image)
                    var deleteFile = await storageService.deleteFileFromS3(dealer.image)            

                var image = req.files.image    
                var filename = dealer.name + '-' + image.originalFilename
                
                var uploadfile = await storageService.uploadFileInS3(image.path, filename, pathname )
                dealerData.image = path.join(pathname,filename)
                

            }else{
                dealerData.image=req.body.image
            }
            
            var farm = await repo.updateDealer(req.params.farmID,req.params.dealerID,dealerData) 
            var publishEvent =await options.kafkaService.publishEvent("service.farm","update.dealer",dealerData);


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
   * /farm/{farmId}/dealer/{dealerId}:
   *   delete:
   *     summary: Delete Farm's Dealer
   *     description: Delete a single dealer
   *     security:
   *        - bearerAuth: []
   *     tags: [FarmDealers]
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
   *        - name: dealerId
   *          in: path
   *          required: true
   *          description: Dealer id string
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
   *                 description: Dealer not found
   */
    router.delete('/:farmID/dealer/:dealerID', auth.required,auth.isFarmAdmin,  async (req,res) => {
        try{

            var dealer = await repo.getDealer(req.params.farmID,req.params.dealerID)
            if(dealer.image)
                var deleteFile = await storageService.deleteFileFromS3(dealer.image)  
 
            var farm = await repo.deleteDealer(req.params.farmID,req.params.dealerID)
            var publishEvent =await options.kafkaService.publishEvent("service.farm","delete.dealer",dealer);

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