<template>
  <div class="register-container">
    <div class="flex-div-title">
      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改密码</h1>
    </div>
    <div class="flex-div">
      <el-form
          :label-position="'right'"
          label-width="100px"
          :model="userRegisterInfo"
          style="max-width: 460px"
      >
        <el-form-item label="旧密码">
          <el-input v-model="password.old" size="large" type="password" :prefix-icon="Lock" placeholder="请输入旧密码"/>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="password.new1" type="password" show-password size="large" :prefix-icon="Lock" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="password.new2" type="password" show-password size="large" :prefix-icon="Lock" placeholder="请确认新密码"/>
        </el-form-item>
      </el-form>
    </div>

    <div class="btn-container flex-div">
      <el-button type="primary" size="large" @click="onClickRegister">修改</el-button>
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
import {useUserStore} from "../../stores/userStore.js";
import {changeUserPassword} from "../../api/auth.js";
import router from "../../router/index.js";

const password = reactive({
  old: '',
  new1: '',
  new2: ''
})

const userStore = useUserStore()
const onClickRegister = async function () {
  if (password.new1 !== password.new2) {
    ElMessage.warning("新密码不相同")
    password.old = ''
    password.new1 = ''
    password.new2 = ''
    return
  }
  console.log(userStore.userinfo.uuid)
  const res = await changeUserPassword(
      userStore.userinfo.uuid,
      password.old,
      password.new1
  )
  if (res.msg === "密码更改成功") {
    await router.push('/home')
  }
  else {
    password.old = ''
    password.new1 = ''
    password.new2 = ''
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
  justify-content: center;
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