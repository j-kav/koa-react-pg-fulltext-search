const pg = require('pg')

const { CONNECTION_STRING } = require('../../config')

const pool = new pg.Pool({ connectionString: CONNECTION_STRING })

module.exports = { pool }
