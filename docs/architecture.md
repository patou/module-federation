# Architecture et navigation

## Les applications

| Élément | Responsabilité |
| --- | --- |
| [Shell Vue](../apps/shell/src/App.vue) | Conserve le layout hôte, lit l’URL du navigateur, choisit le remote et fournit le menu de navigation principal. |
| [Angular 1 · Clients](../apps/angular-clients/src/app/app.routes.ts) | Pages historiques `/clients` et `/clients/:id`. |
| [Angular 2 · Back-office](../apps/angular-backoffice/src/app/app.routes.ts) | Pages historiques `/rapports` et `/parametres`. |
| [Vue 1 · Clients](../apps/vue-clients/src/routes.ts) | Pages migrées `/clients` et `/clients/:id`. |
| [Vue 2 · Back-office](../apps/vue-backoffice/src/routes.ts) | Pages migrées `/rapports` et `/parametres`. |

Chaque remote expose `./app` via Module Federation. Le shell les charge par leur nom fédéré : `vue_clients/app`, `angular_clients/app`, `vue_backoffice/app` et `angular_backoffice/app` (voir [RemoteOutlet.vue](../apps/shell/src/RemoteOutlet.vue)). Ports, noms fédérés et URL publiques sont centralisés dans [public-bases.ts](../build/public-bases.ts) ; les options Vite communes aux remotes et les dépendances partagées dans [federation.ts](../build/federation.ts).

Cette fédération ne fusionne pas les routeurs. La table [route-ownership.ts](../apps/shell/src/route-ownership.ts) reste la source de décision du shell : elle détermine quel remote est propriétaire de chaque URL selon le scénario sélectionné.

Le shell construit son menu principal à partir de `routeOwnership` et exclut les chemins paramétrés comme `/clients/:id`. Chaque remote possède aussi un menu interne, y compris des liens vers les routes d’**autres** applications (`/clients` depuis le back-office, par exemple) : le shell décide qui affiche la destination.

```text
                 ┌──────────────── Shell Vue (5000) ────────────────┐
  URL navigateur │ layout · menu · route-ownership · RemoteOutlet    │
                 └──┬──────────────┬──────────────┬──────────────┬───┘
                    │ mount/navigate/unmount (contrat @demo/contracts)
              vue_clients   angular_clients  vue_backoffice  angular_backoffice
                (5001)          (5002)          (5003)           (5004)
                    │              │              │               │
                 @demo/vue-shared  @demo/angular-shared  ...      │
                    └──────────── @demo/shared (singleton) ───────┘
```

## À qui appartient l’historique du navigateur ?

**Seul le shell contrôle l’historique et l’URL du navigateur lorsque l’application est intégrée.** Le shell transmet le chemin courant (avec query et fragment) au remote sélectionné. Les routeurs des remotes intégrés restent internes et ne remplacent pas l’URL du shell.

- Le shell crée son routeur Vue avec `createWebHistory()` dans [main.ts](../apps/shell/src/main.ts), ou `createWebHashHistory()` pour GitHub Pages.
- Les remotes Vue sont démarrés par `createVueRemote` dans [create-remote.ts](../packages/vue-shared/src/integration/create-remote.ts) : `createMemoryHistory()` en mode intégré, historique Web (ou hash) en mode autonome.
- Les remotes Angular sont démarrés par `createAngularRemote` dans [create-remote.ts](../packages/angular-shared/src/integration/create-remote.ts) : `MemoryLocationStrategy` ([navigation.ts](../packages/angular-shared/src/integration/navigation.ts)) en mode intégré, stratégie standard ou `withHashLocation()` en mode autonome.

Chaque application ne contient donc que trois petits fichiers d’intégration :

