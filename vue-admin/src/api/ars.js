import request from '@/utils/request'

// 根据fileid删除云存储的图片
export function removeimg(data) {
  return request({
    url: '/ars/removeimg',
    method: 'post',
    data
  })
}

export function upload(data) {
  return request({
    url: '/ars/upload/' + data._id,
    method: 'post',
    data
  })
}
export function getList(type) {
  return request({
    url: '/ars/getlist/' + type,
    method: 'get',
  })
}

export function removeItem(data) {
  return request({
    url: '/ars/removeItem/',
    method: 'post',
    data
  })
}
// 修改数据
export function editItem(data) {
  return request({
    url: '/ars/editItem/',
    method: 'post',
    data
  })
}
// 获取线上链接  和cb共用
