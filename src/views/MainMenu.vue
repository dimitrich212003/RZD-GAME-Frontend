<template>
  <div class="main-menu-container">
    <div class="games-grid">
      <GameCard
          v-for="game in games"
          :key="game.id"
          :title="game.title"
          :description="game.description"
          :image="game.image"
          :id="game.id"
          :bgColor="game.bgColor"
          :subTitleColor="game.subTitleColor"
          :imagePosition="game.imagePosition"
          :textPosition="game.textPosition"
          :aliIt="game.aliIt"
      />
    </div>
  </div>
  <nav class="bottom-nav">
    <div
        :class="['nav-item', { active: false }]"
        @click="goToAchievements"
    >
      <img class="cup_icon nav_icon" src="@/assets/cup.svg" alt="Лисёнок - легкий уровень" />
    </div>
    <div
        :class="['nav-item', { active: true }]"
        @click="goToMenu"
    >
      <img class="game_icon nav_icon" src="@/assets/game_active.svg" alt="Лисёнок - легкий уровень" />
    </div>
    <div
        :class="['nav-item', { active: false }]"
        @click="goToProfile"
    >
      <img class="person_icon nav_icon" src="@/assets/person.svg" alt="Лисёнок - легкий уровень" />

    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
import GameCard from '../components/GameCard.vue';

export default {
  name: 'MainMenu',
  components: {
    GameCard,
  },
  setup() {
    const router = useRouter();

    const games = [
      {
        id: 'machinist',
        title: 'Лисёнок-машинист',
        description: 'Веди паровозик по рельсам, избегая препятствий!',
        image: 'fox_machinist.png',
        bgColor: '#00A0E3',
        subTitleColor: '#024660',
        imagePosition: 'right',
        textPosition: 'left',
        aliIt: 'flex-start'
      },
      {
        id: 'puteec',
        title: 'Лисёнок-путеец',
        description: 'Чини железную дорогу и расставляй рельсы правильно!',
        image: 'fox_puteec.png',
        bgColor: '#EE8016',
        subTitleColor: '#613C18',
        imagePosition: 'right',
        textPosition: 'left',
        aliIt: 'flex-start'
      },
      {
        id: 'dispatcher',
        title: 'Лисёнок-диспетчер',
        description: 'Управляй движением поездов избегая аварий!',
        image: 'fox_dispatcher.png',
        bgColor: '#009946',
        subTitleColor: '#003A1B',
        imagePosition: 'left',
        textPosition: 'right',
        aliIt: 'flex-end'
      },
      {
        id: 'provodnik',
        title: 'Лисёнок-проводник',
        description: 'Помогай пассажирам и следи за порядком в вагоне!',
        image: 'fox_provodnik.png',
        bgColor: '#036186',
        subTitleColor: '#012838',
        imagePosition: 'left',
        textPosition: 'right',
        aliIt: 'flex-end'
      },
    ];

    const changeDifficulty = () => {
      router.push({ name: 'SelectDifficulty' });
    };

    // Нижняя панель
    const goToAchievements = () => {
      router.push({ name: 'Achievements' });
    };

    const goToMenu = () => {
      router.push({ name: 'MainMenu' });
    };

    const goToProfile = () => {
      router.push({ name: 'Profile' });
    };

    return {
      games,
      changeDifficulty,
      goToAchievements,
      goToMenu,
      goToProfile,
    };
  },
};
</script>

<style scoped>
.main-menu-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  overflow: auto;
}

/* ВЕРХНЯЯ ПАНЕЛЬ */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.top-bar .logo {
  width: clamp(100px, 15vw, 200px);
}

.change-difficulty {
  background-color: transparent;
  border: 2px solid #003399;
  color: #003399;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.change-difficulty:hover {
  background-color: #dde;
}


.games-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  row-gap: 3rem;
  column-gap: 2rem;
  padding: 2.6rem 4rem;
}


/* Нижняя панель */
.bottom-nav {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #00A0E3;
  padding: 0.5rem;
  width: 300px;
  height: 60px;
  border-radius: 40px;
}

.nav-item {
  font-size: 1.5rem;
  color: #fff;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s ease;
  position: relative;
}

.nav-item.active {
  opacity: 1;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 57%;
  transform: translateX(-54%);
  width: 45px;
  height: 20px;
  background-image: url('@/assets/active.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.nav-item:hover {
  opacity: 1;
}

@media (max-width: 1100px) {
  .games-grid {
    grid-template-columns: 1fr;
    padding: 2.6rem 2rem;
  }
}

@media (max-width: 615px) {
  .games-grid {
    padding: 2.6rem 1rem;
    row-gap: 2.5rem;
  }
}
</style>
