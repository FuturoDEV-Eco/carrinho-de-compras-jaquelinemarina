const { Router } = require('express')
const clientsController = require('../controllers/ClientsController')

const clientsRoutes = new Router()

clientsRoutes.post("/", clientsController.create.bind(clientsController))
clientsRoutes.get("/", clientsController.getAll.bind(clientsController))
clientsRoutes.delete("/:id", clientsController.delete.bind(clientsController))
clientsRoutes.put("/:id", clientsController.update.bind(clientsController))

module.exports = clientsRoutes