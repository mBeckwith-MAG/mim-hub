import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'

import Container from '@mim-workspace/ui/Layouts/Container.vue'
import Navigation from '@mim-workspace/ui/Layouts/Navigation.vue'
import Card from '@mim-workspace/ui/Layouts/Card.vue'
import Badge from '@mim-workspace/ui/Layouts/Badge.vue'
import DateDisplay from '@mim-workspace/ui/Components/DateDisplay.vue'
import DataDisplay from '@mim-workspace/ui/Components/DataDisplay.vue'

import FileDownloadIcon from '@iconify-vue/system-uicons/file-download'
import LinkAltIcon from '@iconify-vue/system-uicons/link-alt'
import FilterIcon from '@iconify-vue/system-uicons/filter'
import WriteIcon from '@iconify-vue/system-uicons/write'
import ButtonAddIcon from '@iconify-vue/system-uicons/button-add'
import CloseIcon from '@iconify-vue/system-uicons/close'

const app = createApp(App)
app.use(router)

app.component('Container', Container)
app.component('Navigation', Navigation)
app.component('Card', Card)
app.component('Badge', Badge)
app.component('DateDisplay', DateDisplay)
app.component('DataDisplay', DataDisplay)

app.component('FileDownloadIcon', FileDownloadIcon)
app.component('LinkAltIcon', LinkAltIcon)
app.component('FilterIcon', FilterIcon)
app.component('WriteIcon', WriteIcon)
app.component('ButtonAddIcon', ButtonAddIcon)
app.component('CloseIcon', CloseIcon)

app.mount('#app')
