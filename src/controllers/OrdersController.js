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
    //-----------------------------------------------------------------------------------------------

    // LISTANDO TODOS OS PEDIDOS
    async getAll(request, response) {

        const orders = await this.database.query('SELECT * FROM orders')
        response.status(200).json(orders.rows)
    }
    //-----------------------------------------------------------------------------------------------

    // DELETANDO PEDIDO
    async delete(request, response) {
        try {
            const id = request.params.id

            await this.database.query('DELETE FROM orders_items WHERE order_id = $1', [id])
            const orders = await this.database.query('DELETE FROM orders WHERE id = $1', [id])


            // verifica se deletou alguma linha
            if (orders.rowCount === 0) {
                return response.status(404).json(
                    { mensagem: "O pedido não existe ou já foi deletado." }
                )
            }
            response.status(200).json({ mensagem: "Pedido deletado com sucesso." })

        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar deletar o pedido."
            })
        }
    }
}

module.exports = new OrdersController()