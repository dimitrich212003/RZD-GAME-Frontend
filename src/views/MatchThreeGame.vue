<template>
  <div class="match3-container">
    <!-- Панель со счётом, кнопкой «Выйти» -->
    <div class="ui-overlay">
      <div class="score-display">
        <p>Очки: {{ scoreStore.score }}</p>
        <p>Рекорд: {{ scoreStore.matchThreeBestScore }}</p>
      </div>
      <button class="exit-button" @click="exitGame">Выйти в меню</button>
    </div>

    <!-- Холст Pixi -->
    <div class="canvas-area" ref="container"></div>

    <!-- Используем GameResultPopup -->
    <GameResultPopup
        :visible="gameOver"
        :finalScore="finalScore"
        :gainedCoins="gainedCoins"
        @close="closePopup"
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useMatchThreeScoreStore } from '@/stores/matchThreeScoreStore'
import { useFoxStore } from '@/stores/foxStore'
import { useRouter } from 'vue-router'
import { App } from '@/games/match3/system/App.js'
import { Config } from '@/games/match3/game/Config.js'
import GameResultPopup from '@/components/GameResultPopup.vue' // <-- Вот компонент

export default {
  name: 'MatchThreeGame',
  components: { GameResultPopup }, // Регистрируем
  setup() {
    const container = ref(null)
    const scoreStore = useMatchThreeScoreStore()
    const foxStore = useFoxStore()
    const router = useRouter()

    // Состояние попапа
    const gameOver = ref(false)
    const finalScore = ref(0)
    const gainedCoins = ref(0)

    onMounted(() => {
      if (!container.value) return;

      scoreStore.resetScore()
      Config.scoreStore = scoreStore
      Config.foxStore = foxStore

      App.runCustom(Config, container.value)

      // setTimeout - к примеру, чтобы дождаться инициализации
      setTimeout(() => {
        if (App.scene && App.scene.board) {
          App.scene.board.container.on('game-over', (payload) => {
            gameOver.value = true
            finalScore.value = payload.finalScore
            gainedCoins.value = payload.gainedCoins
          })
        }
      }, 100)
    })

    // Завершить игру (вызвать endGame)
    function exitGame() {
      if (App.scene && App.scene.endGame) {
        App.scene.endGame()
      }
    }

    // При «OK» на попапе – закрываем попап и уходим в меню
    function closePopup() {
      gameOver.value = false
      router.push({ name: 'MainMenu' })
    }

    return {
      container,
      scoreStore,
      foxStore,
      gameOver,
      finalScore,
      gainedCoins,
      exitGame,
      closePopup
    }
  }
}
</script>

<style scoped>
.match3-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.ui-overlay {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #333;
  color: #fff;
  align-items: center;
}
.score-display {
  font-size: 1.2rem;
  display: flex;
  gap: 15px;
}
.exit-button {
  padding: 0.5rem 1rem;
  background-color: red;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.canvas-area {
  flex-grow: 1;
  position: relative;
}
</style>
