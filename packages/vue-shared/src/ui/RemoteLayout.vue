<script setup lang="ts">
defineProps<{ appName: string; badge: string }>();
</script>

<template>
  <section class="remote-layout">
    <header>
      <div>
        <span class="eyebrow">APPLICATION VUE</span>
        <h1>{{ appName }}</h1>
      </div>
      <span class="badge">{{ badge }}</span>
    </header>
    <nav :aria-label="`Navigation ${appName}`"><slot name="nav" /></nav>
    <div class="content"><slot /></div>
    <footer>Mise en page fournie par @demo/vue-shared · rendu sans iframe.</footer>
  </section>
</template>

<style scoped>
.remote-layout { overflow: hidden; border: 1px solid #b8e8d0; border-radius: 16px; background: #fff; color: #173b31; font: 16px/1.55 system-ui, -apple-system, sans-serif; }
header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px 28px; background: #eaf8f1; }
h1 { margin: 4px 0 0; font-size: 25px; }
.eyebrow { color: #0b6b4c; font-size: 11px; font-weight: 750; letter-spacing: .12em; }
.badge { padding: 5px 11px; border-radius: 6px; background: #16805c; color: #fff; font-size: 13px; white-space: nowrap; }
nav { display: flex; flex-wrap: wrap; gap: 8px; padding: 14px 28px; border-bottom: 1px solid #dcefe6; }
nav :slotted(a) { padding: 6px 14px; border-radius: 6px; color: #3d5a51; font-weight: 600; text-decoration: none; }
nav :slotted(a:hover) { background: #effaf5; }
nav :slotted(a.router-link-active) { background: #d5f1e4; color: #0b6b4c; }
nav :slotted(a:focus-visible) { outline: 3px solid #087653; outline-offset: 3px; }
.content { padding: 26px 28px; }
footer { padding: 14px 28px; border-top: 1px solid #dcefe6; color: #5f746d; font-size: 12px; }
@media (max-width: 600px) {
  header, .content { padding: 20px 16px; }
  nav, footer { padding: 14px 16px; }
}
</style>
