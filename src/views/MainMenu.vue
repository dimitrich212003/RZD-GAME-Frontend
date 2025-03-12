<template>
  <div class="main-menu-container">
    <header class="top-bar">
      <Logo/>
    </header>
    <div class="games-grid">
      <GameCard
          v-for="game in games"
          :key="game.id"
          :title="game.title"
          :description="game.description"
          :image="game.image"
          :id="game.id"
          :bgColor="game.bgColor"
          :subTitleColor="game.subTitleColor"
          :imagePosition="game.imagePosition"
          :textPosition="game.textPosition"
          :aliIt="game.aliIt"
      />
    </div>
  </div>
  <NavBar activeTab="MainMenu" />
</template>

<script>
import GameCard from '../components/GameCard.vue';
import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";

export default {
  name: 'MainMenu',
  components: {
    NavBar,
    GameCard,
    Logo
  },
  setup() {

    const games = [
      {
        id: 'machinist',
        title: 'Лисёнок-машинист',
        description: 'Веди паровозик по рельсам, избегая препятствий!',
        image: 'fox_machinist.png',
        bgColor: '#00A0E3',
        subTitleColor: '#024660',
        imagePosition: 'right',
        textPosition: 'left',
        aliIt: 'flex-start'
      },
      {
        id: 'puteec',
        title: 'Лисёнок-путеец',
        description: 'Чини железную дорогу и расставляй рельсы правильно!',
        image: 'fox_puteec.png',
        bgColor: '#EE8016',
        subTitleColor: '#613C18',
        imagePosition: 'right',
        textPosition: 'left',
        aliIt: 'flex-start'
      },
      {
        id: 'dispatcher',
        title: 'Лисёнок-диспетчер',
        description: 'Управляй движением поездов избегая аварий!',
        image: 'fox_dispatcher.png',
        bgColor: '#009946',
        subTitleColor: '#003A1B',
        imagePosition: 'left',
        textPosition: 'right',
        aliIt: 'flex-end'
      },
      {
        id: 'provodnik',
        title: 'Лисёнок-проводник',
        description: 'Помогай пассажирам и следи за порядком в вагоне!',
        image: 'fox_provodnik.png',
        bgColor: '#036186',
        subTitleColor: '#012838',
        imagePosition: 'left',
        textPosition: 'right',
        aliIt: 'flex-end'
      },
    ];
    return {
      games,
    };
  },
};
</script>

<style scoped>
.main-menu-container {
  display: flex;
  flex-direction: column;
  height: 91vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  row-gap: 3rem;
  column-gap: 2rem;
  padding: 2.6rem 4rem;
}

@media (max-width: 1100px) {
  .games-grid {
    grid-template-columns: 1fr;
    padding: 2.6rem 2rem;
  }
}

@media (max-width: 615px) {
  .games-grid {
    padding: 2.6rem 1rem;
    row-gap: 2.5rem;
  }
}
</style>
