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
        const farmData = {
            name: req.body.name,
            address: req.body.address,
            mail: req.body.mail,
            phone: req.body.phone,
            logo: req.body.logo,
            websiteURL: req.body.websiteURL,
            description: req.body.description,
            dealers: req.body.dealers,
            products: req.body.products,
            users: req.body.users,
            lots: req.body.lots,
            siteBuilder: req.body.siteBuilder,
            advs: req.body.advs
        }
        var farm = await repo.createFarm(farmData).catch(err => {res.status(400).send(err)})
        res.status(status.OK).json(farm)
    })

    router.get('/:farmID', async (req,res) => {
        var farm = await repo.getFarm(req.params.farmID).catch(err => {res.status(400).send(err)})
        if(!farm) res.status(404).send()
        else res.status(status.OK).json(farm)
    })
    router.put('/:farmID', async (req,res) => {
        const farmData = {
            name: req.body.name,
            address: req.body.address,
            mail: req.body.mail,
            phone: req.body.phone,
            logo: req.body.logo,
            websiteURL: req.body.websiteURL,
            description: req.body.description,
            dealers: req.body.dealers,
            products: req.body.products,
            users: req.body.users,
            lots: req.body.lots,
            siteBuilder: req.body.siteBuilder,
            advs: req.body.advs
        }
        var farm = await repo.updateFarm(req.params.farmID,farmData).catch(err => {res.status(400).send(err)})
        if(!farm) res.status(404).send()
        else res.status(status.OK).json(farm)
    })
    router.delete('/:farmID', async (req,res) => {
        var farm = await repo.deleteFarm(req.params.farmID).catch(err => {res.status(400).send(err)})
        if(!farm) res.status(404).send()
        else res.status(status.OK).json(farm)
    })

    return router;
}