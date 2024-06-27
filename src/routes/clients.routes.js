const {Router} = require('express')
const clientsController = require('../controllers/ClientsController')

const clientsRoutes = new Router()

clientsRoutes.post("/", clientsController.create)
clientsRoutes.get("/", clientsController.getAll)
clientsRoutes.delete("/:id", clientsController.delete)
clientsRoutes.put("/:id", clientsController.update)

module.exports = clientsRoutes