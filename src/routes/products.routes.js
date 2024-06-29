const {Router} = require('express')
const productsController = require('../controllers/ProductsController')

const productsRoutes = new Router()

productsRoutes.post("/", productsController.create.bind(productsController))
productsRoutes.get("/", productsController.getAll.bind(productsController))
productsRoutes.get("/:id", productsController.getProductDetails.bind(productsController))
productsRoutes.delete("/:id", productsController.delete.bind(productsController))
productsRoutes.put("/:id", productsController.update.bind(productsController))

module.exports = productsRoutes