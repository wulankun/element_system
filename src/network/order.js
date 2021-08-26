import {request} from './request'

export function oder1(params){

    return request({
        url:'/orders',
        method:'get',
        params
    })
}


// 物流地址
export function oder2(){

    return request({
        url:'kuaidi/1106975712662',
        method:'get',
        
    })
}

