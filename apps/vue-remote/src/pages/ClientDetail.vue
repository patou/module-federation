<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { RouterLink } from "vue-router";
const route = useRoute();
const clients: Record<string, string> = { "1": "Alice Martin", "2": "Karim Bernard" };
const name = computed(() => clients[String(route.params.id)]);
</script>
<template>
  <h1 id="fiche">{{ name ?? "Client introuvable" }}</h1>
  <p>Identifiant : {{ route.params.id }}</p>
  <p>Source : {{ route.query.source ?? "accès direct" }} · fragment : {{ route.hash || "aucun" }}</p>
  <RouterLink to="/clients">Retour aux clients</RouterLink>
</template>
