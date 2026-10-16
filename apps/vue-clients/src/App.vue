<script setup lang="ts">
import { RemoteLayout } from "@demo/vue-shared";
</script>

<template>
  <RemoteLayout app-name="Vue 1 · Relation clients" badge="Vue 3">
    <template #nav>
      <RouterLink to="/clients">Clients</RouterLink>
      <!-- Links to another application: the shell decides which remote renders them. -->
      <RouterLink to="/rapports">Rapports</RouterLink>
      <RouterLink to="/parametres">Paramètres</RouterLink>
    </template>
    <RouterView />
  </RemoteLayout>
</template>
