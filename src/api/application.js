import axios from "../utils/axios.js";

// 获取新关系列表
export function getUserApplications(uuid) {
    return axios.get("/application", {
        params: {
            uuid: uuid
        }
    });
}

// 创建好友申请
export function createUserApplication(uuid_from, uuid_to, apply_text) {
    return axios.post("/application", {
        uuid_from: uuid_from,
        uuid_to: uuid_to,
        apply_text: apply_text
    })
}

// 接受申请
export function acceptUserApplication(application_id) {
    return axios.put("/application", {
        application_id: application_id,
        apply_status: "SUCCESS"
    })
}

// 拒绝申请
export function rejectUserApplication(application_id) {
    return axios.put("/application", {
        application_id: application_id,
        apply_status: "FAILED"
    })
}