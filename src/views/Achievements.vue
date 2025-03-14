<template>
  <div class="achievements-container">
    <header>
      <Logo />
    </header>
    <div>
      <div class="achievements-grid">
        <div
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
            @click="toggleAchievement(achievement.id)"
        >
          <transition name="card-scale">
            <div class="card-inner">
              <img
                  :src="achievement.unlocked ? achievement.img : achievement.lockedImg"
                  :class="{ 'locked': !achievement.unlocked }"
                  :alt="achievement.name"
              />
              <p class="achievement-name">{{ achievement.name }}</p>
            </div>
          </transition>

          <transition name="fade">
            <div
                v-if="expandedId === achievement.id"
                class="achievement-details"
            >
              <p>{{ achievement.description }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
  <NavBar activeTab="Achievements" />
</template>

<script>
import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";
import { useAchievementsStore } from "@/stores/achievementsStore";
import { computed, ref } from "vue";

export default {
  name: "AchievementsComponent",
  components: {
    NavBar,
    Logo,
  },
  setup() {
    const achievementsStore = useAchievementsStore();
    const achievements = computed(() => achievementsStore.achievements);

    const expandedId = ref(null);

    const toggleAchievement = (id) => {
      expandedId.value = (expandedId.value === id) ? null : id;
    };

    return {
      achievements,
      expandedId,
      toggleAchievement,
    };
  },
};
</script>

<style scoped>
.achievements-container {
  display: flex;
  flex-direction: column;
  height: 91vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.achievements-grid {
  display: grid;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  grid-template-columns: repeat(5, 1fr);
}

.achievement-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding: 1rem;
}

.achievement-card:hover {
  transform: scale(1.03);
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Картинка */
.achievement-card img {
  width: 100px;
  height: 100px;
  transition: filter 0.3s ease-in-out;
}

.achievement-card img.locked {
  filter: grayscale(100%) brightness(60%);
}

.achievement-name {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  color: #012838;
}

.achievement-details {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;

  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  width: 140px;
  font-size: 0.9rem;
  color: #012838;
  animation: fade-in 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.card-scale-enter-active,
.card-scale-leave-active {
  transition: transform 0.3s ease;
}
.card-scale-enter {
  transform: scale(0.95);
}
.card-scale-leave-to {
  transform: scale(0.95);
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -5px);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 1199px) {
  .achievements-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 992px) {
  .achievements-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 480px) {
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
