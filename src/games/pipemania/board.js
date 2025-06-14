import Pipe from './pipe.js';

export default class Board {
    constructor(images, sourcePos, destinationPos) {
        this.grid = this._makeGrid();
        this.selectPos = [0, 0];
        this.prevSelect = [0, 0];
        this.sourcePos = sourcePos;
        this.destinationPos = destinationPos;
        this.points = 0;
        this.images = images;
        this.dirt = document.getElementById("dirt");
    }

    _makeGrid() {
        const grid=[];
        for(let i=0;i<8;i++){
            grid.push(["","","","","","","",""]);
        }
        return grid;
    }

    setCurrentPos() {
        this.currentPos = this.sourcePos;
        this.currentPipe = this.grid[this.currentPos[0]][this.currentPos[1]];
    }

    placePipe(pipe, pos=this.selectPos) {
        this.grid[pos[0]][pos[1]] = pipe;
    }

    checkPos(pos=this.selectPos) {
        const source = Board.posEquals(pos, this.sourcePos);
        const dest   = Board.posEquals(pos, this.destinationPos);
        return (source || dest);
    }

    updateSelectedPos(keyCode) {
        const move = Board.MOVES[keyCode];
        if (move) {
            let moveX = (this.selectPos[0] + move[0]) % 8;
            let moveY = (this.selectPos[1] + move[1]) % 8;
            if(moveX<0) moveX=7;
            if(moveY<0) moveY=7;
            this.selectPos=[moveX, moveY];
        }
    }

    checkWin(interval) {
        this.images[6].src = '/pipeManiaSprites/0.png';
        const flowDir = this.currentPipe.getFlowDir('out');
        const move    = Pipe.MOVES[flowDir];
        const nextPos = [this.currentPos[0] + move[0], this.currentPos[1] + move[1]];
        this.currentPipe.fill = false;

        if (!this.boundary(nextPos)) {
            clearInterval(interval);
            return 'game over';
        }

        const nextPipe = this.grid[nextPos[0]][nextPos[1]];

        if (nextPipe && this.currentPipe.checkConnection(nextPipe)) {
            nextPipe.resetFlow();
            const flowIn  = Pipe.complement(flowDir);
            nextPipe.setFlowIn(flowIn);
            const flowOut = nextPipe.getFlowDir('');
            if (flowOut) nextPipe.setFlowOut(flowOut);
            nextPipe.fill   = true;
            this.currentPos = nextPos;
            this.currentPipe = nextPipe;

            this.points += 10;

            if (
                nextPos[0] === this.destinationPos[0] &&
                nextPos[1] === this.destinationPos[1]
            ) {
                clearInterval(interval);
                return 'winner';
            }

            return 'continue';
        }

        clearInterval(interval);
        return 'game over';
    }

    drawGrid(ctx) {
        this.grid.forEach((row,x)=>{
            row.forEach((pipe,y)=>{
                const xPos=x*Board.WIDTH;
                const yPos=y*Board.WIDTH;
                ctx.drawImage(this.dirt, xPos,yPos, Board.WIDTH, Board.WIDTH);
            });
        });
    }

    drawPipe(ctx, pipe, x,y) {
        let fillColor='#E0E0D1';
        if(this.checkPos([x,y])) {
            fillColor='#DF2A2A';
        }
        const width=Board.WIDTH;
        const xPos=x*width;
        const yPos=y*width;
        const ACTIVE_SPRITE = {
            0: 7,
            1: 8,
            2: 9,
            3: 10,
            4: 11,
            5: 12
        };
        const imgIndex = (pipe.fill && Object.prototype.hasOwnProperty.call(ACTIVE_SPRITE, pipe.img))
            ? ACTIVE_SPRITE[pipe.img]
            : pipe.img;
        ctx.fillStyle=fillColor;
        ctx.fillRect(xPos,yPos,width,width);
        ctx.drawImage(this.images[imgIndex], xPos, yPos, width, width);
    }

    draw(ctx) {
        const w=Board.WIDTH;
        ctx.clearRect(this.prevSelect[0], this.prevSelect[1], w,w);
        ctx.drawImage(this.dirt, this.prevSelect[0], this.prevSelect[1], w,w);

        this.grid.forEach((row,x)=>{
            row.forEach((square,y)=>{
                if(square!==""){
                    this.drawPipe(ctx,square,x,y);
                }
            });
        });
        ctx.fillStyle='rgba(0,204,102,0.3)';
        const x= this.selectPos[0]*w;
        const y= this.selectPos[1]*w;
        ctx.fillRect(x,y,w,w);
        this.prevSelect=[x,y];
    }

    static posEquals(pos1,pos2){
        return (pos1[0]===pos2[0] && pos1[1]===pos2[1]);
    }

    boundary(pos){
        return (pos[0]>=0 && pos[0]<8 && pos[1]>=0 && pos[1]<8);
    }
}

Board.MOVES={
    38:[0,-1],
    37:[-1,0],
    40:[0,1],
    39:[1,0]
};
Board.WIDTH=60;
