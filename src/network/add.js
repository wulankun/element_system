import {request} from './request'

export function add1(){

    return request({
        url:'/categories',
        method:'get',
        
    })
}


export function add2(cateId,sel){

    return request({
        url:`/categories/${cateId}/attributes`,
        method:'get',
        params:{
            sel

        }
        
    })
}


export function add3(cateId,sel){

    return request({
        url:`/categories/${cateId}/attributes`,
        method:'get',
        params:{
            sel

        }
        
    })
}


export function add4(data){

    return request({
        url:'/goods',
        method:'post',
        data
        
    })
}


