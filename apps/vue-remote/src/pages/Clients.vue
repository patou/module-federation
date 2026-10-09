<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<template>
  <h1>Clients</h1>
  <p>La liste est maintenant implémentée en Vue. Le détail peut encore être Angular.</p>
  <ul>
    <li><RouterLink :to="{ path: '/clients/1', query: { source: 'liste' }, hash: '#fiche' }">Alice Martin</RouterLink></li>
    <li><RouterLink to="/clients/2">Karim Bernard</RouterLink></li>
  </ul>
  <RouterLink to="/rapports">Voir les rapports</RouterLink>
</template>
