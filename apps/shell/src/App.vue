<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import RemoteOutlet from "./RemoteOutlet.vue";
import { ownerFor, routeOwnership, type Scenario } from "./route-ownership";

const route = useRoute();
const scenario = ref<Scenario>("partial");
const owner = computed(() => ownerFor(route.fullPath, scenario.value));
const menu = routeOwnership.filter((entry) => !entry.path.includes(":"));
</script>

<template>
  <header>
    <strong>Migration progressive · Angular → Vue</strong>
    <span>Shell Vue permanent</span>
  </header>
  <div class="layout">
    <aside>
      <nav aria-label="Navigation principale">
        <RouterLink v-for="item in menu" :key="item.path" :to="item.path">
          {{ item.label }}
          <small>{{ item.owners[scenario] }}</small>
        </RouterLink>
      </nav>
      <label for="scenario">Scénario de démonstration</label>
      <select id="scenario" v-model="scenario">
        <option value="angular">Avant : tout Angular</option>
        <option value="partial">Pendant : liste clients en Vue</option>
        <option value="vue">Après : tout Vue</option>
      </select>
      <p>La sélection modifie le propriétaire de l’URL, pas l’URL elle-même.</p>
    </aside>
    <main>
      <div class="status">
        <code>{{ route.fullPath }}</code>
        <strong data-testid="owner">{{ owner ?? "aucun remote" }}</strong>
      </div>
      <RemoteOutlet :owner="owner" :path="route.fullPath" />
      <details>
        <summary>Répartition des URL</summary>
        <ul><li v-for="item in routeOwnership" :key="item.path"><code>{{ item.path }}</code> → {{ item.owners[scenario] }}</li></ul>
      </details>
    </main>
  </div>
</template>

<style>
body { margin: 0; background: #f6f7fb; color: #202638; font-family: system-ui, sans-serif; }
* { box-sizing: border-box; }
</style>
<style scoped>
header { background: #202638; color: white; padding: 22px 28px; display: flex; justify-content: space-between; gap: 20px; }
header span { font-size: 13px; }
.layout { display: grid; grid-template-columns: 260px 1fr; min-height: calc(100vh - 70px); }
aside { background: white; padding: 24px; border-right: 1px solid #dde1eb; }
nav { display: grid; gap: 8px; margin-bottom: 32px; }
nav a { display: flex; justify-content: space-between; padding: 12px; border-radius: 6px; text-decoration: none; color: #202638; }
nav .router-link-active { background: #e8edff; }
small { color: #5c6683; }
label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; }
select { width: 100%; padding: 8px; }
aside p { color: #5c6683; font-size: 13px; line-height: 1.6; }
main { padding: 28px; min-width: 0; }
.status { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.status strong { background: #e5e9f6; border-radius: 16px; padding: 3px 12px; }
details { margin-top: 24px; }
details li { margin: 8px 0; }
@media (max-width: 720px) {
  .layout { grid-template-columns: 1fr; }
  header { flex-direction: column; }
  aside { border-right: none; }
  nav { grid-template-columns: repeat(3, 1fr); margin-bottom: 16px; }
}
</style>
