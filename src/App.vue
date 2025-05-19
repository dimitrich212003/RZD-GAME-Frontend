<template>
  <div id="app">
      <router-view />
  </div>
</template>

<script>
import { useFoxStore } from '@/stores/foxStore';
import { onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const foxStore = useFoxStore();
    onMounted(() => {
      const savedFoxId = localStorage.getItem('foxId');
      if (savedFoxId) {
        foxStore.setFoxId(savedFoxId);
      }
    });
  }
};
</script>

<style>
/* Подключение шрифта (пример) */
@font-face {
  font-family: 'Kaph';
  src: url('@/assets/fonts/Kaph.woff2') format('woff2'),
  url('@/assets/fonts/Kaph.woff') format('woff'),
  url('@/assets/fonts/Kaph.ttf') format('ttf'),
  url('@/assets/fonts/Kaph.otf') format('otf');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

#app {
  min-height: 100vh;
  font-family: 'Kaph', sans-serif;
  background: url('@/assets/background.png') no-repeat center center;
  background-size: cover;
}

.app__container {
  max-width: 1440px;
  margin: 0 auto;
}

/* Шапка */
.select-difficulty-header {
  display: block;
  padding: 2rem;
  text-align: left;
}

/* Логотип по умолчанию (Desktop) */
.select-difficulty-header .logo {
  display: block;
  width: 200px; /* Desktop: 200px */
  height: auto;
}

/* Tablet: уменьшим до 120px (примерный брейкпоинт 768px) */
@media (max-width: 768px) {
  .select-difficulty-header .logo {
    width: 160px;
  }
}

/* Mobile: ещё меньше – 80px (примерный брейкпоинт 480px) */
@media (max-width: 480px) {
  .select-difficulty-header .logo {
    width: 140px;
  }

  .select-difficulty-header {
    padding: 3rem 2rem 1rem 2rem;
  }
}
</style>
