import { createI18n } from 'vue-i18n'

// 引入各个语言配置文件
import zh from './config/zh'
// 创建vue-i18n实例i18n
const i18n = createI18n({
  // 设置默认语言
  locale: 'zh', // 语言标识
  // 添加多语言（每一个语言标示对应一个语言文件）
  messages: {
    zh,
  }
})


// 暴露i18n
export default i18n
