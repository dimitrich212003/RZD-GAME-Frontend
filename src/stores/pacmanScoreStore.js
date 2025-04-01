import { defineStore } from 'pinia'
import {useAchievementsStore} from "@/stores/achievementsStore";

export const usePacmanScoreStore = defineStore('pacmanStore', {
    state: () => ({
        score: 0,
        pacmanBestScore: 0,
    }),
    actions: {
        addScore(amount) {
            this.score += amount;

            if(this.score > this.pacmanBestScore) {
                this.pacmanBestScore = this.score;
            }

            const achievementsStore = useAchievementsStore();
            if (this.score >= 300) {
                achievementsStore.unlockAchievement(3);
            }
            if (this.score >= 709) {
                achievementsStore.unlockAchievement(4);
            }

        },
        resetScore() {
            this.score = 0;
        }
    },
});
