import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'user/getInfoByToken',
    method: 'get',
  })
}



export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}
export function getList(listQuery) {
  return request({
    url: '/user/getAdminList',
    method: 'get',
    params: listQuery
  })
}

export function editpwd(data) {
  return request({
    url: '/user/editpassword',
    method: 'post',
    data
  })
}

