const { Pool } = require('pg')

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Abacaxi123$',
    database: 'M2S06'
})

class ClientsController {

    // CRIANDO CLIENTE
    async create(request, response) {

        try {
            const dados = request.body

            // retorna erro se não tem nome, email, cpf ou contato
            if (!dados.name || !dados.email || !dados.cpf || !dados.contact) {
                return response.status(400).json({
                    mensagem: "Nome, email (dado único), CPF (dado único) e contato são obrigatórios."
                })
            }

            // caso contrário insere o cliente
            const client = await conexao.query(`
                INSERT INTO clients
                (name, email, cpf, contact)
                values
                ($1, $2, $3, $4)
                RETURNING * 
                `, [dados.name, dados.email, dados.cpf, dados.contact])

            response.status(201).json(client.rows[0])

            // pega os erros não tratados
        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar criar um cliente."
            })
        }
    }
    //-----------------------------------------------------------------------------------------------

    // LISTANDO CLIENTES
    async getAll(request, response) {

        try {

            // busca um cliente com filtro
            const query = request.query

            if (query.filter) {
                const clients = await conexao.query(`
                SELECT * FROM clients
                where name ilike $1
                or email ilike $1
                or cpf ilike $1
                or contact ilike $1
                `, [`%${query.filter}%`])
                response.json(clients.rows)
            }
            else {
                //busca todos os clientes
                const clients = await conexao.query('SELECT * FROM clients')
                response.json(clients.rows)
            }

        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar listar os clientes."
            })

        }
    }
}

module.exports = new ClientsController()