| Fichier | Angular | Vue |
| --- | --- | --- |
| Définition | `src/app/app.ts` : `createAngularRemote({ root, routes })` | `src/application.ts` : `createVueRemote({ component, routes })` |
| Entrée fédérée | `src/remote.ts` : exporte `mount` | `src/remote.ts` : exporte `mount` |
| Entrée autonome | `src/main.ts` : `app.startStandalone(...)` | `src/main.ts` : `app.startStandalone(...)` |

## Propriété actuelle des routes

Les clés `angular`, `partial` et `vue` correspondent aux scénarios du sélecteur dans [App.vue](../apps/shell/src/App.vue).

| URL | `angular` | `partial` (scénario initial) | `vue` |
| --- | --- | --- | --- |
| `/clients` | Angular 1 | Vue 1 | Vue 1 |
| `/clients/:id` | Angular 1 | Angular 1 | Vue 1 |
| `/rapports` | Angular 2 | Vue 2 | Vue 2 |
| `/parametres` | Angular 2 | Angular 2 | Vue 2 |

La fonction `ownerFor` compare les segments complets de chemin : `/clients` ne correspond pas à `/clients/:id`. Elle ignore query et fragment, accepte un slash final et renvoie `undefined` lorsqu’aucune route ne correspond. Le shell affiche alors son état 404.

## Contrat d’un remote

Les types se trouvent dans [packages/contracts/src/index.ts](../packages/contracts/src/index.ts). Un remote exposé fournit `mount(container, options)` et renvoie un handle :

```ts
interface RemoteOptions {
  initialPath: string;
  onNavigate: (path: string) => void;
  resolveHref?: (path: string) => string;
}

interface RemoteHandle {
  navigate: (path: string) => Promise<void>;
  unmount: () => void;
}
```

Le cycle de vie dans [RemoteOutlet.vue](../apps/shell/src/RemoteOutlet.vue) :

1. Le shell détermine le propriétaire courant à partir de l’URL et du scénario.
2. Il charge l’entrée fédérée correspondante et appelle `mount` avec un conteneur DOM, le chemin initial et le callback `onNavigate`.
3. Quand l’URL change mais que le propriétaire reste le même, il appelle `navigate(path)` sur le handle existant.
4. Quand le propriétaire change ou que le shell est démonté, il appelle `unmount()`.

### Navigation native, sans directive spéciale dans les pages

Les pages Angular utilisent les vrais `RouterLink`, `RouterLinkActive` et `RouterOutlet`. Les pages Vue utilisent le vrai `RouterLink`. Les paramètres, query strings et fragments sont produits par les routers des frameworks.

En mode intégré, un adaptateur au niveau du router délègue les navigations au shell **avant d’activer la page** :

- Angular : `createAngularRemote` enveloppe les routes dans une route parente portant la garde `canActivateChild` de [navigation.ts](../packages/angular-shared/src/integration/navigation.ts). Elle transmet `state.url` au shell et annule la navigation locale. Les navigations envoyées par le shell portent le marqueur `shellNavigation` dans `NavigationExtras.info` pour franchir la garde sans boucle.
- Vue : `createVueRemote` installe la garde `beforeEach` de [router-bridge.ts](../packages/vue-shared/src/integration/router-bridge.ts), qui délègue `to.fullPath` et annule la navigation locale, puis autorise le `router.push` demandé par le shell.

Même une navigation programmée (`router.navigateByUrl`, `router.push`) passe par ce mécanisme. Les liens modifiés (Cmd/Ctrl-clic, nouvel onglet) restent de vrais liens vers les URL publiques grâce à `resolveHref`, y compris sous un préfixe de dépôt avec `#/clients` sur GitHub Pages.

En mode autonome, ces gardes ne sont pas installées : les mêmes composants naviguent normalement. Le code des pages n’a donc pas à changer entre autonome et intégré. En revanche, migrer une page Angular en Vue implique toujours de réécrire son template et sa logique ; `routerLink` Angular n’est pas une directive Vue.

