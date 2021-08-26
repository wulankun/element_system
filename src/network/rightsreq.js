import {request} from './request'

export function rightslist(){

    return request({
        url:'/rights/list',
        method:'get',
       
    })
}