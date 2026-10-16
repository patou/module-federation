<script setup lang="ts">
import { RemoteLayout } from "@demo/vue-shared";
</script>

<template>
  <RemoteLayout app-name="Vue 2 · Back-office" badge="Vue 3">
    <template #nav>
      <RouterLink to="/rapports">Rapports</RouterLink>
      <RouterLink to="/parametres">Paramètres</RouterLink>
      <!-- Link to another application: the shell decides which remote renders it. -->
      <RouterLink to="/clients">Clients</RouterLink>
    </template>
    <RouterView />
  </RemoteLayout>
</template>
