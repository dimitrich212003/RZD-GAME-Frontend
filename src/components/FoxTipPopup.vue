<template>
  <transition name="slide-left">
    <div v-if="visible" class="fox-popup">
      <img :src="foxImg" alt="Лисёнок" class="fox" />
      <div class="speech">
        <p v-html="message"></p>
        <button
            v-if="closeAllowed"
            class="close-btn"
            @click="$emit('close')"
            aria-label="закрыть"
        >×</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FoxTipPopup',
  props: {
    visible: { type: Boolean, default: false },
    foxImg: { type: String, default: '' },
    message: { type: String,  default: '' },
    closeAllowed: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
.fox-popup {
  position: fixed;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  display: flex;
  align-items: center;
  z-index: 9000;
  pointer-events: none;
}

.fox-popup .speech {
  position: relative;
  background: #fff;
  border: 3px solid #f27c22;
  border-radius: 14px;
  padding: 1rem 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,.2);
  pointer-events: auto;
  width: 300px;
}

.fox {
  height: 140px;
  user-select: none;
}

.close-btn {
  position: absolute;
  top: -10px; right: -10px;
  width: 28px; height: 28px;
  border-radius: 50%;
  border: none;
  background: #f44336;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform .4s ease;
}

.slide-left-enter-from,
.slide-left-leave-to { transform: translate(-110%, -50%); }
.slide-left-enter-to,
.slide-left-leave-from { transform: translate(   0%, -50%); }
</style>