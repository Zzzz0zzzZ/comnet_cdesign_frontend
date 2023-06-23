import axios from "../utils/axios.js"

// 登录
export function authUserLogin(username, password) {
    return axios.post("/user/auth", {
        username: username,
        password: password
    })
}

// 注册
export function authUserRegister(username, password) {
    return axios.post("/user", {
        username: username,
        password: password,
        avatar: ""
    })
}