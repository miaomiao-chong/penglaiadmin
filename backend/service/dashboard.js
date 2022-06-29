const callCloudDB = require('../utils/callCloudDB')


function getdata(ctx) {
  return new Promise(async (resolve, reject) => {

    let recordlist = ['store', 'restaurant', 'attraction']
    const query1 = `db.collection('public').doc('${recordlist[0]}').get()`
    const query2 = `db.collection('public').doc('${recordlist[1]}').get()`
    const query3 = `db.collection('public').doc('${recordlist[2]}').get()`
    let p1 = await callCloudDB('databasecollectionget')
    let p2 = await callCloudDB('databasequery', query1)
    let p3 = await callCloudDB('databasequery', query2)
    let p4 = await callCloudDB('databasequery', query3)

    let arr = [p1, p2, p3, p4]
    Promise.all(arr).then((res) => {
      console.dir(res);
      let adminPersonCount = res[0].collections[0].count
      let storeCount = JSON.parse(res[1].data[0]).introductions.length
      let restaurantCount = JSON.parse(res[2].data[0]).introductions.length
      let attractionCount = JSON.parse(res[3].data[0]).introductions.length
      resolve({
        adminPersonCount,storeCount,restaurantCount,attractionCount
      })
    }).catch((err)=>{
      ctx.app.emit('error', new Error(JSON.stringify({ message: '获取失败', wxdata: err })), ctx);
    })
  })
}
module.exports = { getdata }