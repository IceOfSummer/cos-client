<template>
  <v-dialog v-model="visible">
    <v-card>
      <v-card-title>
        <span class="text-h5">添加存储桶</span>
      </v-card-title>
      <!-- v-text-field在Web上有性能问题, 不过在electron上表现良好. See: https://github.com/vuetifyjs/vuetify/issues/6201 -->
      <v-form @submit.prevent="onSubmit">
        <v-card-text>
          <v-alert type="warning" text="暂时只支持腾讯云, 后续将会支持更多厂商"/>
        </v-card-text>
        <v-card-text>
          <v-lazy :min-height="550">
            <div>
              <v-text-field label="存储桶名称" :rules="commonRules" v-model="cosName"/>
              <v-text-field label="存储桶别称(可选)"  v-model="cosAlias"/>
              <v-text-field label="地域" :rules="commonRules" v-model="region"/>
              <v-text-field label="存储桶访问地址" :rules="commonRules" v-model="accessUrl"/>
              <v-text-field label="AccessKey" :rules="commonRules" v-model="accessKey"/>
              <v-text-field label="AccessToken" :rules="commonRules" v-model="accessToken"/>
            </div>
          </v-lazy>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="visible = false"
          >
            取消
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            type="submit"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { ref, computed,defineComponent } from 'vue'
import useTokenStore from '../store/tokenStore'
import Toastify from 'toastify-js'
import { showToast } from '../utils/Toast'

const successToast = Toastify({
  text: '添加成功!',
  duration: 3000
})

export default defineComponent({
  name: 'CosAddDialog',
  props: {
    modelValue: Boolean
  },
  setup(props, { emit }) {
    const tokenStore = useTokenStore()
    const visible = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })
    const cosName = ref()
    const cosAlias = ref()
    const region = ref()
    const accessUrl = ref()
    const accessKey = ref()
    const accessToken = ref()

    const commonRules = [
      (value: string) => {
        if (!value || value.trim().length === 0) {
          return '该值不可为空'
        }
        return true
      }
    ]

    const openDrawer = () => {
      visible.value = true
    }

    const onSubmit = (e: SubmitEvent) => {
      try {
        tokenStore.appendToken({
          accessKey: accessKey.value,
          accessToken: accessKey.value,
          bucketAlias: cosAlias.value || cosName.value,
          bucket: cosName.value,
          region: region.value
        })
        successToast.showToast()
        // 清空表单
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        e.target?.reset()
        visible.value = false
      } catch (e: any) {
        showToast('保存失败: ' + e.message, 'error')
      }
    }

    return {
      visible,
      openDrawer,
      cosName,
      cosAlias,
      region,
      accessUrl,
      accessKey,
      accessToken,
      commonRules,
      onSubmit
    }
  }
})
</script>

<style scoped>

</style>
