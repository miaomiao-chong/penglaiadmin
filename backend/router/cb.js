//cb:  country, bulletin

const Router = require('koa-router')
const router = new Router({ prefix: '/cb' })
const constant = require('../utils/constant')
const { getdata,updateData,getdownloadurl ,uploadimg} = require('../service/cb')
const verifyAuth = require('../middleware/auth')

// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseQuery.html
// 获取数据
// type: bulletinboard,  
router.get('/getdata', verifyAuth, async (ctx, next) => {
  const recordName = ctx.request.query.recordName

  await getdata(ctx, recordName).then((res) => {
  
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "获取数据成功",
      data: res
    }
  }).catch((err) => { next() })
})
// 更新数据
router.post('/updateData', verifyAuth, async (ctx, next) => {
  // console.dir( ctx.request.params);
  const params = ctx.request.body
 
  await updateData(ctx, params).then(() => {
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "更新成功",
      data: []
    }
  }).catch((err) => {next() })
})

// 获取真实下载链接
router.get('/getdownloadurl',verifyAuth,async (ctx, next) => {
  // console.dir( ctx.request.params);
  const params = ctx.request.query.fileid
  await getdownloadurl(ctx, params).then((res) => {
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "",
      data: res
    }
  }).catch((err) => {next() })
})

// 上传图片到云存储(删除原有的图片，上传新图片， 还要把数据库数据更新成新上传的路径)
router.post('/uploadimg', verifyAuth, async (ctx, next) => {
  // {
  //  _id,
  //  fileurl: 文件夹路径
  //  imageurl: 旧图片
  //   
  // }
  // let file = ctx.request.files.file  统一在封装的上传函数里获取
  let params =  ctx.request.body.data
  await uploadimg(ctx, params).then((res) => {
    console.log("res----------", res);
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "图片修改成功",
      data: res
    }
  }).catch((err) => { next() })
})


module.exports = router