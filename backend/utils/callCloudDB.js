// 通过云数据库拿到数据
const { getAccessToken } = require('./getAccessToken.js')
const axios = require('axios')
const { CLOUD_ENV } = require('./constant')

const callCloudDB = async (fnName, query = {}) => {
  const ACCESS_TOKEN = await getAccessToken()
  console.log("fnname", fnName);
  let data
  if (fnName === 'databasecollectionget') {
    data = {
      env: CLOUD_ENV,
    }

  } else {
    data = {
      query,
      env: CLOUD_ENV,
    }
  }
  const options = {
    method: 'POST',
    url: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
    data,
    json: true // Automatically stringifies the body to JSON
  }

  return axios(options)
    .then((res) => {
      console.log("axios res", res);
      return res.data
    })
    .catch(function (err) {
      console.log("axios err", err);
    })
}
// 导出promise对象 供在controller里面的文件调用
module.exports = callCloudDB