<template>
  <el-card class="container" shadow="always" :body-style="{padding: '10px'}">
    <template #default class="container-body">
      <div class="flex-container">
        <el-card class="relation-card" shadow="never" :body-style="{padding: '10px'}">
          <el-card class="card-item" shadow="never" :body-style="{padding: '10px'}">
            <el-tabs v-model="activeName" class="demo-tabs">
              <el-tab-pane label="朋友" name="朋友"></el-tab-pane>
              <el-tab-pane label="群聊" name="群聊"></el-tab-pane>
            </el-tabs>
          </el-card>
          <el-card class="card-item" shadow="never" :body-style="{padding: '10px', width: '15vw'}"
                   v-for="friend in friendList" :key="friend"
          >
                <el-avatar :size="'default'" :src="avatarUrl"/>
                  {{ friend.username }}
          </el-card>
        </el-card>
        <el-card class="chat-card" shadow="never" :body-style="{padding: '10px'}">
          <div class="chat-layout">
            <div class="chat-layout-header">

              与
              <el-icon><user /></el-icon>
              的对话
            </div>
            <div class="chat-layout-detail">
                <div>
                  <h1>User1 Chat</h1>
                  <div>
                    <input type="text" v-model="perPartMessage.text" autocomplete="off" />
                    <button @click="send">Send</button>
                  </div>
                  <ul id="messages">
                    <li v-for="message in messages" :key="message.id">{{ message.content }}</li>
                  </ul>
                </div>
            </div>
            <div class="chat-layout-footer">
              <el-input v-model="perPartMessage.text"
                        type="textarea"
                        placeholder="请输入要发送的消息, 按Enter键发送"
                        :rows="5"
                        @keyup.enter="send"
              />
            </div>
          </div>
        </el-card>
      </div>
    </template>

  </el-card>
</template>

<script setup>
import { useChatStore } from "../../stores/chatStore.js";
import {reactive, ref, watch} from 'vue';
import {useUserStore} from "../../stores/userStore.js";
import {getUserFriends} from "../../api/relationship.js";
import {Tickets, User,} from '@element-plus/icons-vue'
const activeName = ref("朋友")

const store = useChatStore();
const userStore = useUserStore()

const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const friendList = ref([])
const loadFriendList = async function () {
  const res = await getUserFriends(userStore.userinfo.uuid)
  friendList.value = res.data.friends
  console.log(res.data.friends)
}

const loadGroupList = async function () {
  console.log("加载群聊列表")
}

watch(activeName, async (newName) => {
  if (newName === "朋友") {
    friendList.value = []
    loadFriendList()
  }
  else {
    friendList.value = []
    loadGroupList()
  }
}, {immediate: true})

const messages = store.messages;
const perPartMessage = reactive({
  to: "cb158eec-2f89-4ef2-a4e4-02ae2b73879d",
  text: "",
  type: "single"
})

const send = function () {
  store.sendMessage(perPartMessage);
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.container {
  width: 95vw;
  height: 85vh;
}
.container-body {
  padding: 10px;
}
.flex-container {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
}
.relation-card {
  width: 20vw;
  margin: 10px;
  height: 80vh;
}
.chat-card {
  height: 80vh;
  /*min-width: 20vw;*/
  margin: 10px;
  flex-grow: 1;
}
.card-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px;
}
.chat-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 75vh;
  padding: 5px;
}
.chat-layout-header {
  height: 5vh;
  width: 100%;
  border-bottom: 1px solid lightgrey;
  line-height: 5vh;
}
.chat-layout-detail {
  flex-grow: 1;
  width: 100%;
}
.chat-layout-footer {
  height: 10vh;
  /*border-top: 1px solid lightgrey;*/
  width: 100%;
}
</style>