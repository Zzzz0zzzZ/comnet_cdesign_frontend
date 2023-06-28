<template>
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
  <el-button @click="handleCloseWs">断开</el-button>
</template>

<script setup>
import { useChatStore } from "../../stores/chatStore.js";
import {reactive, ref} from 'vue';

const store = useChatStore();

const messages = store.messages;
const perPartMessage = reactive({
  to: "cb158eec-2f89-4ef2-a4e4-02ae2b73879d",
  text: "",
  type: "single"
})

const send = function () {
  store.sendMessage(perPartMessage);
}
const handleCloseWs = () => store.closeWebSocketConnection()
</script>
