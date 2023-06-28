<template xmlns="http://www.w3.org/1999/html">
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
            <img src="src/assets/bjut.png" style="height: 30px"/>
            <b>&nbsp;&nbsp;BJUT-IM System</b></el-menu-item>

          <div class="flex-grow" />
          <el-menu-item index="1"><b>新关系</b></el-menu-item>
          <el-sub-menu index="2">
            <template #title><b>我的IMS&nbsp;&nbsp;</b>
            </template>
            <el-menu-item index="2-1"><b>个人主页&nbsp;&nbsp;(用户: {{ sessionGet("bjut_im_user").username }})</b></el-menu-item>
            <el-menu-item index="2-2"><b>资料设置</b></el-menu-item>
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
import {sessionGet, sessionRemove, sessionSet} from "./utils/myStorage.js";
import {useChatStore} from "./stores/chatStore.js";

const activeIndex = ref('0')
const router = useRouter()
const store = useChatStore()

const selectActionMap = {
  "0": () => router.push("/home"),
  "1": () => router.push("/relation"),
  "2-1": () => router.push("/userinfo"),
  "2-2": () => router.push("/settings"),
  "2-3": () => {
    sessionRemove("bjut_im_login")
    sessionRemove("bjut_im_user")
    sessionRemove("ws_connection")
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
})

</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
