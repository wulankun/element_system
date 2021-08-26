<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="" />
      </div>
        <!-- 登录表单 -->
      <el-form ref="loginFormRef"  :model="loginForm" :rules="loginFormRules"  label-width="0px" class="login_form">
          <!-- 账号 -->
        <el-form-item  prop="username">
          <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.username"> </el-input>
        </el-form-item>
      
         <!-- 密码 -->  
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-s-cooperation"  v-model="loginForm.password" type="password"> </el-input>
        </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="btns" >
         <el-button type="primary" :plain="true"  @click="login">登录</el-button>  
         <el-button type="info" @click="resetLoginForm">重置</el-button>  
            </el-form-item>
      </el-form>
 
    </div>
  </div>
</template>

<script>
import {LoginAxios} from '../../network/login'
export default {
  name: "Login",
  data(){
      return{
          loginForm:{
              username:'admin',
              password:'123456',
          },
           loginFormRules:{
               username:[ 
                   { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                   ],
               password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
               ],
           }
      }
  },
  methods:{
      resetLoginForm(){
          this.$refs.loginFormRef.resetFields()
      },
      login(){
        this.$refs.loginFormRef.validate(valid=>{
          if(!valid) return 
      const result=  LoginAxios(this.loginForm.username,this.loginForm.password)
      result.then(res=>{
         
          if(res.meta.status!==200){ return this.$message.error('登录失败')}
          this.$message.success('登录成功')

          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        })
       
        })

      },
  }
};
</script>

<style  lang="less"  scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100vh;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: solid 1px #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>