import request  from "@/utils/imageRequest";
// 获取图片列表接口
export const getImageList = ()=>{
    return request({
        url:'/home/category/head',
        method:'GET'
    })
}
