import {request} from './request'

export function catelist1(type,pagenum,pagesize){

    return request({
        url:'/categories',
        method:'get',
        params:{
            type,
            pagenum,
            pagesize
        }
    })
}

 // 获取父级分类的数据
 export function catelist2(){

    return request({
        url:'/categories',
        method:'get',
        params:{
            type:2,
           
        }
    })
}

//点击添加新的分类
export function fenlei(cat_name,cat_pid,cat_level){

    return request({
        url:'/categories',
        method:'post',
        data:{
            cat_name,
            cat_pid,
            cat_level
        }
    })
}