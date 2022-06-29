const Router = require('koa-router')
const router = new Router({ prefix: '/dashboard' })
const constant = require('../utils/constant')
const { getdata} = require('../service/dashboard')
const verifyAuth = require('../middleware/auth')

router.get('/getdata', verifyAuth, async (ctx, next) => {
  await getdata(ctx).then((res) => {
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "获取数据成功",
      data: res
    }
  }).catch((err) => {next() })
})

module.exports = router