Cette démonstration délègue des navigations ordinaires : `replaceUrl`/`replace`, `skipLocationChange`, `state` et les navigations relatives doivent être examinés si votre application en dépend. Précédent/suivant appartient au shell, pas à `Location.back()` dans le remote.

### Structure Angular

Chaque application Angular suit une structure standalone : [app.routes.ts](../apps/angular-clients/src/app/app.routes.ts), un composant racine (`app.component.ts` + `.html`) et des pages séparées sous `src/app/pages/<page>/` avec fichiers `.ts`, `.html` et `.css`. Les composants UI, services et pipes communs viennent de `@demo/angular-shared`. Seul `app.ts` connaît le bootstrap fédéré, via la bibliothèque.

## Dépendances partagées à l’exécution

[federation.ts](../build/federation.ts) déclare les paquets partagés par Module Federation :

| Configuration | Paquets | Utilisée par |
| --- | --- | --- |
| `vueShared` | `vue`, `@demo/shared` | shell, Vue 1, Vue 2 |
| `angularShared` | `@angular/core`, `@angular/common`, `@angular/router`, `@angular/platform-browser`, `rxjs`, `@demo/shared` | Angular 1, Angular 2 |

Tous sont des **singletons** : une seule instance est chargée dans la page, quelle que soit l’application qui l’a fournie en premier. Pour `@demo/shared`, c’est ce qui permet au store `favorites` d’être commun au shell et aux quatre remotes.

> **Piège Angular** : n’utilisez pas `@angular/core/rxjs-interop` (`toSignal`, `takeUntilDestroyed`…) dans les remotes. Ce point d’entrée importe des fichiers internes de `@angular/core` au lieu de `@angular/core` lui-même. Lorsqu’il est fourni par une autre application que le core partagé (par exemple Angular 1 alors qu’Angular 2 a fourni le core), il possède son propre contexte d’injection et échoue avec l’erreur `NG0203`. Le déclarer dans `shared` ne suffit pas, car rien ne garantit que les deux modules viennent de la même application. Utilisez plutôt `withComponentInputBinding()` + `input()` pour les paramètres de route, ou une souscription libérée par `DestroyRef`.

Voir [Partage de code](partage-de-code.md) pour le détail des bibliothèques.

## Erreurs de chargement

En cas d’échec de chargement ou de montage, le shell affiche l’erreur et un bouton de nouvelle tentative. Il n’y a **pas de basculement automatique** vers un autre remote : masquer l’échec changerait le contenu affiché sans respecter la propriété déclarée de l’URL.

## Limites et déploiement

- Sans variable de déploiement, les entrées fédérées du shell pointent vers `http://localhost:5001/remoteEntry.js` à `http://localhost:5004/remoteEntry.js`. Avec `PAGES_BASE_URL`, les remotes et leurs assets sont publiés sous `remotes/<application>/` sur le même site.
- Pour un déploiement réel, configurez les adresses des remote entries selon l’environnement. Les serveurs des remotes doivent répondre avec les en-têtes CORS autorisant leur chargement depuis l’origine du shell.
- Avec l’historique Web, un serveur doit renvoyer le document du shell pour les URL profondes (fallback SPA). Le workflow GitHub Pages définit `VITE_ROUTER_MODE=hash` pour s’en passer ; les entrées autonomes des remotes utilisent aussi le hash dans ce build.
- Les quatre remotes sont ici construits et publiés ensemble. Ils peuvent techniquement être déployés séparément, à condition de respecter le contrat de montage et la compatibilité des versions partagées (voir [Partage de code](partage-de-code.md#versions-et-déploiements-indépendants)).
- Le HMR à travers les frontières de remotes fédérés n’est pas garanti ; un rechargement peut être nécessaire.
- L’exemple n’implémente ni authentification, ni backend, ni SSR. Le seul état partagé entre frameworks est le store de favoris.
- Le sélecteur du shell garde le scénario dans un `ref` Vue initialisé à `partial`. Il n’y a ni persistance, ni configuration serveur, ni feature flag de production.
