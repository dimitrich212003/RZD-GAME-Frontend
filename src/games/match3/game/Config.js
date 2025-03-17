import { Game } from "./Game";

export const Config = {
    loader: [
        { key: "bg", path: "/sprites/bg.png" },
        { key: "field", path: "/sprites/field.png" },
        { key: "field-selected", path: "/sprites/field-selected.png" },
        { key: "blue", path: "/sprites/blue.png" },
        { key: "green", path: "/sprites/green.png" },
        { key: "orange", path: "/sprites/orange.png" },
        { key: "pink", path: "/sprites/pink.png" },
        { key: "red", path: "/sprites/red.png" },
        { key: "yellow", path: "/sprites/yellow.png" },

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