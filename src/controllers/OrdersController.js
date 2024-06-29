const Database = require('../database/database')

class OrdersController extends Database {

    // CRIANDO PEDIDO
    async create(request, response) {

        try {
            const data = request.body

            if (!data.client_id || !data.address || !data.products) {
                return response.status(400).json({
                    mensagem: "Cliente, endereço, quantidade e ID do produto são obrigatórios."
                })
            }

            let total = 0

            // calcula o total do pedido (preço * quantidade)
            for (let i = 0; i < data.products.length; i++) {
                const item = data.products[i]
                const currentProduct = await this.database.query(`
                SELECT price FROM products 
                WHERE id = $1
            `, [item.product_id])

                total = total + (currentProduct.rows[0].price * item.amount)
            }

            // insere o pedido 
            const myOrder = await this.database.query(`
            INSERT INTO orders (client_id, address, observations, total)
            values ($1, $2, $3, $4)
            RETURNING *
            `, [data.client_id, data.address, data.observations, total])

            // insere os itens do pedido
            data.products.forEach(async item => {
                const currentProduct = await this.database.query(`
                SELECT price from products 
                where id = $1
                `, [item.product_id])

                this.database.query(`
                INSERT INTO orders_items (order_id, product_id, amount, price)
                values ($1,$2,$3,$4)
                RETURNING *
                `, [
                    myOrder.rows[0].id,
                    item.product_id,
                    item.amount,
                    currentProduct.rows[0].price
                ])
            })
            response.status(201).json({ mensagem: "Pedido criado com sucesso." })

        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar criar o pedido."
            })
        }
    }
}

module.exports = new OrdersController()