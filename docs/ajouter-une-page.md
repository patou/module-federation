# Ajouter une page dans les deux remotes

Ce tutoriel ajoute `/aide`. Il faut enregistrer la route dans chaque remote et déclarer son propriétaire dans le shell. Les composants utilisent uniquement les liens natifs : aucune connaissance du shell ou de Module Federation n’est nécessaire.

## 1. Créer la page Vue

Créez `apps/vue-remote/src/pages/Help.vue` :

```vue
<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <h1>Aide</h1>
  <p>Retrouvez ici les informations utiles.</p>
  <RouterLink to="/clients">Retour aux clients</RouterLink>
</template>
```

Dans [router.ts](../apps/vue-remote/src/router.ts), importez le composant puis ajoutez la route avant l’attrape-tout :

```ts
import Help from "./pages/Help.vue";
// Dans routes :
{ path: "/aide", component: Help },
```

## 2. Créer le composant Angular

Créez `apps/angular-remote/src/app/pages/help/help.component.ts` :

```ts
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "angular-help",
  imports: [RouterLink],
  templateUrl: "./help.component.html",
  styleUrl: "../page.css",
})
export class HelpComponent {}
```

Puis `help.component.html` dans le même dossier :

```html
<header><h2>Aide</h2><p>Retrouvez ici les informations utiles.</p></header>
<a routerLink="/clients">Retour aux clients</a>
```

Angular 21 utilise les composants standalone par défaut. L’import `RouterLink` est celui d’Angular, pas une directive du projet.

Dans [app.routes.ts](../apps/angular-remote/src/app/app.routes.ts), importez le composant puis ajoutez sa route avant `**` :

```ts
import { HelpComponent } from "./pages/help/help.component";
// Dans routes :
{ path: "aide", component: HelpComponent },
```

Les routes Angular s’écrivent sans slash initial. Vous pouvez ajouter un lien `routerLink="/aide"` au menu interne dans [app.component.html](../apps/angular-remote/src/app/app.component.html), si souhaité.

## 3. Choisir le propriétaire dans le shell

Ajoutez à [route-ownership.ts](../apps/shell/src/route-ownership.ts) :

```ts
{
  path: "/aide",
  label: "Aide",
  owners: { angular: "angular", partial: "vue", vue: "vue" },
},
```

Le menu principal est dérivé des routes statiques : l’entrée apparaît automatiquement. Les routes paramétrées ne deviennent pas des liens de menu.

## 4. Routes paramétrées et query strings

Pour `/aide/:section`, déclarez `aide/:section` dans Angular, `/aide/:section` dans Vue et dans la table du shell. Lisez le paramètre avec `ActivatedRoute` ou `useRoute`. Exemple de liens natifs :

```html
<!-- Angular : RouterLink construit l’URL et ses paramètres -->
<a [routerLink]="['/aide', 'navigation']"
   [queryParams]="{ source: 'menu' }" fragment="exemples">Navigation</a>
```

```vue
<RouterLink :to="{
  path: '/aide/navigation',
  query: { source: 'menu' },
  hash: '#exemples'
}">Navigation</RouterLink>
```

La query et le fragment sont transmis au remote sélectionné, mais ne changent pas le propriétaire. Les gardes de délégation sont installées uniquement en mode intégré ; ces templates restent identiques en mode autonome.

## 5. Vérifier

```sh
npm test
npm run typecheck
npm run build
```

- Ouvrez `/aide` sur les ports 5001 et 5002 pour vérifier les applications autonomes.
- Ouvrez `/aide` sur le port 5000 et changez les scénarios.
- Vérifiez le menu, le retour aux clients, précédent/suivant et l’accès direct après rechargement.
- Pour la route paramétrée, vérifiez `/aide/navigation?source=menu#exemples`.
- Ajoutez les cas pertinents aux tests : la propriété des routes et le pont de navigation sont déjà couverts dans [tests/](../tests/).

Changer le propriétaire ne convertit pas le code Angular en Vue ; cela change uniquement l’application qui affiche l’URL.
