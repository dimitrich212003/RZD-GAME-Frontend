import { defineStore } from "pinia";
import axios from "axios";

export const useAchievementsStore = defineStore("achievementsStore", {
    state: () => ({
        achievements: [
            {
                id: 1,
                name: "Новичок диспетчер",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Наберите 500 очков в Лисенке диспетчере",
            },
            {
                id: 2,
                name: "Мастер комбинаций",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Наберите 5000 очков в Лисенке диспетчере",
            },

            {
                id: 3,
                name: "Охотник за ураганами",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Наберите 300 очков в Лисенке машинисте",
            },
            {
                id: 4,
                name: "Паровозик, который смог",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Соберите все монетки в Лисенке машинисте",
            },

            {
                id: 5,
                name: "Начинающий путеец",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Пройдите 3 уровня в Лисенке путейце",
            },
            {
                id: 6,
                name: "Великий укладчик",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Пройдите 15 уровней в Лисенке путейце",
            },

            {
                id: 7,
                name: "Хранитель багажа",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Поймайте 50 сумок в Лисенке проводнике",
            },
            {
                id: 8,
                name: "Без единого падения",
                unlocked: false,
                img: "/img/achievementUnlocked.png",
                lockedImg: "/img/achievementLocked.png",
                description: "Пройдите все уровни в Лисенке проводнике",
            },
        ],
        templates: [
        ]
    }),
    actions: {
        async unlockAchievement(foxId, achievementId) {
            try {
                const achievement = this.achievements.find(a => a.id === achievementId);
                if (!achievement) return;

                await axios.put(`http://localhost:8585/api/achievement/${foxId}/unlock`, achievementId,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                achievement.unlocked = true;
            } catch (error) {
                console.error('Ошибка разблокировки:', error);
                throw error;
            }
        },
        async syncAchievements(foxId) {
            try {
                const response = await axios.get(`http://localhost:8585/api/achievement/${foxId}`);                response.data.forEach(serverAchievement => {
                    const localAchievement = this.achievements.find(a => a.id === serverAchievement.code);
                    if (localAchievement) {
                        localAchievement.unlocked = serverAchievement.unlocked;
                    }
                });
            } catch (error) {
                console.error('Ошибка синхронизации достижений:', error);
                throw error;
            }
        }
    },
});
