<template>
  <div class="profile-container">
    <header class="top-bar">
      <Logo />
      <SwapButton />
    </header>
    <div class="content-wrapper">
      <div class="fox-avatar" :style="backgroundStyle">
        <img :class="{ clicked: isClicked }" @click="handleFoxClick"
            :src="currentFoxImage" alt="Лисёнок"/>
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
      <div class="info-block">
        <div class="info-line edit-name-wrapper">
          <span class="label">Имя лисёнка:</span>
          <div class="name-field">
            <template v-if="!isEditingName">
              <span class="fox-name">{{ foxStore.foxName || 'Имя' }}</span>
              <img
                  src="@/assets/edit.svg"
                  class="edit-icon"
                  alt="edit"
                  @click="startEditingName"
              />
            </template>
            <template v-else>
              <form class="edit-name">
                <div>
                  <input
                      type="text"
                      class="name-input"
                      v-model="tempName"
                      :maxlength="10"
                      :class="{ 'invalid': showError }"
                      placeholder="Например, Рыжик..."
                      @input="validateName"
                  />
                  <p v-if="showError" class="error-text">Введите имя (до 10 символов)</p>
                </div>
                <button
                    :disabled="!isValid"
                    class="save-name"
                    @click="saveName"
                >Сохранить</button>
              </form>
            </template>
          </div>
        </div>
        <div class="info-line coins-wrapper">
          <p class="value coin-value">{{ foxStore.totalCoins }}</p>
          <p class="label coin-label">Монетки</p>
        </div>
        <div class="info-line">
          <span class="label">Уровень игры:</span>
          <span class="value">{{ difficultyLabel }}</span>
        </div>
      </div>
    </div>
  </div>
  <NavBar activeTab="Profile" />
</template>

