<template>
  <v-dialog :model-value="visible">
    <v-card>
      <v-card-title>
        <span class="text-h5">修改存储桶</span>
      </v-card-title>
      <v-form v-if="formValue" @submit.prevent="onSubmit">
        <v-card-text>
          <v-lazy :min-height="550">
            <div>
              <v-text-field label="存储桶名称" v-model="formValue.bucketAlias"
                            :error-messages="form.bucketAlias.$errors.map(errorsToStringArray)"/>
              <v-text-field label="存储桶访问域名" v-model="formValue.bucket"
                            :error-messages="form.bucket.$errors.map(errorsToStringArray)"/>
              <v-text-field label="SecretId" v-model="formValue.secretId"
                            :error-messages="form.secretId.$errors.map(errorsToStringArray)"/>
              <v-text-field label="SecretKey" v-model="formValue.secretKey"
                            :error-messages="form.secretKey.$errors.map(errorsToStringArray)"/>
              <v-text-field label="CDN访问链接(格式为https://xxx.xxx, 可选)" v-model="formValue.cdnUrl"/>
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
      <v-card-text v-else>
        <v-alert type="error" text="存储桶不存在"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, Ref, watch } from 'vue'
import useTokenStore, { Token } from '../store/tokenStore'
import { useVuelidate, Validation, ValidationArgs } from '@vuelidate/core'
import { errorsToStringArray, required } from '../utils/validators'
import { showToast } from '../utils/Toast'

interface Props {
  /**
   * visible
   */
  modelValue: boolean
  cosName: string
}
const tokenStore = useTokenStore()
const props = withDefaults(defineProps<Props>(), {
  cosName: ''
})

const emit = defineEmits(['update:modelValue'])
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

let formValue: Token | undefined
let form: Ref<Validation<ValidationArgs<Token>, Token>> | undefined
watch(() => props.cosName, () => {
  const token = JSON.parse(JSON.stringify(tokenStore.findByTitle(props.cosName))) as Token
  console.log(token, props.modelValue)
  if (token) {
    formValue = reactive(token)
    console.log(form)
    form = useVuelidate<Token, ValidationArgs<Token>>({
      bucketAlias: { required },
      bucket: { required },
      secretKey: { required },
      secretId: { required },
      cosProvider: { required },
    }, formValue)
  } else {
    if (props.cosName) {
      console.error(`不存在名称为${props.cosName}的存储桶`)
    }
  }

})

const onSubmit = async () => {
  if (!form || !await form.value.$validate()) {
    return
  }
  const _formValue = formValue as Required<Token>
  try {
    if (tokenStore.modifyToken(props.cosName, _formValue)) {
      showToast('添加成功')
      visible.value = false
      // 清空表单
      form.value.$reset()
    } else {
      showToast('保存失败，请重试', 'error')
    }
  } catch (e: any) {
    showToast('保存失败: ' + e.message, 'error')
  }
}

</script>

<style scoped>

</style>
