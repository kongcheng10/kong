import request from "@/utils/request";
//获取频道列表接口
export const getCategory = () => { 
    return request({
        url:'/my/cate/list',
        method:'get',
    })
}
//添加频道接口
export const addCategory = (data) => { 
    return request({
        url:'/my/cate/add',
        method:'POST',
        data:data
    })
}
//删除频道接口
export const deleteCategory = (id) => { 
    return request({
        url:'/my/cate/del',
        method:'delete',
        params:{id}           //这里要用params，params会自动拼接到 URL 后面，最后就会变成 /my/cate/del?id=123
    })
}
//更新频道接口
export const updateCategory = (id,data) => { 
    return request({
        url:'/my/cate/info',
        method:'PUT',
        data:{
            id,
            ...data
        }
    })
}
//获取文章接口
export const getArticleList = (params) => { 
    return request({
        url:'/my/article/list',
        method:'GET',
        params
        
    })
}
//获取文章详情接口
export const getArticleDetail = (id) => { 
    return request({
        url:'/my/article/info',
        method:'GET',
        params:{
            id
        }
        
    })
}
//添加
export const addArticle = (data) => { 
    return request({
        url:'/my/article/add',
        method:'POST',
        data
        
    })
}
//更新
export const updateArticle = (data) => { 
    return request({
        url:'/my/article/info',
        method:'PUT',
        data
        
    })
}
//删除
export const deleteArticle = (id) => { 
    return request({
        url:'/my/article/info',
        method:'DELETE',
        params:{
            id
        }
        
    })
}