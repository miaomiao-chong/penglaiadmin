import request from '@/utils/request'
export function getCount() {
  return request({
    url: '/dashboard/getdata',
    method: 'get',
  })
}