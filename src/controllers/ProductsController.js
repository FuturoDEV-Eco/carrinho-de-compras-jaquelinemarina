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

        try {
            const dados = request.body

            if (!dados.name || !dados.amount || !dados.category_id) {
                return response.status(400).json({
                    mensagem: "Nome e ID da categoria são obrigatórios. A quantidade deve ser um valor que não se repita."
                })
            }

            const product = await conexao.query(`
            INSERT INTO products
            (name, amount, color, voltage, description, category_id)
            values
            ($1, $2, $3, $4, $5, $6)
            RETURNING * 
            `, [dados.name, dados.amount, dados.color, dados.voltage, dados.description, dados.category_id])

            response.status(201).json(product.rows[0])

        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar criar um produto."
            })
        }
    }
}

module.exports = new ProductsController()