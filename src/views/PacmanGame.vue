<template>
  <div class="pacman-container">
    <div class="ui-overlay">
      <div class="score-display">
        <p>Очки: {{ scoreStore.score }}</p>
        <p>Рекорд: {{ scoreStore.pacmanBestScore }}</p>
      </div>
      <button class="exit-button" @click="exitGame">Выйти в меню</button>
    </div>

    <div class="game-field-wrapper">
      <div class="game-field">
        <canvas ref="gameCanvas" class="pacman-canvas"></canvas>
      </div>
    </div>

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
import {ref, onMounted, onUnmounted} from 'vue'
import { usePacmanScoreStore } from '@/stores/pacmanScoreStore'
import { useFoxStore } from '@/stores/foxStore'
import { useRouter } from 'vue-router'

import GameResultPopup from '@/components/GameResultPopup.vue'

import Boundary from '@/games/pacman/entities/Boundary.js'
import Player from '@/games/pacman/entities/Player.js'
import Ghost from '@/games/pacman/entities/Ghost.js'
import Pellet from '@/games/pacman/entities/Pellet.js'
import PowerUp from '@/games/pacman/entities/PowerUp.js'

import { circleCollidesWithRectanglePlayer, circleCollidesWithRectangleGhost } from '@/games/pacman/utils/collisions.js'
import { createImage } from '@/games/pacman/utils/createImage.js'

import { map } from '@/games/pacman/map.js'

const COIN_RATIO = 0.01;

