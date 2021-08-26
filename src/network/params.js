import {request} from './request'

export function params1(){

    return request({
        url:'/categories',
        method:'get',
       
    })
}

// 修改参数的请求
export function params2(cateId,sel){

    return request({
        url:`/categories/${cateId}/attributes`,
        method:'get',
        params:{
            sel
        }
       
    })
}

export function queding(cateId,attr_name,attr_sel){

    return request({
        url:`/categories/${cateId}/attributes`,
        method:'post',
        data:{
            attr_name,
            attr_sel   
        }
       
    })
}

export function bianji(cateId,attr_id,attr_sel){

    return request({
        url:`/categories/${cateId}/attributes/${attr_id}`,
        method:'get',
        params:{
          attr_sel
        }
       
    })
}
// 编辑操作的请求
export function huoqu1(cateId,attr_id,attr_name,attr_sel){

    return request({
        url:`/categories/${cateId}/attributes/${attr_id}`,
        method:'put',
        data:{
          attr_name,
          attr_sel,
          

        }
       
    })
}

//删除的操作
export function delete1(cateId,attr_id){

    return request({
        url:`/categories/${cateId}/attributes/${attr_id}`,
        method:'delete',
       
       
    })
}

// 编辑提交参数
export function tijiaocanshu(cateId,attr_id,attr_name,attr_sel,attr_vals){

    return request({
        url:`/categories/${cateId}/attributes/${attr_id}`,
        method:'put',
       data:{
           attr_name,
           attr_sel,
           attr_vals
       }
       
    })
}




