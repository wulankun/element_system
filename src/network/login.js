import {request} from './request'

export function LoginAxios(data1,data2){

    return request({
        url:'/login',
        method:'post',
        data:{
            username:data1,
            password:data2
        }
    })
}

//   第二个请求获取菜单
export function MenuList(){

    return request({
        url:'/menus',
        method:'get',
       
    })
}
// 第三个请求 获取用户列表
export function UserList(params){

    return request({
        url:'/users',
        method:'get',
        params
       
    })
}

