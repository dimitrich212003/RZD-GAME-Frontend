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
    <FoxTipPopup
        :visible="foxTipVisible"
        :foxImg="require('/public/img/fox_dispatcher.png')"
        :message="currentFoxMessage"
        :closeAllowed="foxTipCloseAllowed"
        @close="closeFoxTip"
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
import FoxTipPopup from '@/components/FoxTipPopup.vue'
import axios from "axios";

export default {
  name: 'MatchThreeGame',
  components: { GameResultPopup, GameInstructionPopup, FoxTipPopup },
  setup() {
    const container = ref(null)
    const scoreStore = useMatchThreeScoreStore()
    const foxStore = useFoxStore()
    const router = useRouter()
    const gameOver = ref(false)
    const finalScore = ref(0)
    const gainedCoins = ref(0)
    const showIntro = ref(true);
    const foxTipVisible = ref(false)
    const foxTipCloseAllowed = ref(false)
    const currentFoxMessage = ref('')
    const foxMessages = [
      'Одна диспетчерская может управлять движением 200 поездов одновременно!',
      'Самый загруженный участок РЖД — участок Москва–Санкт-Петербург: до 50 поездов в сутки!',
      'Зелёный сигнал светофора называют \'попутным\' — он разрешает ехать, но только если диспетчер дал добро!',
      'Раньше диспетчеры общались свистками, а теперь у них есть цифровые карты всей сети!'
    ];

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

    function scheduleFoxTip() {
      const delay = Math.random() * 20_000 + 10_000;
      setTimeout(() => {
        currentFoxMessage.value = foxMessages[Math.floor(Math.random() * foxMessages.length)]
        foxTipVisible.value = true;
        foxTipCloseAllowed.value = false;
        setTimeout(() => { foxTipCloseAllowed.value = true }, 5_000)
        setTimeout(closeFoxTip, 30_000);
      }, delay)
    }

    function closeFoxTip() {
      foxTipVisible.value = false
      foxTipCloseAllowed.value = false
      scheduleFoxTip()
    }

    function startGameFromPopup() {
      showIntro.value = false;
      scheduleFoxTip()
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
      showIntro,
      foxTipVisible,
      foxTipCloseAllowed,
      foxMessages,
      closeFoxTip,
      currentFoxMessage
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
