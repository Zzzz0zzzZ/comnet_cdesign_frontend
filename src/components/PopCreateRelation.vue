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
        <el-form :model="formGroupData" label-width="125px">
          <el-form-item label="新群聊的名称"
                        :rules="[{ required: true, message: '必须填写' }]"
                        inline-message="true"
          >
            <el-input v-model="formGroupData.gname" />
          </el-form-item>
          <el-form-item label="添加现有好友">
            <el-autocomplete
                v-model="state2"
                :fetch-suggestions="querySearch"
                :trigger-on-focus="false"
                clearable
                class="inline-input w-50"
                placeholder="搜索现有好友名"
                @select="handleSelect"
                style="width: 200px"
            />
            &nbsp;&nbsp;&nbsp;
            <el-button type="primary" @click="addSelected">添加</el-button>
          </el-form-item>
          <el-form-item label="已选择好友">
            <el-tag
                v-for="selected in alreadySelected"
                :key="selected.uuid"
                class="mx-1"
                closable
                @close="handleClose(selected)"
            >
              {{ selected.username }}
            </el-tag>
          </el-form-item>
        </el-form>
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
import {onMounted, reactive, ref, toRaw, watch} from 'vue'
import {useUserStore} from "../stores/userStore.js";
import {createUserApplication} from "../api/application.js";
import {createUserGroup, getUserFriends} from "../api/relationship.js";
import {ElMessage} from "element-plus";

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
const formGroupData = reactive({
  gname: ""
})

const store = useUserStore()
const createRelations = async function () {
  if (activeName.value === "新朋友") {
    const res = await createUserApplication(
        store.userinfo.uuid,
        formFriendsData.uuid,
        formFriendsData.apply_text
    )
    console.log(res)

  }
  else {
    const list = alreadySelected.value.map(x => x.uuid)
    const res = await createUserGroup(
        store.userinfo.uuid,
        formGroupData.gname,
        list
    )
    console.log("create", res)
  }
  emit('doNotShowDialog')
  emit('loadApplications')

}

const onClickCancel = function () {
  formFriendsData.uuid = ""
  formFriendsData.apply_text = ""
  emit('doNotShowDialog')
}

const tags = ref([])
const state2 = ref('')
const restaurants = ref([])
const userStore = useUserStore()
const alreadySelected = ref([])


const curSel = ref({})
const addSelected = function () {
  if (state2.value === "") {
    ElMessage.warning("输入不能为空")
    return
  }

  let f = 0
  restaurants.value.forEach(x => {
    if (x.username === state2.value) {
      f += 1
    }
  })
  if (!f) {
    ElMessage.warning("不是您的好友")
    return;
  }

  alreadySelected.value.push({
    "uuid": curSel.value.uuid,
    "username": curSel.value.username
  })
  curSel.value = {}
  state2.value = ""
}

watch(activeName, (n, o) => {
  console.log(n)
  console.log(restaurants.value)
  if (n === "新群聊" && restaurants.value.length === 0) {
    const uuid = userStore.userinfo.uuid
    getUserFriends(uuid).then(res => {
      restaurants.value = res.data.friends
      console.log(restaurants.value)
    })
  }
})

const querySearch = (queryString, cb) => {
  console.log(queryString)
  const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value
  // call callback function to return suggestions

  const r = results.map(x => {
    x.value = x.username
    return x
  })
  console.log("rr", r)
  cb(r)
}
const createFilter = (queryString) => {
  return (restaurant) => {
    console.log("ff", restaurant.username, restaurant.username.toLowerCase().includes(queryString.toLowerCase()))
    return (
        restaurant.username.toLowerCase().includes(queryString.toLowerCase())
    )
  }
}
const handleSelect = (item) => {
  curSel.value = item
}

const handleClose = (selected) => {
  console.log("cl", selected)
  const newArray = alreadySelected.value.filter(obj => obj.uuid !== selected.uuid);
  alreadySelected.value = newArray
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>