<script>
import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";
import SwapButton from "@/components/SwapButton";
import { useFoxStore } from "@/stores/foxStore";
import { useDifficultyStore } from "@/stores/difficultyStore";
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  name: "ProfileComponent",
  components: {
    SwapButton,
    NavBar,
    Logo
  },
  setup() {
    const foxStore = useFoxStore();
    const difficultyStore = useDifficultyStore();
    const isClicked = ref(false);
    const coins = ref([]);
    const isEditingName = ref(false);
    const tempName = ref("");
    const showError = ref(false);
    const startEditingName = () => {
      isEditingName.value = true;
      tempName.value = foxStore.foxName;
    };
    const saveName = async () => {
      if (!foxStore.foxId) {
        console.error('Fox ID не сохранено');
        return;
      }
      try {
        const currentLevel = difficultyStore.difficultyLevel;
        const response = await axios
            .put(`http://localhost:8585/api/fox/updateName/${foxStore.foxId}`,
                tempName.value.trim(),
            {
              headers: {
                'Content-Type': 'text/plain'
              }
            });
        foxStore.setFoxName(response.data.name);
        difficultyStore.setDifficulty(currentLevel);
        isEditingName.value = false;
      } catch (error) {
        console.error('Ошибка обновлении имени лисёнка:', error);
        showError.value = true;
      }
    };

    const isValid = computed(() => {
      return tempName.value.trim().length > 0 && tempName.value.trim().length <= 10;
    });

    const validateName = () => {
      showError.value = !isValid.value;
    };

    const handleFoxClick = () => {
      isClicked.value = true;
      setTimeout(() => {
        isClicked.value = false;
      }, 150);

      spawnCoins();
    };

    const spawnCoins = () => {
      const newCoins = [];
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = 80 + Math.random() * 70;
        newCoins.push({
          id: Date.now() + "-" + i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * -distance
        });
      }
      coins.value.push(...newCoins);

      setTimeout(() => {
        coins.value.splice(0, newCoins.length);
      }, 1000);
    };

    const difficultyLabel = computed(() => {
      return difficultyStore.difficultyLevel === 'easy' ? 'Малыш' : 'Взрослый';
    });

    const currentStage = computed(() => {
      const total = foxStore.totalCoins;
      if (total >= 1000) return 'Профи';
      if (total >= 500) return 'Средний';
      if (total >= 100) return 'Юниор';
      return 'Малыш';
    });

    const currentFoxImage = computed(() => {
      if (currentStage.value === 'Юниор') return require('@/assets/2level.png');
      if (currentStage.value === 'Средний') return require('@/assets/3level.png');
      if (currentStage.value === 'Профи') return require('@/assets/4level.png');
      return require('@/assets/1level.png');
    });

    const backgroundStyle = computed(() => {
      let gradientColor = "transparent";
      let fillPercentage = 0;
      if (foxStore.totalCoins >= 10000) {
        return {
          backgroundImage: "linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)",
          transition: "background 0.5s ease-in-out",
        };
      } else if (foxStore.totalCoins >= 1000) {
        gradientColor = "#D50000";
        fillPercentage = ((foxStore.totalCoins - 1000) / (10000 - 1000)) * 100;
      } else if (foxStore.totalCoins >= 500) {
        gradientColor = "#003399";
        fillPercentage = ((foxStore.totalCoins - 500) / (1000 - 500)) * 100;
      } else if (foxStore.totalCoins >= 100) {
        gradientColor = "#EE7F1A";
        fillPercentage = ((foxStore.totalCoins - 100) / (500 - 100)) * 100;
      } else if (foxStore.totalCoins > 0) {
        gradientColor = "#009946";
        fillPercentage = (foxStore.totalCoins / 100) * 100;
      }
      return {
        background: `linear-gradient(to top, ${gradientColor} ${fillPercentage}%, transparent ${fillPercentage}%)`,
        transition: "background 0.5s ease-in-out",
      };
    });

    onMounted(async () => {
      if (!foxStore.foxId) {
        console.error('Fox ID не сохранено');
        return;
      }
      if (!difficultyStore.difficultyLevel) {
        difficultyStore.setDifficulty('easy');
      }
      try {
        const response = await axios.get(`http://localhost:8585/api/fox/${foxStore.foxId}`);
        foxStore.setFoxName(response.data.name);
        foxStore.setCoins(response.data.coins);
        difficultyStore.setDifficulty(response.data.gameLevel);
      } catch (error) {
        if (error.response?.status === 404) {
          console.error('Такого лисенка не существует: ', error);
        } else {
          console.error('Ошибка загрузки данных: ', error);
        }
      }
    });

    return {
      foxStore,
      isClicked,
      handleFoxClick,
      showError,
      isValid,
      validateName,
      coins,
      isEditingName,
      tempName,
      startEditingName,
      saveName,
      difficultyLabel,
      currentStage,
      currentFoxImage,
      backgroundStyle
    };
  }
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-container {
  display: flex;
  flex-direction: column;
  height: 91vh;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 1440px;
  margin: 0 auto;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  gap: 4rem;
  margin: 4rem auto 2rem auto;
  padding: 0 2rem;
}

.fox-avatar {
  flex-shrink: 0;
  width: clamp(330px, 40vw, 500px);
  height: clamp(330px, 40vw, 500px);
  border-radius: 50%;
  border: 10px solid #000000;
  position: relative;
}

.fox-avatar img {
  position: absolute;
  cursor: pointer;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  max-width: 90%;
  transition: transform 0.15s ease-in-out;
}

.fox-avatar img.clicked {
  transform: translate(-50%, -50%) scale(0.9);
}

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

.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

}

.edit-name {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.save-name {
  padding: 5px;
}

.edit-name-wrapper {
  flex-direction: column;
}

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

.error-text {
  color: red;
  font-size: 0.7rem;
  margin-bottom: 0rem;
  text-align: center;
}

.info-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #026288;
  min-width: 100px;
}

.value {
  font-weight: bold;
  color: #FF9800;
}

.name-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fox-name {
  font-weight: 700;
  font-size: 3rem;
  color: #003399;
  margin-left: 25px;
}

.edit-icon {
  width: 18px;
  cursor: pointer;
  align-self: flex-start;
}

.coins-wrapper {
  display: flex;
  flex-direction: column;
}
.coin-value {
  font-size: 6rem;
  line-height: 1;
}
.coin-label {
}

@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
    gap: 3rem;
  }
  .fox-name {
    font-size: 2.5rem;
  }
}
@media (max-width: 410px) {
  .fox-name {
    font-size: 2rem;
  }
}

</style>
