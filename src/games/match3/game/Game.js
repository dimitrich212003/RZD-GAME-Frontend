import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Board } from "./Board";
import { CombinationManager } from "./CombinationManager";

export class Game {
    constructor() {
        this.container = new PIXI.Container();
        this.scoreStore = App.config.scoreStore;
        this.foxStore = App.config.foxStore;

        if (this.scoreStore) {
            this.scoreStore.resetScore();
        }

        this.initPhase = true;
        this.resolveBoardSize();

        this.board = new Board();
        this.container.addChild(this.board.container);
        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));
        this.combinationManager = new CombinationManager(this.board);
        this.removeStartMatches();
        this.initPhase = false;
    }

    endGame() {
        const finalScore = this.scoreStore.score;
        const gainedCoins = Math.round(finalScore * 0.01);
        if (this.foxStore) {
            this.foxStore.addCoins(gainedCoins);
        }
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
        if (!this.initPhase && this.scoreStore) {
            this.scoreStore.addScore(totalTiles * 10);
        }
    }

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
                this.clearSelection(tile);
                this.selectTile(tile);
            } else {
                this.swap(this.selectedTile, tile);
            }
        } else {
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
