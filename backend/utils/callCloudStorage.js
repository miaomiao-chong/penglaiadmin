// 云存储操作
const {getAccessToken} = require('./getAccessToken.js')
const {CLOUD_ENV} = require('./constant')
const rp = require('request-promise')
const fs = require('fs')

// 把有关云存储的方法都封装到这个对象里面
const cloudStorage = {
  // 获取文件真实下载链接（由云存储里面的链接转成我们浏览器能使用的链接）
  // 文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/batchDownloadFile.html
  // fileList 文件列表
  async download(ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
      body: {
        env: CLOUD_ENV,
        file_list: fileList
      },
      json: true
    }

    return await rp(options)
      .then((res) => {
        return res
      })
      .catch(function (err) {
        console.log(err);
      })
  },

  async upload(ctx,folder) {
    // 文件上传官方文档https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/uploadFile.html
    // 从文档可知，需要走两步，第一步获取到返回数据后，需要再进行拼装发送一个post请求
    // 1、请求地址
    const ACCESS_TOKEN = await getAccessToken()
    // console.log("ctxaaaa", ctx);
    const file = ctx.request.files.file
    // console.log("ctx.request.files.file",ctx.request.files.file);
    console.log("folder",folder);
    // 存储在云存储的路径
    folder = folder.slice(-1)==='/'? folder.slice(0, folder.length-1): folder
    console.log("folder", folder);
    const path = `${folder}/${Date.now()}-${Math.random()}-${file.name}`
    console.log( {
      path,
      env: CLOUD_ENV,
    },);
    console.log("pa-----th", path);
    const options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
      body: {
        path,
        env: CLOUD_ENV,
      },
      json: true // Automatically stringifies the body to JSON
    };
    // 
    const info = await rp(options)
      .then(function (res) {
        return res
      })
      .catch(function (err) {
      })
    console.log(info)
    // 2、上传图片
    const params = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      uri: info.url,
      formData: {
        key: path,
        Signature: info.authorization,
        'x-cos-security-token': info.token,
        'x-cos-meta-fileid': info.cos_file_id,
        // 二进制数据  如何获取--用fs模块
        file: fs.createReadStream(file.path)
      },
      json: true
    }
    // 没有返回值
    await rp(params)
    // 因为后面要用到file_id 所以把它返回
    return info.file_id
  },

  // 删除云存储数据
  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
      body: {
        env: CLOUD_ENV,
        // fileid列表
        fileid_list: fileid_list
      },
      json: true
    }

    return await rp(options)
      .then((res) => {
        console.log("deleteimg");
        return res
      })
      .catch(function (err) {
        console.log(err);
      })
  }
}

module.exports = cloudStorage