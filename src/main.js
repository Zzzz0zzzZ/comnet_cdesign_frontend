import { createApp } from 'vue'
import router from './router/index'
// import './style.css'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
