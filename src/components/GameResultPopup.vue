<template>
  <transition name="fade">
    <div v-if="visible" class="popup-overlay">
      <div class="popup">
        <img
            src="/img/achievementUnlocked.png"
            alt="Happy Fox"
            class="happy-fox"
        />
        <p>Вы набрали {{ finalScore }} очков</p>
        <p style="margin-top: 10px;">Получено монеток:</p>
        <div class="coins-wrapper">
          <p>{{ gainedCoins }}</p>
          <img src="@/assets/coin.png" class="coin-icon" />
        </div>
        <!-- При клике на OK – шлём событие «close», родитель закроет попап -->
        <button class="close-popup-btn" @click="$emit('close')">OK</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "GameResultPopup",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    finalScore: {
      type: Number,
      default: 0
    },
    gainedCoins: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
/* Полупрозрачный фон, закрывает весь экран */
.popup-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* затемнение */
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-align: center;
  /* Можно добавить transform / transition для анимации */
}

.happy-fox {
  width: 120px;
  margin: 0 auto;
}

.coins-wrapper {
  display: flex;
  gap: 7px;
  justify-content: center;
  align-items: center;
}

.coin-icon {
  width: 24px;
  vertical-align: middle;
}

.close-popup-btn {
  padding: 10px 20px;
  margin-top: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
