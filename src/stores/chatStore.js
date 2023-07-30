import { defineStore } from "pinia"
import { sessionGet } from "../utils/myStorage.js";
import {getCurrentTime} from "../utils/time.js";
import {createChatMsg} from "../utils/chat.js";
import {ElNotification} from "element-plus";

export const useChatStore = defineStore('chatStore', {
    state: () => {
        return {
            ws: null,
            ws_connection: false,
            messages: [],
            chat: {
                "uuid": "",
                "data": {},
            }
        }
    },
    actions: {
        setupWebSocket() {
            // 在这里建立WebSocket连接
            this.ws = new WebSocket(`ws://106.12.165.78:8889/ws/${sessionGet("bjut_im_user").uuid}`);

            // 监听WebSocket的消息事件
            this.ws.onmessage = (event) => {
                const newMessage = JSON.parse(event.data)
                console.log(newMessage)

                ElNotification({
                    title: '你收到了一条新消息',
                    message:  `时间: ${newMessage.data.time}\n消息类型: [${newMessage.data.msg_type}]`,
                    type: 'info'
                })

                if (newMessage.msg_type === "c") {
                    const msg = createChatMsg(newMessage.data.text, newMessage.data.from, newMessage.data.time, newMessage.data.msg_type)
                    if (newMessage.data.type === "SINGLE") {
                        if (!this.chat.data[newMessage.data.from]) {
                            this.chat.data[newMessage.data.from] = []
                        }
                        this.chat.data[newMessage.data.from].push({...msg})
                    }
                    else if (newMessage.data.type === "GROUP") {
                        if (!this.chat.data[newMessage.data.group_id]) {
                            this.chat.data[newMessage.data.group_id] = []
                        }
                        this.chat.data[newMessage.data.group_id].push({...msg})
                    }

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
        combineMessage(id, previousMessage) {
            if (!this.chat.data[id]) {
                this.chat.data[id] = []
            }
            this.chat.data[id].push({...previousMessage})
        }
        ,
        sendMessage(perPartMessage) {
            // 当前时间
            const curTime = getCurrentTime()
            // 添加到本地
            const msg = createChatMsg(perPartMessage.text, sessionGet("bjut_im_user").uuid, curTime, perPartMessage.msg_type)
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
                "text": perPartMessage.text,
                "msg_type": perPartMessage.msg_type
            }
            this.ws.send(JSON.stringify(wholeMessage));
        },
    },
    getters: {

    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: `chatHistory`,
                storage: sessionStorage,
                paths: ['chat']
            }
        ]
    }
})