const crypto  = require('crypto')
const jwt = require('jsonwebtoken')
const constant  = require('../utils/constant')
// md5加密
function md5(s) {
  return crypto.createHash('md5')
    .update(String(s)).digest('hex');
}

// 授权jwt
function authToken(username) {
  console.log("username12", username);
  console.log("根据", username,"获得的token");
  const token = jwt.sign({
    username
  }, constant.PRIVATE_KEY, { expiresIn: constant.JWT_EXPIREDTIME });
    return token
}
function generateId(){
 //获取随机数id
    let date = Date.now();
    let rund = Math.ceil(Math.random()*1000)
    let id = date + '' + rund;
    return id;
}



module.exports={
  md5,authToken,generateId
}