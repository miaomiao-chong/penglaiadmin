const constant = require('../utils/constant');
const {updateAccessToken} = require('../utils/getAccessToken')
const errorHandler = (error, ctx) => {

  let { message: errmessage, data: errdata, wxdata: errwxdata } = JSON.parse(error.message)
  let message = errmessage
  console.log("errmessage", errmessage);
  // err: {
  // message,   --> 展示到页面上的信息
  // data,  -->  错误信息自定义对象
  // wxdata   -->  微信调用接口出现的错误信息
  // }
  // error.message拿到错误信息   为特定的值的时候，修改status，并且给message赋值
  if(errmessage===constant.UNAUTHORIZATION||errmessage===constant.UNPERMISSION||errmessage===constant.LOGINFAIL){
    let status = 400
    let body ={}
    if(errmessage===constant.UNAUTHORIZATION){
      status=401
      body={message: '登录过期 请重新登录'}
    }
    if(errmessage===constant.UNPERMISSION){
      status=403
      body={message: '您不具备操作的权限'}
    }
    if(errmessage===constant.LOGINFAIL){
      status=400
      body={message: '用户名或密码错误'}
    }
    ctx.status = status
    console.log({
      code: status,
      ...body, errdata, errwxdata
    });
    ctx.body={
      code: status,
      ...body, errdata, errwxdata
    }
  }else{
    let code = constant.ERR_CODE
    // 如果传入wxdata有值就代表是调用微信接口的时候出错了
    // 有关微信的code: 自定义普通错误返回-1， accesstoken失效返回-2  
    if (errwxdata) {
      console.log("进入到这里了");
  
      if (errwxdata.errcode === 42001 || errwxdata.errcode === 40001) {
        console.log("进入到这里111");
        code = constant.TOKEN_EXPIRE;
        message = "正在刷新微信accesstoken，请重试"
        updateAccessToken()
      }
      if (errwxdata.errcode === -501000) {
        console.log("进入到这里222");
        message = "已经有人注册了"
      }
    }
    ctx.response.body = {
      code: code ,
      message: message || "请求微信接口失败", 
      data: errdata || {}, 
      wxdata: errwxdata || {}
    };
  }
}

module.exports = errorHandler;
