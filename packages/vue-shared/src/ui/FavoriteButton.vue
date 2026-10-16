<script setup lang="ts">
import { computed } from "vue";
import { useFavorites } from "../composables/useFavorites";

const props = defineProps<{ clientId: string }>();
const favorites = useFavorites();
const active = computed(() => favorites.has(props.clientId));
</script>

<template>
  <button type="button" :aria-pressed="active" @click="favorites.toggle(clientId)">
    {{ active ? "★ Favori" : "☆ Ajouter aux favoris" }}
  </button>
</template>

<style scoped>
button { padding: 4px 10px; border: 1px solid #d7c28a; border-radius: 6px; background: #fff; color: #7a5a00; font: 600 13px system-ui, sans-serif; cursor: pointer; }
button[aria-pressed="true"] { background: #fff4cf; }
button:focus-visible { outline: 3px solid #087653; outline-offset: 2px; }
</style>
