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
//更新基本资料
export const updateUserInfo = (id,username,nickname,email) => {
    return request({
        url:'/my/userinfo',
        method:'PUT',
        data:{
            id,
            username,
            nickname,
            email,
        }
    })
}
//更新密码
export const updatePassword = (data) => {
    return request({
        url:'/my/updatepwd',
        method:'patch',
        data
    })
}
//更新头像
export const updateAvatar = (data) => {
    return request({
        url:'/my/update/avatar',
        method:'patch',
        data
    })
}