const CLOUD_ENV = 'cloud1-4ggtvcwv498de39b'
const PWD_SALT = 'penglaiadminqwer'
// token秘钥
const PRIVATE_KEY = 'qwerpenglaiadmin'

const APPID = 'wxef2347a5f51fb862'
const APPSECRET = 'f3be1161457c0fce17fabb4453c7873d'

const DEFAULT_IMG='cloud://cloud1-4ggtvcwv498de39b.636c-cloud1-4ggtvcwv498de39b-1312243214/default-img/无资讯.png'
// 认证失败  401
const UNAUTHORIZATION = 'token失效';
// 403
const UNPERMISSION = '无权限';
// 400
const LOGINFAIL= "登录失败，请检查用户名和密码"
// const MULTIPLE= "已被注册"
// // 这个是微信的accesstoken失效的code码
const TOKEN_EXPIRE = -2
// 普通错误的错误码
const ERR_CODE = -1
const SUCCESS_CODE = 20000


const JWT_EXPIREDTIME = 60*60




module.exports = {
  CLOUD_ENV, 
  PWD_SALT, 
  APPID, 
  APPSECRET, 
  SUCCESS_CODE, 
  ERR_CODE, TOKEN_EXPIRE, 
  PRIVATE_KEY, 
  JWT_EXPIREDTIME,
  UNAUTHORIZATION,
  UNPERMISSION,
  LOGINFAIL,
  DEFAULT_IMG,
  // BASE_CLOUD_IMGURL
  // MULTIPLE
}