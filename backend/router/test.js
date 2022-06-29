const Router = require('koa-router')
const router = new Router({prefix:"/test"})

router.get('/', (ctx,enxt)=>{
    ctx.response.body={
      aaa: 'bbb'
    }
})


router.get('/hahaha', (ctx,enxt)=>{
  ctx.response.body={
    haha: 'bbb'
  }
})
module.exports = router