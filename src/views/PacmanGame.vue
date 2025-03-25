<template>
  <div class="pacman-container">
    <!-- Верхняя панель -->
    <div class="ui-overlay">
      <div class="score-display">
        Score: {{ scoreStore.score }}
      </div>
      <button class="exit-button" @click="exitGame">Выйти в меню</button>
    </div>

    <!-- Canvas -->
    <div class="canvas-area">
      <canvas ref="gameCanvas"></canvas>
    </div>

    <!-- Итоговый попап (GameResultPopup) -->
    <GameResultPopup
        :visible="gameOver"
        :finalScore="finalScore"
        :gainedCoins="gainedCoins"
        @close="closePopup"
    />
  </div>
</template>

<script>
import {ref, onMounted, onUnmounted} from 'vue'
import { useScoreStore } from '@/stores/pacmanScoreStore'
import { useFoxStore } from '@/stores/foxStore'
import { useRouter } from 'vue-router'
import GameResultPopup from '@/components/GameResultPopup.vue'

const COIN_RATIO = 0.01;

export default {
  name: "PacmanGame",
  components: { GameResultPopup },

  setup() {
    const gameCanvas = ref(null)
    const scoreStore = useScoreStore()
    const foxStore = useFoxStore()
    const router = useRouter()

    const gameOver = ref(false)
    const finalScore = ref(0)
    const gainedCoins = ref(0)

    let handleKeyDown, handleKeyUp;

    onMounted(() => {
      if (!gameCanvas.value) return

      scoreStore.resetScore()

      const canvas = gameCanvas.value;
      const context = canvas.getContext('2d');
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      class Boundary {
        static width = 40;
        static height = 40;
        constructor({ position, image }) {
          this.position = position;
          this.width = 40;
          this.height = 40;
          this.image = image;
        }

        draw() {
          context.drawImage(this.image, this.position.x, this.position.y);
        }
      }

      class Player {
        constructor({ position, velocity }) {
          this.position = position;
          this.velocity = velocity;
          this.radius = 15;
          this.radians = 0.75;
          this.openRate = 0.12;
          this.rotation = 0;
          this.speed = 2;
        }

        draw() {
          context.save();
          context.translate(this.position.x, this.position.y);
          context.rotate(this.rotation);
          context.translate(-this.position.x, -this.position.y);
          context.beginPath();
          context.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
          context.fillStyle = 'brown';
          context.lineTo(this.position.x, this.position.y);
          context.fill();
          context.closePath();
          context.restore();
        }

        update() {
          this.draw();
          this.position.x += this.velocity.x;
          this.position.y += this.velocity.y;

          if(this.radians < 0 || this.radians > 0.75) {
            this.openRate = -this.openRate;
          }
          this.radians += this.openRate;
        }
      }

      class Ghost {
        static speed = 1;
        constructor({ position, velocity, color = 'red' }) {
          this.position = position;
          this.velocity = velocity;
          this.radius = 15;
          this.color = color;
          this.prevCollisions = [];
          this.speed = 1.5;
          this.scared = false;
        }

        draw() {
          context.beginPath();
          context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
          context.fillStyle = this.scared ? 'blue' : this.color;
          context.fill();
          context.closePath();
        }

        update() {
          this.draw();
          this.position.x += this.velocity.x;
          this.position.y += this.velocity.y;
        }
      }

      class Pellet {
        constructor({ position }) {
          this.position = position;
          this.radius = 3;
        }

        draw() {
          context.beginPath();
          context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
          context.fillStyle = 'black';
          context.fill();
          context.closePath();
        }
      }

      class PowerUp {
        constructor({ position }) {
          this.position = position;
          this.radius = 10;
        }

        draw() {
          context.beginPath();
          context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
          context.fillStyle = 'black';
          context.fill();
          context.closePath();
        }
      }

      const map = [
        ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
        ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
        ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
        ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
      ]

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
      const pellets = [];
      const boundaries = [];
      const powerUps = [];

      const ghosts = [
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

      const player = new Player({
        position: {
          x: Boundary.width + Boundary.width / 2,
          y: Boundary.height + Boundary.height / 2
        },
        velocity: {
          x: 0,
          y: 0
        }
      });

      function createImage(src) {
        const image = new Image();
        image.src = src;
        return image;
      }

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

      function circleCollidesWithRectanglePlayer({ circle, rectangle }) {
        const padding = Boundary.width / 2 - circle.radius - 2;
        return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
            circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
            circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
            circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding);
      }

      function circleCollidesWithRectangleGhost({ circle, rectangle }) {
        const padding = Boundary.width / 2 - circle.radius - 1;
        return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
            circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
            circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
            circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding);
      }

      let animationId;
      function animate() {
        animationId = requestAnimationFrame(animate);
        context.clearRect(0,0, canvas.width, canvas.height);

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
          console.log('you win');
          cancelAnimationFrame(animationId);
          exitGame();
        }

        // Логика касания суперсилы
        for (let i = powerUps.length - 1; i >= 0; i--) {
          const powerUp = powerUps[i];
          powerUp.draw();

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
          pellet.draw();

          // если игрок съел гранулу
          if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y)
              < pellet.radius + player.radius) {
            pellets.splice(i, 1);
            scoreStore.addScore(10);
          }
        }

        boundaries.forEach((boundary) => {
          boundary.draw();
          if (circleCollidesWithRectanglePlayer({
            circle: player,
            rectangle: boundary
          })) {
            player.velocity.y = 0;
            player.velocity.x = 0;
          }
        });
        player.update();

        ghosts.forEach(ghost => {
          ghost.update();

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
      }

      animate();

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
      }

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
      }

      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    })

    function exitGame() {
      // 1) finalScore = scoreStore.score
      finalScore.value = scoreStore.score
      // 2) gainedCoins = round(score * ratio)
      gainedCoins.value = Math.round(finalScore.value * COIN_RATIO)
      // 3) Добавить монеты (пример, если у вас foxStore)
      foxStore.addCoins(gainedCoins.value)
      // 4) Показать попап
      gameOver.value = true
    }

    function closePopup() {
      gameOver.value = false
      router.push({ name: 'MainMenu' })
    }

    return {
      gameCanvas,
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
.pacman-container {
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
canvas {
  display: block;
}
</style>
