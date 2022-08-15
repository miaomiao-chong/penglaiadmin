const Router = require('koa-router')
const router = new Router({ prefix: '/ars' })
const constant = require('../utils/constant')
const { upload, uploadimg, removeimg, getList,updateimg,removeItem,editItem } = require('../service/ars')
const verifyAuth = require('../middleware/auth')
// let arsitem = ["attraction", "restaurant", "store"]


// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseQuery.html
// 新增
router.post('/upload/:type', verifyAuth, async (ctx, next) => {
  // params  里应该传入username，password
  const params = ctx.params.type
  const introduction = ctx.request.body
  delete introduction._id
  let data = {
    _id: params,
    introduction
  }
  await upload(ctx, data).then((res) => {
    ctx.response.body = {
      code: constant.SUCCESS_CODE,
      message: "添加成功",
      data: res
    }
  }).catch((err) => { next() })
})

router.post('/uploadimg/:type', verifyAuth, async (ctx, next) => {
  // 这里的type应该是图片所在文件夹
  const params = ctx.params.type
  await uploadimg(ctx, params).then((res) => {
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "上传成功",
      data: res
    }
  }).catch((err) => { next() })
})
// 拿到type的显示列表
router.get('/getlist/:type', verifyAuth, async (ctx, next) => {
  const type = ctx.params.type
  await getList(ctx, type).then((res) => {
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "获取列表成功",
      data: res
    }
  }).catch((err) => {next() })
})

// 图片更新
router.post('/updateimg', verifyAuth, async (ctx, next) => {
 
  // {
  //  _id: 记录id
  //  introductionid:  introduction itemid  ,
  //  index: 下标值(废弃)
  //  fileurl: 文件夹路径
  //  imageurl: 旧图片
  // }
  let params = JSON.parse(ctx.request.body.data)
 
  await updateimg(ctx, params).then((res) => {
    console.log("updateimgres", res);
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "图片修改成功",
      data: res
    }
  }).catch((err) => { next() })
})
// 删除图片
router.post('/removeimg', verifyAuth, async (ctx, next) => {

  let fileid = ctx.request.body.fileid
  await removeimg(ctx, fileid).then(() => {
    ctx.body = {
      code: constant.SUCCESS_CODE,
      message: "移除图片成功",
      data: {}
    }
  }).catch((err) => { next() })
})

router.post('/removeItem', verifyAuth, async (ctx, next) => {
  // {
  //   // 删除
  //   imageurl: row.fileurl,
  //   _id: this.type,
  //   introcutionId: row.id,
  // };
  const params =  ctx.request.body
   await removeItem(ctx, params).then((res)=>{
      ctx.body={
        code: constant.SUCCESS_CODE,
        message: "删除成功",
        data: {}
      }
   }).catch((err)=>{})

})

router.post('/editItem', verifyAuth, async (ctx, next) => {
  // {
  //   _id: 记录名,
  //   introductionId: listitem标识id,
  //   introductionItem: {name,information,address,id,imageurl}
  // };
  const params =  ctx.request.body
   await editItem(ctx, params).then((res)=>{
      ctx.body={
        code: constant.SUCCESS_CODE,
        message: "修改成功",
        data: {}
      }
   }).catch((err)=>{})

})



module.exports = router