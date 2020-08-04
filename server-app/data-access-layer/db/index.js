const assert = require('better-assert')
const { SUGGEST_RESULT_LIMIT } = require('../../config')
const { pool } = require('./db-context')


//TODO: https://www.postgresql.org/docs/9.5/textsearch-controls.html#TEXTSEARCH-HEADLINE
exports.suggestCities = async function (searchInput) {
    if (!searchInput) {
        return [];
    }
    assert(typeof searchInput === 'string')

    const result = await pool.query(`
            with auxiliaryStatements as (
                select name,
                       to_tsvector('simple', lower(unaccent(name))) as tsvector,
                       f_concat_suggest_query('${searchInput}') as input
                from cities
            )
            SELECT name, ts_rank_cd(tsvector, query) as rank
            FROM auxiliaryStatements, plainto_tsquery(input) query
            where query @@ tsvector
               or lower(unaccent(name)) ilike '%' || input || '%'
            order by rank desc
            limit ${SUGGEST_RESULT_LIMIT};
        `)

    if (result.rowCount > 0) {
        return result.rows.map(r => r.name);
    }

    return []
}
