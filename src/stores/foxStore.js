import { defineStore } from 'pinia';

// Пример простого плагина для сохранения в localStorage
function persistPlugin({ store }) {
    store.$subscribe((mutation, state) => {
        localStorage.setItem('foxStore', JSON.stringify(state));
    });
}

export const useFoxStore = defineStore('foxStore', {
    state: () => ({
        foxName: '',
    }),
    actions: {
        setFoxName(name) {
            this.foxName = name;
        },
        loadFromLocalStorage() {
            const data = localStorage.getItem('foxStore');
            if (data) {
                const parsed = JSON.parse(data);
                this.foxName = parsed.foxName || '';
            }
        },
    },
    // Автоматически вызываем плагин
    plugins: [persistPlugin],
});