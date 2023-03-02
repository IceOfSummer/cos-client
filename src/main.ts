import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VCard, VTab, VTabs } from 'vuetify/components'

const vuetify = createVuetify({
  components: {
    'v-tabs': VTabs,
    'v-card': VCard,
    'v-tab': VTab
  },
  directives: []
})

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.mount('#app')
