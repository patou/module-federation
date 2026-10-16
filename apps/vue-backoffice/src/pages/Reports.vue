<script setup lang="ts">
import { computed } from "vue";
import { formatCurrency, summarize } from "@demo/shared";
import { PageHeader, useClientList, useFavorites } from "@demo/vue-shared";

const clients = useClientList();
const favorites = useFavorites();
const summary = computed(() => clients.value && summarize(clients.value, favorites.ids.value));
</script>

<template>
  <PageHeader heading="Rapports" subtitle="Indicateurs calculés par le service summarize() de @demo/shared." />
  <div v-if="summary" class="stats">
    <demo-stat-card label="Clients" :value="summary.total" hint="dans le portefeuille" />
    <demo-stat-card label="Actifs" :value="summary.active" hint="statut « Actif »" />
    <demo-stat-card label="Chiffre d’affaires" :value="formatCurrency(summary.revenue)" hint="cumulé" />
    <demo-stat-card label="Favoris" :value="summary.favorites" hint="état partagé entre applications" />
  </div>
  <p v-else>Calcul des indicateurs…</p>
</template>

<style scoped>
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 1fr)); gap: 16px; }
p { color: #4f6b62; }
</style>
