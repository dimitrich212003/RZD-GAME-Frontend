import { defineStore } from 'pinia';

function persistPlugin({ store }) {
    store.$subscribe((mutation, state) => {
        localStorage.setItem('foxStore', JSON.stringify(state));
    });
}

export const useDifficultyStore = defineStore('difficultyStore', {
    state: () => ({
        difficultyLevel: null
    }),
    actions: {
        setDifficulty(level) {
            this.difficultyLevel = level;
        },
    },
    plugins: [persistPlugin],
});