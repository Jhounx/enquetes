const path = require("path")
const moment = require("moment")
require("dotenv").config()
// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'local_my_db',
    user: process.env.DB_USER || 'local_username',
    password: process.env.DB_PASSWORD || 'local_password',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.resolve(__dirname, 'src', 'database', 'migrations') 
  }
};