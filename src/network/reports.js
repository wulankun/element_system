import {request} from './request'

export function reports1(){

    return request({
        url:'/reports/type/1',
        method:'get',
        
    })
}