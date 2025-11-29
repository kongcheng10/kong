
import axios from 'axios'
// 创建一个专门请求图片的 axios 实例
const imageRequest = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net', // 图片服务专属 base
  
  timeout: 10000
})

// // 这里可以根据需要添加请求拦截器
// request.interceptors.request.use()

// //和响应拦截器
// request.interceptors.response.use()


export default imageRequest