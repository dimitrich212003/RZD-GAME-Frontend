import Board from './board.js';
import Pipe from './pipe.js';

export default class Game {
    constructor(ctx, options = {}) {
        this.ctx = ctx;
        this.options = options;
        this.images = this._loadImages();

        this.level = 1;
        this.timerInterval = null;
        this.flowInterval = null;
        this.timeout = null;
        this.levelBoard   = document.getElementById("level");
        this.scoreBoard   = document.getElementById("score");
        this.result       = document.getElementById("result");
        this.levelResult  = document.getElementById("level-result");
        this.next         = document.getElementById("next");
        this.target       = document.getElementById("target");
        this.restartBtn   = document.getElementById("restart");
        this.quickFinishBtn = document.getElementById("quick-finish");
        this.timerBarElem = document.getElementById("timerBar");
        this.setupGame();
    }

    setupGame() {
        const sourcePos = this._randomSourcePos();
        const destPos   = this._randomDestinationPos();

        this.images[6].src = '/pipeManiaSprites/0_active.png';
        this.board = new Board(this.images, sourcePos, destPos);
        this.pipeQueue = [ new Pipe(), new Pipe(), new Pipe() ];
        this.board.placePipe(Pipe.source(), sourcePos);
        this.board.placePipe(Pipe.destination(), destPos);
        this.board.setCurrentPos();
        this.board.points = 0;
        this.board.drawGrid(this.ctx);
        this.draw();
    }

    _loadImages() {
        const images = [];
        for (let i=0; i<7; i++) {
            const el = document.getElementById(`pipe${i}`);
            images.push(el);
        }
        for (let i = 0; i < 6; i++) {
            images.push(document.getElementById(`pipe${i}_active`));
        }
        return images;
    }

    _randomSourcePos(){
        const y = Math.floor(Math.random()*7);
        return [0,y];
    }
    _randomDestinationPos(){
        const x = Math.floor(Math.random()*6)+2;
        return [x,7];
    }

    bindKeyHandlers(){
        document.addEventListener('keydown', e => {
            this.board.updateSelectedPos(e.keyCode);
            if(e.keyCode === 32 && !this.board.checkPos()){
                this.board.placePipe(this.pipeQueue.shift());
                this.pipeQueue.push(new Pipe());
            }
            this.draw();
        });
    }

    start(){
        this.bindKeyHandlers();
        this.board.points = 0;
        this.round();
    }

    disableRestart(disable){
        if(this.restartBtn) this.restartBtn.disabled = disable;
        if(this.quickFinishBtn) this.quickFinishBtn.disabled = disable;
    }

    finishLevel(){
        clearInterval(this.timerInterval);
        clearInterval(this.flowInterval);
        clearTimeout(this.timeout);
        this.disableRestart(true);
        this.checkWin(300);
    }

    checkWin(interval=5000){
        this.images[6].src = '/pipeManiaSprites/0.png';


        this.flowInterval = setInterval(() => {
            const won = this.board.checkWin(this.flowInterval);
            if (this.board.lastFlowSuccess) {
                this.board.lastFlowSuccess = false;
                if (this.options.onAddScore) {
                    this.options.onAddScore(10);
                }
            }

            this.scoreBoard.innerHTML = 'Очки: ' + this.board.points;
            this.draw();

            if(won === "winner"){
                if(this.board.points >= 20 + 20*this.level) {
                    this.evalResult(this.level+1, "winner", 20+20*this.level);
                } else {
                    const needed = 20+20*this.level;
                    this.evalResult(this.level, "not enough", needed);
                }
            } else if(won === "game over"){
                this.evalResult(1, "game over");
            }
        }, interval);
    }

    evalResult(newLevel, resultType, neededPoints=0){
        this.next.disabled = false;
        this.disableRestart(true);
        this.level = newLevel;

        if(resultType === "winner"){
            this.levelResult.innerHTML = "Уровень пройден!";
            this.next.innerHTML = "Продолжить";
        } else if(resultType === "game over"){
            this.levelResult.innerHTML = "Проигрыш!";
            this.next.innerHTML = "Попробовать снова";
        } else {
            this.levelResult.innerHTML = `Needed ${neededPoints} points to pass level!`;
            this.next.innerHTML = "Try Again!";
        }
        this.result.classList.remove("hidden");

        if(this.options.onGameEnd){
            this.options.onGameEnd(resultType, newLevel, neededPoints);
        }
    }

    end(){
        clearInterval(this.timerInterval);
        clearInterval(this.flowInterval);
        clearTimeout(this.timeout);
        this.disableRestart(true);
        this.ctx.clearRect(0,0,700,500);
        this.setupGame();
        this.round();
    }

    round(){
        this.disableRestart(false);
        this.levelBoard.innerHTML = 'Уровень: '+this.level;
        this.draw();

        let width=1;
        this.timerInterval = setInterval(()=>{
            if(width>=99){
                clearInterval(this.timerInterval);
            } else {
                width += 3;
                if(this.timerBarElem){
                    this.timerBarElem.style.width = width+'%';
                }
            }
        }, 1000);

        this.timeout = setTimeout(()=>{
            this.checkWin();
        }, 28000);
    }

    draw(){
        this.board.draw(this.ctx);

        this.pipeQueue.forEach((pipe,y)=>{
            const w = Board.WIDTH;
            const xPos = 9*w;
            const yPos = y*w + 1.5*w;
            this.ctx.clearRect(xPos,yPos,w,w);
            this.ctx.fillStyle='#E0E0D1';
            this.ctx.fillRect(xPos,yPos,w,w);
            this.ctx.drawImage(this.images[pipe.img], xPos,yPos,w,w);
        });
    }
}
