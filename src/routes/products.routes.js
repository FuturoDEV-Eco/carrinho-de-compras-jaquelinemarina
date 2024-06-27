const {Router} = require('express')
const productsController = require('../controllers/ProductsController')

const productsRoutes = new Router()

productsRoutes.post("/", productsController.create)
productsRoutes.get("/", productsController.getAll)
productsRoutes.get("/:id", productsController.getProductDetails)
productsRoutes.delete("/:id", productsController.delete)
productsRoutes.put("/:id", productsController.update)

module.exports = productsRoutes