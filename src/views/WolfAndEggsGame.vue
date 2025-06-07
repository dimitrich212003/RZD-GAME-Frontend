<template>
  <div class="ui-overlay">
    <div class="score-display">
      <p>Очки: {{ scoreStore.score }}</p>
      <p>Рекорд: {{ scoreStore.wolfEggsBestScore }}</p>
    </div>
    <button class="exit-button" @click="exitGame">Выйти в меню</button>
  </div>
  <div class="wolf-eggs-container">
    <div class="service-overlay"></div>
    <div class="wrapper">
      <main class="page">
        <div class="container">
          <div class="game">
            <div id="sun" style="display: none;"></div>
            <div id="score">
              <span>Спасено</span>
              <b>0</b>
            </div>
            <div id="level">
              <span>Уровень</span>
              <b>1</b>
            </div>
            <div id="chicken-left-up">
              <div class="chicken-left-up__wrap">
                <div class="pomost-left-up"></div>
              </div>
            </div>
            <div id="CLU-touch"></div>
            <div id="chicken-left-down">
              <div class="chicken-left-down__wrap">
                <div class="pomost-left-down"></div>
              </div>
            </div>
            <div id="CLD-touch"></div>
            <div id="chicken-right-up">
              <div class="chicken-right-up__wrap">
                <div class="pomost-right-up"></div>
              </div>
            </div>
            <div id="CRU-touch"></div>
            <div id="chicken-right-down">
              <div class="chicken-right-down__wrap">
                <div class="pomost-right-down"></div>
              </div>
            </div>
            <div id="CRD-touch"></div>
            <div id="wolf"></div>
            <button id="pause">Старт</button>
            <div id="lives"></div>

            <div class="game-place-lock"></div>
          </div>
        </div>
        <audio src="/audio/crushed-egg.mp3" id="crash-sound" allow="autoplay"></audio>
        <audio src="/audio/layed-egg.mp3" id="layed-sound" allow="autoplay"></audio>
        <audio src="/audio/pause.mp3" id="pause-sound" allow="autoplay"></audio>
        <audio src="/audio/lost.mp3" id="lost-sound" allow="autoplay"></audio>
        <audio src="/audio/win.mp3" id="win-sound" allow="autoplay"></audio>
      </main>
    </div>
    <GameResultPopup
        :visible="isGameOver"
        :finalScore="finalScore"
        :gainedCoins="gainedCoins"
        @close="closePopup"
        @restart="restartGame"
    />
    <GameInstructionPopup
        :visible="showIntro"
        title="Как играть в «Лисёнок-проводник»"
        :steps="[
          { text: 'Управляй лисенком с помощью стрелок', icon: require('@/assets/keys/arrows.png') },
          { text: 'Лови багаж, падающий с полок купе и помогай пассажирам!', icon: null },
          { text: 'У тебя есть пять жизней, постарайся не тратить их!', icon: null },
          { text: 'Чем больше багажа поймаешь - тем больше получишь монеток!', icon:  require('@/assets/coin.png') }

        ]"
        @start="startGameFromPopup"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFoxStore }   from '@/stores/foxStore.js'
import { useWolfEggsScoreStore } from '@/stores/wolfAndEggsStore.js'
import { useAchievementsStore } from '@/stores/achievementsStore';
import GameResultPopup from '@/components/GameResultPopup.vue'
import GameInstructionPopup from '@/components/GameInstructionPopup.vue'

