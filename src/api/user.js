import request from '@/utils/request'

//注册接口
export const userRegister = (username, password,repassword) => {
    return request( {
        method: 'POST',
        url: '/api/reg',
        data: {
            username,
            password,
            repassword
        }
    })
}
//登录接口
export const userLogin = (username, password) => {
    return request( {
        method: 'POST',
        url: '/api/login',
        data: {
            username,
            password
        }
    })
}
//获取用户信息接口
export const getUserInfo = () =>{
    return request({
        url:'/my/userinfo',
        method:'get',
    })
}