const { Pool } = require('pg');

class Database {
    constructor() {
        this.database = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'M2S06',
            password: 'Abacaxi123$',
            port: 5432,
        })
    }
}

module.exports = Database