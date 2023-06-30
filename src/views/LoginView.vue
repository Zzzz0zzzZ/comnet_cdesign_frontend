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
import {localGet, localRemove, localSet, sessionGet, sessionRemove, sessionSet} from "../utils/myStorage.js";
import {useUserStore} from "../stores/userStore.js";
import {useChatStore} from "../stores/chatStore.js";
import {combineTwoHistory} from "../utils/chat.js";

const userLoginInfo = reactive({
  username: '',
  password: ''
})

const router = useRouter()
const store = useUserStore()
const chatStore = useChatStore()

const onClickLogin = async function () {
  const res = await authUserLogin(userLoginInfo.username, userLoginInfo.password)
  if (res.msg === '登录成功') {
    console.log(res)
    sessionSet("bjut_im_login", true)
    sessionSet("bjut_im_user", res.data.user)
    store.userinfo = res.data.user

    const chatHistory = localGet(`chatHistory_${res.data.user.uuid}`)
    if (chatHistory) {
      console.log("有记录", chatHistory)
      chatStore.chat.uuid = res.data.user.uuid
      chatStore.chat.data = chatHistory.chat.data
      sessionRemove("chatHistory")
      sessionSet("chatHistory", chatHistory)

      console.log(sessionGet("chatHistory"))
      console.log("chatH", chatHistory.chat)
      console.log("schat", store.chat)
    }
    //
    // const chatHistory = localGet("chatHistory")
    // const chatStore = useChatStore()
    //
    // // 如果chatHistory不是当前登录，就保存cH，记录为cH_uuid
    // if (chatHistory && chatHistory.chat.uuid !== store.userinfo.uuid) {
    //   console.log("不是我的记录, 检查有没有我的hist, 检查这个人有没有hist")
    //
    //   // 有没有我的记录，有的话合并
    //   const myHistChat = localGet(`chatHistory_${store.userinfo.uuid}`)
    //   if (myHistChat){
    //     console.log("有我之前的记录,需要合并");
    //     localRemove(`chatHistory_${myHistChat.chat.uuid}`)
    //     chatStore.chat = myHistChat.chat
    //   }
    //   else {
    //     chatStore.chat.data = {}
    //     console.log("没有我之前的记录，直接store置空")
    //   }
    //   chatStore.chat.uuid = store.userinfo.uuid
    //
    //   localRemove("chatHistory")
    //
    //   const otherChatHistory = localGet(`chatHistory_${chatHistory.chat.uuid}`)
    //
    //   if (otherChatHistory) {
    //     console.log("这个人有其他的的记录")
    //     localRemove(`chatHistory${otherChatHistory.chat.uuid}`)
    //     const tempData = combineTwoHistory(chatHistory, otherChatHistory)
    //     localSet(`chatHistory_${chatHistory.chat.uuid}`, tempData)
    //     console.log("合并这个人当前和其他的记录")
    //   }
    //
    //   else {
    //     localSet(`chatHistory_${chatHistory.chat.uuid}`, chatHistory)
    //     console.log("这个人没有其他记录，直接保存当前记录")
    //   }
    //
    // }
    // // 如果是, 读取, 放到userChat
    // else if (chatHistory && chatHistory.chat.uuid === store.userinfo.uuid) {
    //   //
    //   console.log("当前是我的记录")
    //   const myHistChat = localGet(`chatHistory_${store.userinfo.uuid}`)
    //   if (myHistChat){
    //     console.log("还有我之前的记录,需要合并");
    //     localRemove(`chatHistory_${myHistChat.chat.uuid}`)
    //     const tData = combineTwoHistory(chatHistory, myHistChat)
    //     console.log("合并完成我的记录合并结果是", tData)
    //     chatStore.chat.data = tData
    //   }
    //   console.log("没有其他的记录需要合并了, 不做任何操作，继续沿用")
    // }
    //
    // chatStore.chat.uuid = res.data.user.uuid
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