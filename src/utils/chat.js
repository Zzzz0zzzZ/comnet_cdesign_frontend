// 创建一条消息
export function createChatMsg(msg, from, time) {
    return {
        "msg": msg,
        "from": from,
        "time": time
    }
}

// 合并两个历史记录
export function combineTwoHistory(one, two) {
    one.data.push([...two.data])
    return JSON.parse(JSON.stringify(one))
}