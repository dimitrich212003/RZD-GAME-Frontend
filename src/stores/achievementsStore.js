import { defineStore } from "pinia";

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
    }),
    actions: {
        unlockAchievement(achievementId) {
            const achievement = this.achievements.find(a => a.id === achievementId);
            if (achievement && !achievement.unlocked) {
                achievement.unlocked = true;
            }
        },
    },
});
