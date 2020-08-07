require('dotenv').config()
const Koa = require("koa")
const BodyParser = require("koa-bodyparser")
const Logger = require("koa-logger")
const cors = require('koa-cors')
const serve = require("koa-static")

const { PORT } = require("./config")

const index = new Koa()

index.use(BodyParser())
index.use(Logger())
index.use(cors())

const router = require('./routes/index')

index.use(serve(__dirname + '/../public'));
index.use(serve(__dirname + '/../client-app/build'));

index.use(router.routes())
index.use(router.allowedMethods())

index.listen(PORT,  () => {
    console.log('==> 🌎  Listening on port %s. Visit http://localhost:%s/', PORT, PORT)
});