export default {
  name: "PacmanGame",
  components: { GameResultPopup },
  setup() {
    const gameCanvas = ref(null)
    const scoreStore = usePacmanScoreStore()
    const foxStore = useFoxStore()
    const router = useRouter()

    const gameOver = ref(false)
    const finalScore = ref(0)
    const gainedCoins = ref(0)

    let handleKeyDown, handleKeyUp;
    let animationId;
    let context;
    let pellets = [];
    let boundaries = [];
    let powerUps = [];
    let ghosts = [];
    let player = null;

    const keys = {
      w: {
        pressed: false
      },
      a: {
        pressed: false
      },
      s: {
        pressed: false
      },
      d: {
        pressed: false
      }
    };
    let lastKey = '';
    let mapWidth, mapHeight;
    let offsetX, offsetY;

    function animate() {
      animationId = requestAnimationFrame(animate);
      context.clearRect(0,0, gameCanvas.value.width, gameCanvas.value.height)

      context.save();
      context.translate(offsetX, offsetY);

      if(keys.w.pressed && lastKey === 'w') {
        console.log('w');
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (circleCollidesWithRectanglePlayer({
            circle: {...player, velocity: {
                x: 0,
                y: -player.speed
              }},
            rectangle: boundary
          })) {
            player.velocity.y = 0;
            break;
          }
          else {
            player.velocity.y = -player.speed;
          }
        }
      }
      else if(keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (circleCollidesWithRectanglePlayer({
            circle: {...player, velocity: {
                x: -player.speed,
                y: 0
              }},
            rectangle: boundary
          })) {
            player.velocity.x = 0;
            break;
          }
          else {
            player.velocity.x = -player.speed;
          }
        }
      }
      else if(keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (circleCollidesWithRectanglePlayer({
            circle: {...player, velocity: {
                x: 0,
                y: player.speed
              }},
            rectangle: boundary
          })) {
            player.velocity.y = 0;
            break;
          }
          else {
            player.velocity.y = player.speed;
          }
        }
      }
      else if(keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (circleCollidesWithRectanglePlayer({
            circle: {...player, velocity: {
                x: player.speed,
                y: 0
              }},
            rectangle: boundary
          })) {
            player.velocity.x = 0;
            break;
          }
          else {
            player.velocity.x = player.speed;
          }
        }
      }

      //обнаружение столкновение игрока и призрака
      for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i];
        if (Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y) <
            ghost.radius + player.radius) {
          if (ghost.scared) {
            ghosts.splice(i, 1);
          }
          else {
            cancelAnimationFrame(animationId);
            exitGame();
          }
        }
      }

      if(pellets.length === 0) {
        cancelAnimationFrame(animationId);
        exitGame();
      }

      // Логика касания суперсилы
      for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.draw(context);

        // если игрок съел суперсилу
        if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y)
            < powerUp.radius + player.radius) {
          powerUps.splice(i, 1);

          // делаем так, что призраки пугаются
          ghosts.forEach(ghost => {
            ghost.scared = true;

            setTimeout(() => {
              ghost.scared = false;
            }, 5000);
          })
        }
      }

      // Логика касания гранул
      for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i];
        pellet.draw(context);

        // если игрок съел гранулу
        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y)
            < pellet.radius + player.radius) {
          pellets.splice(i, 1);
          scoreStore.addScore(10);
        }
      }

      boundaries.forEach((boundary) => {
        boundary.draw(context);
        if (circleCollidesWithRectanglePlayer({
          circle: player,
          rectangle: boundary
        })) {
          player.velocity.y = 0;
          player.velocity.x = 0;
        }
      });
      player.update(context);

      ghosts.forEach(ghost => {
        ghost.update(context);

        const collisions = [];
        boundaries.forEach((boundary) => {
          if (
              !collisions.includes('right') &&
              circleCollidesWithRectangleGhost({
                circle: { ...ghost, velocity: { x: ghost.speed, y: 0 }},
                rectangle: boundary
              })
          ) {
            collisions.push('right')
          }

          if (
              !collisions.includes('left') &&
              circleCollidesWithRectangleGhost({
                circle: { ...ghost, velocity: { x: -ghost.speed, y: 0 }},
                rectangle: boundary
              })
          ) {
            collisions.push('left')
          }

          if (
              !collisions.includes('down') &&
              circleCollidesWithRectangleGhost({
                circle: { ...ghost, velocity: { x: 0, y: ghost.speed }},
                rectangle: boundary
              })
          ) {
            collisions.push('down')
          }

          if (
              !collisions.includes('up') &&
              circleCollidesWithRectangleGhost({
                circle: { ...ghost, velocity: { x: 0, y: -ghost.speed }},
                rectangle: boundary
              })
          ) {
            collisions.push('up')
          }
        });

        if (collisions.length > ghost.prevCollisions.length) {
          ghost.prevCollisions = collisions;
        }

        if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
          if (ghost.velocity.x > 0) {
            ghost.prevCollisions.push('right');
          }
          else if (ghost.velocity.x < 0) {
            ghost.prevCollisions.push('left');
          }
          else if (ghost.velocity.y > 0) {
            ghost.prevCollisions.push('down');
          }
          else if (ghost.velocity.y < 0) {
            ghost.prevCollisions.push('up');
          }


          const pathways = ghost.prevCollisions.filter((collision) => {
            return !collisions.includes(collision);
          });
          console.log({pathways});


          const direction = pathways[Math.floor(Math.random() * pathways.length)];

          switch (direction) {
            case 'down':
              ghost.velocity.y = ghost.speed;
              ghost.velocity.x = 0;
              break;
            case 'up':
              ghost.velocity.y = -ghost.speed;
              ghost.velocity.x = 0;
              break;
            case 'right':
              ghost.velocity.y = 0;
              ghost.velocity.x = ghost.speed;
              break;
            case 'left':
              ghost.velocity.y = 0;
              ghost.velocity.x = -ghost.speed;
              break;
          }

          ghost.prevCollisions = [];
        }
      })

      if(player.velocity.x > 0) {
        player.rotation = 0;
      }
      else if(player.velocity.x < 0) {
        player.rotation = Math.PI;
      }
      else if(player.velocity.y > 0) {
        player.rotation = Math.PI / 2;
      }
      else if(player.velocity.y < 0) {
        player.rotation = Math.PI * 1.5;
      }

      context.restore();
    }

    function initGame() {
      if (!gameCanvas.value) return;
      scoreStore.resetScore();

      const canvas = gameCanvas.value;
      context = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const rows = map.length;
      const cols = map[0].length;

      mapWidth = cols * Boundary.width;
      mapHeight = rows * Boundary.height;

      offsetX = (canvas.width - mapWidth) / 2;
      offsetY = (canvas.height - mapHeight) / 2;
      offsetY -= 0.3 * (canvas.height - mapHeight);


      pellets = [];
      boundaries = [];
      powerUps = [];
      ghosts = [];

      ghosts = [
        new Ghost({
          position: {
            x: Boundary.width * 4 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
          },
          velocity: {
            x: Ghost.speed,
            y: 0
          },
          color: 'red',
        }),
        new Ghost({
          position: {
            x: Boundary.width * 7 + Boundary.width / 2,
            y: Boundary.height * 3 + Boundary.height / 2
          },
          velocity: {
            x: Ghost.speed,
            y: 0
          },
          color: 'pink',
        }),
        new Ghost({
          position: {
            x: Boundary.width * 7 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2
          },
          velocity: {
            x: Ghost.speed,
            y: 0
          },
          color: 'green',
        }),

      ];

      player = new Player({
        position: {
          x: Boundary.width + Boundary.width / 2,
          y: Boundary.height + Boundary.height / 2
        },
        velocity: {
          x: 0,
          y: 0
        }
      });

      map.forEach((row, i) => {
        row.forEach((symbol, j) => {
          switch (symbol) {
            case '-':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * i
                    },
                    image: createImage('/pacmanSprites/pipeHorizontal.png')
                  })
              )
              break
            case '|':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * i
                    },
                    image: createImage('/pacmanSprites/pipeVertical.png')
                  })
              )
              break
            case '1':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * i
                    },
                    image: createImage('/pacmanSprites/pipeCorner1.png')
                  })
              )
              break
            case '2':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * i
                    },
                    image: createImage('/pacmanSprites/pipeCorner2.png')
                  })
              )
              break
            case '3':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * i
                    },
                    image: createImage('/pacmanSprites/pipeCorner3.png')
                  })
              )
              break
            case '4':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * i
                    },
                    image: createImage('/pacmanSprites/pipeCorner4.png')
                  })
              )
              break
            case 'b':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * i
                    },
                    image: createImage('/pacmanSprites/block.png')
                  })
              )
              break
            case '[':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    image: createImage('/pacmanSprites/capLeft.png')
                  })
              )
              break
            case ']':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    image: createImage('/pacmanSprites/capRight.png')
                  })
              )
              break
            case '_':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    image: createImage('/pacmanSprites/capBottom.png')
                  })
              )
              break
            case '^':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    image: createImage('/pacmanSprites/capTop.png')
                  })
              )
              break
            case '+':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    image: createImage('/pacmanSprites/pipeCross.png')
                  })
              )
              break
            case '5':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    color: 'blue',
                    image: createImage('/pacmanSprites/pipeConnectorTop.png')
                  })
              )
              break
            case '6':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    color: 'blue',
                    image: createImage('/pacmanSprites/pipeConnectorRight.png')
                  })
              )
              break
            case '7':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    color: 'blue',
                    image: createImage('/pacmanSprites/pipeConnectorBottom.png')
                  })
              )
              break
            case '8':
              boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    image: createImage('/pacmanSprites/pipeConnectorLeft.png')
                  })
              )
              break
            case '.':
              pellets.push(
                  new Pellet({
                    position: {
                      x: j * Boundary.width + Boundary.width / 2,
                      y: i * Boundary.height + Boundary.height / 2
                    }
                  })
              )
              break
            case 'p':
              powerUps.push(
                  new PowerUp({
                    position: {
                      x: j * Boundary.width + Boundary.width / 2,
                      y: i * Boundary.height + Boundary.height / 2
                    }
                  })
              )
              break
          }
        })
      });

      handleKeyDown = ({ key }) => {
        switch (key) {
          case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
          case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
          case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
          case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        }
      };

      handleKeyUp = ({ key }) => {
        switch (key) {
          case 'w':
            keys.w.pressed = false
            break
          case 'a':
            keys.a.pressed = false
            break
          case 's':
            keys.s.pressed = false
            break
          case 'd':
            keys.d.pressed = false
            break
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      animate();
    }

    onMounted(() => {
      initGame();
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    })

    function exitGame() {
      cancelAnimationFrame(animationId);
      finalScore.value = scoreStore.score;
      gainedCoins.value = Math.round(finalScore.value * COIN_RATIO);
      foxStore.addCoins(gainedCoins.value);
      gameOver.value = true;
    }

    function closePopup() {
      gameOver.value = false;
      router.push({ name: 'MainMenu' });
    }

    function restartGame() {
      gameOver.value=false;
      scoreStore.resetScore();
      cancelAnimationFrame(animationId);
      initGame();
    }

    return {
      gameCanvas,
      scoreStore,
      foxStore,
      gameOver,
      finalScore,
      gainedCoins,

      exitGame,
      closePopup,
      restartGame
    }
  }
}
</script>

<style scoped>
.pacman-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; /* или 100% */
}

/* Панель со счётом и кнопкой выхода */
.ui-overlay {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #333;
  color: #fff;
  align-items: center;
  justify-content: space-between;
}

/* Здесь размещаем поле */
.game-field-wrapper {
  flex: 1;
  display: flex;
  justify-content: center; /* по горизонтали */
  align-items: center;     /* по вертикали */
}

.game-field {
  background: transparent;
  width: max-content;
  height: max-content;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pacman-canvas {
  display: block;
  width: 100%;
  height: 100%;
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
</style>
