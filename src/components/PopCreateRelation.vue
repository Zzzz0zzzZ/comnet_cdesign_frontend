<template>
  <el-dialog
      v-model="props.canIShowDialog"
      title="添加新朋友/创建新群聊"
      width="60%"
      :before-close="onClickCancel"
  >
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="新朋友" name="新朋友">
        <el-form :model="formFriendsData" label-width="125px">
          <el-form-item label="新朋友的通讯号"
                        :rules="[{ required: true, message: '需要填写通讯号才能加好友' }]"
                        inline-message="true"
          >
            <el-input v-model="formFriendsData.uuid" />
          </el-form-item>
          <el-form-item label="发送请求的备注">
            <el-input v-model="formFriendsData.apply_text" type="textarea" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="新群聊" name="新群聊">
        新群聊
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClickCancel">让我再想想</el-button>
        <el-button type="primary" @click="createRelations">
          {{ activeName === "新朋友" ? "添加新朋友" : "创建新群聊" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useUserStore} from "../stores/userStore.js";
import {createUserApplication} from "../api/application.js";

const activeName = ref('新朋友')

const props = defineProps({
  canIShowDialog: {
    required: true
  }
})
const emit = defineEmits(['doNotShowDialog', 'loadApplications'])


const formFriendsData = reactive({
  uuid: "",
  apply_text: ""
})

const store = useUserStore()
const createRelations = async function () {
  const res = await createUserApplication(
      store.userinfo.uuid,
      formFriendsData.uuid,
      formFriendsData.apply_text
  )
  console.log(res)
  emit('doNotShowDialog')
  emit('loadApplications')
}

const onClickCancel = function () {
  formFriendsData.uuid = ""
  formFriendsData.apply_text = ""
  emit('doNotShowDialog')
}

</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>