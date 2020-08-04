const Router = require('koa-router')
const HttpStatus = require('http-status')

const db = require('../data-access-layer/db')

const router = new Router()

router.get('/suggest',async (ctx, next) => {
    const searchInput = decodeURIComponent(ctx.request.query.searchInput)

    try {
        ctx.body = await db.suggestCities(searchInput)
        ctx.status = HttpStatus.OK
    } catch(error) {
        console.error(error)
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR
    }

    await next()
});

module.exports = router
