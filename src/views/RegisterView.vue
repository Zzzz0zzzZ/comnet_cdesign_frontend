<template>
  <div class="register-container">
    <div class="flex-div-title">
      <img src="src/assets/logo_frontpage.png" style="height: 65px">
    </div>
        <div class="flex-div">
          <el-form
              :label-position="'right'"
              label-width="100px"
              :model="userRegisterInfo"
              style="max-width: 460px"
          >
            <el-form-item label="用户名">
              <el-input v-model="userRegisterInfo.username" size="large" :prefix-icon="UserFilled" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userRegisterInfo.password" type="password" show-password size="large" :prefix-icon="Lock" placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="userRegisterInfo.password_confirm" type="password" show-password size="large" :prefix-icon="Lock" placeholder="请确认密码"/>
            </el-form-item>
          </el-form>
        </div>

        <div class="btn-container flex-div">
          <el-button type="primary" size="large" @click="onClickRegister">注册</el-button>
        </div>
        <div class="btn-container flex-div">
          <el-button size="large" @click="onClickReturn">返回</el-button>
        </div>
  </div>
</template>

<script setup>
import {reactive, watch} from 'vue'
import {ElMessage} from "element-plus";
import { UserFilled, Lock } from '@element-plus/icons-vue'
import {authUserRegister} from "../api/auth.js";

const userRegisterInfo = reactive({
  username: '',
  password: '',
  password_confirm: ''
})

const onClickRegister = async function () {
  if (userRegisterInfo.password !== userRegisterInfo.password_confirm) {
    ElMessage.warning("两次密码不相同")
    userRegisterInfo.username = ''
    userRegisterInfo.password = ''
    userRegisterInfo.password_confirm = ''
    return
  }
  const res = await authUserRegister(userRegisterInfo.username, userRegisterInfo.password)
  if (res.msg === "创建成功") {
    ElMessage.success(res.msg)
    history.back()
  }
  else {
    ElMessage.error(res.msg)
    userRegisterInfo.username = ''
    userRegisterInfo.password = ''
    userRegisterInfo.password_confirm = ''
  }
}

const onClickReturn = () => history.back()
</script>

<style scoped>
.register-container {
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