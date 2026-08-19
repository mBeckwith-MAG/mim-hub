import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Container from '@mim-workspace/ui/Layouts/Container.vue'

const app = createApp(App)


app.component('Container', Container)


app.mount('#app')