export default {
  name: 'WolfAndEggsGame',
  components: { GameResultPopup, GameInstructionPopup },

  setup() {
    const isGameOver = ref(false);
    const finalScore = ref(0);
    const gainedCoins = ref(0);
    const showIntro = ref(true);
    const scoreStore = useWolfEggsScoreStore();
    scoreStore.score = 0;
    const foxStore   = useFoxStore();
    const achievementsStore = useAchievementsStore();
    const router = useRouter();
    let score = 0
    let level = 1
    let lives = 5
    let wolfLevel = 'up'
    let wolfSide = 'right'
    let currPos = 'rc'

    let speedUpdatePosition = 100
    let gameProcess = false
    let rollingSpeed
    let fallingSpeed
    let resetSpeed
    let nextEgg
    let eggCount = 0
    let sunFlag = 0
    let pauseFlag = false
    let game = null

    const COIN_RATIO = 0.01;

    let gam;
    let CRU
    let CRD
    let CLD
    let CLU

    let scoreElement
    let levelElement
    let livesElement
    let pauseElement
    let lock

    let crashSound
    let laySound
    let pauseSound
    let lostSound
    let winSound

    let wolf

    let nestLU
    let nestLD
    let nestRU
    let nestRD

    let removeAllEggs
    let clearAllTimeouts
    let anounce

    onMounted(() => {
      gam = document.querySelector('.game')

      CRU = document.querySelector('#CRU-touch')
      CRD = document.querySelector('#CRD-touch')
      CLD = document.querySelector('#CLD-touch')
      CLU = document.querySelector('#CLU-touch')

      scoreElement = document.querySelector('#score b')
      levelElement = document.querySelector('#level b')
      livesElement = document.querySelector('#lives')
      pauseElement = document.querySelector('#pause')
      lock = document.querySelector('.game-place-lock')

      crashSound = document.querySelector('#crash-sound')
      laySound = document.querySelector('#layed-sound')
      pauseSound = document.querySelector('#pause-sound')
      lostSound = document.querySelector('#lost-sound')
      winSound = document.querySelector('#win-sound')
      wolf = document.querySelector('#wolf')
      nestLU = document.querySelector('#chicken-left-up')
      nestLD = document.querySelector('#chicken-left-down')
      nestRU = document.querySelector('#chicken-right-up')
      nestRD = document.querySelector('#chicken-right-down')
      showScore();
      pauseElement.addEventListener('click', pauseHandler)
      CRU.addEventListener('click', () => setWolfPos('ru'))
      CLU.addEventListener('click', () => setWolfPos('lu'))
      CRD.addEventListener('click', () => setWolfPos('rd'))
      CLD.addEventListener('click', () => setWolfPos('ld'))
      document.addEventListener('keydown', keyDown)

      function pauseHandler() {
        if (gameProcess && !pauseFlag) {
          pauseFlag = true
          clearInterval(game)
          gameProcess = false
          pauseElement.innerHTML = 'Продолжить'
          pauseElement.classList.add('active')
          lock.classList.add('active')
          removeAllEggs()
          clearAllTimeouts()
          pauseSound.play()
          wolf.className = 'rc'
          setTimeout(() => {
            pauseFlag = false
          }, 300)

        } else if (!gameProcess && !pauseFlag) {
          pauseFlag = true
          rollingSpeed = rollingSpeed || 2000
          game = setInterval(nextRandomEgg, rollingSpeed)
          gameProcess = true
          pauseElement.innerHTML = 'Пауза'
          pauseElement.classList.remove('active')
          lock.classList.remove('active')
          pauseSound.play()
          showScore()
          wolf.className = 'lc'
          anounce('Поехали !', 1500)
          setTimeout(() => {
            pauseFlag = false
          }, 300)
        }
      }

      function setWolfPos(positionClass) {
        if (!gameProcess) return
        wolf.className = ''
        wolf.classList.add(positionClass)
        currPos = positionClass
      }

      function keyDown(e) {
        if (!gameProcess) return
        e.stopPropagation()
        if (e.keyCode === 38) {
          wolfLevel = 'up'
          if (wolfSide === 'right') {
            wolf.className = 'ru'
            currPos = 'ru'
          } else {
            wolf.className = 'lu'
            currPos = 'lu'
          }
        }

        if (e.keyCode === 40) {
          wolfLevel = 'down'
          if (wolfSide === 'right') {
            wolf.className = 'rd'
            currPos = 'rd'
          } else {
            wolf.className = 'ld'
            currPos = 'ld'
          }
        }

        if (e.keyCode === 39) {
          if (wolfSide !== 'right') {
            wolf.className = 'rc'
          }
          wolfSide = 'right'
          if (wolfLevel === 'up') {
            setTimeout(() => {
              wolf.className = 'ru'
              currPos = 'ru'
            }, speedUpdatePosition)
          } else {
            setTimeout(() => {
              wolf.className = 'rd'
              currPos = 'rd'
            }, speedUpdatePosition)
          }
        }

        if (e.keyCode === 37) {
          if (wolfSide !== 'left') {
            wolf.className = 'lc'
          }
          wolfSide = 'left'
          if (wolfLevel === 'up') {
            setTimeout(() => {
              wolf.className = 'lu'
              currPos = 'lu'
            }, speedUpdatePosition)
          } else {
            setTimeout(() => {
              wolf.className = 'ld'
              currPos = 'ld'
            }, speedUpdatePosition)
          }
        }
      }

      clearAllTimeouts = () => {
        const highestTimeoutId = setTimeout(';')
        for (let i = 0; i < highestTimeoutId; i++) {
          clearTimeout(i)
        }
      }

      removeAllEggs = () => {
        const all = document.querySelectorAll('.egg')
        all.forEach(egg => {
          egg.remove()
        })
      }

      function nextRandomEgg() {
        nextEgg = getRandomInt(1, 4)
        if (nextEgg === 1) startEgg(nestRD)
        if (nextEgg === 2) startEgg(nestRU)
        if (nextEgg === 3) startEgg(nestLD)
        if (nextEgg === 4) startEgg(nestLU)
      }

      function createEgg(nest) {
        const egg = document.createElement('div')
        egg.className = 'egg'

        if (getRandomInt(1, 2) === 1) {
          egg.classList.add('egg-white')
        } else {
          egg.classList.add('egg-brown')
        }

        if (nest === nestRD || nest === nestRU) {
          egg.classList.add('egg-right')
        } else {
          egg.classList.add('egg-left')
        }

        egg.classList.add('rolling')
        egg.classList.add('rolling')
        return egg
      }

      function startEgg(nest) {
        eggCount++;

        if(eggCount >= 50) {
          achievementsStore.unlockAchievement(foxStore.foxId, 7);
        }

        const newEgg = createEgg(nest)
        nest.appendChild(newEgg)

        eggSpeed(newEgg)

        const fallingTimer = setTimeout(() => {
          newEgg.classList.remove('falling')
          newEgg.classList.add('cracked')
          crashSound.play()
          lives--
          showScore()
        }, fallingSpeed + rollingSpeed)

        const resetTimer = setTimeout(() => {
          newEgg.remove()
        }, resetSpeed)

        setTimeout(() => {
          newEgg.classList.remove('rolling')
          newEgg.classList.add('falling')

          if (
              (nest === nestLU && currPos === 'lu') ||
              (nest === nestLD && currPos === 'ld') ||
              (nest === nestRU && currPos === 'ru') ||
              (nest === nestRD && currPos === 'rd')
          ) {
            clearTimeout(fallingTimer)
            clearTimeout(resetTimer)
            newEgg.remove()

            score++
            showScore()
            laySound.play()
          }
        }, rollingSpeed)
      }

      function eggSpeed(egg) {
        if (level === 1) levelSet(2500, 250, 1)
        if (level === 2) levelSet(2200, 230, 1)
        if (level === 3) levelSet(2000, 200, 0.75)
        if (level === 4) levelSet(1800, 200, 0.65)
        if (level === 5) levelSet(1500, 200, 0.65)
        if (level === 6) levelSet(1300, 150, 0.65)
        if (level === 7) levelSet(1100, 150, 0.85)
        if (level === 8) levelSet(950, 150, 0.75)
        if (level === 9) levelSet(850, 150, 0.80)
        if (level === 10) levelSet(750, 150, 0.85)

        function levelSet(rolling, falling, kef) {
          rollingSpeed = rolling
          fallingSpeed = falling
          resetSpeed = rollingSpeed + fallingSpeed + 1500
          egg.style.setProperty('--rolling-time', rolling + 'ms')
          egg.style.setProperty('--falling-time', falling + 'ms')

          if (gameProcess) {
            clearInterval(game)
            game = setInterval(nextRandomEgg, rollingSpeed * kef)
          }
        }
      }

      function showScore() {
        let livesHTML = '<ul>'
        for (let i = 0; i < lives; i++) {
          livesHTML += '<li></li>'
        }
        livesHTML += '</ul>'

        scoreElement.innerHTML = `<span>${score}</span>`
        levelElement.innerHTML = `<span>${level}</span>`
        livesElement.innerHTML = livesHTML

        if (lives <= 0) {
          gameOver()
        }

        if (score === 10) { level = 2; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 20) { level = 3; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 30) { level = 4; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 40) { level = 5; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 50) { level = 6; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 60) { level = 7; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 70) { level = 8; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 80) { level = 9; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 90) { level = 10; doSunRotateOnce(); scoreStore.addScore(300); }
        if (score === 99) {
          scoreStore.addScore(300);
          achievementsStore.unlockAchievement(foxStore.foxId, 8);
          youWin();
        }
      }

      function doSunRotateOnce() {
        sunFlag++
        if (sunFlag === 1) sunRotate()
        setTimeout(() => { sunFlag = 0 }, 3000)
      }

      function gameOver() {
        lostSound.play()
        clearInterval(game)
        gameProcess = false
        eggCount = 0
        wolf.className = 'rc'
        currPos = 'rc'
        anounce('ВЫ ПРОИГРАЛИ !', 4000)
        pauseElement.disabled = true

        finalScore.value = 0;
        gainedCoins.value = 0;
        scoreStore.resetScore();

        setTimeout(() => {
          lives = 5
          level = 1
          score = 0
          pauseElement.innerHTML = 'Заново !'
          pauseElement.disabled = false
        }, 4000)
      }

      function youWin() {
        winSound.play()
        clearInterval(game)
        gameProcess = false
        wolf.className = 'lc'
        currPos = 'lc'
        removeAllEggs()
        eggCount = 0
        clearAllTimeouts()
        anounce('ПОБЕДА !', 15000)
        gam.classList.add('bright')
        pauseElement.disabled = true

        foxStore.addCoins(scoreStore.score * COIN_RATIO);

        setTimeout(() => {
          gam.classList.remove('bright')
        }, 450)

        setTimeout(() => {
          lives = 5
          level = 1
          score = 0
          pauseElement.innerHTML = 'Заново !'
          pauseElement.disabled = false
        }, 22000)
      }

      function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      anounce = (content, delay) => {
        const element = document.createElement('div')
        const body = document.querySelector('body')
        element.innerHTML = content
        element.className = 'anounce active'
        body.appendChild(element)

        setTimeout(() => {
          element.classList.remove('active')
          pauseFlag = false
        }, delay)
        setTimeout(() => {
          element.remove()
        }, delay + 1000)
      }

      function sunRotate() {
        const s = document.querySelector('#sun')
        s.classList.add('active')
        pauseSound.play()
        setTimeout(() => {
          s.classList.remove('active')
        }, 1000)
      }
    });

    function startGameFromPopup() {
      showIntro.value = false;
    }

    function exitGame() {
      pauseElement.disabled = true;
      finalScore.value = scoreStore.score;
      gainedCoins.value = finalScore.value * COIN_RATIO;
      eggCount = 0
      foxStore.addCoins(gainedCoins.value);
      isGameOver.value = true;
      clearInterval(game)
      gameProcess = false
      wolf.className = 'rc'
      currPos = 'rc'
      pauseElement.disabled = true
    }

    function closePopup() {
      isGameOver.value = true;
      finalScore.value = 0;
      gainedCoins.value = 0;
      scoreStore.resetScore();
      router.push({ name: 'MainMenu' })
    }

    function restartGame() {
      clearInterval(game)
      gameProcess = false
      wolf.className = 'lc'
      currPos = 'lc'
      eggCount = 0
      removeAllEggs()
      clearAllTimeouts()
      gam.classList.add('bright')
      pauseElement.disabled = true
      isGameOver.value = false;

      finalScore.value = 0;
      gainedCoins.value = 0;
      scoreStore.resetScore();

      setTimeout(() => {
        gam.classList.remove('bright')
      }, 450)

      lives = 5
      level = 1
      score = 0
      pauseElement.innerHTML = 'Заново !'
      pauseElement.disabled = false
    }

    return {
      scoreStore,
      foxStore,
      isGameOver,
      finalScore,
      gainedCoins,
      exitGame,
      closePopup,
      restartGame,
      showIntro,
      startGameFromPopup
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

.wrapper {
  max-width: 440px;
  margin: 0 auto;
}
.game {
  position: relative;
  margin: 1rem 0;
  border: 5px solid rgba(0, 0, 128, 0.65);
  border-radius: 10px;
  box-shadow: 0 0 50px 1px #69c0fa;
  min-height: 660px;
  background-image: url("@/assets/WolfAndEggsSprites/bg.png");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}

:deep(.game .egg) {
  --rolling-time: 2500ms;
  --falling-time: 250ms;
  --egg-size: 60px;
  --egg-cracked-size: 70px;
  position: absolute;
  width: var(--egg-size);
  height: var(--egg-size);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

:deep(.game .egg-white) {
  background-image: url("@/assets/WolfAndEggsSprites/bag-point.png");
}
:deep(.game .egg-brown) {
  background-image: url("@/assets/WolfAndEggsSprites/bag-orange.png");
}

:deep(.game .egg-smile) {
  background-image: url("@/assets/WolfAndEggsSprites/bag-point.png");
}

:deep(.game .egg-left.cracked),
:deep(.game .egg-right.cracked) {
  width: var(--egg-cracked-size);
  height: var(--egg-cracked-size);
  background-image: url("@/assets/WolfAndEggsSprites/bag-open.png");
}

:deep(.game #lives) {
  position: absolute;
  bottom: 2.3rem;
  left: 2rem;
  height: 2rem;
  width: 50%;
}
:deep(.game #lives ul) {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

:deep(.game #lives ul li) {
  width: 2rem;
  height: 2rem;
  background-image: url("@/assets/WolfAndEggsSprites/bag-point.png");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

@media (max-width: 375px) {
  :deep(.game #lives ul li) {
    width: 1.65rem;
    height: 1.65rem;
  }
}

:deep(.game .egg-left.rolling) {
  animation-duration: var(--rolling-time);
  animation-name: leftEggRolling;
  animation-timing-function: linear;
}

:deep(.game .egg-right.rolling) {
  animation-duration: var(--rolling-time);
  animation-name: rightEggRolling;
  animation-timing-function: linear;
}

:deep(.game #chicken-left-up .egg-left.falling) {
  animation-duration: var(--falling-time);
  animation-name: leftEggUpFalling;
  animation-timing-function: linear;
}
:deep(.game #chicken-left-down .egg-left.falling) {
  animation-duration: var(--falling-time);
  animation-name: leftEggDownFalling;
  animation-timing-function: linear;
}
:deep(.game #chicken-right-up .egg-right.falling) {
  animation-duration: var(--falling-time);
  animation-name: rightEggUpFalling;
  animation-timing-function: linear;
}
:deep(.game #chicken-right-down .egg-right.falling) {
  animation-duration: var(--falling-time);
  animation-name: rightEggDownFalling;
  animation-timing-function: linear;
}

@keyframes leftEggRolling {
  from {
    top: -30%;
    left: 30%;
    transform: rotate(0deg);
  }
  to {
    top: 40%;
    left: 98%;
    transform: rotate(720deg);
  }
}

@keyframes leftEggUpFalling {
  from {
    top: 40%;
    left: 98%;
    transform: rotate(720deg);
  }
  to {
    top: 250%;
    left: 98%;
    transform: rotate(720deg);
  }
}

@keyframes leftEggDownFalling {
  from {
    top: 40%;
    left: 98%;
    transform: rotate(720deg);
  }
  to {
    top: 140%;
    left: 98%;
    transform: rotate(720deg);
  }
}

@keyframes rightEggRolling {
  from {
    top: -30%;
    right: 30%;
    transform: rotate(0deg);
  }
  to {
    top: 40%;
    right: 98%;
    transform: rotate(-720deg);
  }
}

@keyframes rightEggUpFalling {
  from {
    top: 40%;
    right: 98%;
    transform: rotate(-720deg);
  }
  to {
    top: 250%;
    right: 98%;
    transform: rotate(-720deg);
  }
}

@keyframes rightEggDownFalling {
  from {
    top: 40%;
    right: 98%;
    transform: rotate(-720deg);
  }
  to {
    top: 140%;
    right: 98%;
    transform: rotate(-720deg);
  }
}

.game-place-lock {
  position: absolute;
  top: 0;
  left: -110%;
  width: 100%;
  height: 100%;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease-in-out;
}
.game-place-lock.active {
  left: 0;
}
#sun {
  position: absolute;
  width: 40%;
  height: 20%;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-image: url("@/assets/WolfAndEggsSprites/sun.png");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  transition: transform 0.5s ease-in-out;
}
#sun.active {
  filter: brightness(250%);
  transform: translateX(0) rotate(90deg);
}

#score,
#level {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgb(252, 98, 98);
  text-shadow: 0 0 5px rgba(16, 54, 253, 0.95);
}
#score {
  top: 2rem;
  left: 2rem;
}
#score span,
#level span {
  font-weight: bold;
  text-transform: uppercase;
}
#score b,
#level b {
  font-size: 4rem;
  font-weight: bold;
}
#level {
  top: 2rem;
  right: 2rem;
}

