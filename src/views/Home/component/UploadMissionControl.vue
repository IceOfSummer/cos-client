<template>
  <v-card-title>
    <span class="text-h5">{{$t('home.uploadMission')}}</span>
  </v-card-title>
  <mission-item v-for="item in missions" :key="item.name" :mission="item"/>
</template>

<script setup lang="ts">
import MissionItem from './MissionItem.vue'
import { storeToRefs } from 'pinia'
import useMissionStore from '../../../store/missionStore'

const missionStore = useMissionStore()
const { missions } = storeToRefs(missionStore)


</script>

<style scoped>

</style>
