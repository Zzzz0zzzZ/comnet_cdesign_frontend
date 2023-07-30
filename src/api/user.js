import axios from "../utils/axios.js";

export function updateUserPhoto (uuid, img_url) {
    return axios.post('/user/update/photo', {
        "uuid": uuid,
        "url": img_url
    })
}

export function getUserInfo (uuid) {
    return axios.get(`/user/info/${uuid}`)
}

export function getPreviousChat (uuid) {
    return axios.post(`/chat/pull/${uuid}`)
}