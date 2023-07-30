import axios from "../utils/axios.js"

// 登录
export function authUserLogin(username, password) {
    return axios.post("/user/auth", {
        username: username,
        password: password
    })
}

// 更改密码
export function changeUserPassword (uuid, old, new_) {
    return axios.post("/user/update/password", {
        uuid: uuid,
        old_password: old,
        new_password: new_
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