import axios from 'axios'

import NProgress from 'nprogress'    //进度条加载插件
import 'nprogress/nprogress.css'     //进度条加载插件

export function request(config){

    const instance=axios.create({
        baseURL:'http://127.0.0.1:8888/api/private/v1',
        timeout:5000
    })
    // 2.axios请求拦截器
instance.interceptors.request.use(config=>{  
    config.headers.Authorization=window.sessionStorage.getItem('token')

    NProgress.start()                  //进度条加载插件
    return config
   
    
},err=>{
    console.log(err)
})

// 2.axios相应拦截器
instance.interceptors.response.use(res=>{
    NProgress.done()                   //进度条加载插件  
    return res.data
},err=>{
    console.log(err);
})


    return instance(config)
}

