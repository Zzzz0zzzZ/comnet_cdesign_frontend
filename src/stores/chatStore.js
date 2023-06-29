import { defineStore } from "pinia"
import { sessionGet } from "../utils/myStorage.js";
import {getCurrentTime} from "../utils/time.js";
import {createChatMsg} from "../utils/chat.js";

export const useChatStore = defineStore('chatStore', {
    state: () => {
        return {
            ws: null,
            ws_connection: false,
            messages: [],
            chat: {
                "uuid": sessionGet("bjut_im_user").uuid,
                "data": {},
            }
        }
    },
    actions: {
        setupWebSocket() {
            // 在这里建立WebSocket连接
            this.ws = new WebSocket(`ws://127.0.0.1:8889/ws/${sessionGet("bjut_im_user").uuid}`);

            // 监听WebSocket的消息事件
            this.ws.onmessage = (event) => {
                const newMessage = JSON.parse(event.data)

                if (newMessage.msg_type === "c") {
                    const msg = createChatMsg(newMessage.data.text, newMessage.data.from, newMessage.data.time)
                    if (!this.chat.data[newMessage.data.from]) {
                        this.chat.data[newMessage.data.from] = []
                    }
                    this.chat.data[newMessage.data.from].push({...msg})
                }
                this.messages.push(newMessage); // 暂时没用了
                console.log("聊天记录", this.chat)
            };
            console.log("已经建立连接", this.ws)
        },
        closeWebSocketConnection() {
            this.ws.close()
            this.ws = null
        },
        sendMessage(perPartMessage) {
            // 当前时间
            const curTime = getCurrentTime()
            // 添加到本地
            const msg = createChatMsg(perPartMessage.text, sessionGet("bjut_im_user").uuid, curTime)
            if (!this.chat.data[perPartMessage.to]) {
                this.chat.data[perPartMessage.to] = []
            }
            this.chat.data[perPartMessage.to].push({...msg})
            console.log("聊天记录", this.chat)
            // 发送消息到WebSocket服务器
            console.log(perPartMessage)
            const wholeMessage = {
                "from": sessionGet("bjut_im_user").uuid,
                "to": perPartMessage.to,
                "time": curTime,
                "type": perPartMessage.type,
                "text": perPartMessage.text
            }
            this.ws.send(JSON.stringify(wholeMessage));
        },
    },
    getters: {

    }
})