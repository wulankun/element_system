import {request} from './request'

export function goodslist(query,pagenum,pagesize){

    return request({
        url:'/goods',
        method:'get',
        params:{
            query,
            pagenum,
            pagesize
        }
    })
}

// 删除操作
export function delete1(id){

    return request({
        url:`/goods/${id}`,
        method:'delete',
        
    })
}
