<script setup lang="ts">
defineProps<{ heading: string; subtitle?: string }>();
</script>

<template>
  <header class="page-header">
    <div>
      <h2>{{ heading }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="actions"><slot /></div>
  </header>
</template>

<style scoped>
.page-header { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
h2 { margin: 0 0 6px; font-size: 23px; color: #173b31; }
p { margin: 0; color: #4f6b62; }
.actions { display: flex; gap: 12px; }
</style>
