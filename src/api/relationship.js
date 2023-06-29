import axios from "../utils/axios.js";

// 获取朋友列表
export function getUserFriends(uuid) {
    return axios.get("/relationship", {
        params: {
            uuid: uuid
        }
    });
}