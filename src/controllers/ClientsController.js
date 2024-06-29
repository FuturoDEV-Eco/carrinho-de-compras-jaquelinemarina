const Database = require('../database/database')

class ClientsController extends Database{

    // CRIANDO CLIENTE
    async create(request, response) {

        try {
            const data = request.body

            // retorna erro se não tem nome, email, cpf ou contato
            if (!data.name || !data.email || !data.cpf || !data.contact) {
                return response.status(400).json({
                    mensagem: "Nome, email (dado único), CPF (dado único) e contato são obrigatórios."
                })
            }

            // caso contrário insere o cliente
            const client = await this.database.query(`
                INSERT INTO clients
                (name, email, cpf, contact)
                values
                ($1, $2, $3, $4)
                RETURNING * 
                `, [data.name, data.email, data.cpf, data.contact])

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
                const clients = await this.database.query(`
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
                const clients = await this.database.query('SELECT * FROM clients')
                response.status(201).json(clients.rows)
            }
        } catch (error) {
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar listar os clientes."
            })
        }
    }
    //-----------------------------------------------------------------------------------------------

    // ATUALIZANDO CLIENTE
    async update(request, response) {

        try {
            // pra atualizar precisa do corpo e do id
            const data = request.body
            const id = request.params.id

            // busca todos os dados do cliente pra manter aqueles que não quero atualizar
            const dataClients = await this.database.query(`
                SELECT * FROM clients
                WHERE id = $1
                `, [id])

            await this.database.query(`
                UPDATE clients
                SET name = $1,
                email = $2,
                cpf = $3,
                contact = $4
                WHERE id = $5
                `, [
                // se não tiver dados novos, mantém os antigos
                data.name || dataClients.rows[0].name,
                data.email || dataClients.rows[0].email,
                data.cpf || dataClients.rows[0].cpf,
                data.contact || dataClients.rows[0].contact,
                id])

            response.status(201).json({
                mensagem: "Cliente atualizado com sucesso."
            })

        } catch (error) { // pega os erros não tratados
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar atualizar um cliente."
            })
        }
    }
    //-----------------------------------------------------------------------------------------------

    // DELETANDO CLIENTE
    async delete(request, response) {

        try {
            const id = request.params.id

            const clients = await this.database.query(`
                DELETE FROM clients
                WHERE id = $1
                `, [id])

            // verifica se deletou alguma linha
            if (clients.rowCount === 0) {
                return response.status(404).json(
                    { mensagem: "O cliente não existe ou já foi deletado." }
                )
            }
            response.status(204).json() // retorna 204 (com sucesso mas sem conteúdo)

        } catch (error) { // pega os erros não tratados
            console.log(error)
            response.status(500).json({
                mensagem: "Ocorreu um erro ao tentar deletar um cliente."
            })
        }
    }
}

module.exports = new ClientsController()