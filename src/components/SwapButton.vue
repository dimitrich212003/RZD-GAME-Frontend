<template>
  <button class="change-difficulty" @click="changeDifficulty">
    <span>Сменить режим игры</span>
    <img class="swap-icon" src="@/assets/swap.svg" alt="swap" />
  </button>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: "SwapButton",
  setup() {
    const router = useRouter();

    const changeDifficulty = () => {
      router.push({ name: 'SelectDifficulty' });
    };

    return {
      changeDifficulty,
    };
  }
}
</script>

<style scoped>
/* Основные стили кнопки */
.change-difficulty {
  background-color: transparent;
  color: #012838;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
}

.swap-icon {
  max-width: 40px;
  transition: transform 0.2s ease-in-out;
}

.change-difficulty:hover .swap-icon {
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0% { transform: rotate(0); }
  25% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0); }
}

@media (max-width: 768px) {
  .change-difficulty {
    font-size: 1rem;
    text-align: right;
    gap: 8px;
  }
  .swap-icon {
    max-width: 30px;
  }
}


@media (max-width: 480px) {
  .change-difficulty {
    margin: 3rem 2rem 1rem 2rem;
    font-size: 0.8rem;
    gap: 6px;
  }
  .swap-icon {
    max-width: 20px;
  }
}
</style>
