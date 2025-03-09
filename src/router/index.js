import { createRouter, createWebHistory } from 'vue-router';
import SelectDifficulty from '@/views/SelectDifficulty.vue';
import EnterName from "@/views/EnterName.vue";
import MainMenu from "@/views/MainMenu";
import Achievements from "@/views/Achievements";
import Profile from "@/views/Profile";
import GamePlay from "@/views/GamePlay";

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
    {
        path: '/',
        name: 'MainMenu',
        component: MainMenu,
    },
    {
        path: '/achievements',
        name: 'Achievements',
        component: Achievements,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
    },
    {
        path: '/game/:id',
        name: 'GamePlay',
        component: GamePlay,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;