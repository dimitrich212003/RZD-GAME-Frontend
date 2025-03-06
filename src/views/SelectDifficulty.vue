<template>
  <div class="select-difficulty-container">
    <h1 class="select-difficulty-title">Привет! Выбери уровень игры</h1>
    <!-- Карточки с лисёнками -->
    <div class="cards-wrapper">
      <div class="difficulty-card easy" @click="chooseLevel('easy')">
        <!-- Изображение лисёнка (малыш) -->
        <div class="fox-image">
          <img class="easy_img" src="@/assets/fox_easy.png" alt="Лисёнок - легкий уровень" />
        </div>
        <p>Я еще малыш</p>
      </div>

      <div class="difficulty-card hard" @click="chooseLevel('hard')">
        <!-- Изображение лисёнка (большой) -->
        <div class="fox-image">
          <img class="hard_img" src="@/assets/fox_hard.png" alt="Лисёнок - сложный уровень" />
        </div>
        <p>Я уже большой</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useDifficultyStore } from '@/stores/difficultyStore';
import { useRouter } from 'vue-router';

export default {
  name: 'SelectDifficulty',
  setup() {
    const difficultyStore = useDifficultyStore();
    const router = useRouter();

    const chooseLevel = (level) => {
      difficultyStore.setDifficulty(level);
      router.push({ name: 'EnterName' });
    };

    return {
      chooseLevel,
    };
  },
};
</script>

<style scoped>
.select-difficulty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0rem 2rem 2rem 2rem;
}

.select-difficulty-title {
  font-size: clamp(1.5rem, 5vw, 3rem);
  text-align: center;
  margin: 1rem 0 clamp(3.5rem, 5vw, 5rem) 0;
  color: #003399;

}

/* Обёртка для карточек */
.cards-wrapper {
  display: flex;
  width: 100%;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

/* Карточка */
.difficulty-card {
  cursor: pointer;
  width: clamp(300px, 30vw, 500px);
  aspect-ratio: 1/1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  position: relative;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

/* Контейнер для лисёнка, чтобы "выступал" за карточку */
.fox-image {
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Настройка изображения */
.fox-image img {
  height: auto;
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
}

/* Лёгкий лисёнок немного меньше, если хотите */
.easy_img {
  width: 95%;
}

/* Взрослый лисёнок */
.hard_img {
  width: 100%;
}

.difficulty-card p {
  margin-top: 1rem;
  color: #fff;
  font-size: clamp(1rem, 5vw, 1.7rem);
  font-weight: bold;
}

/* Фоновые цвета для карточек */
.difficulty-card.easy {
  background-color: #EE7F1A;
}

.difficulty-card.hard {
  background-color: #00A0E3;
}

/* Анимация при ховере */
.difficulty-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

/* Анимация при клике */
.difficulty-card:active {
  transform: scale(0.95);
}

/* Увеличиваем лисенка при наведении */
.difficulty-card:hover .fox-image img {
  transform: scale(1.1);
}

/* ----- Адаптация под планшеты ----- */
@media (max-width: 768px) {
  .cards-wrapper {
    flex-direction: column;
    align-items: center;
  }
  .difficulty-card {
    width: 80%;
    margin-bottom: 1rem;
  }
}

/* ----- Адаптация под мобильные ----- */
@media (max-width: 480px) {
  .difficulty-card {
    width: 100%;
  }
}
</style>
