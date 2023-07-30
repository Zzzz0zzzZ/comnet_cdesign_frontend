<template>
  <div class="common-layout">
    <el-container v-if="state.showMenu">
      <el-header>
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            @select="handleSelect"
        >
          <el-menu-item index="0">
            <img src="/src/assets/bjut.png" style="height: 30px"/>
            <b>&nbsp;&nbsp;BJUT-IM System</b></el-menu-item>

          <div class="flex-grow" />
          <el-menu-item index="1"><b>新关系</b></el-menu-item>
          <el-sub-menu index="2">
            <template #title><b>我的IMS&nbsp;&nbsp;</b>
            </template>
            <el-menu-item index="2-1"><b>个人主页&nbsp;&nbsp;(用户: {{ username }})</b></el-menu-item>
            <el-menu-item index="2-2"><b>更改密码</b></el-menu-item>
            <el-menu-item index="2-3"><b>退出登录</b></el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-main style="height: 90vh"><router-view/></el-main>
    </el-container>
    <el-container v-else>
      <router-view/>
    </el-container>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useRouter} from "vue-router";
import {localSet, sessionGet, sessionRemove, sessionSet} from "./utils/myStorage.js";
import {useChatStore} from "./stores/chatStore.js";
import {useUserStore} from "./stores/userStore.js";

const activeIndex = ref('0')
const router = useRouter()
const store = useChatStore()

const selectActionMap = {
  "0": () => router.push("/home"),
  "1": () => router.push("/relation"),
  "2-1": () => router.push("/userinfo"),
  "2-2": () => router.push("/change_password"),
  "2-3": () => {

    const hist = sessionGet("chatHistory")
    sessionRemove("chatHistory")
    localSet(`chatHistory_${sessionGet("bjut_im_user").uuid}`, hist)

    sessionRemove("bjut_im_login")
    sessionRemove("bjut_im_user")
    sessionRemove("ws_connection")

    store.chat.uuid = ""
    store.chat.data = {}


    store.closeWebSocketConnection()
    router.push("/login")
  }
}
const handleSelect = (key) => selectActionMap[key]()

const noMenu = ['/login', '/register']
const state = reactive({
  showMenu: true,
  currentPath: '/'
})
const username = ref("");

router.beforeEach((to, from, next) => {
  if (to.path === "/login" || to.path === "/register") {
    next()
  }
  else {
    if (!sessionGet("bjut_im_login")) {
      next({path: '/login'})
    }
    else {
      next()
      if (!sessionGet("ws_connection")) {
        store.setupWebSocket();
        sessionSet("ws_connection", true)
        username.value = sessionGet("bjut_im_user").username
        const userStore = useUserStore()
        userStore.userinfo = sessionGet("bjut_im_user")
      }
    }
  }
  state.showMenu = !noMenu.includes(to.path)
  state.currentPath = to.path
})
window.addEventListener("beforeunload", () =>{
  console.log("准备刷新了")
  // 期待重新建立ws连接
  sessionSet("ws_connection", false)
  const hist = sessionGet("chatHistory")
  localSet(`chatHistory_${sessionGet("bjut_im_user").uuid}`, hist)
})

</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
