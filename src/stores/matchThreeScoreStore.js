import { defineStore } from 'pinia';
import { useAchievementsStore } from '@/stores/achievementsStore';
import { useFoxStore } from '@/stores/foxStore';
import axios from 'axios';


export const useMatchThreeScoreStore = defineStore('matchThreeStore', {
    state: () => ({
        score: 0,
        matchThreeBestScore: 0,
    }),
    actions: {
        addScore(amount) {
            const foxStore = useFoxStore();

            if (!foxStore.foxId) {
                console.error('Fox ID не найден!');
                return;
            }

            this.score += amount;

            if(this.score > this.matchThreeBestScore) {
                this.matchThreeBestScore = this.score;
                this.updateGameRecord(this.matchThreeBestScore);
            }

            const achievementsStore = useAchievementsStore();
            if (this.score >= 500) {
                achievementsStore.unlockAchievement(foxStore.foxId,1);
            }
            if (this.score >= 5000) {
                achievementsStore.unlockAchievement(foxStore.foxId,2);
            }
        },
        resetScore() {
            this.score = 0;
        },
        setMatchThreeBestScore(score) {
            this.matchThreeBestScore = score;
        },

        async updateGameRecord(score) {
            const foxStore = useFoxStore(); // ← Создаём локальную переменную

            if (!foxStore.foxId) {
                console.error('Fox ID не найден!');
                return;
            }

            try {
                const requestDTO = {
                    game: 'matchThreeStore',
                    score: score,
                };

                const response = await axios.put(
                    `http://localhost:8585/api/record/${foxStore.foxId}`,
                    requestDTO
                );
                console.log('Рекорд обновлен на сервере', response.data);
            } catch (error) {
                console.error('Ошибка при обновлении рекорда на сервере:', error);
            }
        },
    },
});
