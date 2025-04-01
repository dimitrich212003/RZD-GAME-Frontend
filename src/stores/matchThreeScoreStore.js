import { defineStore } from 'pinia';
import { useAchievementsStore } from '@/stores/achievementsStore';

export const useMatchThreeScoreStore = defineStore('matchThreeStore', {
    state: () => ({
        score: 0,
        matchThreeBestScore: 0,
    }),
    actions: {
        addScore(amount) {
            this.score += amount;

            if(this.score > this.matchThreeBestScore) {
                this.matchThreeBestScore = this.score;
            }

            const achievementsStore = useAchievementsStore();
            if (this.score >= 500) {
                achievementsStore.unlockAchievement(1);
            }
            if (this.score >= 5000) {
                achievementsStore.unlockAchievement(2);
            }
        },
        resetScore() {
            this.score = 0;
        }
    },
});
