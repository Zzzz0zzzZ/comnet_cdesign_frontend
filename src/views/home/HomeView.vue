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
          <el-card class="card-item"
                   shadow="never"
                   :body-style="{padding: '10px', width: '15vw'}"
                   :class="{ 'selected': selectedCard === friend }"
                   v-for="friend in friendList" :key="friend"
                   @click="onSelectFriendCard(friend)"
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
              {{ activedFriendName }}
              的对话
            </div>
            <div class="chat-layout-detail">
                <div>
                  <ul id="messages">
                    <li v-for="message in messages" :key="message.time">
                      {{message.time}}
                      {{ message.from === userStore.userinfo.uuid ? "(me)" : "(friend)" }}
                      :&nbsp;
                      {{ message.msg }}
                    </li>
                  </ul>
                </div>
            </div>
            <div class="chat-layout-footer">
              <el-input v-model="perPartMessage.text"
                        type="textarea"
                        placeholder="请输入要发送的消息, 按Enter键发送, 按Ctrl+Enter键换行..."
                        :rows="5"
                        @keyup.enter="handleKeyCode($event)"
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
import {User} from '@element-plus/icons-vue'

// 切换标签
const activeName = ref("朋友")
// stores
const store = useChatStore();
const userStore = useUserStore()
// 头像链接
const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
// 朋友关系列表
const friendList = ref([])
// 好友
const loadFriendList = async function () {
  const res = await getUserFriends(userStore.userinfo.uuid)
  friendList.value = res.data.friends
  console.log(res.data.friends)
}
// 群
const loadGroupList = async function () {
  console.log("加载群聊列表")
}
// 监听tab变化
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

// 处理选中联系人后的逻辑
const activedFriendName = ref("")
const activedFriendUuid = ref("")
const selectedCard = ref("")

// 消息通讯
const chatData = store.chat.data  // 原始数据
const messages = ref([])  // 渲染数据
// 监听变化，更改渲染数据
watch(activedFriendUuid, (newVal) => {
  if (!chatData[newVal]){
    chatData[newVal] = []
  }
  messages.value = chatData[newVal]
  console.log(newVal, chatData[newVal])
}, {immediate: true})


const perPartMessage = reactive({
  to: "",
  text: "",
  type: activeName.value === "朋友" ? "single" : "group"
})
const onSelectFriendCard = function (friend) {
  selectedCard.value = friend
  perPartMessage.to = friend.uuid
  activedFriendName.value = friend.username
  activedFriendUuid.value = friend.uuid
}

// 发送
const send = function () {
  store.sendMessage(perPartMessage);
  perPartMessage.text = ""
}

// 对enter和ctrl+enter做判断
const handleKeyCode = function (event) {
  console.log(event)
  if (event.ctrlKey && event.keyCode===13) {
      perPartMessage.text = perPartMessage.text + '\n';
    } else {
      event.preventDefault();
      send()
    }
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
  background-color: white;
  transition: 0.2s ease;
}

.card-item:hover {
  cursor: pointer;
}

.card-item:active,
.card-item.selected {
  border-color: #589ef8;
  color: #589ef8;
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
  max-height: 50vh;
  overflow: scroll;
  width: 100%;
}
.chat-layout-footer {
  height: 10vh;
  /*border-top: 1px solid lightgrey;*/
  width: 100%;
}
</style>