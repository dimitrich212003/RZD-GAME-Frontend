<template>
  <div class="select-difficulty-header">
    <img
        class="logo"
        src="@/assets/logo_rjd.png"
        alt="Логотип РЖД"
    />
  </div>
</template>

<script>
export default {
  name: "Logo"
}
</script>

<style scoped>
.select-difficulty-header {
  display: block;
  padding: 2rem;
  text-align: left;
}

.select-difficulty-header .logo {
  display: block;
  width: 200px;
  height: auto;
}

@media (max-width: 768px) {
  .select-difficulty-header .logo {
    width: 160px;
  }
}

@media (max-width: 480px) {
  .select-difficulty-header .logo {
    width: 140px;
  }

  .select-difficulty-header {
    padding: 3rem 0rem 1rem 2rem;
  }
}
</style>