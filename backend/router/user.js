const Router = require('koa-router')
const router = new Router({prefix: '/user'})
const constant = require('../utils/constant')
const { register,login,admit,getAdminList,getInfoByName,editpassword} = require('../service/user')
const {authToken} = require('../utils/util')
const verifyAuth  = require('../middleware/auth')
// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseQuery.html
// 登录
router.post('/login', async(ctx,next)=>{
  // params  里应该传入username，password
  const params = ctx.request.body
  let token = authToken(params.username)
  await login(ctx,params).then((res)=>{
   ctx.response.body={
      code: constant.SUCCESS_CODE,
      message:"登录成功",
      data: {
        role: res.is_super_admin?'superAdmin': 'commonAdmin',
        username: res.username,
        token: token
      }
    }
  }).catch((err)=>{
    next()
  })



})

// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseAdd.html
// 注册
router.post('/register', async(ctx,next)=>{
  // params  里应该传入username，password, message
  const params = ctx.request.body
 
  await register(ctx,params).then((res)=>{

    ctx.response.body={
      code: constant.SUCCESS_CODE,
      message:"已发送审核",
      data: res
    }
  }).catch((err)=>{
    next()
  })

})

router.get('/getInfoByToken',verifyAuth, async(ctx,next)=>{
  // 在verifyAuth中间件已经解好码了
 
  await getInfoByName(ctx,{username: ctx.username}).then((res)=>{
    ctx.response.body={
      code: constant.SUCCESS_CODE,
      data: res
    }
  }).catch((err)=>{
    next()
  })
})

// 对管理员的操作
router.post('/edit',verifyAuth, async(ctx,next)=>{
  // 传入两个字段：id, admit
  // id: _id
  // admit: true,false
  // 为false的时候，管理员数据从数据库删除
  // 为true的时候，改字段数据就行了
  const params = ctx.request.body
 
  await admit(ctx,params).then((res)=>{
    // 操作是否成功
    // 修改状态  更新记录
    ctx.response.body={
      code: constant.SUCCESS_CODE,
      message:"修改状态成功",
      data: res
    }
  }).catch((err)=>{
    // 交给错误处理中间件
    next()
  })

})

// 获取所有普通管理员的信息
router.get('/getAdminList',verifyAuth, async(ctx,next)=>{
  const params = ctx.request.query
  await getAdminList(ctx,params).then((res)=>{
    ctx.response.body={
      code: constant.SUCCESS_CODE,
      message:"获取成功",
      data: res.jsonData,
      pager: res.pager
    }
  }).catch((err)=>{
  
    next()
  })
})

router.post('/editpassword',verifyAuth, async(ctx,next)=>{
  const params = ctx.request.body
  await editpassword(ctx,params).then((res)=>{
    ctx.response.body={
      code: constant.SUCCESS_CODE,
      message:"修改成功",
      data:res
    }
  }).catch((err)=>{
   
    next()
  })
})


module.exports = router