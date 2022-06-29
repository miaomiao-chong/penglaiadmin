// 有关attractions， restaurant store的逻辑
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')
const { DEFAULT_IMG } = require('../utils/constant')
const { generateId } = require('../utils/util')
// 上传信息
function upload(ctx, data) {

  return new Promise(async (resolve, reject) => {
    data.introduction.id = generateId()
    data.introduction.information = data.introduction.information.replace(/\n/g, "\\\\n")
    let query = `
     db.collection('public').doc('${data._id}').update({
      data: {
        introductions: _.unshift(${JSON.stringify(data.introduction)})
      }
    })
    `
    await callCloudDB('databaseupdate', query).then((res) => {
      if (res.errcode === 0 && res.modified !== 0) {
        resolve(res)
      } else {
        ctx.app.emit('error', new Error(JSON.stringify({ message: '添加失败', wxdata: res })), ctx);
        reject()
      }
    })
  })
}

// 
async function uploadimg(ctx, type) {
  // data.type  
  return new Promise(async (resolve, reject) => {
    const fileid = await cloudStorage.upload(ctx, type)
    resolve(fileid)
  })
}

async function updateimg(ctx, data) {
  // 逻辑： 先上传新照片到云存储， 之后还要删除当前的照片， 并且更新数据库数据
  // {
  //  _id: 记录id
  //  introductionid:  introduction itemid,
  //  index: 下标值(废弃)
  //  fileurl: 文件夹路径
  //  imageurl: 旧图片
  // }

  return new Promise(async (resolve, reject) => {
    const { _id, introductionid, fileurl, imageurl } = data
    // 上传新图片
    // fileurl = fileurl.split('/')[3]
    let fileurlformat = fileurl.split('/')[3]
    await cloudStorage.upload(ctx, fileurlformat).then(async (uploadimage) => {
      // 删除旧图片
  
      cloudStorage.delete(ctx, [imageurl]).then((res) => { }).catch((err) => { ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx); })
      // let query = `db.collection('public').doc('${_id}').where("{introductions:db.command.elemMatch({id:'${introductionid}'})}")`
      // let query = `db.collection('public').where({introductions:db.command.elemMatch({id:'${introductionid}'})})`

      let query = `
      db.collection('public').where({
        '_id': '${_id}',
        'introductions.id': '${introductionid}'
        }).update({
        data:{
        'introductions.$.imageurl': '${uploadimage}'
        }
        })
        `
 

      await callCloudDB('databaseupdate', query).then(async (res) => {
  
        if (res.errcode === 0 && res.modified !== 0) {
 
          resolve(uploadimage)
        } else {
          ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
        }
      }).catch((err) => {  })
    })
  })

}

// 修改对应id的 introduction 
async function editItem(ctx, data) {
  return new Promise(async (resolve, reject) => {
    // {
    //   _id: 记录名,
    //   introductionId: listitem标识id,
    //   introductionItem: {name,information,address,id,imageurl}
    // };

    const { _id, introductionId, introductionItem } = data
    // 上传新图片
    introductionItem.information = introductionItem.information.replace(/\n/g, "\\\\n")
    let query = `
    db.collection('public').where({
      '_id': "${_id}",
          'introductions.id': "${introductionId}"
          }).update({
          data:{
          'introductions.$': ${JSON.stringify(introductionItem)}
          }
          })
          `
   
    await callCloudDB('databaseupdate', query).then(async (res) => {
    
      if (res.errcode === 0 && res.modified !== 0) {

        resolve(res)
      } else {

        ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
      }
    }).catch((err) => {})
  })

}

// 删除图片
async function removeimg(ctx, fileid) {
  return new Promise(async (resolve, reject) => {
    await cloudStorage.delete(ctx, fileid)
    resolve()
  })
}

