import { defineStore } from 'pinia';

export const useDifficultyStore = defineStore('difficultyStore', {
    state: () => ({
        difficultyLevel: null, // "easy" или "hard"
    }),
    actions: {
        setDifficulty(level) {
            this.difficultyLevel = level;
        },
    },
});