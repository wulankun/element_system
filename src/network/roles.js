import {request} from './request'

export function roles1(){

    return request({
        url:'/roles',
        method:'get',
       
    })
}


//删除角色制定权限
export function quanxian(roleid,roleid2){

    return request({
        url:`/roles/${roleid}/rights/${roleid2}`,
        method:'delete',
        
       
    })
}

//获取所有权限数据
export function quanxianall(){

    return request({
        url:'/rights/tree',
        method:'get',
        
       
    })
}

// 分配角色权限
export function quanxianID(roleId,rids){

    return request({
        url:`/roles/${roleId}/rights`,
        method:'post',
        data:{
            rids,
            
        }
        
       
    })
}


