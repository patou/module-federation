<script setup lang="ts">
import { ClientCard, PageHeader, useClientList } from "@demo/vue-shared";

const clients = useClientList();
</script>

<template>
  <PageHeader heading="Clients" subtitle="Cartes, badges et favoris viennent des bibliothèques partagées." />
  <div v-if="clients" class="grid">
    <ClientCard v-for="client in clients" :key="client.id" :client="client" />
  </div>
  <p v-else>Chargement des clients…</p>
</template>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: 18px; }
</style>
