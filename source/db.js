const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  database: 'todoapp',
  password: 'abcd'
})

module.exports = pool
