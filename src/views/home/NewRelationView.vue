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
        <el-timeline-item center :timestamp="content.timestamp" placement="top" v-for="(content, index) in userRelationDetails" :key="index">
          <el-card>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div>
                <div style="font-size: 18px; font-weight: bold">{{ content.name }}请求添加你的好友</div>
                <p>备注信息：{{ content.description }}</p>
              </div>
              <div>
                <el-button type="danger">拒绝申请</el-button>
                <el-button type="primary">接受申请</el-button>
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
import {reactive} from "vue";

const userRelationDetails = reactive([
  {"timestamp": "2019/6/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/5/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/6/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/9/10", "name": "wsz", "description": "你好啊"},
  {"timestamp": "2019/6/10", "name": "wsz", "description": "你好啊"}
])


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