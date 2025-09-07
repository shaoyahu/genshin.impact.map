import './css/main.less'
import 'leaflet/dist/leaflet.css'
import 'leaflet.zoomslider'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
