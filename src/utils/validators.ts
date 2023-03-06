import * as validators from '@vuelidate/validators'
import i18n from '../i18n'
import { Ref } from 'vue'

const withI18nMessage = validators.createI18nMessage({ t: i18n.global.t.bind(i18n) })

export const required = withI18nMessage(validators.required)

type ErrorLike = {
  '$message': string | Ref<string>
}
export const errorsToStringArray = ({ $message }: ErrorLike) => {
  if (typeof $message === 'string') {
    return $message
  }
  return $message.value
}
