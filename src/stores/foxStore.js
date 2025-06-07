import { defineStore } from 'pinia';
import axios from "axios";

function persistPlugin({ store }) {
    store.$subscribe((mutation, state) => {
        localStorage.setItem('foxStore', JSON.stringify(state));
    });
}

export const useFoxStore = defineStore('foxStore', {
    state: () => ({
        foxName: '',
        totalCoins: 0,
        foxId: null
    }),
    actions: {
        setFoxId(id) {
            this.foxId = id;
        },
        setFoxName(name) {
            this.foxName = name;
        },
        setCoins(totalCoins) {
            this.totalCoins = totalCoins;
        },
        async addCoins(amount) {
            if (amount <= 0) {
                console.warn('Попытка добавить некорректное количество монет:', amount);
                return;
            }

            this.totalCoins += amount;

            if (!this.foxId) {
                console.error('Fox ID не сохранено');
                return;
            }

            try {
                const response = await axios.put(
                    `http://localhost:8585/api/fox/addCoins/${this.foxId}`,
                    amount,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                this.totalCoins = response.data.coins;
            } catch (error) {
                this.totalCoins -= amount;
                this.error = error.response?.data?.message || 'Failed to add coins';
            }
        },
        resetCoins() {
            this.totalCoins = 0;
        },
        loadFromLocalStorage() {
            const data = localStorage.getItem('foxStore');
            if (data) {
                const parsed = JSON.parse(data);
                this.foxName = parsed.foxName || '';
                this.totalCoins = parsed.totalCoins ?? 0;
                this.foxId = parsed.foxId || null;
            }
        },
        initFox(data) {
            this.foxName = data.name;
            this.totalCoins = data.coins;
            this.foxId = data.id;
        }
    },
    plugins: [persistPlugin],
});
