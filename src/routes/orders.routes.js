const { Router } = require('express')
const ordersController = require('../controllers/OrdersController')

const ordersRoutes = new Router()

ordersRoutes.post("/", ordersController.create.bind(ordersController))

module.exports = ordersRoutes