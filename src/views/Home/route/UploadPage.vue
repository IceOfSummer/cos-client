<template>
  <div>
    <v-file-input label="添加图片/文件" @update:model-value="onModelValueUpdate"></v-file-input>
    <div class="bottom-control-container">
      <v-select :items="tokens.map(value => value.bucketAlias)" label="上传目的地" v-model="selectPick">
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
              <v-btn @click.prevent="onCosDelete(props.item.title)" variant="text" color="error">删除</v-btn>
            </template>
          </v-btn>
        </template>
      </v-select>
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
      <v-btn :disabled="buttonDisable" block location="start" class="upload-button">
        <div>开始上传</div>
      </v-btn>
    </div>
    <cos-add-dialog v-model="dialogVisible"/>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import CosAddDialog from '../../../components/CosAddDialog.vue'
import { storeToRefs } from 'pinia'
import useTokenStore from '../../../store/tokenStore'
import { showToast } from '../../../utils/Toast'

export default {
  components: { CosAddDialog },
  setup() {
    const tokenStore = useTokenStore()
    const deleteDialogVisible = ref(false)
    const dialogVisible = ref(false)
    const currentSelectCosTitle = ref<string | undefined>()
    const { tokens } = storeToRefs(tokenStore)
    const selectPick = ref<string | undefined>(tokens.value[0]?.bucketAlias)
    const buttonDisable = ref < boolean > (true)
    const onModelValueUpdate = (files: File[]) => {
      buttonDisable.value = !(files.length >= 0 && selectPick.value)
    }

    const onSubmitButtonPress = () => {
      dialogVisible.value = true
    }

    const onCosDelete = (title: string) => {
      currentSelectCosTitle.value = title
      deleteDialogVisible.value = true
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

    const addCosDialogVisible = ref(false)

    return {
      buttonDisable,
      onModelValueUpdate,
      tokens,
      addCosDialogVisible,
      dialogVisible,
      onSubmitButtonPress,
      selectPick,
      deleteDialogVisible,
      currentSelectCosTitle,
      onCosDelete,
      confirmDelete
    }
  }
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
