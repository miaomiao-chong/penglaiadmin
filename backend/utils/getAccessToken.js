const axios = require('axios')
const { APPID, APPSECRET } = require('../utils/constant')
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, './access_token.json')

const updateAccessToken = async () => {

  const resStr = await axios.get(URL)

  const res =resStr.data
  console.log("重新获取了一次", res)
  if (res.access_token) {
    fs.writeFileSync(fileName, JSON.stringify({
      access_token: res.access_token,
      createTime: new Date()
    }))
  } else {
    await updateAccessToken()
  }
}

const getAccessToken = async () => {
  try {
    const readRes = fs.readFileSync(fileName, 'utf8')
    const readObj = JSON.parse(readRes)
    const createTime = new Date(readObj.createTime).getTime()
    const nowTime = new Date().getTime()
    console.log("bbb时间----",nowTime , createTime, nowTime - createTime);
    if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
      console.log("超时了");
      await updateAccessToken()
      await getAccessToken()
    }
    return readObj.access_token
  } catch (error) {
    await updateAccessToken()
    await getAccessToken()
  }
}

setInterval(async () => {
  await updateAccessToken()
}, (7200 - 300) * 1000)


// 导出获取到的access_token
module.exports = {getAccessToken, updateAccessToken}
