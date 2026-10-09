# Architecture et navigation

## Les trois applications

| Élément | Responsabilité |
| --- | --- |
| [Shell Vue](../apps/shell/src/App.vue) | Conserve l’interface hôte, lit l’URL du navigateur, choisit le remote et fournit le menu de navigation principal. |
| [Remote Angular](../apps/angular-remote/src/app/app.component.ts) | Fournit les pages historiques et leur routeur Angular. |
| [Remote Vue](../apps/vue-remote/src/router.ts) | Fournit les pages migrées et leur routeur Vue. |

Module Federation rend le code des remotes accessible au shell : les configurations Vite exposent chacune `./app`, et le shell les charge via `vue_remote/app` ou `angular_remote/app`. Cette fédération ne fusionne pas les routeurs. La table [route-ownership.ts](../apps/shell/src/route-ownership.ts) reste la source de décision du shell : elle détermine quel remote est propriétaire de chaque URL selon le scénario sélectionné.

Le shell contient le menu principal. Il le construit à partir de `routeOwnership` et exclut les chemins paramétrés comme `/clients/:id` ; ces pages de détail ne deviennent donc pas des entrées de menu automatiquement. Les remotes gardent leurs propres routes et leurs liens internes.

## À qui appartient l’historique du navigateur ?

**Seul le shell contrôle l’historique et l’URL du navigateur lorsque l’application est intégrée.** L’URL peut comprendre un chemin, une query et un fragment ; le shell transmet le chemin courant au remote sélectionné. Les routeurs des remotes intégrés restent internes et ne remplacent pas l’URL du shell.

- Le shell crée son routeur Vue avec `createWebHistory()` dans [main.ts](../apps/shell/src/main.ts), ou `createWebHashHistory()` pour GitHub Pages.
- Le remote Vue intégré crée son routeur avec `createMemoryHistory()` dans [router.ts](../apps/vue-remote/src/router.ts). Son point d’entrée autonome, [main.ts](../apps/vue-remote/src/main.ts), utilise `makeRouter(false)` et donc l’historique Web.
- Le remote Angular intégré reçoit `MemoryLocationStrategy`, définie dans [navigation.ts](../apps/angular-remote/src/navigation.ts), par le bootstrap fédéré [bootstrap.ts](../apps/angular-remote/src/bootstrap.ts). Le démarrage autonome via [main.ts](../apps/angular-remote/src/main.ts) ne fournit pas ces options et utilise la stratégie Angular standard, ou `withHashLocation()` pour GitHub Pages.

Ces modes permettent de tester chaque remote seul tout en évitant, dans le mode intégré, que deux routeurs écrivent simultanément dans l’historique du navigateur.

## Propriété actuelle des routes

Les clés `angular`, `partial` et `vue` de chaque entrée correspondent aux scénarios du sélecteur dans [App.vue](../apps/shell/src/App.vue).

| URL | `angular` | `partial` (scénario initial) | `vue` |
| --- | --- | --- | --- |
| `/clients` | Angular | Vue | Vue |
| `/clients/:id` | Angular | Angular | Vue |
| `/rapports` | Angular | Angular | Vue |
| `/parametres` | Angular | Angular | Vue |

La fonction `ownerFor` compare les segments complets de chemin : `/clients` ne correspond pas à `/clients/:id`. Elle ignore query et fragment pour choisir un propriétaire, accepte un slash final et renvoie `undefined` lorsqu’aucune route ne correspond. Le shell affiche alors son état 404 au lieu de sélectionner arbitrairement un remote.

## Contrat d’un remote

Les types partagés se trouvent dans [packages/contracts/src/index.ts](../packages/contracts/src/index.ts). Un remote exposé fournit `mount(container, options)` et renvoie un handle :

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

Le cycle de vie dans [RemoteOutlet.vue](../apps/shell/src/RemoteOutlet.vue) est le suivant :

1. Le shell détermine le propriétaire courant à partir de l’URL et du scénario.
2. Il charge l’entrée fédérée correspondante et appelle `mount` avec un conteneur DOM, le chemin initial et le callback `onNavigate`.
3. Quand l’URL change mais que le propriétaire reste le même, le shell appelle `navigate(path)` sur le handle existant.
4. Quand le propriétaire change ou que le shell est démonté, il appelle `unmount()`.

### Navigation native, sans directive spéciale dans les pages

Les pages Angular utilisent les vrais `RouterLink`, `RouterLinkActive` et `RouterOutlet`. Les pages Vue utilisent le vrai `RouterLink`. Les paramètres, query strings et fragments sont produits par les routers des frameworks, pas par un composant de lien maison.

