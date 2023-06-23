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
            <el-menu-item index="2-1"><b>个人主页</b></el-menu-item>
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
import {localGet, localRemove} from "./utils/localStorage.js";

const activeIndex = ref('0')
const router = useRouter()

const selectActionMap = {
  "0": () => router.push("/home"),
  "1": () => router.push("/relation"),
  "2-1": () => router.push("/userinfo"),
  "2-2": () => router.push("/settings"),
  "2-3": () => {
    localRemove("bjut_im_login")
    localRemove("bjut_im_user")
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
    console.log(localGet("bjut_im_login"))
    if (!localGet("bjut_im_login")) {
      next({path: '/login'})
    }
    else {
      next()
    }
  }
  state.showMenu = !noMenu.includes(to.path)
  state.currentPath = to.path
})

</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
