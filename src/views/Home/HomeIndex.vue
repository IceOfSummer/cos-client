<template>
  <v-card class="header">
    <v-tabs
      v-model="tab"
      color="primary"
      align-tabs="center">
        <div class="tabs">
          <div class="tab-item"></div>
          <div class="center-tab">
            <v-tab to="/home/statusPage">{{$t('status')}}</v-tab>
            <v-tab to="/home/upload">{{$t('uploadFile')}}</v-tab>
            <v-tab to="/home/uploadHistory">{{$t('uploadHistory')}}</v-tab>
          </div>
          <div class="right-tab" >
            <v-btn @click="uploadDrawerVisible = true" variant="text">
              {{$t('home.uploadList')}}
              <span v-if="totalMissionCount > 0">({{$t('home.missionUploadProgress', [finishedCount, totalMissionCount])}})</span>
            </v-btn>
          </div>
        </div>
    </v-tabs>
  </v-card>
  <v-layout>
    <v-navigation-drawer v-model="uploadDrawerVisible" temporary location="right" style="width: 34%">
      <upload-mission-control/>
    </v-navigation-drawer>
  </v-layout>
  <router-view class="container"/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UploadMissionControl from './component/UploadMissionControl.vue'
import pubsub from 'pubsub-js'
import { CloudObjectStorage } from '../../api/cos/types'

const tab = ref()
const uploadDrawerVisible = ref(false)
const totalMissionCount = ref(0)
const finishedCount = ref(0)
pubsub.subscribe(CloudObjectStorage.PUBSUB_MISSION_ADD, () => {
  totalMissionCount.value++
})
PubSub.subscribe(CloudObjectStorage.PUBSUB_MISSION_DONE, () => {
  finishedCount.value++
})

</script>

<style scoped lang="scss">
.container {
  margin-top: 1rem;
  box-sizing: border-box;
  padding: 0 1rem;
}
.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1
}
.tab-item {
  flex: 1;
  display: flex;
}
.center-tab {
  @extend .tab-item;
  justify-content: center;
}
.right-tab {
  @extend .tab-item;
  justify-content: flex-end;
}
</style>
