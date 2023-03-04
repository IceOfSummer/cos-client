<script setup lang="ts">
import { onMounted } from 'vue'
import Database from './database'

onMounted(() => {
  // 初始化
  Database.INSTANCE
})
</script>

<template>
  <router-view/>
</template>

<style scoped>
</style>
