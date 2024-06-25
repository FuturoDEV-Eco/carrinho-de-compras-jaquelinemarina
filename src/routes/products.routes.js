const {Router} = require('express')
const productsController = require('../controllers/ProductsController')

const productsRoutes = new Router()

productsRoutes.post("/", productsController.create)

module.exports = productsRoutes