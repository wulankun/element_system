<template>
  <div>
   <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>全选管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-table :data="rithtsList" border stripe>
        <el-table-column type="index"></el-table-column>
         <el-table-column label="权限名称" prop="authName"></el-table-column>
         <el-table-column label="路径" prop="path"></el-table-column>
         <el-table-column label="权限等级" prop="level">
           <template slot-scope="scope">
           <el-tag v-if="scope.row.level==='0'">一级</el-tag>
           <el-tag type="success" v-else-if="scope.row.level==='1'" >二级</el-tag>
           <el-tag type="warning" v-else>三级</el-tag>

         </template>
         </el-table-column>
         
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {rightslist} from '../../network/rightsreq'
export default {
    name:'Rights',
    created(){
      this.getRightsList()
    },
    methods:{
      getRightsList(){

        rightslist().then(res=>{
          console.log(res);
          if(res.meta.status!==200) return this.$message.error('获取失败')
          this.rithtsList=res.data
          console.log( this.getRightsList);
        })
      }
    },
    data(){
      return{
        rithtsList:[

        ],
      }
    }
}
</script>

<style lang="less" scoped>
// .el-table{
//   height: 515px;
//   overflow: hidden;
//   overflow-y: scroll;
// }

</style>