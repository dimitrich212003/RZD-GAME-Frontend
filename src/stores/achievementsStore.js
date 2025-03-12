import { defineStore } from "pinia";

export const useAchievementsStore = defineStore("achievementsStore", {
    state: () => ({
        achievements: [
            { id: 1, name: "Достижение №1", unlocked: true, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png" },
            { id: 2, name: "Достижение №2", unlocked: true, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png" },
            { id: 3, name: "Достижение №3", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png" },
        ],
    }),
});
