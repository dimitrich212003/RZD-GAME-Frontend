<template>
  <div class="ui-overlay">
    <div class="score-display">
      <p>Очки: {{ scoreStore.score }}</p>
      <p>Рекорд: {{ scoreStore.pipeManiaBestScore }}</p>
    </div>
    <button class="exit-button" @click="exitGame">Выйти в меню</button>
  </div>

  <div id="pipe-mania">
    <canvas
        id="board"
        ref="boardCanvas"
        class="hidden"
    ></canvas>

    <div id="content">
      <div id="level">Уровень: {{ level }}</div>
      <div id="score">Очки: {{ localScore }}</div>
      <div style="display: none">Следующая</div>
      <div style="display: none" id="target">цель</div>

      <button
          style="width: 120px; margin-bottom: 10px;"
          id="start"
          :disabled="startDisabled"
          @click="onStartClick"
      >
        Старт
      </button>

      <button style="width: 120px; margin-bottom: 10px;"
          id="quick-finish"
          :disabled="quickFinishDisabled"
          @click="onQuickFinish"
      >
        Завершить уровень
      </button>

      <button
          style="width: 120px"
          id="restart"
          :disabled="restartDisabled"
          @click="onRestartLevel"
      >
        Начать заного
      </button>
    </div>

    <!-- Результат (старый div) -->
    <div id="result" class="hidden">
      <p id="level-result">{{ levelResultMessage }}</p>
      <button
          id="next"
          :disabled="nextDisabled"
          @click="onNext"
      >
        {{ nextButtonText }}
      </button>
    </div>

    <!-- Таймер -->
    <div id="timerProgress" class="hidden">
      <div id="timerBar" ref="timerBar"></div>
    </div>

    <!-- Картинки труб -->
    <div class="images">
      <img id="dirt" src="/pipeManiaSprites/dirt.png" />
      <img id="pipe0" src="/pipeManiaSprites/0.png" />
      <img id="pipe1" src="/pipeManiaSprites/1.png" />
      <img id="pipe2" src="/pipeManiaSprites/2.png" />
      <img id="pipe3" src="/pipeManiaSprites/3.png" />
      <img id="pipe4" src="/pipeManiaSprites/4.png" />
      <img id="pipe5" src="/pipeManiaSprites/5.png" />
      <img id="pipe6" src="/pipeManiaSprites/0_active.png" />
      <img id="pipe7" src="/pipeManiaSprites/7.png" />
      <img id="pipe0_active" src="/pipeManiaSprites/0_active.png" />
      <img id="pipe1_active" src="/pipeManiaSprites/1_active.png" />
      <img id="pipe2_active" src="/pipeManiaSprites/2_active.png" />
      <img id="pipe3_active" src="/pipeManiaSprites/3_active.png" />
      <img id="pipe4_active" src="/pipeManiaSprites/4_active.png" />
      <img id="pipe5_active" src="/pipeManiaSprites/5_active.png" />
    </div>

    <!-- Попап, где видим монеты (scoreStore.coins) и финальный счет -->
    <GameResultPopup
        :visible="gameOver"
        :finalScore="finalScore"
        :gainedCoins="gainedCoins"
        @close="closePopup"
        @restart="restartGame"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePipeManiaScoreStore } from '@/stores/pipeManiaStore.js'
import { useFoxStore }   from '@/stores/foxStore.js'

import Game from '@/games/pipemania/game.js'
import GameResultPopup from '@/components/GameResultPopup.vue'

const COIN_RATIO = 0.01;

