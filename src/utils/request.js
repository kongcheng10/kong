import axios from 'axios';
import { ElMessage } from 'element-plus'
import  router  from '@/router';

// 引入用户仓库来验证有无token
import { useUserStore } from '@/stores/user'
const baseURL = 'https://big-event-vue-api-t.itheima.net';
  // TODO 1. 基础地址，超时时间
const request = axios.create({
  baseURL,
  timeout: 5000,
});
// 请求拦截器在发送请求前做的事情
request.interceptors.request.use(
  (config) => {   //config 参数: 包含本次请求的所有配置信息（URL、方法、headers等）
    // 有token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token //如果有token将token放入请求头中这样每次之后的请求都会携带token
    }
    return config;
  },
  //无token直接返回错误进入响应拦截
  (error) => {
    return Promise.reject(error);
  }
);
// 响应拦截器
request.interceptors.response.use(
  (res) => {
    // TODO 3. 摘取核心响应数据
    if(res.data.code === 0){  //这里要看后端接口文档定义的成功标志
        return res
    }
    // TODO 4. 处理业务失败
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 3. 响应失败拦截
    if (err.response.status === 401) {
      ElMessage.error('请重新登录');
      router.push('/login')

    }
    //其他错误
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
);

export default request;
export { baseURL };
