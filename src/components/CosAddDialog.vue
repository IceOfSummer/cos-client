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
              <v-select
                :items="cosProviderList"
                :error-messages="form.cosProvider.$errors.map(errorsToStringArray)"
                item-title="alias"
                item-value="name"
                v-model="formValue.cosProvider"
                label="服务商"
              />
              <v-text-field label="存储桶名称" v-model="formValue.cosName" :error-messages="form.cosName.$errors.map(errorsToStringArray)"/>
              <v-text-field label="存储桶访问域名" v-model="formValue.accessUrl" :error-messages="form.accessUrl.$errors.map(errorsToStringArray)"/>
              <v-text-field label="SecretId" v-model="formValue.secretId" :error-messages="form.secretId.$errors.map(errorsToStringArray)"/>
              <v-text-field label="SecretKey" v-model="formValue.secretKey" :error-messages="form.secretKey.$errors.map(errorsToStringArray)"/>
              <v-text-field label="存储桶别称(可选)"  v-model="formValue.cosAlias"/>
              <v-text-field label="CDN访问链接(格式为https://xxx.xxx, 可选)"  v-model="formValue.cdnUrl"/>
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

<script lang="ts" setup>
import { computed, reactive, Ref } from 'vue'
import useTokenStore from '../store/tokenStore'
import { showToast } from '../utils/Toast'
import { CosProvider } from '../api/cos/types'
import { useVuelidate, ValidationArgs } from '@vuelidate/core'
import { required } from '../utils/validators'

interface Props {
  modelValue: boolean
}

type ErrorLike = {
  '$message': string | Ref<string>
}

const errorsToStringArray = ({ $message }: ErrorLike) => {
  if (typeof $message === 'string') {
    return $message
  }
  return $message.value
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

type CosProviderItem = {
  name: CosProvider
  alias: string
}

// cos列表
const cosProviderList: Array<CosProviderItem> = [{ name: 'tencent', alias: '腾讯云' }]

type FromValue = {
  cosName?: string,
  cosAlias?: string,
  accessUrl?: string,
  secretKey?: string,
  secretId?: string,
  cosProvider?: CosProvider,
  cdnUrl?: string
}

const formValue = reactive<FromValue>({
  cosName: '',
  cosAlias: '',
  accessUrl: '',
  secretKey: '',
  secretId: '',
  cosProvider: undefined,
  cdnUrl: undefined
})

const form = useVuelidate<FromValue, ValidationArgs<FromValue>>({
  cosName: { required },
  accessUrl: { required },
  secretKey: { required },
  secretId: { required },
  cosProvider: { required },
}, formValue)

const tokenStore = useTokenStore()
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const onSubmit = async () => {
  const result = await form.value.$validate()
  if (!result) {
    return
  }
  const _formValue = formValue as Required<FromValue>
  try {
    tokenStore.appendToken({
      secretKey: _formValue.secretKey,
      secretId: _formValue.secretId,
      bucketAlias: _formValue.cosAlias || _formValue.cosName,
      bucket: _formValue.accessUrl,
      cosProvider: _formValue.cosProvider,
      cdnUrl: _formValue.cdnUrl
    })
    visible.value = false
    showToast('添加成功')
    // 清空表单
    form.value.$reset()
  } catch (e: any) {
    showToast('保存失败: ' + e.message, 'error')
  }
}
</script>

<style scoped>

</style>
