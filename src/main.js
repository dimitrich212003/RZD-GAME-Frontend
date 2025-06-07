import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/assets/styles/global.css'
import { useFoxStore } from '@/stores/foxStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const store = useFoxStore()
store.loadFromLocalStorage()

app.mount('#app')
