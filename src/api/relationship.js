import axios from "../utils/axios.js";

// 获取朋友列表
export function getUserFriends(uuid) {
    return axios.get("/relationship", {
        params: {
            uuid: uuid
        }
    });
}

// 获取群聊列表
export function getUserGroups(uuid) {
    return axios.post(`/group/${uuid}`)
}

// 创建群聊
export function createUserGroup (uuid_from, gname, uuid_to) {
    return axios.post('/group', {
        "uuid_from": uuid_from,
        "gname": gname,
        "uuid_to": uuid_to
    })
}