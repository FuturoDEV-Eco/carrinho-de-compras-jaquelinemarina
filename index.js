const express = require('express')

const clientsRoutes = require('./src/routes/clients.routes')
const productsRoutes = require('./src/routes/products.routes')
const ordersRoutes = require('./src/routes/orders.routes')

const app = express()
app.use(express.json()) // Habilita o servidor a receber JSON

app.use('/clients', clientsRoutes)
app.use('/products', productsRoutes)
app.use('/orders', ordersRoutes)

app.listen(3000, () => {
    console.log("Servidor Online")
})