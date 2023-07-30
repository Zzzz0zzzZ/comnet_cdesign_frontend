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
          <template v-if="activeName==='朋友'">
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
          </template>
          <template v-if="activeName === '群聊'">
            <el-card class="card-item"
                     shadow="never"
                     :body-style="{padding: '10px', width: '15vw'}"
                     :class="{ 'selected': selectedCard === group }"
                     v-for="group in groupList" :key="group.group.gid"
                     @click="onSelectGroupCard(group)"
            >
              <el-avatar :size="'default'" :src="avatarUrl"/>
              {{ group.group.gname }}
            </el-card>
          </template>

        </el-card>
        <el-card v-if="activedFriendUuid !== '' || activedGroupUuid !== ''" class="chat-card" shadow="never" :body-style="{padding: '10px'}">
          <div class="chat-layout">
            <div class="chat-layout-header">


              <el-icon v-if="activeName === '朋友'"><user /></el-icon>
              {{ activeName === "与朋友" ? `${activedFriendName}的群对话` : `群聊：${activedGroupName}` }}
              <template v-if="activeName === '群聊'">
                群成员: {{ getGroupMembers() }}
              </template>

            </div>
            <div class="chat-layout-detail">
                <div>
<!--                  <ul id="messages">-->
<!--                    <li v-for="message in messages" :key="message.time">-->
<!--                      {{message.time}}-->
<!--                      {{ message.from === userStore.userinfo.uuid ? "(me)" : "(friend)" }}-->
<!--                      :&nbsp;-->
<!--                      {{ message.msg }}-->
<!--                    </li>-->
<!--                  </ul>-->
                  <ul id="messages">
                    <li v-for="message in messages" :key="message.time" :class="getMessageClass(message)">
                      <div v-if="isCurrentUser(message.from)" class="message-right">
                        <div style="overflow-wrap: normal; margin-right:10vw;background-color: #f3f2f2; border-color: #f5f4f4; width: 100%; display: flex; flex-direction: row-reverse">
                          <img :src="userStore.userinfo.avatar" style="width: 25px; height: 25px">
                          <div>
                            <span>{{ message.time }}</span>
                            <span>(me)</span>

                            <div v-if="message.msg_type && message.msg_type === 'TEXT'">{{ message.msg }}</div>
                            <div v-else-if="message.msg_type && message.msg_type === 'IMAGE'">
                              <div class="demo-image__preview">
                                <el-image
                                    style="width: 150px; height: 150px; margin-top: 10px"
                                    :src="message.msg"
                                    :zoom-rate="1.2"
                                    :preview-src-list="[message.msg]"
                                    :initial-index="4"
                                    fit="fill"
                                />
                              </div>
                            </div>
                            <div v-else>{{ message.msg_type }}</div>
                          </div>

                        </div>

                      </div>
                      <div v-else class="message-left">
                        <div style="overflow-wrap: normal;background-color: #f3f2f2; border-color: #f5f4f4; width: 100%; display: flex; flex-direction: row">
                          <img :src="userStore.userinfo.avatar" style="width: 25px; height: 25px">
                          <div>
                            <span>{{ message.time }}</span>
                            <span>(friend {{ activeName==='群聊' && findname(message.from) }})</span>
                            <div v-if="message.msg_type && message.msg_type === 'TEXT'">{{ message.msg }}</div>
                            <div v-else-if="message.msg_type && message.msg_type === 'IMAGE'">
                              <div class="demo-image__preview">
                                <el-image
                                    style="width: 150px; height: 150px; margin-top: 10px"
                                    :src="message.msg"
                                    :zoom-rate="1.2"
                                    :preview-src-list="[message.msg]"
                                    :initial-index="4"
                                    fit="fill"
                                />
                              </div>
                            </div>
                            <div v-else>{{ message.msg_type }}</div>
                          </div>

                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
            </div>
            <div class="chat-layout-footer">
              <span>选取图片</span><input id="fileSelector" type="file" @change="upload" accept=".jpg, .png"/>
              <el-button type="primary" size="small" @click="updateToDB">发送图片</el-button>
              <el-input v-model="perPartMessage.text"
                        type="textarea"
                        placeholder="请输入要发送的消息, 按Enter键发送, 按Ctrl+Enter键换行..."
                        :rows="4"
                        @keyup.enter="handleKeyCode($event)"
              />
            </div>
          </div>
        </el-card>
        <el-card v-else class="chat-card" shadow="never" :body-style="{padding: '10px'}">
          <div class="chat-layout">
            <span style="height: 100%; line-height: 100%">选择左侧联系人/群聊列表以开启聊天！</span>
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
import {getUserFriends, getUserGroups} from "../../api/relationship.js";
import {User} from '@element-plus/icons-vue'
import cos from "../../utils/cos.js";
import {cosConfig} from "../../config/index.js";
import {ElMessage} from "element-plus";
import {updateUserPhoto} from "../../api/user.js";

// 切换标签
const activeName = ref("朋友")
// stores
const store = useChatStore();
const userStore = useUserStore()
// 头像链接
const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
// 朋友关系列表
const friendList = ref([])

// 处理选中联系人后的逻辑
const activedFriendName = ref("")
const activedFriendUuid = ref("")
const selectedCard = ref("")

