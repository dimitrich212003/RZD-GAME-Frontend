import { gsap } from "gsap";
import { App } from "@/games/match3/system/App.js";

export class Tile {
    constructor(color) {
        this.color = color;
        this.sprite = App.sprite(this.color);
        // anchor(0.5,0.5), чтобы (x,y) = центр тайла
        this.sprite.anchor.set(0.5);
    }

    setPosition(pos) {
        // Ставим в центр (pos.x, pos.y)
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }

    moveTo(pos, duration, delay = 0, ease = "linear") {
        return new Promise(resolve => {
            gsap.to(this.sprite, {
                duration,
                delay,
                ease,
                pixi: {
                    x: pos.x,
                    y: pos.y
                },
                onComplete: () => resolve()
            });
        });
    }

    isNeighbour(otherTile) {
        // Соседние ячейки: row±1,col±1
        return (
            Math.abs(this.field.row - otherTile.field.row) +
            Math.abs(this.field.col - otherTile.field.col)
        ) === 1;
    }

    remove() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        if (this.field) {
            this.field.tile = null;
            this.field = null;
        }
    }

    fallDownTo(pos, delay) {
        // Немного «прыгает»
        return this.moveTo(pos, 0.5, delay, "bounce.out");
    }
}