#chicken-left-up,
#chicken-left-down,
#chicken-right-up,
#chicken-right-down {
  position: absolute;
  width: 75px;
  height: 75px;
}
#chicken-left-up { top: 42%; left: 0; }
.chicken-left-up__wrap { position: relative; }
#chicken-left-down { top: 52%; left: 0; }
.chicken-left-down__wrap { position: relative; }
#chicken-right-up { top: 42%; right: 0; }
.chicken-right-up__wrap { position: relative; }
#chicken-right-down { top: 52%; right: 0; }
.chicken-right-down__wrap { position: relative; }

.pomost-left-up,
.pomost-right-up,
.pomost-left-down,
.pomost-right-down {
  position: absolute;
  top: 63%;
  width: 230px;
  height: 120px;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}
.pomost-left-up {
  left: -4rem;
  top: -4rem;
  background-image: url("@/assets/WolfAndEggsSprites/pomost_lu.png");
}
.pomost-right-up {
  right: -4rem;
  top: -4rem;
  background-image: url("@/assets/WolfAndEggsSprites/pomost_ru.png");
}
.pomost-left-down {
  left: -4rem;
  top: 1rem;
  background-image: url("@/assets/WolfAndEggsSprites/pomost_ld.png");
}
.pomost-right-down {
  right: -4rem;
  top: 1rem;
  background-image: url("@/assets/WolfAndEggsSprites/pomost_rd.png");
}

