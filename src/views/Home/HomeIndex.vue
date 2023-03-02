<template>
  <v-card class="header">
    <v-tabs
      v-model="tab"
      color="primary"
      align-tabs="center">
        <v-tab to="/home/statusPage">状态</v-tab>
        <v-tab to="/home/upload">上传图片</v-tab>
        <v-tab to="/home/uploadHistory">上传历史</v-tab>
    </v-tabs>
  </v-card>
  <router-view/>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tab = ref()

</script>

<style scoped lang="scss">

</style>
