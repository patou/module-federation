<template>
  <section class="vue-remote">
    <p class="technology">Application Vue 3 · version migrée</p>
    <RouterView />
  </section>
</template>

<style scoped>
.vue-remote { font-family: system-ui, sans-serif; color: #173b31; padding: 24px; background: #f0fdf7; border: 1px solid #b8e8d0; border-radius: 12px; }
.technology { font-size: 13px; font-weight: 700; color: #16805c; }
.vue-remote :deep(a) { color: #087653; }
.vue-remote :deep(li) { margin: 12px 0; }
</style>
