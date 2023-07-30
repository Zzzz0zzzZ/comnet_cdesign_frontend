<template>
  <h1 style="width: 100%; text-align: center">用户信息</h1>
  <div class="user-info-container">
    <div>
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户头像">
          <div class="demo-image__preview">
            <el-image
                style="width: 150px; height: 150px; margin-top: 10px"
                :src="userphoto"
                :zoom-rate="1.2"
                :preview-src-list="[userphoto]"
                :initial-index="4"
                fit="fill"
            />
            <el-button type="primary" @click="updateToDB">更新头像</el-button>
            <div>(若图片有效，则可点击进行预览)</div>
          </div>
        </el-form-item>
        <el-form-item label="上传/更新头像">
          <input id="fileSelector" type="file" @change="upload" accept=".jpg, .png"/>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名">
          {{form.name}}
        </el-form-item>
        <el-form-item label="用户id">
          {{ form.uuid }}
        </el-form-item>
        <el-form-item label="用户邀请码">
          {{ form.udid }}
        </el-form-item>
        <el-form-item label="您的注册时间是">
          {{ form.day }}
        </el-form-item>
      </el-form>
    </div>
  </div>


</template>

<script setup>


import {reactive, ref} from "vue";
import cos from "../../utils/cos.js";
import {cosConfig} from "../../config/index.js";
import {getUserInfo, updateUserPhoto} from "../../api/user.js";
import {useUserStore} from "../../stores/userStore.js";
import {ElMessage} from "element-plus";
import {authUserLogin} from "../../api/auth.js";

const userStore = useUserStore()
const form = reactive({
  name: "",
  uuid: "",
  udid: "",
  day: ""
})
const userphoto = ref('')

const load = async () => {
  const res_ = await getUserInfo(userStore.userinfo.uuid)
  console.log(res_)
  userphoto.value = res_.avatar
  form.name = res_.username
  form.uuid = res_.uuid
  form.udid = res_.udid
  form.day = res_.register_time
}
load()



function upload(e) {

  function randomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_=-';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  const uuid = randomString(32)
  const file = e.target.files && e.target.files[0];
  const fileExtension = e.target.files[0].name.slice(e.target.files[0].name.lastIndexOf('.') + 1)

  /* 直接调用 cos sdk 的方法 */
  cos.uploadFile({
    Bucket: cosConfig['bkt'], /* 填写自己的 bucket，必须字段 */
    Region: cosConfig['rg'],     /* 存储桶所在地域，必须字段 */
    Key: `img/products/${uuid}.${fileExtension}`,              /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: file, // 上传文件对象
    SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
  }, function (err, data) {
    console.log("err", err)
    console.log("data", data)
    if (data.statusCode === 200) {
      userphoto.value = 'https://' + data.Location
    }
  });
}


const updateToDB = async () => {
  if (userphoto.value === '') {
    ElMessage.warning('请先上传图片')
    return
  }
  const res = await updateUserPhoto(userStore.userinfo.uuid, userphoto.value)
  userStore.userinfo.avatar = userphoto.value
  console.log(res)
}

</script>

<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.demo-image__preview {
  z-index: 9;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.user-info-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>