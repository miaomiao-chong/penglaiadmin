// 业务逻辑
const callCloudDB = require('../utils/callCloudDB')
const { md5 } = require('../utils/util')
const constant = require('../utils/constant')

// 登录
function login(ctx, data) {
  return new Promise(async (resolve, reject) => {
    // 
    const query = `
    db.collection('administrators').where({
      _id: '${data.username}',
      admit:'admit'
    }).get()`
    await callCloudDB('databasequery', query).then(async (res) => {
    
    
      if (res.errcode == 0 && res.data && res.data.length && res.data[0] && JSON.parse(res.data[0]).salt_password === md5(data.password + constant.PWD_SALT)) {
        resolve(JSON.parse(res.data[0]))
      } else if (res.errcode !== 0) {
        // 调用错误
        ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx);
        reject()
      } else {
        // 用户名密码错误
        ctx.app.emit('error', new Error(JSON.stringify({ message: "请检查用户名和密码" })), ctx);
        reject()
      }
    }).catch((err) => {
      // 这个逻辑应该永远不会走到的，因为微信接口是通过判断errcode来确定是否成功的， 而不是走catch逻辑
      // 所以后面的路由都不处理catch里面的逻辑了
      ctx.app.emit('error', new Error(), ctx);
      // 其他错误
      reject(err)
    })
  })
}
function getInfoByName(ctx, querystring) {
  const query = `
  db.collection('administrators').doc('${querystring.username}').get()`
  return new Promise(async (resolve, reject) => {
    await callCloudDB('databasequery', query).then(async (res) => {
      if (res.errcode === 0 && res.data.length > 0) {
        let data = JSON.parse(res.data)
        delete data.salt_password
        resolve(data)
      } else {
        // 查询不到账号
        ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res, message: "出错了，账号异常" })), ctx);
        reject()
      }
    }).catch((err) => {

    })
  })
}
// 注册
function register(ctx, data) {

  return new Promise(async (resolve, reject) => {
    const query = `
    db.collection('administrators').add({
      data: {
        _id:  '${data.username}',
        username:  '${data.username}',
        salt_password: '${md5(data.password + constant.PWD_SALT)}',
        admit: 'pending',
        is_super_admin: false,
        message: '${data.message}',
        phone_num: '${data.phonenum}'
      }
    })
    `
  
    await callCloudDB('databaseadd', query).then(async (res) => {
 
      if (res.errcode !== 0) {
        // 统一处理错误请求
        ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx)
        reject()
      } else {
        resolve(res)
      }
    }).catch((err) => {
      // 其他错误
      ctx.app.emit('error', new Error(err), ctx);
      reject(err)
    })
  })
}

// 超级管理员确认是否通过
function admit(ctx, data) {
  return new Promise(async (resolve, reject) => {

    const updateQuery = `
      db.collection(\"administrators\").doc(\"${data.id}\").update({data:{admit: 'admit'}})
    `
    const deleteQuery = `db.collection(\"administrators\").doc(\"${data.id}\").remove()`
    // admit同意
    if (data.admit === true) {
      await callCloudDB('databaseupdate', updateQuery).then(async (res) => {
     
        if (res.errcode === 0 && res.modified !== 0) {
          resolve(res)
        } else {
          ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
          reject()
        }
      }).catch((err) => {
        reject()
      })
    } else {
      // 不同意
      await callCloudDB('databasedelete', deleteQuery).then(async (res) => {
      
        if (res.errcode === 0 && res.deleted !== 0) {
          resolve(res)
        } else {
          ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
          reject()
        }
      }).catch((err) => {
        reject()
      })
    }

  })
}

// 获取所有普通管理员的列表
function getAdminList(ctx, queryString) {
  return new Promise(async (resolve, reject) => {
    let skip = queryString.skip
    let limit = queryString.limit
    let query = `db.collection('administrators').where({is_super_admin:false}).skip(${skip}).limit(${limit}).get()`
    await callCloudDB('databasequery', query).then(async (res) => {

      if (res.errcode === 0) {
        let resData = res.data
        let jsonData = resData.map(element => {

          let item = JSON.parse(element)
          // 删除密码属性
          delete (item.salt_password)
          return item
        });
    
        resolve({ jsonData, pager: res.pager })
      } else {

        ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx);
        reject()
      }
    }).catch((err) => {
      ctx.app.emit('error', new Error(), ctx);
      reject()
    })
  })
}

function editpassword(ctx, params) {
  return new Promise(async (resolve, reject) => {
    // resolve(ctx.username)
    let username = ctx.username
    let newpwd = params.newpwd

    let query = `db.collection('administrators').doc('${username}').update({
      data: {
        salt_password: '${md5(newpwd + constant.PWD_SALT)}',
      }
    })`

    await callCloudDB('databaseupdate', query).then(async (res) => {
      if (res.errcode === 0) {
        
        resolve(res)
      } else {

        ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx);
        reject()
      }
    }).catch((err) => {
      ctx.app.emit('error', new Error(), ctx);
      reject()
    })
  })
}
module.exports = {
  register, login, admit, getAdminList, getInfoByName, editpassword
}