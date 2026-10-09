# Démonstration de migration progressive : Angular vers Vue

Ce dépôt illustre une application composée d’un shell Vue permanent et de deux applications distantes fédérées : l’application historique Angular et sa version migrée en Vue. Le shell choisit quel remote affiche chaque URL. Les applications restent séparées, mais sont rendues dans la même page, sans iframe.

La démonstration démarre par défaut dans le scénario **Pendant : liste clients en Vue**. Le sélecteur du shell permet de comparer les répartitions Angular, partielle et Vue.

## Démarrage

### Prérequis

- Node.js **22.18 ou supérieur dans la ligne 22**, ou **24 ou supérieur**. Les tests utilisent le support TypeScript natif de Node.
- npm avec la prise en charge des workspaces.

### Installer et lancer

Depuis la racine du dépôt :

```sh
npm install
npm run dev
```

La commande de développement lance les trois serveurs ensemble :

| Application | Adresse locale | Rôle |
| --- | --- | --- |
| Shell Vue | [http://localhost:5000](http://localhost:5000) | URL du navigateur, navigation principale et choix du remote |
| Remote Vue | [http://localhost:5001](http://localhost:5001) | Pages migrées |
| Remote Angular | [http://localhost:5002](http://localhost:5002) | Pages historiques |

Ouvrez le shell sur le port **5000** pour parcourir l’application intégrée. Les deux autres serveurs sont des dépendances du shell : ils publient leurs entrées Module Federation.

## Vérifications et aperçu de production

Les scripts racine exécutent les commandes suivantes :

```sh
npm run typecheck
npm run build
npm test
```

- `typecheck` lance la vérification de types dans les workspaces qui la déclarent.
- `build` construit les workspaces qui déclarent un script de build.
- `test` exécute les tests Node de `tests/*.test.ts`, notamment ceux de propriété des routes.

Les pages utilisent les liens natifs des frameworks (`routerLink` Angular et `RouterLink` Vue). Les adaptateurs de router assurent la communication avec le shell, sans directive spécifique dans les composants métier.

Pour consulter les builds avec les serveurs d’aperçu Vite, construisez d’abord les applications, puis lancez :

```sh
npm run build
npm run preview
```

L’aperçu utilise les ports **5000**, **5001** et **5002**, comme le mode développement. Sans configuration de déploiement, les adresses des remotes restent locales.

## GitHub Actions et GitHub Pages

Le workflow [pages.yml](.github/workflows/pages.yml) :

1. installe les dépendances avec `npm ci` sous Node 24 ;
2. vérifie les types, lance les tests et construit les trois applications à chaque push et pull request ;
3. sur la **branche par défaut du dépôt**, construit le site avec son URL GitHub Pages et publie l’artefact uniquement si les vérifications réussissent.

Pour l’activer, poussez ce projet dans un dépôt GitHub, puis choisissez **Settings → Pages → Build and deployment → Source : GitHub Actions**. Le workflow peut aussi être lancé manuellement depuis l’onglet Actions. Les pull requests et les branches secondaires ne sont pas déployées.

Le shell est publié à la racine du site, et les remotes sous `remotes/vue/` et `remotes/angular/`. L’action `configure-pages` fournit l’URL réelle du site : préfixe de dépôt et domaine personnalisé sont pris en compte automatiquement.

GitHub Pages ne propose pas de fallback SPA configurable. Le build déployé utilise donc des URL avec hash, par exemple `https://utilisateur.github.io/depot/#/clients/1?source=liste#fiche`. Le rechargement et les liens directs fonctionnent sans page 404 de contournement. **Les routes métier restent `/clients/:id`** : aucune modification des composants ou de la table de migration n’est nécessaire. En développement local, le routage conserve ses URL habituelles sans hash.

Pour construire manuellement ce même artefact :

```sh
PAGES_BASE_URL=https://utilisateur.github.io/depot/ VITE_ROUTER_MODE=hash npm run build
npm run package:pages
```

Le dossier `dist/pages/` contient alors tout le site. `package:pages` remplace uniquement ce dossier d’assemblage et nécessite les trois builds déjà produits. Pour revenir aux builds locaux, exécutez `npm run build` sans ces variables.

## Documentation

- [Architecture et navigation](docs/architecture.md) — responsabilités du shell et des remotes, contrat de montage et limites.
- [Guide de migration progressive](docs/migration-progressive.md) — modifier la propriété d’une route, vérifier le résultat et revenir en arrière.
- [Ajouter une page](docs/ajouter-une-page.md) — enregistrer une nouvelle page dans les deux remotes et l’exposer dans le shell.

## Structure utile

- [apps/shell/](apps/shell/) — shell Vue et table de propriété des URL.
- [apps/vue-remote/](apps/vue-remote/) — pages Vue et contrat de montage fédéré.
- [apps/angular-remote/](apps/angular-remote/) — pages Angular autonomes et entrée fédérée.
- [packages/contracts/](packages/contracts/) — types partagés du cycle de vie des remotes.
- [tests/](tests/) — tests de correspondance et de propriété des routes.

## Portée de la démonstration

Le sélecteur de scénario est un contrôle de démonstration en mémoire, pas un indicateur de fonctionnalité persistant ni un feature flag de production. Ce dépôt ne met pas en œuvre l’authentification, un backend, le rendu côté serveur (SSR) ou la migration d’état entre frameworks. Consultez les [limites et considérations de déploiement](docs/architecture.md#limites-et-déploiement) avant de transposer cette configuration à un environnement réel.
