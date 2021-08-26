<template>
  <div class="login_container">
    <div>
      <login-item></login-item>

    </div>
  </div>
</template>

<script>
import LoginItem from './LoginItem.vue'
export default {
  name: "Login",
  components:{
    LoginItem
  }
};
</script>

<style  lang="less"   scoped>
</style>