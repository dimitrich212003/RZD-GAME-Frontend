import { defineStore } from 'pinia'
import {useAchievementsStore} from "@/stores/achievementsStore";
import {useFoxStore} from "@/stores/foxStore";

export const usePacmanScoreStore = defineStore('pacmanStore', {
    state: () => ({
        score: 0,
        pacmanBestScore: 0,
    }),
    actions: {
        addScore(amount) {
            const foxStore = useFoxStore();

            if (!foxStore.foxId) {
                console.error('Fox ID не найден!');
                return;
            }

            this.score += amount;

            if(this.score > this.pacmanBestScore) {
                this.pacmanBestScore = this.score;
            }

            const achievementsStore = useAchievementsStore();
            if (this.score >= 300) {
                achievementsStore.unlockAchievement(foxStore.foxId,3);
            }
            if (this.score >= 709) {
                achievementsStore.unlockAchievement(foxStore.foxId,4);
            }

        },
        resetScore() {
            this.score = 0;
        }
    },
});
