import { defineStore } from "pinia";

export const useAchievementsStore = defineStore("achievementsStore", {
    state: () => ({
        achievements: [
            { id: 1, name: "Достижение №1", unlocked: true, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 2, name: "Достижение №2", unlocked: true, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 3, name: "Достижение №3", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 4, name: "Достижение №4", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 5, name: "Достижение №5", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 6, name: "Достижение №6", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 7, name: "Достижение №7", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 8, name: "Достижение №8", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
            { id: 9, name: "Достижение №9", unlocked: false, img: "/img/achievementUnlocked.png", lockedImg: "/img/achievementLocked.png", description: "Сыграйте в мини-игру и наберите 50 очков!" },
        ],
    }),
});
