const { Router } = require('express')
const ordersController = require('../controllers/OrdersController')

const ordersRoutes = new Router()

ordersRoutes.post("/", ordersController.create.bind(ordersController))
ordersRoutes.get("/", ordersController.getAll.bind(ordersController))
ordersRoutes.delete("/:id", ordersController.delete.bind(ordersController))

module.exports = ordersRoutes