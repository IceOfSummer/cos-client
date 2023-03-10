<template>
  <div>
    <v-file-input label="添加图片/文件" v-model="selectedFile"></v-file-input>
    <div class="bottom-control-container">
      <v-select :items="tokens.map(value => value.bucketAlias)" label="选择存储桶" v-model="selectPick">
        <template v-slot:append-item>
          <v-divider class="mb-2"/>
          <v-btn variant="text" block color="primary" @click="onSubmitButtonPress">
            + 添加对象存储桶
          </v-btn>
        </template>
        <template v-slot:item="props">
          <v-btn size="large" color="primary" variant="text" block v-bind="props.props" :active="props.item.title === selectPick" class="select-button">
            <div style="align-self: flex-start">{{props.item.title}}</div>
            <template v-slot:append>
              <v-btn @click.prevent="onCosModify(props.item.title)" variant="text" color="warn">修改</v-btn>
              <v-btn @click.prevent="onCosDelete(props.item.title)" variant="text" color="error">删除</v-btn>
            </template>
          </v-btn>
        </template>
      </v-select>
      <v-text-field label="上传路径(文件名将使用随机UUID，请勿提供文件名，不填将上传至根目录)" style="flex: 1" v-model="uploadPath"/>
      <v-btn block location="start" class="upload-button" @click="onSubmit">
        <div>开始上传</div>
      </v-btn>
      <v-dialog v-model="deleteDialogVisible">
        <v-card>
          <v-card-title>
            <span class="text-h5">删除对象桶</span>
          </v-card-title>
          <v-card-text>
            <span>你确认删除存储桶{{currentSelectCosTitle}}吗?</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="deleteDialogVisible = false"
            >
              取消
            </v-btn>
            <v-btn
              color="error"
              variant="text"
              @click="confirmDelete"
            >
              确认
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="uploadConfirmDialogVisible">
        <v-card>
          <v-card-title>
            <span class="text-h5">确认文件名称</span>
          </v-card-title>
          <v-card-text>
            <span>将上传到<span class="text-light-blue">{{uploadFilePath}}</span>，确认吗?</span>
          </v-card-text>
          <v-card-text v-if="!!uploadedRemoteUrl">
            <span>该文件可能已经上传到<a :href="uploadedRemoteUrl" class="link-text">{{uploadedRemoteUrl}}</a>了，确认上传吗?</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="uploadConfirmDialogVisible = false"
            >
              取消
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="confirmUpload"
            >
              确认
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <cos-add-dialog v-model="addCosDialogVisible"/>
    <cos-modify-dialog v-model="modifyDialogVisible" :cos-name="currentSelectCosTitle"/>
  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import CosAddDialog from '../../../components/CosAddDialog.vue'
import { storeToRefs } from 'pinia'
import useTokenStore from '../../../store/tokenStore'
import { showToast, showToastFromBottom } from '../../../utils/Toast'
import CosFactory from '../../../api/cos'
import { v4 as uuidv4 } from 'uuid'
import UploadDB from '../../../database/UploadDB'
import { readFileUrl } from '../../../utils/FileUtils'
import useMissionStore from '../../../store/missionStore'
import CosModifyDialog from '../../../components/CosModifyDialog.vue'

const tokenStore = useTokenStore()
const deleteDialogVisible = ref(false)
const modifyDialogVisible = ref(false)
const currentSelectCosTitle = ref<string | undefined>()
const { tokens } = storeToRefs(tokenStore)
const addCosDialogVisible = ref(false)
const selectPick = ref<string | undefined>(tokens.value[0]?.bucketAlias)
const uploadPath = ref('')
const uploadConfirmDialogVisible = ref(false)
const uploadFilePath = ref('')
const selectedFile = ref<File[]>([])
const missionStore = useMissionStore()

const onSubmitButtonPress = () => {
  addCosDialogVisible.value = true
}

const onCosDelete = (title: string) => {
  currentSelectCosTitle.value = title
  deleteDialogVisible.value = true
}

const onCosModify = (title: string) => {
  currentSelectCosTitle.value = title
  modifyDialogVisible.value = true
}

const confirmDelete = () => {
  deleteDialogVisible.value = false
  if (currentSelectCosTitle.value) {
    showToast('删除成功')
    tokenStore.removeToken(currentSelectCosTitle.value)
    if (currentSelectCosTitle.value === selectPick.value) {
      // 删除的是已经选中的值
      selectPick.value = undefined
    }
  } else {
    showToast('删除失败：未知原因请重试!', 'error')
  }
}

// 保存签名备份，以防上传失败
let randomFilename = ''
// 若当前文件已经上传，则在这里保存url
const uploadedRemoteUrl = ref<string | undefined>()

const onSubmit = () => {
  const file = selectedFile.value[0]
  if (!file) {
    showToast('请选择一个文件', 'error')
    return
  }
  const token = tokens.value.find(value => value.bucketAlias === selectPick.value)
  if (token) {
    const fileExtensionIndex = file.name.lastIndexOf('.')
    if (fileExtensionIndex < 0) {
      showToast('文件名有误! 请确保该文件拥有拓展名')
      return
    }
    const now = new Date()
    let pathPrefix = uploadPath.value
    if (!pathPrefix.endsWith('/')) {
      pathPrefix = pathPrefix + '/'
    }
    randomFilename = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}-${uuidv4() + file.name.substring(fileExtensionIndex)}`

    UploadDB.checkIsUploaded(readFileUrl(file)).then(r => {
      uploadedRemoteUrl.value = r
      console.log(r)
    }).catch(e => {
      uploadedRemoteUrl.value = undefined
      console.error(e)
    })

    uploadFilePath.value = pathPrefix + randomFilename
    uploadConfirmDialogVisible.value = true
  } else {
    showToast('上传失败, 疑似您的存储桶设置有误', 'error')
  }
}



const confirmUpload = () => {
  const token = tokens.value.find(value => value.bucketAlias === selectPick.value)
  if (!token) {
    showToast('上传失败, 疑似您的存储桶设置有误', 'error')
    return
  }
  const file = selectedFile.value[0]
  UploadDB.checkIsUploaded(file.name)
  const { cos, signer } = CosFactory(token.cosProvider)
  const sign = signer.signPutRequest(uploadFilePath.value, { secretId: token.secretId, secretKey: token.secretKey })
  missionStore.addMission(cos.putObject({
    file,
    signature: sign,
    bucket: token.bucket,
    path: uploadFilePath.value,
    uploadFilename: randomFilename,
    cdnUrl: token.cdnUrl
  }))
  selectedFile.value = []
  uploadConfirmDialogVisible.value = false
  showToastFromBottom('添加上传任务成功')
}

</script>

<style scoped>
.bottom-control-container {
  display: flex;
  flex-direction: column;
}
.select-button {
  justify-content: space-between;
}
.upload-button {
  margin-top: 1rem;
}
</style>
