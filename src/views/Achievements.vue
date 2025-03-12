<template>
  <div class="achievements-container">
    <header>
      <Logo/>
    </header>
    <div>
      <div class="achievements-grid">
        <div v-for="achievement in achievements" :key="achievement.id" class="achievement-card">
          <img
              :src="achievement.unlocked ? achievement.img : achievement.lockedImg"
              :class="{ 'locked': !achievement.unlocked }"
              alt="achievement.name"
          />
          <p class="achievement-name">{{ achievement.name }}</p>
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
import { computed } from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Achievements",
  components: {
    NavBar,
    Logo
  },
  setup() {
    const achievementsStore = useAchievementsStore();
    const achievements = computed(() => achievementsStore.achievements);

    return {
      achievements,
    };
  },
}
</script>

<style scoped>
.achievements-container {
  display: flex;
  flex-direction: column;
  height: 91vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
}

.title {
  font-size: 2rem;
  color: #003399;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 800px;
}

.achievement-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

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
  color: #003399;
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