async function removeItem(ctx, data) {
 
  let { imageurl, introductionId, _id } = data
  return new Promise(async (resolve, reject) => {

    // 删除数组中的某一项  不支持https://developers.weixin.qq.com/community/develop/doc/0000202fad8c38ed3a292862f51800?_at=1569973995514
    // 方法1： 目前不支持
    // const query = `db.collection('public').doc('${_id}').update({
    //   data:{
    //     introductions: db.command.pull({
    //       id: db.command.eq('${introductionId}')
    //     })
    //   }
    // })`

    // 方法2：重新插入数组： 不好用，因为获取的是\\n  这是不能插入数据库的  重新插入的话，需要replace成\\\\n
    // const query = `db.collection('public').doc('${_id}').get()`
    // await callCloudDB('databasequery', query).then(async (res) => {
    //   console.log("aaaaaaaaares", res);

    //   if (res.errcode !== 0) {
    //     ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx);
    //     reject()
    //   }

    //   // 获取列表
    //   let arr = res.data[0] && JSON.parse(res.data[0]).introductions || []
    //   if (arr.length) {

    //     let index = arr.findIndex((item) => {
    //       return item.id === introductionId
    //     })
    //     // 新数组
    //     arr.splice(index, 1)

    //     // arr =  arr.map((item)=>{
    //     //   return JSON.stringify(item)
    //     // })
    //     console.log("arr----", arr);
    //     let query1 = `db.collection("public").doc("${_id}").update({data:{introductions:  ${JSON.stringify(arr)}}})`
    //     console.log("query1", query1);
    //     await callCloudDB('databaseupdate', query1).then(async (res) => {
    //       console.log("databaseupdate", res);
    //       if (res.errcode === 0 && res.modified !== 0) {
    //         resolve(res)
    //       } else {
    //         ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
    //         reject()
    //       }
    //     }).catch((err) => {
    //       reject()
    //     })
    //   }

    //   resolve(arr)
    //   // res.data[0] ? resolve(JSON.parse(res.data[0])): resolve([]) 
    // }).catch((err) => {
    //   reject(err)
    // })
    //方法3： 找到index  指定下标删除   注意这一项依然存在只是变成null了 不能用
    // const query = `db.collection('public').doc('${_id}').get()`
    // await callCloudDB('databasequery', query).then(async (res) => {
    //   if (res.errcode !== 0) {
    //     ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx);
    //     reject()
    //   }
    //   cloudStorage.delete(ctx, imageurl)
    //   let arr = res.data[0] && JSON.parse(res.data[0]).introductions || []

    //   if (arr.length) {
    //     let index = arr.findIndex((item) => {
    //       return item.id === introductionId
    //     })
    //     const query1 = `db.collection('public').doc('${_id}').update({
    //       data:{
    //         'introductions.${index}':_.remove()
    //       }
    //     })`
    //     console.log("query1----", query1);
    //     await callCloudDB('databaseupdate', query1).then((res)=>{
    //       console.log("r-----es", res);
    //       if(res.errcode===0&&res.modified===1){
    //         resolve(res)
    //       }else{
    //         ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
    //       }
    //     })
    //   }
    // })



    const query = `db.collection('public').doc('${_id}').get()`
    await callCloudDB('databasequery', query).then(async (res) => {
   
      // 删除图片
      cloudStorage.delete(ctx,imageurl)
      if (res.errcode !== 0) {
        ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx);
        reject()
      }

      // 获取列表
      let arr = res.data[0] && JSON.parse(res.data[0]).introductions || []
      if (arr.length) {

        let index = arr.findIndex((item) => {
          return item.id === introductionId
        })
        // 新数组
        arr.splice(index, 1)

        // arr =  arr.map((item)=>{
        //   return JSON.stringify(item)
        // })
        let arrString = JSON.stringify(arr).replace(/\\n/g, '\\\\n')
      
        let query1 = `db.collection("public").doc("${_id}").update({data:{introductions:  ${arrString}}})`

        await callCloudDB('databaseupdate', query1).then(async (res) => {
        
          if (res.errcode === 0 && res.modified !== 0) {
            resolve(res)
          } else {
            ctx.app.emit('error', new Error(JSON.stringify({ message: '失败', wxdata: res })), ctx);
            reject()
          }
        }).catch((err) => {
          reject()
        })
      }

      resolve(arr)
      // res.data[0] ? resolve(JSON.parse(res.data[0])): resolve([]) 
    }).catch((err) => {
      reject(err)
    })


  })
}

async function getList(ctx, type) {

  return new Promise(async (resolve, reject) => {
    const query = `db.collection('public').doc('${type}').get()`
   
    await callCloudDB('databasequery', query).then(async (res) => {
   

      if (res.errcode !== 0) {
        ctx.app.emit('error', new Error(JSON.stringify({ wxdata: res })), ctx);
        reject()
      }
      // 上传路径
      let fileurls = res.data[0] && JSON.parse(res.data[0]).fileurls
      // 列表
      let arr = res.data[0] && JSON.parse(res.data[0]).introductions || []
     
      if (arr.length) {
        // 需要拿到图片http链接
        // 万一有的没有图片怎么办，数组里有空字符串会报错的？  上传的时候强制带图片或者给一个默认路径吧
       
        let fileidlist = arr.map((item) => {
          return {
            //  空的imgurl给他一个默认值
            fileid: (item.imageurl && item.imageurl.length) ? item.imageurl : DEFAULT_IMG,
            max_age: 7200
          }
        })

        let result = await cloudStorage.download(ctx, fileidlist)
       
        result.file_list.forEach((element, index) => {
       
          arr[index].downloadurl = element.download_url
          //         这里replace一下information
          arr[index].information = arr[index].information.replace(/&nbsp;/g, ' ').replace(/\\n/g, '\n')
          arr[index].fileurls = fileurls
        });
      }
      resolve(arr)
      // res.data[0] ? resolve(JSON.parse(res.data[0])): resolve([]) 
    }).catch((err) => {
      reject(err)
    })
  })
}



module.exports = {
  upload, uploadimg, removeimg, getList, updateimg, removeItem, editItem
}