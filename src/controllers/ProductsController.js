const { Pool } = require('pg')

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Abacaxi123$',
    database: 'M2S06'
})

class ProductsController {

    // CRIANDO PRODUTO
    async create(request, response) {

    }
}

module.exports = new ProductsController()