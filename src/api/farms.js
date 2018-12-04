'use strict'
const status = require('http-status')
const router = require('express').Router();


module.exports = (options) => {
    const {repo} = options
    router.get('/', async (req,res) => {
        var farms = await repo.getAllFarms();
        res.status(status.OK).json(farms)
    })

    router.post('/', async (req,res) => {
        var farm = await repo.createFarm(req.body).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(farm)
    })

    router.get('/:farmID', async (req,res) => {
        var farm = await repo.getFarm(req.params.farmID).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(farm)
    })
    router.put('/:farmID', async (req,res) => {
        var farm = await repo.updateFarm(req.params.farmID,req.body).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(farm)
    })
    router.delete('/:farmID', async (req,res) => {
        var farm = await repo.deleteFarm(req.params.farmID).catch(err => {res.status(400).send(err)})
        res.status(status.OK).send()
    })

    return router;
}