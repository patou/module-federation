<script setup lang="ts">
import { ref } from "vue";
import { PageHeader, useFavorites } from "@demo/vue-shared";

const favorites = useFavorites();
const notifications = ref(true);
</script>

<template>
  <PageHeader heading="Paramètres" subtitle="Préférences du back-office." />
  <div class="sections">
    <section>
      <h3>Favoris</h3>
      <p>{{ favorites.count.value }} client(s) en favori. Cet état est partagé avec le shell et toutes les applications.</p>
      <button type="button" :disabled="favorites.count.value === 0" @click="favorites.clear()">Vider les favoris</button>
    </section>
    <section>
      <h3>Notifications</h3>
      <label><input v-model="notifications" type="checkbox" /> Recevoir les alertes de suivi client</label>
    </section>
  </div>
</template>

<style scoped>
.sections { display: grid; gap: 18px; }
section { padding: 20px; border: 1px solid #d4eadf; border-radius: 10px; background: #fff; }
h3 { margin: 0 0 8px; font-size: 18px; }
p { color: #4f6b62; }
button { padding: 8px 14px; border: 0; border-radius: 6px; background: #16805c; color: #fff; font-weight: 600; cursor: pointer; }
button:disabled { background: #b8c0cc; cursor: not-allowed; }
button:focus-visible, input:focus-visible { outline: 3px solid #087653; outline-offset: 2px; }
</style>
