import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Field } from "./Field";
import { TileFactory } from "./TileFactory";

export class Board {
    constructor() {
        this.container = new PIXI.Container();

        this.fields = [];
        this.rows = App.config.board.rows;
        this.cols = App.config.board.cols;

        this.create();
        this.ajustPosition();
    }

    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
        this.fields.forEach(field => this.createTile(field));
    }

    createField(row, col) {
        const field = new Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
    }

    createTile(field) {
        const tile = TileFactory.generate();
        field.setTile(tile);
        this.container.addChild(tile.sprite);

        tile.sprite.interactive = true;
        tile.sprite.on("pointerdown", () => {
            this.container.emit("tile-touch-start", tile);
        });

        return tile;
    }

    getField(row, col) {
        return this.fields.find(f => f.row === row && f.col === col);
    }

    ajustPosition() {
        this.fieldSize = this.fields[0].sprite.width;
        this.width = this.cols * this.fieldSize;
        this.height = this.rows * this.fieldSize;
        let scaleFactor = 1;
        if (window.innerWidth < 500) {
            const scaleW = window.innerWidth / this.width;
            const scaleH = (window.innerHeight - 100) / this.height;
            scaleFactor = Math.min(scaleW, scaleH, 1);
        }

        this.container.scale.set(scaleFactor);

        const scaledWidth = this.width * scaleFactor;
        const scaledHeight = this.height * scaleFactor;

        this.container.x = (window.innerWidth - scaledWidth) / 2;
        this.container.y = (window.innerHeight - scaledHeight) / 2 - 50;
    }

    swap(tile1, tile2) {
        const f1 = tile1.field;
        const f2 = tile2.field;

        f1.tile = tile2;
        tile2.field = f1;

        f2.tile = tile1;
        tile1.field = f2;
    }
}