import request from '@/utils/request'


export function getList(type) {
  return request({
    url: '/cb/getdata/',
    method: 'get',
    params:type
  })
}

export function getImgUrl(fileid) {
  return request({
    url: '/cb/getdownloadurl/',
    method: 'get',
    params:fileid
  })
}

export function updatedata(data) {
  return request({
    url: '/cb/updateData/',
    method: 'post',
    data
  })
}