const activedGroupName = ref("")
const activedGroupUuid = ref("")

// 消息通讯
const chatData = store.chat.data  // 原始数据
const messages = ref([])  // 渲染数据

// 好友
const loadFriendList = async function () {
  const res = await getUserFriends(userStore.userinfo.uuid)
  friendList.value = res.data.friends
  console.log(res.data.friends)
}
// 群
const groupList = ref([])
const loadGroupList = async function () {
  console.log("加载群聊列表")
  const res = await getUserGroups(userStore.userinfo.uuid)
  groupList.value = res.data.groups
  console.log(res)
}
// 监听tab变化
watch(activeName, async (newName) => {
  if (newName === "朋友") {
    friendList.value = []
    loadFriendList()
    activedGroupUuid.value = ""
    activedGroupName.value = ""
  }
  else {
    friendList.value = []
    activedFriendUuid.value = ""
    activedFriendName.value = ""
    loadGroupList()
  }
}, {immediate: true})


// 监听变化，更改渲染数据
watch(activedFriendUuid, (newVal) => {
  if (!chatData[newVal]){
    chatData[newVal] = []
  }
  messages.value = chatData[newVal]
  console.log(newVal, chatData[newVal])
}, {immediate: true})

watch(activedGroupUuid, (newVal) => {
  if (!chatData[newVal]){
    chatData[newVal] = []
  }
  messages.value = chatData[newVal]
  console.log(newVal, chatData[newVal])
}, {immediate: true})



const cur_members = ref([])
const getGroupMembers = () => {
  console.log(groupList.value)
  let res = ""
  groupList.value.map(x => {
    console.log("x", x)
    if (x.group.gid === activedGroupUuid.value) {
      res = `(共${x.members.length}人): `
      cur_members.value = x.members
    }
  })
  groupList.value.map(x => {
    if (x.group.gid === activedGroupUuid.value) {
      res += x.members.map(xx => `【用户: ${xx.username}】 `)
    }
  })
  return res
}
const findname = function (uuid) {
  for (let i=0; i < cur_members.value.length; i ++) {
    if (cur_members.value[i].uuid === uuid) {
      return cur_members.value[i].username
    }
  }
}

const perPartMessage = reactive({
  to: "",
  text: "",
  type: "",
  msg_type: "TEXT"
})
const onSelectFriendCard = function (friend) {
  selectedCard.value = friend
  perPartMessage.to = friend.uuid
  perPartMessage_img.to = friend.uuid
  activedFriendName.value = friend.username
  activedFriendUuid.value = friend.uuid
}
const onSelectGroupCard = function (group) {
  selectedCard.value = group
  perPartMessage.to = group.group.gid
  perPartMessage_img.to = group.group.gid
  activedGroupName.value = group.group.gname
  activedGroupUuid.value = group.group.gid
}

// 发送
const send = function () {
  console.log("ppm", perPartMessage)
  store.sendMessage(perPartMessage);
  perPartMessage.text = ""
}

const perPartMessage_img = reactive({
  to: "",
  text: "",
  type: "",
  msg_type: "IMAGE"
})
const send_img = function () {
  console.log("ppm", perPartMessage_img)
  perPartMessage_img.text = userphoto.value
  store.sendMessage(perPartMessage_img);
  perPartMessage_img.text = ""
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
watch(activeName, (n) => {
  perPartMessage.type = (n === "朋友") ? "SINGLE" : "GROUP"
  perPartMessage_img.type = (n === "朋友") ? "SINGLE" : "GROUP"
}, {immediate: true})

function isCurrentUser(from) {
  return from === userStore.userinfo.uuid;
}

function getMessageClass(message) {
  return {
    "message-right": isCurrentUser(message.from),
    "message-left": !isCurrentUser(message.from)
  };
}

const userphoto = ref('')
function upload(e) {

  function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_=-';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  const uuid = randomString(32)
  const file = e.target.files && e.target.files[0];
  const fileExtension = e.target.files[0].name.slice(e.target.files[0].name.lastIndexOf('.') + 1)

  /* 直接调用 cos sdk 的方法 */
  cos.uploadFile({
    Bucket: cosConfig['bkt'], /* 填写自己的 bucket，必须字段 */
    Region: cosConfig['rg'],     /* 存储桶所在地域，必须字段 */
    Key: `img/products/${uuid}.${fileExtension}`,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: file, // 上传文件对象
    SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
  }, function (err, data) {
    console.log("err", err)
    console.log("data", data)
    if (data.statusCode === 200) {
      userphoto.value = 'https://' + data.Location
    }
  });
}
const updateToDB = async () => {
  if (userphoto.value === '') {
    ElMessage.warning('请先上传图片')
    return
  }
  send_img()
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
.chat-layout-detail {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

ul#messages {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

.message-right {
  text-align: right;
}

.message-left {
  text-align: left;
}

.message-right span:first-child,
.message-left span:first-child {
  font-weight: bold;
  margin-right: 5px;
}

.message-right span:nth-child(2),
.message-left span:nth-child(2) {
  color: #888;
  margin-right: 5px;
}

.message-right span:nth-child(3),
.message-left span:nth-child(3) {
  word-break: break-all;
}

img {
  max-width: 200px;
  max-height: 200px;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.demo-image__preview {
  z-index: 9;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>