export default {
  name: 'PipeManiaGame',
  components: { GameResultPopup },
  setup() {
    const router = useRouter()
    const scoreStore = usePipeManiaScoreStore()
    const foxStore   = useFoxStore()

    const boardCanvas = ref(null)
    const timerBar    = ref(null)

    // локальные reactive
    const level              = ref(1)
    const localScore         = ref(0)
    const levelResultMessage = ref('Completed the level!')
    const nextButtonText     = ref('Continue')

    const startDisabled       = ref(false)
    const quickFinishDisabled = ref(true)
    const restartDisabled     = ref(true)
    const nextDisabled        = ref(true)

    const gameOver    = ref(false)
    const finalScore  = ref(0);
    const gainedCoins = ref(0);

    let pipeGame = null

    onMounted(() => {
      const canvas = boardCanvas.value
      canvas.width  = 650
      canvas.height = 500
      const ctx = canvas.getContext('2d')

      // Создаём Game
      pipeGame = new Game(ctx, {
        // Когда вода протекает ещё +10 к очкам:
        onAddScore(points) {
          scoreStore.addScore(points)
          localScore.value = scoreStore.score
        },
        // Когда игра закончилась
        onGameEnd(resultType, newLevel, neededPoints) {
          // (1) Записываем finalScore
          finalScore.value = scoreStore.score

          if (resultType === 'winner') {
            // (2) +300 очков за прохождение уровня
            scoreStore.addScore(300)
            localScore.value = scoreStore.score

            // (3) при желании ещё конвертируем часть в монеты
            // scoreStore.addCoins(Math.floor(300 * 0.01)) // если хотим +3 coins

            levelResultMessage.value = 'Level completed!'
            nextButtonText.value     = 'Continue'
            level.value = newLevel
          }
          else if (resultType === 'game over') {
            scoreStore.resetCoins()
            levelResultMessage.value = 'Game Over!'
            nextButtonText.value     = 'Try Again'
            level.value = 1
          }
          else {
            // not enough
            scoreStore.resetCoins()
            levelResultMessage.value = `Needed ${neededPoints} points!`
            nextButtonText.value = 'Try Again'
          }
        }
      })
    })

    // ---------- Методы ----------
    function onStartClick() {
      boardCanvas.value.classList.remove('hidden')
      document.getElementById('timerProgress').classList.remove('hidden')

      startDisabled.value       = true
      quickFinishDisabled.value = false
      restartDisabled.value     = false

      // Сбросим очки и монеты
      scoreStore.resetScore()
      localScore.value = 0

      pipeGame?.start()
    }

    function onQuickFinish() {
      pipeGame?.finishLevel()
    }

    function onRestartLevel() {
      scoreStore.resetScore()
      localScore.value = 0
      pipeGame?.end()
    }

    function onNext() {
      document.getElementById('result').classList.add('hidden')
      nextDisabled.value = true
      pipeGame?.setupGame()
      pipeGame?.round()
    }

    function exitGame() {
      // Останавливаем
      pipeGame?.end()

      // Переносим локальные монеты -> foxStore
      if (localScore.value > 0) {
        foxStore.addCoins(localScore.value * COIN_RATIO)
      }

      // Показываем попап
      gameOver.value   = true
      finalScore.value = localScore.value
      gainedCoins.value = finalScore.value * COIN_RATIO;
    }

    function closePopup() {
      gameOver.value = false;
      finalScore.value = 0;
      gainedCoins.value = 0;
      scoreStore.resetCoins();
      scoreStore.resetScore();
      router.push({ name: 'MainMenu' })
    }

    function restartGame() {
      gameOver.value = false
      localScore.value = 0
      scoreStore.resetCoins()
      finalScore.value = 0;
      gainedCoins.value = 0;
      scoreStore.resetCoins();
      scoreStore.resetScore();
      pipeGame?.end()
    }

    return {
      scoreStore, foxStore,

      boardCanvas,
      timerBar,

      level,
      localScore,
      levelResultMessage,
      nextButtonText,

      startDisabled,
      quickFinishDisabled,
      restartDisabled,
      nextDisabled,

      gameOver,
      finalScore,
      gainedCoins,

      onStartClick,
      onQuickFinish,
      onRestartLevel,
      onNext,
      exitGame,
      closePopup,
      restartGame
    }
  }
}
</script>

<style scoped>
.ui-overlay {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #333;
  color: #fff;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 999;
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

#pipe-mania {
  display: grid;
  grid-template-columns: 1fr 700px 1fr;
  grid-template-rows: 80px 500px 1fr;
}

canvas {
  grid-area: 2 / 2;
  margin-left: 80px;
}
.hidden {
  opacity: 0;
  z-index: -10;
}

#content {
  grid-area: 2 / 2;
  width: 100px;
  z-index: 10;
  justify-self: right;
  background: transparent;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
}

#result {
  grid-area: 2 / 2;
  margin-top: 100px;
  width: 300px;
  height: 200px;
  background-color: white;
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

#timerProgress {
  grid-area: 3 / 2;
  justify-self: center;
  width: 90%;
  background-color: #E0E0D1;
  border-radius: 6px;
}
#timerBar {
  width: 1%;
  height: 30px;
  background-color: #00CC66;
  border-radius: 6px;
}

.images img {
  position: absolute;
  top: 0;
  opacity: 0;
}
</style>
