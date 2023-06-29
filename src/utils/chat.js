// 创建一条消息
export function createChatMsg(msg, from, time) {
    return {
        "msg": msg,
        "from": from,
        "time": time
    }
}
