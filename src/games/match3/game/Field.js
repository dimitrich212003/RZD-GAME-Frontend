import { App } from "@/games/match3/system/App.js";

export class Field {
    constructor(row, col) {
        this.row = row;
        this.col = col;

        this.sprite = App.sprite("field");
        this.sprite.anchor.set(0.5);

        const fieldW = this.sprite.width;
        const fieldH = this.sprite.height;
        this.sprite.x = col * fieldW + fieldW / 2;
        this.sprite.y = row * fieldH + fieldH / 2;
        this.selected = App.sprite("field-selected");
        this.selected.anchor.set(0.5);
        this.selected.visible = false;
        this.sprite.addChild(this.selected);
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
        tile.setPosition({
            x: this.sprite.x,
            y: this.sprite.y
        });
    }

    get position() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
}