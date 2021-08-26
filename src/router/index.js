import Vue from "vue";
import VueRouter from "vue-router";
import MainLogin from '../view/login/MainLogin'




const Home =()=>import('../view/home/Home')
const Welcome =()=>import('../view/welcome/Welcome')
const Users =()=>import('../view/user/Users')
const Roles =()=>import('../view/roles/Roles')
const Rights =()=>import('../view/rights/Rights')
const Categories =()=>import('../view/categories/Categories')
const Params=()=>import('../view/params/Params')
const Goods=()=>import('../view/goods/Goods')
const Add=()=>import('../view/goods/Add')
const Order=()=>import('../view/order/Order')
const Reports=()=>import('../view/reports/Reports')

Vue.use(VueRouter)


const routes = [
    {
        path:'',
        redirect:'/mainlogin'
    },
    {
     path:'/mainlogin',
     component:MainLogin
    },
    {
        path:'/home',
        component:Home,
        redirect:'/welcome',
        children:[
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path:'/users',
                component:Users
            },
            {
                path:'/roles',
                component:Roles
            },
            {
                path:'/rights',
                component:Rights
            },
            {
                path:'/categories',
                component:Categories
            },
            {
                path:'/params',
                component:Params
            },
            {
                path:'/goods',
                component:Goods
            },
            {
                path:'/goods/Add',
                component:Add
            },
            {
                path:'/orders',
                component:Order
            },
            {
                path:'/reports',
                component:Reports
            }
            
        ]
    },
    
]

const router = new VueRouter({
    routes,
    mode:'history'
})

// 在导出router之前挂在一个导航首位
router.beforeEach((to,from,next)=>{
    // to代表将要访问的路径  from代表从哪个路径跳过来  next是一个函数 表示放行
    if(to.path==='/mainlogin') return next();
    //获取token
  const tokenste=  window.sessionStorage.getItem('token')
  if(!tokenste) return next('/mainlogin')
  next()
})

export default router