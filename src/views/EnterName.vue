<template>
  <div class="enter-name-container">
    <div class="content-wrapper">
      <!-- Блок лисёнка -->
      <div class="fox-avatar">
        <!-- Само изображение лисёнка -->
        <img
            :class="{ clicked: isClicked }"
            @click="handleFoxClick"
            src="@/assets/1level.png"
            alt="Лисёнок"
        />

        <!-- Монетки, генерируемые при клике -->
        <div
            v-for="coin in coins"
            :key="coin.id"
            class="coin"
            :style="{
            '--x': coin.x + 'px',
            '--y': coin.y + 'px'
          }"
        ></div>
      </div>

      <!-- Блок формы -->
      <div class="form-block">
        <h2 class="title">Введи имя твоего лисенка</h2>
        <input
            type="text"
            class="name-input"
            v-model="localName"
            :maxlength="12"
            :class="{ 'invalid': showError }"
            placeholder="Например, Рыжик..."
            @input="validateName"
        />
        <p v-if="showError" class="error-text">Введите имя (до 12 символов)</p>

        <button
            :disabled="!isValid"
            class="submit-button"
            @click="submitName"
        >
          Стать железнодорожником
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useFoxStore } from '@/stores/foxStore';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

export default {
  name: 'EnterName',
  setup() {
    const router = useRouter();
    const foxStore = useFoxStore();

    // Локальное состояние поля ввода
    const localName = ref('');
    const showError = ref(false);

    // Валидное имя: не пустое и <= 12 символов
    const isValid = computed(() => {
      return localName.value.trim().length > 0 && localName.value.trim().length <= 12;
    });

    const validateName = () => {
      showError.value = !isValid.value;
    };

    // --- Анимация лисёнка при клике ---
    const isClicked = ref(false);

    // Массив монеток
    const coins = ref([]);

    // Клик по лисёнку: scale + spawn монеток
    const handleFoxClick = () => {
      // 1. Быстрая анимация "сжатия"
      isClicked.value = true;
      setTimeout(() => {
        isClicked.value = false;
      }, 150); // через 0.15с возвращаемся к scale(1)

      // 2. Запускаем монетки
      spawnCoins();
    };

    // Создаём 5 монеток с рандомным направлением/расстоянием
    const spawnCoins = () => {
      const newCoins = [];
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * 2 * Math.PI;  // от 0 до 2π
        const distance = 80 + Math.random() * 70;   // пусть разлетаются на 80..150px
        newCoins.push({
          id: Date.now() + '-' + i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * -distance, // минус, чтобы летели вверх
        });
      }
      coins.value.push(...newCoins);

      // Удаляем эти монетки из массива через 1с (по окончанию анимации)
      setTimeout(() => {
        coins.value.splice(0, newCoins.length);
      }, 1000);
    };

    // Сабмит формы
    const submitName = () => {
      if (!isValid.value) {
        showError.value = true;
        return;
      }
      foxStore.setFoxName(localName.value.trim());
      router.push({ name: 'MainMenu' });
    };

    return {
      localName,
      showError,
      isValid,
      validateName,
      submitName,
      // Лисёнок + монетки
      isClicked,
      handleFoxClick,
      coins
    };
  },
};
</script>

<style scoped>
.enter-name-container {
  position: relative;
  width: 100%;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
  max-width: 1200px;
  gap: 4rem;
  padding: 0 2rem;
}

/* ------ Лисёнок ------ */
.fox-avatar {
  flex-shrink: 0;
  width: clamp(350px, 40vw, 500px);
  height: clamp(350px, 40vw, 500px);
  border-radius: 50%;
  border: 10px solid #000000;
  background-color: transparent;
  position: relative;
}

/* Само изображение */
.fox-avatar img {
  position: absolute;
  cursor: pointer;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  max-width: 130%;
  transition: transform 0.15s ease-in-out;
}

/* При клике чуть уменьшаем */
.fox-avatar img.clicked {
  transform: translate(-50%, -50%) scale(0.9);
}

/* ------ Монетки ------ */
.coin {
  --x: 0px;
  --y: 0px;
  position: absolute;
  width: 50px;
  height: 50px;
  left: 50%;
  top: 50%;
  background-image: url('@/assets/coin.png');
  background-size: cover;
  animation: coin-fall 1s ease forwards;
}


@keyframes coin-fall {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(0.5);
    opacity: 0;
  }
}



/* ------ Форма ввода ------ */
.form-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  width: 100%;
}

/* Заголовок */
.title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  margin-bottom: 1.5rem;
  color: #003399;
  text-align: center;
}

/* Поле ввода */
.name-input {
  font-size: 1rem;
  padding: 0.8rem;
  border: 2px solid #003399;
  border-radius: 0.5rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
}

.name-input.invalid {
  border-color: red;
}

/* Текст ошибки */
.error-text {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

/* Кнопка */
.submit-button {
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  background-color: #d50000;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 1rem;
  line-height: 130%;
  margin-bottom: 20px;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
  background-color: #b71c1c;
}

/* Адаптация */
@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
  }
}
</style>
