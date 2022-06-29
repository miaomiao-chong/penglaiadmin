// 有关attractions， restaurant store的逻辑
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')

function getdata(ctx, recordName) {
  // type: bulletinboard,  countryintroduction
 
  const query = `db.collection('public').doc('${recordName}').get()`

  return new Promise(async (resolve, reject) => {
    await callCloudDB('databasequery', query).then(async (res) => {
      if (res.errcode !== 0) {
        ctx.app.emit('error', new Error(JSON.stringify({ message: '获取失败', wxdata: res })), ctx);
        reject()
      }
      let data = JSON.parse(res.data[0])
  
      // 把nbsp;改成空格,  把\n改成<br>
      data.information = data.information.replace(/&nbsp;/g, ' ').replace(/\\n/g, '\n')
      resolve(data)
    }).catch((err) => {
    
    })
  })
}


function updateData(ctx, params) {
  

  let { recordName, data } = params

  data.information=   data.information.replace(/\n/g, "\\\\n")
 
  let updateQuery = `
  db.collection(\"public\").doc(\"${recordName}\").update({data:${JSON.stringify(data)}})
  `

  return new Promise(async (resolve, reject) => {
    await callCloudDB('databaseupdate', updateQuery).then(async (res) => {
     
      if (res.errcode === 0) {

        resolve()
      } else {
     
        ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
        reject()
      }
    }).catch((err) => { })
  })
}
// 获取下载链接
function getdownloadurl(ctx, fileid) {
  let fileidlist = [{ fileid: fileid, max_age: 7200 }]
  return new Promise(async (resolve, reject) => {
    await cloudStorage.download(ctx, fileidlist).then((res) => {
      resolve(res.file_list)
    }).catch((err) => {
    
      reject()
    })
  })
}
// 上传图片并更新数据库
async function uploadimg(ctx, data) {
 // 记录名， 图片文件夹名， 旧图片的fileid 
  let {_id, fileurl, imageurl}  = JSON.parse(data)
  fileurl = fileurl.split('/')[3]
 
  return new Promise(async (resolve, reject) => {
    // 删除旧图片

    // 上传到云存储
   
    await cloudStorage.upload(ctx,fileurl).then(async(uploadimage)=>{
      // 上传成功之后删除旧图片
    
      cloudStorage.delete(ctx,[imageurl]).then((res)=>{}).catch((err)=>{ ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);})

      // res: fileid
    
      // 修改数据库文件
      let query = ` db.collection(\"public\").doc(\"${_id}\").update({data:{imageurl: "${uploadimage}"}})`
   
      await callCloudDB('databaseupdate', query).then(async (res) => {
     
        if (res.errcode === 0 && res.modified !== 0) {
        
          resolve(uploadimage)
        } else {
          ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
        }
      }).catch((err) => {})
    })
  })
}






module.exports = {
  getdata, updateData, getdownloadurl, uploadimg
}