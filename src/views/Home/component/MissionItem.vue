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
            <v-btn v-if="missionState === MissionState.RUNNING" color="error" variant="text" @click="onCancel">{{$t('cancel')}}</v-btn>
            <v-btn v-else-if="missionState === MissionState.FAILED" color="error" variant="text" @click="onRetry">{{$t('retry')}}</v-btn>
          </div>
        </div>
        <v-progress-linear color="primary" :model-value="(progress.current / progress.total) * 100"/>
        <div v-if="missionState >= STATE_DONE_FLAG">
          <div v-if="missionState === MissionState.SUCCESS">
            <span class="text-blue">上传成功, 上传路径: </span>
            <div>
              <span class="text-sm-caption">{{props.mission.remoteUrl}}</span>
            </div>
          </div>
          <div v-else>
            <span class="text-red">上传失败: </span>
            <div>
              <span class="text-sm-caption">{{failMessage}}</span>
            </div>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { Mission } from '../../../api/cos/types'
import { onMounted, reactive, ref } from 'vue'
import useMissionStore from '../../../store/missionStore'

type Props = {
  mission: Mission
}

type Progress = {
  current: number
  total: number
}

enum MissionState {
  NOT_STARTED = 0,
  RUNNING,
  SUCCESS,
  FAILED,
}
// 若state大于该值，说明任务完成了(不管是否成功)
const STATE_DONE_FLAG = 2
const props = defineProps<Props>()
const missionStore = useMissionStore()
const missionState = ref<MissionState>(MissionState.NOT_STARTED)
const failMessage = ref<string>('')

const progress = reactive<Progress>({
  current: 0,
  total: 0,
})

const executeMission = () => {
  if (missionState.value === MissionState.RUNNING) {
    return
  }
  missionState.value = MissionState.RUNNING
  props.mission.execute((current, total) => {
    progress.current = current / 1024
    progress.total = total / 1024
  }).then(() => {
    missionState.value = MissionState.SUCCESS
  }).catch(e => {
    missionState.value = MissionState.FAILED
    failMessage.value = e.message
  }).finally(() => {
    missionStore.incrFinishedCount()
  })
}

onMounted(() => {
  executeMission()
})

const onCancel = () => {
  props.mission.cancel()
}

const onRetry = () => {
  if (missionState.value === MissionState.FAILED) {
    missionStore.decFinishedCount()
    executeMission()
  }
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
