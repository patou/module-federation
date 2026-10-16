# Démonstration de migration progressive : Angular vers Vue

Ce dépôt illustre une application composée d’un **shell Vue permanent** et de **quatre applications distantes fédérées** : deux applications Angular historiques et leurs équivalents migrés en Vue. Le shell choisit quel remote affiche chaque URL. Les applications restent séparées, mais sont rendues dans la même page, sans iframe. Trois bibliothèques communes montrent comment partager des composants UI et des services entre applications et entre frameworks.

La démonstration démarre par défaut dans le scénario **Pendant : migration partielle**. Le sélecteur du shell permet de comparer les répartitions Angular, partielle et Vue. Un compteur de favoris dans l’en-tête du shell montre un état partagé en direct par les cinq applications.

## Démarrage

### Prérequis

- Node.js **22.18 ou supérieur dans la ligne 22**, ou **24 ou supérieur**. Les tests et le script de packaging utilisent le support TypeScript natif de Node.
- npm avec la prise en charge des workspaces.

### Installer et lancer

Depuis la racine du dépôt :

```sh
npm install
npm run dev
```

La commande de développement lance les cinq serveurs ensemble :

| Application | Adresse locale | Nom fédéré | Rôle |
| --- | --- | --- | --- |
| Shell Vue | [http://localhost:5000](http://localhost:5000) | `shell` | URL du navigateur, layout, menu principal et choix du remote |
| Vue 1 · Clients | [http://localhost:5001](http://localhost:5001) | `vue_clients` | `/clients`, `/clients/:id` migrés |
| Angular 1 · Clients | [http://localhost:5002](http://localhost:5002) | `angular_clients` | `/clients`, `/clients/:id` historiques |
| Vue 2 · Back-office | [http://localhost:5003](http://localhost:5003) | `vue_backoffice` | `/rapports`, `/parametres` migrés |
| Angular 2 · Back-office | [http://localhost:5004](http://localhost:5004) | `angular_backoffice` | `/rapports`, `/parametres` historiques |

Ouvrez le shell sur le port **5000** pour parcourir l’application intégrée. Chaque remote peut aussi être ouvert seul sur son port (mode autonome).

## Bibliothèques communes

| Paquet | Consommé par | Contenu |
| --- | --- | --- |
| [@demo/shared](packages/shared/) | toutes les applications | Services en TypeScript pur (`clientService`, `favorites`, `formatCurrency`, `formatDate`, `summarize`) et Web Components (`<demo-status-badge>`, `<demo-stat-card>`) |
| [@demo/angular-shared](packages/angular-shared/) | Angular 1 et 2 | Bootstrap fédéré `createAngularRemote`, services injectables, pipes `eur`/`frDate`, composants `shared-page-header`, `shared-client-card`, `shared-favorite-button`, `shared-remote-layout`, `shared-not-found` |
| [@demo/vue-shared](packages/vue-shared/) | Vue 1 et 2 | Bootstrap fédéré `createVueRemote`, composables `useFavorites`/`useClientList`/`useClient`, composants `PageHeader`, `ClientCard`, `FavoriteButton`, `RemoteLayout`, `NotFoundPage` |
| [@demo/contracts](packages/contracts/) | shell et bibliothèques | Types du contrat de montage d’un remote |

Le guide [Partage de code](docs/partage-de-code.md) explique l’organisation en couches et la différence entre code **partagé à l’exécution** (singleton fédéré) et code **partagé à la compilation** (copié dans chaque bundle).

## Vérifications et aperçu de production

```sh
npm run typecheck
npm run build
npm test
```

- `typecheck` lance la vérification de types dans les workspaces qui la déclarent.
- `build` construit les cinq applications.
- `test` exécute les tests Node de `tests/*.test.ts` : propriété des routes, bases publiques, pont de navigation et services partagés.

Les pages utilisent les liens natifs des frameworks (`routerLink` Angular et `RouterLink` Vue). Les adaptateurs de router des bibliothèques partagées assurent la communication avec le shell, sans directive spécifique dans les composants métier.

Pour consulter les builds avec les serveurs d’aperçu Vite :

```sh
npm run build
npm run preview
```

L’aperçu utilise les ports **5000 à 5004**, comme le mode développement.

## GitHub Actions et GitHub Pages

Le workflow [pages.yml](.github/workflows/pages.yml) :

1. installe les dépendances avec `npm ci` sous Node 24 ;
2. vérifie les types, lance les tests et construit les cinq applications à chaque push et pull request ;
3. sur la **branche par défaut du dépôt**, construit le site avec son URL GitHub Pages et publie l’artefact uniquement si les vérifications réussissent.

Pour l’activer, choisissez **Settings → Pages → Build and deployment → Source : GitHub Actions**. Le workflow peut aussi être lancé manuellement depuis l’onglet Actions. Les pull requests et les branches secondaires ne sont pas déployées.

Le shell est publié à la racine du site, et chaque remote sous `remotes/<application>/` (`remotes/vue-clients/`, `remotes/angular-clients/`, `remotes/vue-backoffice/`, `remotes/angular-backoffice/`). L’action `configure-pages` fournit l’URL réelle du site.

GitHub Pages ne propose pas de fallback SPA configurable. Le build déployé utilise donc des URL avec hash, par exemple `https://utilisateur.github.io/depot/#/clients/1?source=liste#fiche`. **Les routes métier restent `/clients/:id`** : aucune modification des composants ou de la table de migration n’est nécessaire.

Pour construire manuellement ce même artefact :

```sh
PAGES_BASE_URL=https://utilisateur.github.io/depot/ VITE_ROUTER_MODE=hash npm run build
npm run package:pages
```

Le dossier `dist/pages/` contient alors tout le site. Pour revenir aux builds locaux, exécutez `npm run build` sans ces variables.

## Documentation

- [Architecture et navigation](docs/architecture.md) — responsabilités du shell et des remotes, contrat de montage, dépendances fédérées et limites.
- [Partage de code](docs/partage-de-code.md) — les trois bibliothèques communes, Web Components, singletons et contraintes de versions.
- [Guide de migration progressive](docs/migration-progressive.md) — modifier la propriété d’une route, vérifier le résultat et revenir en arrière.
- [Ajouter une page](docs/ajouter-une-page.md) — créer une page dans un remote Angular et son équivalent Vue avec les composants partagés.

## Structure utile

```text
apps/
  shell/               Shell Vue : layout, menu, table de propriété des URL
  angular-clients/     Angular 1 : liste et détail clients
  angular-backoffice/  Angular 2 : rapports et paramètres
  vue-clients/         Vue 1 : liste et détail clients
  vue-backoffice/      Vue 2 : rapports et paramètres
packages/
  shared/              JavaScript/TypeScript pur : services + Web Components
  angular-shared/      Composants, services, pipes et bootstrap Angular
  vue-shared/          Composants, composables et bootstrap Vue
  contracts/           Types du contrat shell ↔ remote
build/                 Bases publiques et configuration Module Federation communes
tests/                 Tests Node
```

## Portée de la démonstration

Le sélecteur de scénario est un contrôle de démonstration en mémoire, pas un feature flag de production. Ce dépôt ne met pas en œuvre l’authentification, un backend, le rendu côté serveur (SSR) ou la migration d’état entre frameworks. Consultez les [limites et considérations de déploiement](docs/architecture.md#limites-et-déploiement) avant de transposer cette configuration à un environnement réel.
