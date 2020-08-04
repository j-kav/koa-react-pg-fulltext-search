const path = require('path')
const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)

require('dotenv').config()

const { pool} = require('./db/db-context')
const { IS_HEROKU_ENVIRONMENT } = require('../config')

const loadSqlFile = (filePath) => readFile(path.join(__dirname, './' + filePath), 'utf8')

async function seed() {
    console.log('Creating schema...')
    const query = await loadSqlFile('schema.sql')
    await pool.query(query)

    if (IS_HEROKU_ENVIRONMENT) {
        // console.log('Seeding cities will be skipped during Heroku restrictions...')
        const citiesInsertions = await loadSqlFile('cities.sql')
        await pool.query(citiesInsertions)
    } else {
        console.log('Seeding cities...')
        const citiesCsvFile = `'${path.join(__dirname, '../data-access-layer/seed-data/cities.csv')}'`
        await pool.query(`
        copy cities
        from ${citiesCsvFile}
        delimiter ',' csv header`)
    }
}

seed().then(() => {
    console.log('Finished seeding db')
    process.exit(0)
}).catch((err) => {
    console.error('Error:', err, err.stack)
    process.exit(1)
});