En mode intégré, un adaptateur au niveau du router délègue les navigations au shell **avant d’activer la page** :

- Angular : une garde `canActivateChild` dans [navigation.ts](../apps/angular-remote/src/navigation.ts) transmet `state.url` au shell et annule la navigation locale. Les routes métier sont enveloppées au bootstrap, sans modifier leurs composants. Les navigations envoyées par le shell portent un marqueur dans `NavigationExtras.info` pour franchir la garde sans boucle. Les gardes sont réexécutées lorsque seuls les paramètres ou la query changent.
- Vue : une garde `beforeEach` dans [router-bridge.ts](../apps/vue-remote/src/router-bridge.ts) délègue `to.fullPath` et annule la navigation locale. L’adaptateur autorise ensuite le `router.push` demandé par le shell.

Le shell choisit le propriétaire puis synchronise le router du remote. Même une navigation programmée avec `router.navigateByUrl` ou `router.push` passe par ce mécanisme. Les liens modifiés (Cmd/Ctrl-clic, nouvel onglet) restent de vrais liens vers les URL publiques.

Le callback `resolveHref` fournit l’adresse publique d’un lien depuis le router du shell. L’historique mémoire Vue et la localisation mémoire Angular l’utilisent pour générer les `href` natifs corrects, notamment sous un préfixe de dépôt avec `#/clients` sur GitHub Pages. Une URL de ressource distante ne doit pas être confondue avec une URL de navigation métier.

En mode autonome, ces gardes de délégation ne sont pas installées : les mêmes composants naviguent normalement. Le code des pages n’a donc pas à changer entre autonome et intégré. En revanche, migrer une page Angular en Vue implique toujours de réécrire son template et sa logique dans le nouveau framework ; `routerLink` Angular n’est pas une directive Vue.

Cette démonstration délègue des navigations ordinaires, pas toutes les options avancées : `replaceUrl`/`replace`, `skipLocationChange`, `state` et les navigations relatives doivent être examinés si votre application en dépend. Le contrat ne transmet ici qu’une URL ; une demande `replace` du remote produit donc une navigation standard du shell. La localisation mémoire Angular n’implémente pas un second historique : précédent/suivant appartient au shell, pas à `Location.back()` dans le remote.

### Structure Angular

L’application suit une structure standalone avec [app.config.ts](../apps/angular-remote/src/app/app.config.ts), [app.routes.ts](../apps/angular-remote/src/app/app.routes.ts), un composant racine et des composants de pages séparés sous `src/app/pages/`. Chaque composant possède son fichier TypeScript et son template HTML ; les pages réutilisent une feuille de style commune. Les données fictives sont isolées dans `src/app/data/clients.ts`. Seul le bootstrap d’intégration connaît Module Federation.

## Erreurs de chargement

En cas d’échec de chargement ou de montage, le shell affiche l’erreur et un bouton de nouvelle tentative. Il n’y a **pas de basculement automatique** vers l’autre remote : masquer l’échec changerait le contenu affiché sans respecter la propriété déclarée de l’URL.

## Limites et déploiement

- Sans variable de déploiement, les entrées fédérées du shell pointent vers `http://localhost:5001/remoteEntry.js` et `http://localhost:5002/remoteEntry.js`. [public-bases.ts](../build/public-bases.ts) centralise les bases utilisées par les trois configurations Vite. Avec `PAGES_BASE_URL`, les remotes et leurs assets sont publiés sous `remotes/vue/` et `remotes/angular/` sur le même site.
- Pour un déploiement réel, configurez les adresses des remote entries et les bases publiques des assets selon l’environnement. Les serveurs qui servent les remotes doivent répondre avec les en-têtes CORS autorisant leur chargement depuis l’origine du shell.
- Avec l’historique Web local, un serveur doit renvoyer le document du shell pour les URL profondes (fallback SPA). Le workflow GitHub Pages définit `VITE_ROUTER_MODE=hash` : les URL profondes sont dans le hash et ne nécessitent pas ce fallback. Les points d’entrée autonomes des deux remotes utilisent aussi le hash dans ce build.
- Le HMR est utile en développement, mais les mises à jour à chaud à travers toutes les frontières de remotes fédérés ne sont pas garanties ; un rechargement de page ou le redémarrage du serveur concerné peut être nécessaire.
- L’exemple n’implémente ni authentification, ni backend, ni SSR, ni migration ou synchronisation d’état entre Angular et Vue.
- Le sélecteur du shell garde le scénario dans un `ref` Vue initialisé à `partial`. Il n’y a ni persistance, ni configuration serveur, ni feature flag de production.
