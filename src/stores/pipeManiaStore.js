import { defineStore } from 'pinia'
import { useAchievementsStore } from '@/stores/achievementsStore';


export const usePipeManiaScoreStore = defineStore('pipeManiaStore', {
    state: () => ({
        score: 0,
        coins: 0,
        pipeManiaBestScore: 0,
    }),
    actions: {
        addScore(amount) {
            this.score += amount

            if(this.score > this.pipeManiaBestScore) {
                this.pipeManiaBestScore = this.score;
            }

            const achievementsStore = useAchievementsStore();
            if (this.score >= 900) {
                achievementsStore.unlockAchievement(6);
            }
            if (this.score >= 4500) {
                achievementsStore.unlockAchievement(6);
            }
        },
        resetScore() {
            this.score = 0
        },

        addCoins(amount) {
            this.coins += amount
        },
        resetCoins() {
            this.coins = 0
        }
    }
})
