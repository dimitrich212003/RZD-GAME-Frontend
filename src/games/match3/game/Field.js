import { App } from "@/games/match3/system/App.js";

export class Field {
    constructor(row, col) {
        this.row = row;
        this.col = col;

        // Фон клетки
        this.sprite = App.sprite("field");
        // Якорь (0.5, 0.5) – координаты (x,y) = центр текстуры
        this.sprite.anchor.set(0.5);

        // Ставим клетку так, чтобы её центр находился в клетке (col, row)
        // При col, row: x = col * width + width/2
        const fieldW = this.sprite.width;
        const fieldH = this.sprite.height;
        this.sprite.x = col * fieldW + fieldW / 2;
        this.sprite.y = row * fieldH + fieldH / 2;

        // Подсветка (selected)
        this.selected = App.sprite("field-selected");
        this.selected.anchor.set(0.5);
        this.selected.visible = false;
        this.sprite.addChild(this.selected);

        // Текущий тайл
        this.tile = null;
    }

    select() {
        this.selected.visible = true;
    }
    unselect() {
        this.selected.visible = false;
    }

    setTile(tile) {
        this.tile = tile;
        tile.field = this;
        // Ставим тайл в центр этой ячейки (такой же x,y)
        tile.setPosition({
            x: this.sprite.x,
            y: this.sprite.y
        });
    }

    // Можно вернуть «координаты центра» через getter
    get position() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
}