import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.ts'

import Container from '@mim-workspace/ui/Layouts/Container.vue'
import Navigation from '@mim-workspace/ui/Layouts/Navigation.vue'
import Card from '@mim-workspace/ui/Layouts/Card.vue'
import Badge from '@mim-workspace/ui/Components/Badge.vue'
import DateDisplay from '@mim-workspace/ui/Components/DateDisplay.vue'
import DataDisplay from '@mim-workspace/ui/Components/DataDisplay.vue'
import Loading from '@mim-workspace/ui/Components/Loading.vue'

const app = createApp(App)
app.use(router)

app.component('Container', Container)
app.component('Navigation', Navigation)
app.component('Card', Card)
app.component('Badge', Badge)
app.component('DateDisplay', DateDisplay)
app.component('DataDisplay', DataDisplay)
app.component('Loading', Loading)


app.mount('#app')
