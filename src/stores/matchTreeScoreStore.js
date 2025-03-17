import { defineStore } from 'pinia';

export const useScoreStore = defineStore('score', {
    state: () => ({
        score: 0,
    }),
    actions: {
        addScore(amount) {
            this.score += amount;
        },
        resetScore() {
            this.score = 0;
        }
    },
});