.chicken-left,
.chicken-right {
  position: relative;
  width: 75px;
  height: 75px;
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}
.chicken-left {
  left: -8px;
  background-image: url("@/assets/WolfAndEggsSprites/chiken-left.png");
}
.chicken-right {
  right: -8px;
  background-image: url("@/assets/WolfAndEggsSprites/chiken-right.png");
}
#CLU-touch, #CLD-touch, #CRU-touch, #CRD-touch {
  position: absolute;
  width: 50%;
  height: 8rem;
  background-color: transparent;
  z-index: 1000;
}
#CLU-touch { top: 38%; left: 0; }
#CLD-touch { top: 58%; left: 0; }
#CRU-touch { top: 38%; right: 0; }
#CRD-touch { top: 58%; right: 0; }

#wolf {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 264px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
#wolf.rc { background-image: url('@/assets/WolfAndEggsSprites/fox_rc.png'); }
#wolf.lc { background-image: url('@/assets/WolfAndEggsSprites/fox_lc.png'); }
#wolf.ru { background-image: url('@/assets/WolfAndEggsSprites/fox_ru.png'); }
#wolf.rd {
  background-image: url('@/assets/WolfAndEggsSprites/fox_rd.png');
  top: 52%;
}
#wolf.lu { background-image: url('@/assets/WolfAndEggsSprites/fox_lu.png'); }
#wolf.ld {
  background-image: url('@/assets/WolfAndEggsSprites/fox_ld.png');
  top: 52%;
}


#pause {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  color: #fff;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  padding: 0.5em;
  background-color: rgba(0, 0, 128, 0.65);
  width: 40%;
  border-radius: 5px;
  z-index: 100;
}
#pause:hover {
  opacity: 0.9;
  box-shadow: 0 0 15px 1px #69c0fa;
}
#pause.active {
  color: rgb(138, 247, 138);
  opacity: 0.9;
  box-shadow: 0 0 15px 1px #69c0fa;
}
#pause[disabled] {
  opacity: 0.5;
  cursor: default;
}

.anounce {
  position: fixed;
  text-align: center;
  text-transform: uppercase;
  top: -100%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  font-size: 2rem;
  line-height: 110%;
  color: rgb(252, 98, 98);
  font-weight: bold;
  transition: all 0.5s ease-in-out;
  text-shadow: 0 0 5px rgba(16, 54, 253, 0.95);
}
.anounce.active {
  top: 50%;
  opacity: 1;
}

.game.bright {
  transition: filter 0.5s ease-in-out;
  filter: brightness(250%);
}
</style>
