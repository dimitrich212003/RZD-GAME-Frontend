<template>
  <nav class="bottom-nav">
    <div
        :class="['nav-item', { active: activeTab === 'Achievements' }]"
        @click="goToAchievements"
    >
      <img class="nav_icon" :src="achievementIcon" alt="Достижения" />
    </div>
    <div
        :class="['nav-item', { active: activeTab === 'MainMenu' }]"
        @click="goToMenu"
    >
      <img class="nav_icon" :src="gameIcon" alt="Игры" />
    </div>
    <div
        :class="['nav-item', { active: activeTab === 'Profile' }]"
        @click="goToProfile"
    >
      <img class="nav_icon" :src="profileIcon" alt="Профиль" />
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: "NavBar",
  props: {
    activeTab: {
      type: String,
      default: 'MainMenu'
    }
  },
  setup(props) {
    const router = useRouter();

    const achievementIcon = computed(() =>
        props.activeTab === 'Achievements' ? require('@/assets/cup_active.svg') : require('@/assets/cup.svg')
    );
    const gameIcon = computed(() =>
        props.activeTab === 'MainMenu' ? require('@/assets/game_active.svg') : require('@/assets/game.svg')
    );
    const profileIcon = computed(() =>
        props.activeTab === 'Profile' ? require('@/assets/person_active.svg') : require('@/assets/person.svg')
    );

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
      goToAchievements,
      goToMenu,
      goToProfile,
      achievementIcon,
      gameIcon,
      profileIcon
    };
  },
};
</script>

<style scoped>
/* Основной контейнер навигации */
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

/* Элементы навбара */
.nav-item {
  font-size: 1.5rem;
  color: #fff;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
  position: relative;
}

/* Анимация при активации */
.nav-item.active {
  opacity: 1;
}

/* Плавное появление active.svg */
.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: -22%;
  transform: translateX(-50%);
  width: 45px;
  height: 20px;
  background-image: url('@/assets/active.svg');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0;
  animation: fade-in 0.3s ease-in-out forwards;
}

/* Анимация смены иконок */
.nav_icon {
  width: 30px;
  height: 30px;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

/* Плавное увеличение иконки при активации */
.nav-item.active .nav_icon {
  transform: scale(1.2);
  opacity: 1;
}

/* Анимация появления active.svg */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
