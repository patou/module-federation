<script setup lang="ts">
import { useRoute } from "vue-router";
import { formatCurrency, formatDate } from "@demo/shared";
import { FavoriteButton, PageHeader, useClient } from "@demo/vue-shared";

const route = useRoute();
const { client, loading } = useClient(() => String(route.params.id));
</script>

<template>
  <RouterLink class="back" to="/clients">← Retour aux clients</RouterLink>
  <p v-if="loading">Chargement de la fiche…</p>
  <template v-else-if="client">
    <div id="fiche">
      <PageHeader :heading="client.name" :subtitle="`Fiche client · #${client.id}`">
        <FavoriteButton :client-id="client.id" />
      </PageHeader>
    </div>
    <article>
      <demo-status-badge :status="client.status" />
      <dl>
        <dt>Entreprise</dt><dd>{{ client.company }}</dd>
        <dt>Ville</dt><dd>{{ client.city }}</dd>
        <dt>Adresse e-mail</dt><dd>{{ client.email }}</dd>
        <dt>Client depuis</dt><dd>{{ formatDate(client.since) }}</dd>
        <dt>Chiffre d’affaires</dt><dd>{{ formatCurrency(client.revenue) }}</dd>
      </dl>
      <p>Source : {{ route.query.source ?? "accès direct" }} · fragment : {{ route.hash || "aucun" }}</p>
    </article>
  </template>
  <PageHeader v-else heading="Client introuvable" subtitle="Cette fiche n’existe pas dans la démonstration." />
</template>

<style scoped>
.back { display: inline-block; margin-bottom: 18px; color: #087653; font-weight: 600; }
article { padding: 22px; border: 1px solid #d4eadf; border-radius: 10px; background: #fff; }
dl { display: grid; grid-template-columns: minmax(130px, 1fr) 2fr; gap: 12px; margin: 16px 0; }
dt { color: #4f6b62; }
dd { margin: 0; overflow-wrap: anywhere; }
p { color: #4f6b62; }
a:focus-visible { outline: 3px solid #087653; outline-offset: 3px; }
@media (max-width: 500px) { dl { grid-template-columns: 1fr; gap: 4px; } dd { margin-bottom: 10px; } }
</style>
