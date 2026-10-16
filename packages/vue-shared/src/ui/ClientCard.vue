<script setup lang="ts">
import { formatCurrency, type Client } from "@demo/shared";
import FavoriteButton from "./FavoriteButton.vue";

defineProps<{ client: Client }>();
</script>

<template>
  <article class="client-card">
    <div class="top">
      <demo-status-badge :status="client.status" />
      <FavoriteButton :client-id="client.id" />
    </div>
    <h3>{{ client.name }}</h3>
    <p>{{ client.company }} · {{ client.city }}</p>
    <p class="revenue">{{ formatCurrency(client.revenue) }}</p>
    <RouterLink :to="{ path: `/clients/${client.id}`, query: { source: 'liste' }, hash: '#fiche' }">
      Voir la fiche de {{ client.name }} →
    </RouterLink>
  </article>
</template>

<style scoped>
.client-card { height: 100%; padding: 20px; border: 1px solid #d4eadf; border-radius: 10px; background: #fff; box-sizing: border-box; }
.top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
h3 { margin: 12px 0 4px; font-size: 18px; color: #173b31; }
p { margin: 4px 0; color: #4f6b62; }
.revenue { font-weight: 700; color: #173b31; }
a { display: inline-block; margin-top: 10px; color: #087653; font-weight: 600; }
a:focus-visible { outline: 3px solid #087653; outline-offset: 3px; }
</style>
