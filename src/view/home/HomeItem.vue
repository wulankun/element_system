<template>
  <div>
<el-container class="home-container">
   
      <!-- 头部区域 -->
  <el-header>
    <div class="header-img">
      <img src="../../assets/logo.png" alt="">
      <span>电商后台管理系统</span>
    </div>
     <el-button  type="info" @click="logout">退出</el-button>
  </el-header>

  <el-container>
       <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" >   
      <div class="toggle-button" @click="toggleCollapse">|||</div>   
      <el-menu 
      :collapse="isCollapse"
      background-color="RGB(51,55,68)"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse-transition="false"
      :router="true"
      :default-active="activePath">
       <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="icon[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
           <!-- 二级菜单 -->
        <el-menu-item :index="'/'+itemx.path" v-for="itemx in item.children" 
        :key="itemx.id" 
        @click="saveNavState('/'+itemx.path)">
          <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{itemx.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>
       <!-- 主体  区域 -->
    <el-main > <router-view></router-view></el-main>
  </el-container>

</el-container>
  </div>
</template>

<script>
import {MenuList} from '../../network/login'
export default {
name:'HomeItem',
created(){
  this.getMenuList()
  this.activePath=window.sessionStorage.getItem('activePath')
},
data(){
  return{
    menulist:[],
    icon:{
      '125':'iconfont icon-yonghu',
      '103':'iconfont icon-quanxian',
      '101':'iconfont icon-shangpin' ,
      '102':'iconfont icon-dingdan',
      '145':'iconfont icon-shuju'
    },
    isCollapse:false,
    activePath:''
  }
},
methods:{
    logout(){
        window.sessionStorage.clear()
        this.$router.push('/mainlogin')

    },
    getMenuList(){
      MenuList().then(res=>{
        // console.log(res);
       if(res.meta.status !== 200) {return this.$message.error(res.meta.msg)}
       this.menulist=res.data
      })
    },
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath

    },
}
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100vh;
}

.el-header{
background-color: #373d41;
display: flex;
justify-content: space-between;
padding-left:0 ;
align-items: center;
color: #fff;
font-size: 15px;

  span{
  margin-left: 20px;
}

}
.el-aside{
  background-color: #333744;  
}
.el-main{
    background-color:#eaedf1 ;
}

.header-img{
  height: 50px;
  width: 250px;
display: flex;
align-items: center;
  img{
    width: 40px;
    height: 40px;
    
  }
}
.el-menu{
  border-right: none;
}
.toggle-button{
  background: #4a5064;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}


</style>