import { createApp } from 'vue'
import router from './router/index'
// import './style.css'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.use(createPinia())
app.mount('#app')
