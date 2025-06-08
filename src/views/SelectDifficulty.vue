<template>
  <div class="select-difficulty-container">
    <header>
      <RzdLogo/>
    </header>
    <h1 class="select-difficulty-title">Привет! Выбери уровень игры</h1>
    <div class="cards-wrapper">
      <div class="difficulty-card easy" @click="chooseLevel('easy')">
        <!-- Изображение лисёнка (малыш) -->
        <div class="fox-image">
          <img class="easy_img" src="@/assets/fox_easy.png" alt="Лисёнок - легкий уровень" />
        </div>
        <p>Я еще малыш</p>
      </div>

      <div class="difficulty-card hard" @click="chooseLevel('hard')">
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
import { useFoxStore } from '@/stores/foxStore';
import { useRouter } from 'vue-router';
import RzdLogo from "@/components/RzdLogo";
import axios from "axios";

export default {
  name: 'SelectDifficulty',
  components: {RzdLogo},
  setup() {
    const difficultyStore = useDifficultyStore();
    const foxStore = useFoxStore();
    const router = useRouter();

    const chooseLevel = async (level) => {
      if (foxStore.foxName) {
        if (!foxStore.foxId) {
          console.error('Fox ID не сохранено');
          return;
        }

        try {
          const response = await axios.put(`http://localhost:8585/api/fox/updateGameLevel/${foxStore.foxId}`, level,
              {
                headers: {
                  'Content-Type': 'text/plain'
                }
              });

          difficultyStore.setDifficulty(response.data.gameLevel);
          await router.push({name: 'Profile'});
        } catch (error) {
          console.error('Ошибка обновлении сложности игры:', error);
        }
      } else {
        difficultyStore.setDifficulty(level);
        foxStore.loadFromLocalStorage();
        await router.push({name: 'EnterName'});
      }
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
  max-width: 1440px;
  margin: 0 auto;
}

.select-difficulty-title {
  font-size: clamp(1.5rem, 5vw, 3rem);
  text-align: center;
  margin: 1rem 0 clamp(3.5rem, 5vw, 5rem) 0;
  color: #003399;

}

.cards-wrapper {
  display: flex;
  width: 100%;
  gap: 2rem;
  justify-content: center;
  align-items: center;
}

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

.fox-image {
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
}

.fox-image img {
  height: auto;
  transform: scale(1);
  transition: transform 0.2s ease-in-out;
}

.easy_img {
  width: 95%;
}

.hard_img {
  width: 100%;
}

.difficulty-card p {
  margin-top: 1rem;
  color: #fff;
  font-size: clamp(1rem, 5vw, 1.7rem);
  font-weight: bold;
}

.difficulty-card.easy {
  background-color: #EE7F1A;
}

.difficulty-card.hard {
  background-color: #00A0E3;
}

.difficulty-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

.difficulty-card:active {
  transform: scale(0.95);
}

.difficulty-card:hover .fox-image img {
  transform: scale(1.1);
}

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

@media (max-width: 480px) {
  .difficulty-card {
    width: 100%;
  }
}
</style>
