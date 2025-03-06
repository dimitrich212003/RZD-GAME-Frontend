import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import '@/assets/styles/global.css'
import { useFoxStore } from '@/stores/foxStore'

const app = createApp(App)

// 1. Создаем экземпляр Pinia
const pinia = createPinia()

// 2. Регистрируем Pinia и роутер
app.use(pinia)
app.use(router)

// 3. Теперь вызываем наш store
const store = useFoxStore()

// 4. Загружаем данные из LocalStorage (если это нужно до начала работы)
store.loadFromLocalStorage()

// 5. Монтируем приложение
app.mount('#app')
