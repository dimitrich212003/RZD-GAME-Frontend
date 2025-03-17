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
        // Создаем все клетки (Field)
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createField(row, col);
            }
        }
        // Создаем тайлы
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

        // Включаем интерактив
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
        // Считаем логическую ширину/высоту
        this.fieldSize = this.fields[0].sprite.width; // ширина 1 ячейки
        this.width = this.cols * this.fieldSize;
        this.height = this.rows * this.fieldSize;

        // 1) Рассчитываем scaleFactor, если экран узкий
        let scaleFactor = 1;
        if (window.innerWidth < 500) {
            // подгоняем под ширину
            const scaleW = window.innerWidth / this.width;
            // подгоняем под высоту (с запасом 100px)
            const scaleH = (window.innerHeight - 100) / this.height;
            scaleFactor = Math.min(scaleW, scaleH, 1);
        }

        this.container.scale.set(scaleFactor);

        // 2) Рассчитываем итоговый размер
        const scaledWidth = this.width * scaleFactor;
        const scaledHeight = this.height * scaleFactor;

        // 3) Ставим по центру экрана
        this.container.x = (window.innerWidth - scaledWidth) / 2;
        this.container.y = (window.innerHeight - scaledHeight) / 2 - 50;
    }

    swap(tile1, tile2) {
        const f1 = tile1.field;
        const f2 = tile2.field;

        // Меняем ссылки
        f1.tile = tile2;
        tile2.field = f1;

        f2.tile = tile1;
        tile1.field = f2;
    }
}