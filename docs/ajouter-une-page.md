# Ajouter une page dans un couple Angular / Vue

Ce tutoriel ajoute `/aide` au back-office : dans **Angular 2** (`apps/angular-backoffice`) et dans son équivalent migré **Vue 2** (`apps/vue-backoffice`). Il faut enregistrer la route dans chaque remote et déclarer son propriétaire dans le shell. Les composants utilisent uniquement les liens natifs et les composants des bibliothèques partagées : aucune connaissance du shell ou de Module Federation n’est nécessaire.

## 1. Créer le composant Angular

Créez `apps/angular-backoffice/src/app/pages/help/help.component.ts` :

```ts
import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FavoritesService, PageHeaderComponent } from "@demo/angular-shared";

@Component({
  selector: "angular-help",
  imports: [RouterLink, PageHeaderComponent],
  templateUrl: "./help.component.html",
  styleUrl: "./help.component.css",
})
export class HelpComponent {
  readonly favorites = inject(FavoritesService);
}
```

Puis `help.component.html` (et un `help.component.css`, éventuellement vide) dans le même dossier :

```html
<shared-page-header heading="Aide" subtitle="Retrouvez ici les informations utiles." />
<p>Vous suivez {{ favorites.count() }} client(s).</p>
<a routerLink="/clients">Voir les clients</a>
```

`RouterLink` est celui d’Angular. Le lien `/clients` pointe vers une autre application : le shell décidera qui l’affiche.

Dans [app.routes.ts](../apps/angular-backoffice/src/app/app.routes.ts), ajoutez la route avant `**` :

```ts
import { HelpComponent } from "./pages/help/help.component";
// Dans routes :
{ path: "aide", component: HelpComponent },
```

Les routes Angular s’écrivent sans slash initial. Ajoutez si souhaité `<a routerLink="/aide" routerLinkActive="active">Aide</a>` au menu interne dans [app.component.html](../apps/angular-backoffice/src/app/app.component.html).

## 2. Créer la page Vue

Créez `apps/vue-backoffice/src/pages/Help.vue` :

```vue
<script setup lang="ts">
import { PageHeader, useFavorites } from "@demo/vue-shared";

const favorites = useFavorites();
</script>

<template>
  <PageHeader heading="Aide" subtitle="Retrouvez ici les informations utiles." />
  <p>Vous suivez {{ favorites.count.value }} client(s).</p>
  <RouterLink to="/clients">Voir les clients</RouterLink>
</template>
```

Dans [routes.ts](../apps/vue-backoffice/src/routes.ts), ajoutez la route avant l’attrape-tout :

```ts
import Help from "./pages/Help.vue";
// Dans routes :
{ path: "/aide", component: Help },
```

Ajoutez si souhaité `<RouterLink to="/aide">Aide</RouterLink>` dans le slot `#nav` de [App.vue](../apps/vue-backoffice/src/App.vue).

Les deux pages lisent le même store de favoris (`@demo/shared`) via leur adaptateur de framework. Si la page a besoin d’une nouvelle logique métier, ajoutez-la d’abord dans `@demo/shared` pour l’écrire une seule fois (voir [Partage de code](partage-de-code.md#ajouter-un-élément-partagé)).

## 3. Choisir le propriétaire dans le shell

Ajoutez à [route-ownership.ts](../apps/shell/src/route-ownership.ts) :

```ts
{ path: "/aide", label: "Aide",
  owners: { angular: "angular-backoffice", partial: "vue-backoffice", vue: "vue-backoffice" } },
```

Le menu principal est dérivé des routes statiques : l’entrée apparaît automatiquement. Les routes paramétrées ne deviennent pas des liens de menu.

> Une **nouvelle application** (et non une nouvelle page) demande en plus : une entrée dans `remoteApps` de [public-bases.ts](../build/public-bases.ts), une valeur dans `RemoteName`, un loader dans [RemoteOutlet.vue](../apps/shell/src/RemoteOutlet.vue), une déclaration dans [remotes.d.ts](../apps/shell/src/remotes.d.ts) et ses scripts `dev`/`preview` dans le `package.json` racine. Le plus simple est de copier une application existante du même framework.

## 4. Routes paramétrées et query strings

Pour `/aide/:section`, déclarez `aide/:section` dans Angular, `/aide/:section` dans Vue et dans la table du shell. Lisez le paramètre avec `ActivatedRoute` côté Angular et `useRoute` côté Vue. Exemple de liens natifs :

```html
<!-- Angular -->
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

- Ouvrez `/aide` sur les ports 5003 (Vue 2) et 5004 (Angular 2) pour vérifier les applications autonomes.
- Ouvrez `/aide` sur le port 5000 et changez les scénarios.
- Vérifiez le menu, le lien vers les clients, précédent/suivant et l’accès direct après rechargement.
- Ajoutez les cas pertinents aux tests de [tests/](../tests/), notamment la propriété de la nouvelle route.

Changer le propriétaire ne convertit pas le code Angular en Vue ; cela change uniquement l’application qui affiche l’URL.
