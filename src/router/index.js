import { createRouter, createWebHistory } from 'vue-router';
import SelectDifficulty from '@/views/SelectDifficulty.vue';
import EnterName from "@/views/EnterName.vue";
import MainMenu from "@/views/MainMenu";
import Achievements from "@/views/Achievements";
import Profile from "@/views/Profile";
import MatchThreeGame from "@/views/MatchThreeGame";
import PacmanGame from "@/views/PacmanGame";
import PipeManiaGame from "@/views/PipeManiaGame";
import WolfAndEggsGame from "@/views/WolfAndEggsGame";

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
        path: '/game/dispatcher',
        name: 'MatchThree',
        component: MatchThreeGame
    },
    {
        path: '/game/machinist',
        name: 'PacmanGame',
        component: PacmanGame
    },
    {
        path: '/game/puteec',
        name: 'PipeManiaGame',
        component: PipeManiaGame
    },
    {
        path: '/game/provodnik',
        name: 'WolfAndEggsGame',
        component: WolfAndEggsGame
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;