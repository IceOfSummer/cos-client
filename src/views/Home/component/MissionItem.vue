<template>
  <div class="mission-item-container">
    <v-card>
      <div class="mission-item-card">
        <div class="mission-item-header">
          <div style="max-width: 70%">
            <span class="text-sm-start">{{props.mission.name}}</span>
          </div>
          <div class="mission-item-right-text">
            <div class="text-body-2">
              <span>{{progress.current.toFixed(2)}}KB/</span>
              <span>{{progress.total.toFixed(2)}}KB</span>
            </div>
            <v-btn v-if="!progress.finish" color="error" variant="text" @click="onCancel">{{$t('cancel')}}</v-btn>
          </div>
        </div>
        <v-progress-linear color="primary" :model-value="(progress.current / progress.total) * 100"/>
        <div v-if="!!progress.finish">
          <div v-if="progress.finish.success">
            <span class="text-blue">上传成功, 文件名称: </span>
            <div>
              <span class="text-sm-caption">{{mission.filename}}</span>
            </div>
          </div>
          <div v-else>
            <span class="text-red">上传失败: </span>
            <div>
              <span class="text-sm-caption">{{progress.finish.message}}</span>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { Mission } from '../../../api/cos/types'
import { reactive } from 'vue'

type Props = {
  mission: Mission
}

type Progress = {
  current: number
  total: number
  finish?: {
    success: boolean
    message?: string
  }
}
const props = defineProps<Props>()

const progress = reactive<Progress>({
  current: 0,
  total: 0,
})

props.mission.onProgress = (current, total) => {
  progress.current = current / 1024
  progress.total = total / 1024
}

props.mission.onUploadDone = (success, response) => {
  progress.current = progress.total
  progress.finish = {
    success: success,
    message: response
  }
}

const onCancel = () => {
  props.mission.abortControl.abort()
}

</script>

<style lang="scss">
.mission-item-card {
  box-sizing: border-box;
  padding: 1rem;
}
.mission-item-container {
  box-sizing: border-box;
  padding: 0 2rem;
  margin: 1rem 0;
}
.mission-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;    //设置行数
  overflow: hidden;
}
.mission-item-right-text {
  display: flex;
  align-items: center;
  > .text-body-2 {
    margin-right: 1rem;
  }
}
</style>
