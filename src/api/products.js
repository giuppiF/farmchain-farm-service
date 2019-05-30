'use strict'
const status = require('http-status')
const router = require('express').Router();
const path = require('path')

module.exports = (options) => {
    const {repo, storageService, storagePath, auth} = options
   /**
   * @swagger
   * tags:
   *   name: FarmProducts
   *   description: API list of Farm's Products 
   */

     /**
   * @swagger
   * /farm/{farmId}/product:
   *   post:
   *     summary: Create Farm's Product
   *     description: API for farm's Product creation
   *     tags: [FarmProducts]
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
   *                     description: Product's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: La Fragola
   *                   image:
   *                     name: image
   *                     description: Product's image storage path
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: /product/5c56d364d7123300b6462ed5/1549194089941-logo_farmchain.JPG
   *                   category:
   *                     name: category
   *                     description: Product's category
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     enum: [Frutta, Verdura]
   *                     example: Frutta
   *                   updatedAt:
   *                     name: updatedAt
   *                     description: Product's udate timestamp
   *                     in: formData
   *                     required: false
   *                     type: string
   *                     example: 2019-02-03T11:41:51.133Z
   *                   status:
   *                     name: site
   *                     description: Product's status
   *                     in: formData
   *                     required: false
   *                     type: string
   *                     enum: [In Progress, Completed]
   *               required:
   *                    - name
   *                    - image
   *                    - category
   *                    - updatedAt
   *                    - status
   *     responses:
   *             200:
   *                 description: Farm object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Product not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product not created for a generic database error
   *                            
   */
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

     /**
   * @swagger
   * /farm/{farmId}/product/{productId}:
   *   put:
   *     summary: Create Farm's Product
   *     description: API for farm's Product creation
   *     tags: [FarmProducts]
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
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
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
   *                   _id:
   *                     name: _id
   *                     description: Product's id
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: 5c56d37fd7123300b6462ed6
   *                   name:
   *                     name: name
   *                     description: Product's name
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: La Fragola
   *                   image:
   *                     name: image
   *                     description: Product's image storage path
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     example: /product/5c56d364d7123300b6462ed5/1549194089941-logo_farmchain.JPG
   *                   category:
   *                     name: category
   *                     description: Product's category
   *                     in: formData
   *                     required: true
   *                     type: string
   *                     enum: [Frutta, Verdura]
   *                     example: Frutta
   *                   updatedAt:
   *                     name: updatedAt
   *                     description: Product's udate timestamp
   *                     in: formData
   *                     required: false
   *                     type: string
   *                     example: 2019-02-03T11:41:51.133Z
   *                   status:
   *                     name: site
   *                     description: Product's status
   *                     in: formData
   *                     required: false
   *                     type: string
   *                     enum: [In Progress, Completed]
   *               required:
   *                    - name
   *                    - image
   *                    - category
   *                    - updatedAt
   *                    - status
   *     responses:
   *             200:
   *                 description: Farm object
   *                 content:
   *                     application/json:
   *                        schema:
   *                            $ref: '#/components/schemas/Farm'
   *             400:
   *                 description: Product not created for a validation error
   *             401:
   *                 description: Not authorized
   *             404:
   *                 description: Product not created for a generic database error
   *                            
   */
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
     /**
   * @swagger
   * /farm/{farmId}/product/{productId}:
   *   delete:
   *     summary: Delete Farm's Product
   *     description: Delete a single product
   *     security:
   *        - bearerAuth: []
   *     tags: [FarmProducts]
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
   *        - name: productId
   *          in: path
   *          required: true
   *          description: Product id string
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
   *                 description: Product not found
   */
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