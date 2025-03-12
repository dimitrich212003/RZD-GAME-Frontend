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
  // eslint-disable-next-line
  name: "Logo"
}
</script>

<style scoped>
/* Шапка */
.select-difficulty-header {
  display: block;
  padding: 2rem;
  text-align: left;
}

/* Логотип по умолчанию (Desktop) */
.select-difficulty-header .logo {
  display: block;
  width: 200px; /* Desktop: 200px */
  height: auto;
}

/* Tablet: уменьшим до 120px (примерный брейкпоинт 768px) */
@media (max-width: 768px) {
  .select-difficulty-header .logo {
    width: 160px;
  }
}

/* Mobile: ещё меньше – 80px (примерный брейкпоинт 480px) */
@media (max-width: 480px) {
  .select-difficulty-header .logo {
    width: 140px;
  }

  .select-difficulty-header {
    padding: 3rem 0rem 1rem 2rem;
  }
}
</style>