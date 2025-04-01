import { defineStore } from 'pinia'

export const useWolfEggsScoreStore = defineStore('wolfAndEggsStore', {
    state: () => ({
        score: 0,
        wolfEggsBestScore: 0,
    }),
    actions: {
        addScore(amount) {
            this.score += amount;
            if(this.score > this.wolfEggsBestScore) {
                this.wolfEggsBestScore = this.score;
            }
        },
        resetScore() {
            this.score = 0;
        }
    },
});
