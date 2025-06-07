<template>
  <div class="match3-container">
    <div class="ui-overlay">
      <div class="score-display">
        <p>Очки: {{ scoreStore.score }}</p>
        <p>Рекорд: {{ scoreStore.matchThreeBestScore }}</p>
      </div>
      <button class="exit-button" @click="exitGame">Выйти в меню</button>
    </div>
    <div class="canvas-area" ref="container"></div>
    <GameResultPopup
        :visible="gameOver"
        :finalScore="finalScore"
        :gainedCoins="gainedCoins"
        @close="closePopup"
    />
    <GameInstructionPopup
        :visible="showIntro"
        title="Как играть в «Лисёнок-диспетчер»"
        :steps="[
          { text: 'Перемещай вагончики с помощью курсора', icon: require('@/assets/keys/cursor.png') },
          { text: 'Собери 3 и более вагончиков одного цвета в ряд, чтобы отправить их на сортировочную горку! ', icon: null },
          { text: 'Чем больше вагончиков отправишь - тем больше получишь монеток!', icon:  require('@/assets/coin.png') }
        ]"
        @start="startGameFromPopup"
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
import GameResultPopup from '@/components/GameResultPopup.vue'
import GameInstructionPopup from '@/components/GameInstructionPopup.vue'
import axios from "axios";

export default {
  name: 'MatchThreeGame',
  components: { GameResultPopup, GameInstructionPopup },
  setup() {
    const container = ref(null)
    const scoreStore = useMatchThreeScoreStore()
    const foxStore = useFoxStore()
    const router = useRouter()
    const gameOver = ref(false)
    const finalScore = ref(0)
    const gainedCoins = ref(0)
    const showIntro = ref(true);

    onMounted(async () => {
      if (!container.value) return;

      if (!foxStore.foxId) {
        console.error('Fox ID не сохранено');
        return;
      }

      scoreStore.resetScore()
      Config.scoreStore = scoreStore
      Config.foxStore = foxStore

      App.runCustom(Config, container.value)

      setTimeout(() => {
        if (App.scene && App.scene.board) {
          App.scene.board.container.on('game-over', (payload) => {
            gameOver.value = true
            finalScore.value = payload.finalScore
            gainedCoins.value = payload.gainedCoins
          })
        }
      }, 100)
      try {
        const game = 'matchThreeStore'
        const response = await axios.get(`http://localhost:8585/api/record/${foxStore.foxId}/${game}`)
        scoreStore.setMatchThreeBestScore(response.data.score)
        console.log('Рекорд Запрошен с сервера', response.data);

      } catch (error) {
        console.error('Ошибка получения рекорда: ', error)
      }
    })

    function startGameFromPopup() {
      showIntro.value = false;
    }

    async function exitGame() {
      if (gainedCoins.value > 0) {
        await foxStore.addCoins(gainedCoins.value);
      } else {
        console.warn('Нельзя добавить 0 или отрицательное количество монет');
      }

      if (App.scene && App.scene.endGame) {
        App.scene.endGame();
      }
    }

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
      closePopup,
      startGameFromPopup,
      showIntro
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
