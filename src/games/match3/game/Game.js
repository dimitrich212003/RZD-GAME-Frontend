// src/games/match3/game/Game.js
import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Board } from "./Board";
import { CombinationManager } from "./CombinationManager";

export class Game {
    constructor() {
        this.container = new PIXI.Container();
        this.scoreStore = App.config.scoreStore;
        this.foxStore = App.config.foxStore;

        // Reset score
        if (this.scoreStore) {
            this.scoreStore.resetScore();
        }

        this.initPhase = true; // флаг, что мы в стартовой чистке
        this.resolveBoardSize();

        this.board = new Board();
        this.container.addChild(this.board.container);

        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));
        this.combinationManager = new CombinationManager(this.board);

        // чистим стартовые совпадения
        this.removeStartMatches();

        // в конце конструктора — отключаем initPhase
        this.initPhase = false;
    }

    endGame() {
        // 1) Получаем финальный счёт
        const finalScore = this.scoreStore.score;

        // 2) Вычисляем монетки: round(score * 0.01)
        const gainedCoins = Math.round(finalScore * 0.01);

        // 3) Зачисляем монетки в FoxStore
        if (this.foxStore) {
            this.foxStore.addCoins(gainedCoins);
        }

        // 4) Сообщаем Vue-компоненту (через событие) сколько монеток
        this.board.container.emit("game-over", {
            finalScore,
            gainedCoins
        });
    }

    removeMatches(matches) {
        let totalTiles = 0;
        matches.forEach(match => {
            totalTiles += match.length;
            match.forEach(tile => tile.remove());
        });

        // Начисляем очки, только если не initPhase
        if (!this.initPhase && this.scoreStore) {
            this.scoreStore.addScore(totalTiles * 10);
        }
    }

    // Пример: если ширина экрана < 768 => 6x10, иначе 8x8
    resolveBoardSize() {
        if (window.innerWidth < 505) {
            App.config.board.rows = 9;
            App.config.board.cols = 5;
        }
        else if (window.innerWidth < 768) {
            App.config.board.rows = 10;
            App.config.board.cols = 6;
        } else {
            App.config.board.rows = 8;
            App.config.board.cols = 8;
        }
    }

    // Если вам нужно было background:
    // createBackground() {
    //   this.bg = App.sprite("bg");
    //   this.bg.width = window.innerWidth;
    //   this.bg.height = window.innerHeight;
    //   this.container.addChild(this.bg);
    // }

    removeStartMatches() {
        let matches = this.combinationManager.getMatches();

        while (matches.length) {
            this.removeMatches(matches);

            const fields = this.board.fields.filter(field => field.tile === null);
            fields.forEach(field => {
                this.board.createTile(field);
            });

            matches = this.combinationManager.getMatches();
        }
    }

    onTileClick(tile) {
        if (this.disabled) return;
        if (this.selectedTile) {
            if (!this.selectedTile.isNeighbour(tile)) {
                // не соседняя плитка
                this.clearSelection(tile);
                this.selectTile(tile);
            } else {
                // swap
                this.swap(this.selectedTile, tile);
            }
        } else {
            // первая плитка
            this.selectTile(tile);
        }
    }

    swap(selectedTile, tile, reverse) {
        this.disabled = true;
        selectedTile.sprite.zIndex = 2;

        selectedTile.moveTo(tile.field.position, 0.2);
        this.clearSelection();

        tile.moveTo(selectedTile.field.position, 0.2).then(() => {
            this.board.swap(selectedTile, tile);

            if (!reverse) {
                const matches = this.combinationManager.getMatches();
                if (matches.length) {
                    this.processMatches(matches);
                } else {
                    this.swap(tile, selectedTile, true);
                }
            } else {
                this.disabled = false;
            }
        });
    }

    processMatches(matches) {
        this.removeMatches(matches);

        // после удаления — заставляем плитки падать
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => this.onFallDownOver());
    }

    onFallDownOver() {
        const matches = this.combinationManager.getMatches();
        if (matches.length) {
            this.processMatches(matches);
        } else {
            this.disabled = false;
        }
    }

    addTiles() {
        return new Promise(resolve => {
            const fields = this.board.fields.filter(field => field.tile === null);
            let total = fields.length;
            let completed = 0;

            fields.forEach(field => {
                const tile = this.board.createTile(field);
                tile.sprite.y = -500;
                const delay = Math.random() * 2 / 10 + 0.3 / (field.row + 1);
                tile.fallDownTo(field.position, delay).then(() => {
                    ++completed;
                    if (completed >= total) resolve();
                });
            });
        });
    }

    processFallDown() {
        return new Promise(resolve => {
            let completed = 0;
            let started = 0;

            for (let row = this.board.rows - 1; row >= 0; row--) {
                for (let col = this.board.cols - 1; col >= 0; col--) {
                    const field = this.board.getField(row, col);
                    if (!field.tile) {
                        ++started;
                        this.fallDownTo(field).then(() => {
                            ++completed;
                            if (completed >= started) resolve();
                        });
                    }
                }
            }
        });
    }

    fallDownTo(emptyField) {
        for (let row = emptyField.row - 1; row >= 0; row--) {
            let fallingField = this.board.getField(row, emptyField.col);
            if (fallingField.tile) {
                const fallingTile = fallingField.tile;
                fallingTile.field = emptyField;
                emptyField.tile = fallingTile;
                fallingField.tile = null;
                return fallingTile.fallDownTo(emptyField.position);
            }
        }
        return Promise.resolve();
    }

    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedTile.field.select();
    }
}
