const Router = require('koa-router')
const HttpStatus = require('http-status')
const router = new Router()

router.get('/suggest',async (ctx, next) => {
    const searchInput = ctx.request.query.searchInput
    const result = ['Gutenzell-Hurbel', 'OElbronn-Duerrn', 'Konigsbach-Stein', 'Mallersdorf-Pfaffenberg', 'Kromsdorf', 'Katlenburg-Lindau', 'Muhr am See']
    ctx.body = result
    ctx.status = HttpStatus.OK
    await next()
});

module.exports = router
