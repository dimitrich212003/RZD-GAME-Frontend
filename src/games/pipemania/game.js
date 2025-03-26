import Board from './board.js';
import Pipe from './pipe.js';

export default class Game {
    constructor(ctx){
        this.ctx = ctx;
        this.images = this._loadImages();

        this.level=1;

        this.setupGame();
    }

    setupGame(){
        const sourcePos=this._randomSourcePos();
        const destPos= this._randomDestinationPos();

        this.board=new Board(this.images, sourcePos, destPos);
        // Очередь труб
        this.pipeQueue=[ new Pipe(), new Pipe(), new Pipe() ];

        // Ставим старт и финиш
        this.board.placePipe(Pipe.source(), sourcePos);
        this.board.placePipe(Pipe.destination(), destPos);
        this.board.setCurrentPos();
        this.board.points=0;

        // Рисуем сетку (фон)
        this.board.drawGrid(this.ctx);
        this.draw();
    }

    // Загружаем <img> с id="pipe0", "pipe1" ... "pipe6"
    _loadImages(){
        const images=[];
        for(let i=0;i<7;i++){
            const el=document.getElementById(`pipe${i}`);
            images.push(el);
        }
        return images;
    }

    _randomSourcePos(){
        const y=Math.floor(Math.random()*7);
        return [0,y];
    }
    _randomDestinationPos(){
        const x=Math.floor(Math.random()*6)+2;
        return [x,7];
    }

    // Активация управления
    bindKeyHandlers(){
        document.addEventListener('keydown', e=>{
            // стрелки -> перемещаем selectPos
            this.board.updateSelectedPos(e.keyCode);

            // space -> ставим новую трубу, если не в source/destination
            if(e.keyCode===32 && !this.board.checkPos()){
                this.board.placePipe(this.pipeQueue.shift());
                this.pipeQueue.push(new Pipe());
            }
            this.draw();
        });
    }

    start(){
        this.bindKeyHandlers();
        this.board.points=0;
        this.round();
    }

    round(){
        // Здесь можно включать таймер, progressBar
        this.draw();
    }

    finishLevel(){
        // останавливаем таймер, flowInterval
        // запускаем checkWin() чаще, ...
    }

    checkWin(interval=5000){
        // запускаем setInterval(() => {
        //   let result = this.board.checkWin(...)
        // }, interval)
    }

    draw(){
        // Рисуем board
        this.board.draw(this.ctx);

        // Рисуем очередь труб (pipeQueue)
        this.pipeQueue.forEach( (pipe,y) =>{
            const width=Board.WIDTH;
            const xPos=9*width;
            const yPos=y*width + 1.5*width;
            this.ctx.clearRect(xPos,yPos,width,width);
            this.ctx.fillStyle='#E0E0D1';
            this.ctx.fillRect(xPos,yPos,width,width);
            this.ctx.drawImage(this.images[pipe.img], xPos,yPos,width,width);
        });
    }

    // Перезапуск
    end(){
        // сбрасываем всё, заново setup
        this.ctx.clearRect(0,0,700,500);
        this.setupGame();
        this.round();
    }
}
