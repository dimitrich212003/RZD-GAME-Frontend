<template>
  <transition name="fade">
    <div v-if="visible" class="popup-overlay">
      <div class="popup">
        <h2 class="title">{{ title }}</h2>
        <ul class="steps">
          <li v-for="(step, i) in steps" :key="i">
            <img v-if="step.icon" :src="step.icon" class="icon" />
            <span v-html="step.text" />
          </li>
        </ul>
        <button class="start-btn" @click="$emit('start')">Начать игру</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "GameInstructionPopup",
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: "" },
    steps: { type: Array, default: () => [] }
  }
};
</script>

<style scoped>
.popup-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.55);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index: 10000;
}

.popup {
  background:#fff;
  padding:1.5rem 2.5rem;
  border-radius:10px;
  width:90%;
  max-width:480px;
  text-align:center;
  line-height:1.35;
}

.title {
  margin-bottom:1rem;
  font-size:1.4rem;
}

.steps {
  list-style:none;
  padding:0; margin:0 0 1.2rem 0;
  text-align:left;
}

.steps li {
  display:flex;
  align-items:center;
  margin-bottom:.6rem;
}
.icon {
  width:40px;
  margin-right:.75rem;
}

.start-btn {
  padding:.6rem 1.4rem;
  background:#e51c23;
  color:#fff;
  border:none;
  border-radius:6px;
  font-weight:600; cursor:pointer;
}

.fade-enter-active,.fade-leave-active{
  transition:opacity .3s
}

.fade-enter-from,.fade-leave-to{
  opacity:0
}
</style>
