<template>
  <v-card-title>
    <span class="text-h5">{{$t('home.uploadMission')}}</span>
  </v-card-title>
  <mission-item v-for="item in missions" :key="item.name" :mission="item"/>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { CloudObjectStorage, Mission } from '../../../api/cos/types'
import MissionItem from './MissionItem.vue'

const missions = ref<Array<Mission>>([])
const listener = PubSub.subscribe(CloudObjectStorage.PUBSUB_MISSION_ADD, (key, arg) => {
  const mission = arg as Mission
  missions.value = [mission, ...missions.value]
})

onUnmounted(() => {
  PubSub.unsubscribe(listener)
})


</script>

<style scoped>

</style>
