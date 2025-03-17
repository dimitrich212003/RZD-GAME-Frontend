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
        totalCoins: 250,
    }),
    actions: {
        setFoxName(name) {
            this.foxName = name;
        },
        addCoins(amount) {
            this.totalCoins += amount;
        },
        resetCoins() {
            this.totalCoins = 0;
        },
        loadFromLocalStorage() {
            const data = localStorage.getItem('foxStore');
            if (data) {
                const parsed = JSON.parse(data);
                this.foxName = parsed.foxName || '';
                this.totalCoins = parsed.totalCoins ?? 0; // Загружаем монеты или 0
            }
        },
    },
    // Автоматически вызываем плагин
    plugins: [persistPlugin],
});
