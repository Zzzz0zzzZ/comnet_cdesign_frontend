<template>
  <el-descriptions
      title="我的交友信息"
      :column="2"
      size="large"
      border
  >
    <template #extra>
      <el-button type="primary">添加新朋友/创建新群聊</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon style="margin-right: 8px">
            <user />
          </el-icon>
          用户名
        </div>
      </template>
      {{ store.userinfo.username }}
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon style="margin-right: 8px">
            <tickets />
          </el-icon>
          邀请码
        </div>
      </template>
      <el-tag size="large">{{ store.userinfo.udid }}</el-tag>
    </el-descriptions-item>

  </el-descriptions>

  <div class="card-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header" style="position: relative; top: 0; left: 0; right: 0;">
          <span style="font-size: 20px"><b>新关系</b></span>
          <el-button :icon="RefreshRight" circle/>
        </div>
      </template>
      <div>
        <el-timeline>
          <el-timeline-item center :timestamp="relation.apply_time" placement="top" v-for="relation in application_to_me" :key="relation.id">
            <el-card>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div>
                  <div style="font-size: 16px; font-weight: bold">
                    用户
                    <el-icon><user /></el-icon>
                    {{ relation.uuid_from.username }}
                    &nbsp;
                    请求添加你的好友</div>
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
      <template #header>
        <div class="card-header" style="position: relative; top: 0; left: 0; right: 0;">
          <span style="font-size: 20px"><b>我的申请</b></span>
          <el-button :icon="RefreshRight" circle/>
        </div>
      </template>
      <div>
        <el-timeline>
          <el-timeline-item center :timestamp="relation.apply_time" placement="top" v-for="relation in application_from_me" :key="relation.id">
            <el-card>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div>
                  <div style="font-size: 16px; font-weight: bold">
                    向用户
                    <el-icon><user /></el-icon>
                    &nbsp;{{ relation.uuid_to.username }}&nbsp;
                    发出好友申请
                  </div>
                  <p>备注信息：{{ relation.apply_text }}</p>
                </div>
                <div v-if="relation.apply_status === 'FAILED'">
                  <el-tag type="warning">被拒绝</el-tag>
                </div>
                <div v-else-if="relation.apply_status === 'SUCCESS'">
                  <el-tag type="success">已添加</el-tag>
                </div>
                <div v-else>
                  <el-tag type="primary">申请中</el-tag>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>

</template>

<script setup>
import { RefreshRight } from "@element-plus/icons-vue";
import {reactive, ref} from "vue";
import {getUserApplications, rejectUserApplication} from "../../api/application.js";
import {sessionGet} from "../../utils/myStorage.js";
import {useUserStore} from "../../stores/userStore.js";
import {Tickets, User,} from '@element-plus/icons-vue'

const store = useUserStore()

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
  width: 45vw;
  height: 65vh;
  overflow: scroll;
}
.card-container {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>