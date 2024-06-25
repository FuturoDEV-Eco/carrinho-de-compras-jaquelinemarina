const {Router} = require('express')
const clientsController = require('../controllers/ClientsController')

const clientsRoutes = new Router()

clientsRoutes.post("/", clientsController.create)

module.exports = clientsRoutes