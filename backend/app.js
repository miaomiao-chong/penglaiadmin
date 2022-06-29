const Koa = require('koa')
const app = new Koa()

const Router = require('koa-router')
const router = new Router()
const serve = require('koa-static');

const cors = require('koa2-cors')
const koaBody = require('koa-body')

const user = require('./router/user')
const test = require('./router/test')
const dashboard = require('./router/dashboard')
// 有关country, buttelin的逻辑
const cb = require('./router/cb')
// 有关attractions， restaurant store的逻辑
const ars = require('./router/ars')
const errorHandler = require('./middleware/errHandler')


app.use(cors())

app.use(koaBody({
  multipart: true,
}))


app.use(async (ctx, next) => {
  console.log('全局中间件')
  await next()
})

app.use(user.routes())
app.use(ars.routes())
app.use( test.routes())
app.use( cb.routes())
app.use( dashboard.routes())


app.use(router.routes())
app.use(router.allowedMethods())
app.use(serve('../vue-admin/dist'))

app.on('error', errorHandler);
// 服务开启在3020端口
app.listen(3020, () => {
  console.log('服务开启成功')
})