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
        Запустить поезд
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
    <div id="result" class="hidden">
      <p id="level-result">{{ levelResultMessage }}</p>
      <button
          id="next"
          :disabled="nextDisabled"
          @click="onNext"
          style="width: 250px; height: 50px;"
      >
        {{ nextButtonText }}
      </button>
    </div>
    <div id="timerProgress" class="hidden">
      <div id="timerBar" ref="timerBar"></div>
    </div>
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
    <GameResultPopup
        :visible="gameOver"
        :finalScore="finalScore"
        :gainedCoins="gainedCoins"
        @close="closePopup"
        @restart="restartGame"
    />
    <GameInstructionPopup
        :visible="showIntro"
        title="Как играть в «Лисёнок-путеец»"
        :steps="[
          { text: 'Перемещай рельсы стрелками на клавиатуре', icon: require('@/assets/keys/arrows.png') },
          { text: 'Установить рельс – пробел', icon: require('@/assets/keys/space.png') },
          { text: 'Когда путь готов, нажми кнопку «Запустить поезд» справа от поля', icon: null },
          { text: 'Успей довести паровозик до финиша до истечения зелёного таймера', icon: null },
          { text: 'Чем больше уровней пройдешь - тем больше получишь монеток!', icon:  require('@/assets/coin.png') }

        ]"
        @start="startGameFromPopup"
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
import GameInstructionPopup from '@/components/GameInstructionPopup.vue'

const COIN_RATIO = 0.01;

export default {
  name: 'PipeManiaGame',
  components: { GameResultPopup, GameInstructionPopup },
  setup() {
    const router = useRouter()
    const scoreStore = usePipeManiaScoreStore()
    const foxStore = useFoxStore()
    const boardCanvas = ref(null)
    const timerBar = ref(null)
    const level = ref(1)
    const localScore = ref(0)
    const levelResultMessage = ref('Completed the level!')
    const nextButtonText = ref('Continue')
    const startDisabled = ref(false)
    const quickFinishDisabled = ref(true)
    const restartDisabled = ref(true)
    const nextDisabled = ref(true)
    const gameOver = ref(false)
    const finalScore = ref(0);
    const gainedCoins = ref(0);
    let pipeGame = null
    const showIntro = ref(true);

    onMounted(() => {
      const canvas = boardCanvas.value
      canvas.width  = 650
      canvas.height = 500
      const ctx = canvas.getContext('2d')
      pipeGame = new Game(ctx, {
        onAddScore(points) {
          scoreStore.addScore(points)
          localScore.value = scoreStore.score
        },
        onGameEnd(resultType, newLevel, neededPoints) {
          finalScore.value = scoreStore.score

          if (resultType === 'winner') {
            scoreStore.addScore(300)
            localScore.value = scoreStore.score
            levelResultMessage.value = 'Уровень пройден!'
            nextButtonText.value     = 'Продолжить'
            level.value = newLevel
          }
          else if (resultType === 'game over') {
            scoreStore.resetCsoins()
            levelResultMessage.value = 'Проигрыш!'
            nextButtonText.value     = 'Попробовать снова'
            level.value = 1
          }
          else {
            scoreStore.resetCoins()
            levelResultMessage.value = `Необходимо набрать ${neededPoints} очков!`
            nextButtonText.value = 'Попробовать снова'
          }
        }
      })
    })

    function startGameFromPopup() {
      showIntro.value = false;
    }

    function onStartClick() {
      boardCanvas.value.classList.remove('hidden')
      document.getElementById('timerProgress').classList.remove('hidden')
      startDisabled.value       = true
      quickFinishDisabled.value = false
      restartDisabled.value     = false
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

      showIntro,
      startGameFromPopup,
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
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 10;
  border-radius: 20px;
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
