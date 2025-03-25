import { Game } from "./Game";

export const Config = {
    loader: [
        { key: "bg", path: "/matchThreeSprites/bg.png" },
        { key: "field", path: "/matchThreeSprites/field.png" },
        { key: "field-selected", path: "/matchThreeSprites/field-selected.png" },
        { key: "blue", path: "/matchThreeSprites/blue.png" },
        { key: "green", path: "/matchThreeSprites/green.png" },
        { key: "orange", path: "/matchThreeSprites/orange.png" },
        { key: "pink", path: "/matchThreeSprites/pink.png" },
        { key: "red", path: "/matchThreeSprites/red.png" },
        { key: "yellow", path: "/matchThreeSprites/yellow.png" },

    ],    startScene: Game,
    tilesColors: ['blue', 'green', 'orange', 'red', 'pink', 'yellow'],
    board: {
        rows: 10,
        cols: 6
    },
    combinationRules: [[
        {col: 1, row: 0}, {col: 2, row: 0},
    ], [
        {col: 0, row: 1}, {col: 0, row: 2},
    ]]
};