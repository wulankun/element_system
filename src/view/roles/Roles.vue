<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1===0 ? 'bdtop':'','vcenter']" >
                <!-- 渲染一级权限 -->
                <el-col :span="5"> 
                 <el-tag closable  @close="removeRightById(scope.row,item1.id)"> {{item1.authName}} <i class="el-icon-caret-right"></i></el-tag>
                </el-col>
                <!-- 渲染二级和三级权限 -->
                 <el-col :span="19">
                  <el-row v-for="(item2,i2) in item1.children" :class="[i2===0 ? '':'bdtop','vcenter']" :key="item2.id" >
                    <el-col :span="6">
                      <el-tag type="success" closable  @close="removeRightById(scope.row,item2.id)"> {{item2.authName}}  <i class="el-icon-caret-right"></i></el-tag>
                    </el-col>
                    <el-col :span="18">
                      <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                 </el-col>
              </el-row>
            </template>
          </el-table-column>
<el-table-column type="index"> </el-table-column>
<el-table-column label="角色名称" prop="roleName"> </el-table-column>
<el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
<el-table-column label="操作" width="300px" > 
  <template slot-scope="scope" :index="scope">
    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
  </template>
</el-table-column>
      </el-table>
    </el-card>
<!-- 分配权限 -->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="30%"
  @close="setRightDialogClosed"
  >
  <!-- 树形控件 -->
  <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id"  default-expand-all :default-checked-keys="defKeys" ref="treeRef"> </el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {roles1,quanxian,quanxianall,quanxianID} from '../../network/roles'
export default {
name:'Roles',
data(){
  return{
    // 所有角色列表数据
    rolelist:[],
    setRightDialogVisible:false,
    rightslist:[],
    treeProps:{
      label:'authName',
      children:'children'
    },
    // 默认选中的节点ID值
    defKeys:[],
    // 当前即将分配权限的角色ID
    roleId:''
  }
},
created(){
  this.getRolesList()
},
methods:{
  getRolesList(){
    roles1().then(res=>{
      // console.log(res);
      this.rolelist=res.data
      // console.log(this.rolelist);
    })
  },
  //根据ID删除对应的权限
 async  removeRightById(role,id){
  
    //弹框提示用户是否要删除
 const confirmResult=  await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)

        if(confirmResult!=='confirm'){
          return this.$message.info('取消了删除')
        }
        quanxian(role.id,id).then(res=>{
          // console.log(res);
          if(res.meta.status!==200) return  this.$message.error('删除权限失败')
          // this.getRolesList()
          role.children=res.data
          
        })
      
  },
  showSetRightDialog(role){
    this.roleId=role.id
    quanxianall().then(res=>{
      // console.log(res);
      if(res.meta.status!==200) return this.$message.error('获取失败')
      this.rightslist=res.data
      // console.log(this.rightslist);
    })
    this.getLeafKeys(role,this.defKeys)
    this.setRightDialogVisible=true
  },
  // 获取三级权限的数据
  getLeafKeys(node,arr){
    if(!node.children){
      return arr.push(node.id)
    }
    node.children.forEach(item=>{this.getLeafKeys(item,arr)})  
  },
  // 监听分配权限对话框的关闭事件
  setRightDialogClosed(){
    this.defKeys=[]
  },
  // 点击为角色分配权限
  allotRights(){
    const keys=[
      ...this.$refs.treeRef.getCheckedKeys(),          //全选状态下的
      ...this.$refs.treeRef.getHalfCheckedNodes()       //半全选状态下的
 
    ]
   const idStr=keys.join(',')
    quanxianID(this.roleId,idStr).then(res=>{
      // console.log(res);
      if(res.meta.status!==200) return this.$message.error('获取失败')
      this.$message.success('更新成功')
       this.getRolesList()
       this.setRightDialogVisible=false
    })

  },
}
}
</script>

<style lang="less"  scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border: 1px solid #eee;
}
.bdbottom{
   border: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}

</style>