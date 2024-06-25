const {Router} = require('express')
const productsController = require('../controllers/ProductsController')

const productsRoutes = new Router()

productsRoutes.post("/", productsController.create)
productsRoutes.get("/", productsController.getAll)

module.exports = productsRoutes