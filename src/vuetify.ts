import { createVuetify } from 'vuetify'
import {
  VAlert,
  VBtn,
  VCard, VCardActions, VCardText,
  VCardTitle, VCheckbox, VCheckboxBtn, VCol, VContainer,
  VDialog,
  VDivider,
  VFileInput, VForm, VLazy,
  VListItem, VRow,
  VSelect, VSpacer,
  VTab,
  VTabs, VTextField
} from 'vuetify/components'
import { aliases, md } from 'vuetify/iconsets/md'

const vuetify = createVuetify({
  components: {
    'v-tabs': VTabs,
    'v-card': VCard,
    'v-tab': VTab,
    'v-file-input': VFileInput,
    'v-btn': VBtn,
    'v-select': VSelect,
    'v-divider': VDivider,
    'v-list-item': VListItem,
    'v-dialog': VDialog,
    'v-card-title': VCardTitle,
    'v-container': VContainer,
    'v-row': VRow,
    'v-col': VCol,
    'v-text-field': VTextField,
    'v-card-text': VCardText,
    'v-card-actions': VCardActions,
    'v-lazy': VLazy,
    'v-spacer': VSpacer,
    'v-form': VForm,
    'v-alert': VAlert,
    'v-checkbox': VCheckbox,
    'v-checkbox-btn': VCheckboxBtn
  },
  directives: [],
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md
    }
  }
})

export default vuetify
