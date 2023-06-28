<template>
  <div class="card-container">
  <el-card class="box-card">
    <template #header>
      <div class="card-header" style="position: relative; top: 0; left: 0; right: 0;">
        <span style="font-size: 24px"><b>新关系</b></span>
        <el-button :icon="RefreshRight" circle/>
      </div>
    </template>
    <div>
      <el-timeline>
        <el-timeline-item center :timestamp="relation.apply_time" placement="top" v-for="relation in application_to_me" :key="relation.id">
          <el-card>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div>
                <div style="font-size: 18px; font-weight: bold">{{ relation.uuid_from.username }}请求添加你的好友</div>
                <p>备注信息：{{ relation.apply_text }}</p>
              </div>
                <div v-if="relation.apply_status === 'FAILED'">
                  <el-tag type="warning">已拒绝</el-tag>
                </div>
                <div v-else-if="relation.apply_status === 'SUCCESS'">
                  <el-tag type="success">已添加</el-tag>
                </div>
                <div v-else>
                  <el-button type="danger" @click="onClickReject(relation.id)">拒绝</el-button>
                  <el-button type="primary" @click="onClickAccept(relation.id)">接受</el-button>
                </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
    <el-card class="box-card">
      
    </el-card>
  </div>

</template>

<script setup>
import { RefreshRight } from "@element-plus/icons-vue";
import {reactive, ref} from "vue";
import {getUserApplications, rejectUserApplication} from "../../api/application.js";
import {sessionGet} from "../../utils/myStorage.js";

const userRelationDetails = reactive([
  {"timestamp": "2019/6/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/5/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/6/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/9/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/6/10", "name": "wsz", "description": "你好啊"}
])

// 加载新关系
const application_from_me = ref([])
const application_to_me = ref([])
const loadApplications = async function () {
  const uuid = "" || sessionGet("bjut_im_user").uuid
  if (uuid !== "") {
    const res = await getUserApplications(uuid)
    application_from_me.value = res.data.application_from_me
    application_to_me.value = res.data.application_to_me
  }
}
loadApplications()

// 处理接受
const onClickAccept = async function (application_id) {
  // TODO: 处理接受
  console.log("接受")
}

// 处理拒绝
const onClickReject = async function (application_id) {
  await rejectUserApplication(application_id)
  await loadApplications()
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 40vw;
  height: 80vh;
  overflow: scroll;
}
.card-container {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>