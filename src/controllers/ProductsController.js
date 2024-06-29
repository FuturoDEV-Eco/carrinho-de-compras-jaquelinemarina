const Database = require('../database/database')
class ProductsController extends Database {

    // CRIANDO PRODUTO
    async create(request, response) {

        try {
            const dados = request.body

            // retorna erro se não tem nome, quantidade ou id da categoria
            if (!dados.name || !dados.amount || !dados.category_id) {
                return response.status(400).json({
                    mensagem: "Nome, quantidade e ID da categoria são obrigatórios."
                })
            }

            // caso contrário insere o produto
            const product = await this.database.query(`
            INSERT INTO products
            (name, amount, color, voltage, description, category_id)
            values
            ($1, $2, $3, $4, $5, $6)
            RETURNING * 
            `, [
                dados.name,
                dados.amount,
                dados.color,
                dados.voltage,
                dados.description,
                dados.category_id])

            response.status(201).json(product.rows[0]) // retorna o objeto criado (RETURNING * também)

        } catch (error) { // pega os erros não tratados
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar criar um produto."
            })
        }
    }
    //-----------------------------------------------------------------------------------------------

    // LISTANDO TODOS OS PRODUTOS
    async getAll(request, response) {

        const products = await this.database.query('SELECT * FROM products')
        response.status(200).json(products.rows)

    }
    //-----------------------------------------------------------------------------------------------

    // LISTANDO PRODUTO COM DETALHE
    async getProductDetails(request, response) {

        try {
            // busca um produto pelo id
            const id = request.params.id

            // obtém os detalhes do produto e da categoria
            const query = `
            SELECT 
              p.id AS product_id,
              p.name AS product_name,
              p.amount,
              p.color,
              p.voltage,
              p.description,
              c.id AS category_id,
              c.name AS category_name
            FROM 
              products p
            JOIN 
              categories c ON p.category_id = c.id
            WHERE 
              p.id = $1
          `
            const result = await this.database.query(query, [id])

            // verificar se os dados foram encontrados
            if (result.rowCount === 0) {
                return response.status(404).json({
                    message: 'Produto não encontrado'
                })
            }
            response.status(200).json(result.rows[0])

        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar buscar um produto."
            })
        }
    }
    //-----------------------------------------------------------------------------------------------

    // ATUALIZANDO PRODUTO
    async update(request, response) {

        try {
            const dados = request.body
            const id = request.params.id

            // busca todos os dados do produto para manter aqueles que não quero atualizar
            const dataProduct = await this.database.query(`
                SELECT * FROM products
                WHERE id = $1
                `, [id])

            await this.database.query(`
            UPDATE products
            SET name = $1,
            amount = $2,
            color = $3,
            voltage = $4,
            description = $5,
            category_id = $6
            WHERE id = $7
            RETURNING *
            `, [// caso não exista dados novos, mantém os antigos
                dados.name || dataProduct.rows[0].name,
                dados.amount || dataProduct.rows[0].amount,
                dados.color || dataProduct.rows[0].color,
                dados.voltage || dataProduct.rows[0].voltage,
                dados.description || dataProduct.rows[0].description,
                dados.category_id || dataProduct.rows[0].category_id,
                id])

            // retorna o objeto atualizado
            response.status(201).json(dataProduct.rows[0])

        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar atualizar um produto."
            })
        }
    }
    //-----------------------------------------------------------------------------------------------

    // DELETANDO PRODUTO
    async delete(request, response) {

        try {
            const id = request.params.id

            const products = await this.database.query(`
                DELETE FROM products
                WHERE id = $1
                `, [id])

            // verifica se deletou alguma linha
            if (products.rowCount === 0) {
                return response.status(404).json(
                    { mensagem: "O produto não existe ou já foi deletado." }
                )
            }
            response.status(204).json() // retorna 204 (com sucesso mas sem conteúdo)

        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar deletar um produto."
            })
        }
    }
}

module.exports = new ProductsController()