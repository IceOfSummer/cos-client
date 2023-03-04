import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuetify from './vuetify'
import 'toastify-js/src/toastify.css'
import i18n from './i18n'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)


app.use(i18n)
app.use(vuetify)
app.use(pinia)
app.use(router)
app.mount('#app')
