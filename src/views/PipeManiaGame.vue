<!-- src/views/PipeManiaGame.vue -->
<template>
  <div class="pipe-mania-container">
    <!-- Кнопки / Overlay -->
    <div class="ui-overlay">
      <div class="score-display">Score: {{ currentScore }}</div>
      <button class="exit-button" @click="exitGame">Выйти</button>
      <button @click="startGame">Start</button>
      <button @click="restartGame">Restart</button>
    </div>

    <!-- Спрятанные картинки, чтобы document.getElementById('pipe0') работало -->
    <!-- А также <img id="dirt" ...> -->
    <!-- В реальном проекте, возможно лучше import'ы, но раз у вас "getElementById" -->
    <div style="display: none;">
      <img id="dirt" src="@/assets/pipeMania/dirt.png" />
      <img id="pipe0" src="@/assets/pipeMania/0.png" />
      <img id="pipe1" src="@/assets/pipeMania/1.png" />
      <img id="pipe2" src="@/assets/pipeMania/2.png" />
      <img id="pipe3" src="@/assets/pipeMania/3.png" />
      <img id="pipe4" src="@/assets/pipeMania/4.png" />
      <img id="pipe5" src="@/assets/pipeMania/5.png" />
      <img id="pipe6" src="@/assets/pipeMania/6.png" />
    </div>

    <!-- Canvas -->
    <div class="canvas-wrapper">
      <canvas ref="boardCanvas" width="650" height="500"></canvas>
    </div>

    <!-- Пример попапа (если нужно) -->
    <GameResultPopup
        :visible="showPopup"
        :finalScore="finalScore"
        :gainedCoins="gainedCoins"
        @close="closePopup"
        @restart="restartGame"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import GameResultPopup from '@/components/GameResultPopup.vue'

// Импортируем классы из папки pipemania
import Game from '@/games/pipemania/Game.js'

export default {
  name: "PipeManiaGame",
  components: { GameResultPopup },
  setup() {
    const boardCanvas = ref(null)
    let context = null
    let pipeGame = null

    // Для примера, локальное состояние счёта / попап
    const currentScore = ref(0)
    const showPopup    = ref(false)
    const finalScore   = ref(0)
    const gainedCoins  = ref(0)

    onMounted(() => {
      if(!boardCanvas.value) return
      context = boardCanvas.value.getContext('2d')

      // Создаём игру
      pipeGame = new Game(context)
    })

    // При размонтировании (необязательно)
    onUnmounted(() => {
      // очистка listeners, cancelAnimationFrame...
    })

    function startGame() {
      if(!pipeGame) return
      pipeGame.start()
    }

    function restartGame() {
      if(!pipeGame) return
      pipeGame.end()
    }

    function exitGame() {
      // например, переход в меню
      // router.push({ name:'MainMenu' })
    }

    function closePopup() {
      showPopup.value = false
    }

    return {
      boardCanvas,
      currentScore,
      showPopup,
      finalScore,
      gainedCoins,

      startGame,
      restartGame,
      exitGame,
      closePopup
    }
  }
}
</script>

<style scoped>
.pipe-mania-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.ui-overlay {
  display: flex;
  gap: 1rem;
  background: #333;
  color: #fff;
  padding: 1rem;
  align-items: center;
}
.score-display {
  font-size:1.2rem;
}
.exit-button {
  padding:0.5rem 1rem;
  background-color:red;
  color:#fff;
  border:none;
  border-radius:6px;
  cursor:pointer;
}
.canvas-wrapper {
  flex-grow:1;
  display:flex;
  justify-content:center;
  align-items:center;
}
</style>
