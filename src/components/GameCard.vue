<template>
  <div class="game-card"
       :style="{ backgroundColor: bgColor, alignItems: aliIt }">
    <img class="game-image"
         :style="{ [imagePosition]: '-5%' }"
         :src="`/img/${image}`"
         :alt="title" />
    <div class="card-info_wrapper"
         :style="{ textAlign: textPosition, alignItems: aliIt }">
      <div>
        <h3 class="game-title">{{ title }}</h3>
        <p class="game-description" :style="{ color: subTitleColor }">{{ description }}</p>
      </div>
      <button class="play-button" @click="playGame">
        Играть
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'GameCard',
  props: {
    title: String,
    description: String,
    image: String,
    id: String,
    bgColor: { type: String, default: '#fff' },
    subTitleColor: { type: String, default: '#fff' },
    imagePosition: { type: String, default: 'right' },
    textPosition: { type: String, default: 'left' },
    aliIt: { type: String, default: 'flex-start' }
  },
  setup(props) {
    const router = useRouter();

    const playGame = () => {
      router.push(`/game/${props.id}`);
    };

    return { playGame };
  },
};
</script>

<style scoped>
/* Основные стили карточки */
.game-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  height: 250px;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
}

/* Анимация при наведении: тень + увеличение */
.game-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

/* Изображение лисёнка */
.game-image {
  position: absolute;
  top: -10%;
  width: 270px;
  transition: transform 0.3s ease-in-out;
}

/* Изображение подлетает при наведении */
.game-card:hover .game-image {
  transform: translateY(-10px);
}

/* Контейнер информации */
.card-info_wrapper {
  width: 65%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 0;
}

/* Заголовок игры */
.game-title {
  font-size: 1.7rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

/* Описание */
.game-description {
  font-size: 0.8rem;
  color: #fff;
  margin-bottom: 1rem;
}

/* Кнопка "Играть" */
.play-button {
  padding: 0.5rem 1rem;
  background-color: #d50000;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease-in-out;
  width: 200px;
  height: 50px;
}

/* Кнопка при наведении немного увеличивается */
.play-button:hover {
  background-color: #b71c1c;
  transform: scale(1.05);
}

/* Адаптация под планшеты */
@media (max-width: 992px) {
  .game-image {
  }
  .game-card {
  }
}

/* Адаптация под мобильные устройства */
@media (max-width: 615px) {
  .game-image {
    width: 200px;
    top: -15%;
  }
  .game-card {
    height: 180px;
  }
  .card-info_wrapper {
    width: 50%;
    margin: 0;
  }
  .game-title {
    font-size: 1.3rem;
  }
  .game-description {
    font-size: 0.6rem;
  }
  .play-button {
    height: 40px;
    width: 150px;
  }
}
</style>
