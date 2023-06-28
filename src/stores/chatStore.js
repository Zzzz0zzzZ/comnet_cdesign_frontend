import { defineStore } from "pinia"
import { sessionGet } from "../utils/myStorage.js";
import {getCurrentTime} from "../utils/time.js";

export const useChatStore = defineStore('chatStore', {
    state: () => {
        return {
            ws: null,
            ws_connection: false,
            messages: [],
        }
    },
    actions: {
        setupWebSocket() {
            // 在这里建立WebSocket连接
            this.ws = new WebSocket(`ws://127.0.0.1:8889/ws/${sessionGet("bjut_im_user").uuid}`);

            // 监听WebSocket的消息事件
            this.ws.onmessage = (event) => {
                const newMessage = {
                    id: this.messages.length + 1,
                    content: event.data,
                };
                this.messages.push(newMessage);
            };
            console.log("已经建立连接", this.ws)
        },
        closeWebSocketConnection() {
            this.ws.close()
            this.ws = null
        },
        sendMessage(perPartMessage) {
            // 发送消息到WebSocket服务器
            console.log(perPartMessage)
            const wholeMessage = {
                "from": sessionGet("bjut_im_user").uuid,
                "to": perPartMessage.to,
                "time": getCurrentTime(),
                "type": perPartMessage.type,
                "text": perPartMessage.text
            }
            this.ws.send(JSON.stringify(wholeMessage));
        },
    },
    getters: {

    }
})