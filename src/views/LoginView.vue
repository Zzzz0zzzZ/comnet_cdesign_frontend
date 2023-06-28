<template xmlns="http://www.w3.org/1999/html">
  <div class="login-container">
    <div class="flex-div-title">
      <img src="src/assets/logo_frontpage.png" style="height: 65px">
    </div>
    <div class="flex-div">
      <el-form
          :label-position="'right'"
          label-width="100px"
          :model="userLoginInfo"
          style="max-width: 460px"
      >
        <el-form-item label="用户名">
          <el-input v-model="userLoginInfo.username" size="large" placeholder="请输入用户名" :prefix-icon="UserFilled"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userLoginInfo.password" type="password" show-password size="large" placeholder="请输入密码" :prefix-icon="Lock"/>
        </el-form-item>
      </el-form>
    </div>

    <div class="btn-container flex-div">
      <el-button type="primary" size="large" @click="onClickLogin">登录</el-button>
    </div>
    <div class="btn-container flex-div">
      <el-button size="large" @click="onClickRegister">注册</el-button>
    </div>

  </div>
</template>

<script setup>

import { reactive } from 'vue'
import {authUserLogin} from "../api/auth.js";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import { UserFilled, Lock } from '@element-plus/icons-vue'
import {sessionSet} from "../utils/myStorage.js";

const userLoginInfo = reactive({
  username: '',
  password: ''
})

const router = useRouter()
const onClickLogin = async function () {
  const res = await authUserLogin(userLoginInfo.username, userLoginInfo.password)
  if (res.msg === '登录成功') {
    console.log(res)
    sessionSet("bjut_im_login", true)
    sessionSet("bjut_im_user", res.data.user)
    await router.push("/home")
  }
  else {
    userLoginInfo.password = ''
    userLoginInfo.username = ''
  }
}

const onClickRegister = () => router.push("/register")



</script>

<style scoped>
.login-container {
  position: fixed;
  left: 40vw;
  top: 30vh;
}
.flex-div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-div-title {
  display: flex;
  justify-content: end;
  align-items: center;
}
.btn-container {
  margin: 20px;
  width: 100%;
}
.el-input {
  width: 200px;
}
.el-button {
  width: 260px;
}
</style>