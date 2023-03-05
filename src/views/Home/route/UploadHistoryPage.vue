<template>
  <v-data-table v-model:items-per-page="pageSize" :headers="tableHeaders" :items="uploadHistory" v-model:page="curPage"/>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import UploadDB, { UploadDBSchema } from '../../../database/UploadDB'
import pubsub from 'pubsub-js'
import Database from '../../../database'

const uploadHistory = ref<UploadDBSchema[]>([])
const curPage = ref(1)
const pageSize = ref(5)
const totalSize = ref(0)
const options = ref({})
const tableHeaders = [{ title: '本地路径', key: 'path' }, { title: '远程路径', key: 'remoteUrl' }]

watch(options, () => {
  loadData()
}, { deep: true })

const loadData = () => {
  UploadDB.queryUploadedByPage(curPage.value, pageSize.value).then(r => {
    uploadHistory.value = r
  }).catch(e => {
    console.error(e)
  })
}

const doInit = () => {
  loadData()
  if (totalSize.value === 0) {
    UploadDB.getUploadedCount().then(r => {
      totalSize.value = r
    }).catch(e => {
      console.error(e)
    })
  }
}

pubsub.subscribeOnce(Database.PUBSUB_ON_DB_INIT_DONE, () => {
  doInit()
})

onMounted(() => {
  doInit()
})

</script>

<style scoped>

</style>
