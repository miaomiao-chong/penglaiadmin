import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = "Bearer "+getToken()
    }
    return config
  },
  error => {
    // do something with request error
    //console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    //console.log("rfdsfdsfdses", res);
    if(res.code===20000){
      if(res.message&&res.message.length){
        Message({
          message: res.message ,
          type: 'success',
          duration: 2 * 1000
        })
      }
      return res
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 2 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === -2) {
        // to re-login
        this.setTimeout(() => {
          location.reload()
        }, 1000);
        
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } 
  },
  // https://www.axios-http.cn/docs/handling_errors
  error => {
    console.dir(error);
   
    Message({
      message: error.response.data.message||error.message,
      type: 'error',
      duration: 2 * 1000
    })
    //console.log(error,error.response,error.response.status);
    if(error.response.status===401){
        // to re-login
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
    }

    return Promise.reject(error)
  }
)

export default service
