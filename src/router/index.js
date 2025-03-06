import { createRouter, createWebHistory } from 'vue-router';
import SelectDifficulty from '@/views/SelectDifficulty.vue';
import EnterName from "@/views/EnterName.vue";

const routes = [
    {
        path: '/select-difficulty',
        name: 'SelectDifficulty',
        component: SelectDifficulty,
    },
    {
        path: '/enter-name',
        name: 'EnterName',
        component: EnterName,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;