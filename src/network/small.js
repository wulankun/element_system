import {request} from './request'

export function switchRequst(data1,data2){

    return request({
        url:`/users/${data1}/state/${data2}`,
        method:'put',
       
       
    })
}


// 添加用户的请求
export function userL(data){

    return request({
        url:'/users',
        method:'post',
        data
       
    })
}

//修改按钮的请求
export function edit(id){

    return request({
        url:'/users/'+id,
        method:'get',
        
       
    })
}

//修改按钮->修改信息的请求
export function message1(id,email,mobile){
 
    return request({
        url:"/users/"+id,
        method:'put',
        data:{
            email,
            mobile
        }
        
       
    })
}

//删除按钮的请求
export function delete1(id){
 
    return request({
        url:"/users/"+id,
        method:'delete',
        
        
       
    })
}
//在展示对话框前,获取所有角色的列表
export function huoqu(){
 
    return request({
        url:"/roles",
        method:'get',
        
        
       
    })
}

//分配用户角色
export function yonghu11(id,rid){
 
    return request({
        url:`/users/${id}/role`,
        method:'put',
        data:{
            rid

        }
        
        
       
    })
}





