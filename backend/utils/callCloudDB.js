// 通过云数据库拿到数据
const { getAccessToken } = require('./getAccessToken.js')
const rp = require('request-promise')
const { CLOUD_ENV } = require('./constant')

const callCloudDB = async (fnName, query = {}) => {
  const ACCESS_TOKEN = await getAccessToken()
  console.log("fnname", fnName);
  let body
  if (fnName === 'databasecollectionget') {
    body = {
      env: CLOUD_ENV,
    }

  } else {
    body = {
      query,
      env: CLOUD_ENV,
    }
  }
  const options = {
    method: 'POST',
    uri: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
    body,
    json: true // Automatically stringifies the body to JSON
  }

  return await rp(options)
    .then((res) => {
      console.log();
      return res
    })
    .catch(function (err) {
      console.log("5555-----", err);
    })
}
// 导出promise对象 供在controller里面的文件调用
module.exports = callCloudDB