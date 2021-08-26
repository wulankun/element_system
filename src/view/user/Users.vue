<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable=""
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope" :index="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
              <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click=" setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
      
    >
     <div>
       <p>当前的用户:{{userInfo.username}}</p>
       <p>当前的角色:{{userInfo.role_name}}</p>
       <p> 分配新角色:
         <el-select v-model="selectedRoleId"   placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>    
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UserList } from "../../network/login";
import {
  switchRequst,
  userL,
  edit,
  message1,
  delete1,
  huoqu,
  yonghu11
} from "../../network/small";
export default {
  name: "Users",
  created() {
    this.getUserList();
  },
  data() {
    // 验证邮箱
    var checkEmail = (rule, value, cb) => {
      //正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条信息
        pagesize: 3,
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度3-10之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码长度6-15之间", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户对象
      editForm: {},
      //修改表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制分配角色的对话框的显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配角色的信息
      userInfo:{},
      //所有角色的数据列表
      rolesList:[],
      selectedRoleId:'',
    };
  },
  methods: {
    getUserList() {
      UserList(this.queryInfo).then((res) => {
        if (res.meta.status !== 200) return this.$message.error("获取失败");
        // console.log(res);
        this.userlist = res.data.users;
        this.total = res.data.total;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    userStateChanged(userinfo) {
      // console.log(userinfo);
      switchRequst(userinfo.id, userinfo.mg_state).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("更新用户失败");
        }
      });
    },
    // 监听添加用户的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) return;
        //可以发起添加用户的网络请求
        userL(this.addForm).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error("添加失败");
          }
          this.$message.success("添加成功");
          this.addDialogVisible = false;
          //  添加用户的请求
          this.getUserList();
        });
      });
    },
    // 展示编辑用户的对话框
    showEditDialog(id) {
      this.editDialogVisible = true;
      edit(id).then((res) => {
        // console.log(res);
        if (res.meta.status != 200) return this.$message.error("查询用户错误");
        this.editForm = res.data;
      });
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息并且提交
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        message1(
          this.editForm.id,
          this.editForm.email,
          this.editForm.mobile
        ).then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error("更新用户信息失败");
          }
          // 关闭会话框
          this.editDialogVisible = false;
          // 刷新数据
          this.getUserList();
          // 提示修改成功
          this.$message.success("更新用户信息成功");
        });
      });
    },
    // 根据ID删除对应的用户信息
    async removeUserById(id) {
      // console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      delete1(id).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("删除用户失败");
        this.$message.success("删除用户成功");
        this.getUserList();
      });
    },
    setRole(userInfo){
      //在展示对话框之前,获取所有角色的列表
      huoqu().then(res=>{
        // console.log(res);
        if(res.meta.status!==200) return this.$message.error('获取失败')
           this.rolesList=res.data
      })
      this.userInfo=userInfo
      this.setRoleDialogVisible=true

    },
    saveRoleInfo(){
      if(!this.selectedRoleId) return this.$message.error('请选择角色')
      yonghu11(this.userInfo.id,this.selectedRoleId).then(res=>{
        // console.log(res);
        if(res.meta.status!==200) return this.$message.error('获取失败')
        this.$message.success('获取成功')
        this.getUserList()
        this.setRoleDialogVisible=false
      })
    },
    setRoleDialogClosed(){
      this.selectedRoleId=''
      this.userInfo={}
    }
  },
};
</script>

<style lang="less" scoped>
</style>