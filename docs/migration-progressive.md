# Guide de migration progressive

Ce guide montre comment déplacer une URL d’Angular vers Vue sans modifier la responsabilité du shell. L’implémentation se trouve dans [apps/shell/src/route-ownership.ts](../apps/shell/src/route-ownership.ts).

La démonstration comporte deux couples d’applications : **Angular 1 → Vue 1** (`angular-clients` → `vue-clients`) et **Angular 2 → Vue 2** (`angular-backoffice` → `vue-backoffice`). Chaque couple se migre indépendamment, URL par URL.

## Point de départ

Chaque entrée de `routeOwnership` associe une route à son libellé et à son propriétaire (`RemoteName`) dans chacun des trois scénarios :

```ts
{
  path: "/clients/:id",
  label: "Détail client",
  owners: {
    angular: "angular-clients",
    partial: "angular-clients",
    vue: "vue-clients",
  },
}
```

Le scénario `angular` représente la situation avant migration ; `vue` représente la situation après migration. Dans le scénario `partial`, `/clients` (Vue 1) et `/rapports` (Vue 2) sont passées à Vue. `/clients/:id` (Angular 1) et `/parametres` (Angular 2) demeurent en Angular, ce qui montre qu’une liste et son détail peuvent avoir des propriétaires différents.

## Migrer une route

Avant de changer le propriétaire, identifiez les paramètres de route, les query strings, les fragments et les liens entrants de la page Angular. Implémentez l’équivalent Vue dans l’application Vue correspondante et enregistrez sa route dans son `routes.ts` (par exemple [routes.ts](../apps/vue-clients/src/routes.ts) pour Vue 1). Réutilisez les services de `@demo/shared` déjà utilisés par la page Angular : la logique métier est commune, seule la présentation est réécrite (voir [Partage de code](partage-de-code.md)). Le [tutoriel de création de pages](ajouter-une-page.md) détaille ces étapes ; pour le détail client, cette implémentation existe déjà dans Angular 1 et Vue 1.

Pour faire également passer le détail client à Vue dans le scénario intermédiaire, changez **uniquement** son propriétaire `partial` :

```diff
 {
   path: "/clients/:id",
   label: "Détail client",
-  owners: { angular: "angular-clients", partial: "angular-clients", vue: "vue-clients" },
+  owners: { angular: "angular-clients", partial: "vue-clients", vue: "vue-clients" },
 },
```

Vérifiez que les deux remotes enregistrent la route `/clients/:id` et que chacun sait afficher l’URL avec son routeur interne. La query et le fragment (`?source=liste#fiche`) sont transmis avec le chemin, mais n’interviennent pas dans la sélection du propriétaire.

Le shell construit son menu principal depuis `routeOwnership` ; une route statique telle que `/aide` y apparaît automatiquement. Les routes contenant un paramètre comme `:id` sont filtrées du menu, mais restent accessibles via un lien dans une page.

### Mettre à jour le test de propriété

Le test actuel dans [route-ownership.test.ts](../tests/route-ownership.test.ts) attend `angular-clients` pour `/clients/1?source=liste#fiche` dans le scénario `partial`. Après le changement ci-dessus, mettez à jour cette attente en `vue-clients`. Conservez les assertions qui vérifient que `/clients` et `/clients/:id` restent des routes distinctes.

Exécutez ensuite :

```sh
npm test
npm run typecheck
npm run build
```

Dans le navigateur, vérifiez `/clients`, `/clients/1?source=liste#fiche`, les liens retour, les changements de scénario et la navigation précédent/suivant. L’URL reste sous la responsabilité du shell même lorsque la page de détail change de framework.

### Parcours de démonstration et contrôles

1. Ouvrez `/clients` dans le shell et choisissez **Avant : tout Angular**.
2. Passez à **Pendant : migration partielle** : l’URL est inchangée et la liste devient Vue 1.
3. Ajoutez un client en favori, puis cliquez sur sa fiche : `/clients/1?source=liste#fiche` est affiché par Angular 1, avec le même état de favori.
4. Choisissez **Après : tout Vue** sur cette page : le détail devient Vue 1 sans modifier l’URL.
5. Ouvrez **Paramètres** : selon le scénario, Angular 2 ou Vue 2 affiche le même nombre de favoris.
6. Revenez à **Avant** : les pages redeviennent Angular.

Après un changement de configuration, contrôlez aussi :

- l’ouverture directe d’une URL profonde et son rechargement ;
- le menu principal et les liens internes des remotes, y compris vers une autre application ;
- précédent/suivant sans entrée supplémentaire dans l’historique ;
- la conservation de l’identifiant, de la query et du fragment ;
- une URL inconnue et un remote arrêté, avec une erreur explicite ;
- le fonctionnement des builds servis séparément, pas seulement des serveurs de développement.

Le sélecteur modifie uniquement la configuration en mémoire. Le diff de `routeOwnership` change la configuration du code et nécessite un nouveau build pour être déployé.

## Retour arrière

Si la route migrée n’est pas prête, restaurez son propriétaire `partial` :

```diff
-  owners: { angular: "angular-clients", partial: "vue-clients", vue: "vue-clients" },
+  owners: { angular: "angular-clients", partial: "angular-clients", vue: "vue-clients" },
```

Mettez aussi à jour l’assertion de test pour refléter ce retour à Angular, puis reconstruisez et redéployez ensemble le changement de table et les versions de remotes compatibles. La réversibilité illustrée ici concerne la sélection d’interface ; elle ne migre ni ne restaure des données ou un état métier.

## Retirer l’ancienne implémentation

Conservez la page Angular pendant la période de validation et de retour arrière. Supprimez-la uniquement lorsque plus aucune configuration utilisée ne lui attribue cette URL et que le retour arrière n’est plus nécessaire. Pour retirer complètement une application Angular (par exemple Angular 2), migrez toutes ses URL, retirez-la de `RemoteName` et des scénarios, de `remoteApps` dans [public-bases.ts](../build/public-bases.ts), du loader de [RemoteOutlet.vue](../apps/shell/src/RemoteOutlet.vue), de [remotes.d.ts](../apps/shell/src/remotes.d.ts) et des scripts racine. Quand plus aucune application Angular ne subsiste, `@demo/angular-shared` peut être supprimé ; `@demo/shared` reste utilisé par les applications Vue. Vérifiez les anciens liens profonds après ce nettoyage.

Module Federation ne convertit pas les composants, les formulaires ou la logique Angular en Vue. Plus la logique est placée dans `@demo/shared`, moins il reste de code à réécrire. La migration de ces éléments et le transfert éventuel d’état sont des travaux séparés.

## À ne pas confondre avec un feature flag

Le sélecteur de scénario dans [App.vue](../apps/shell/src/App.vue) sert uniquement à comparer les répartitions de routes pendant la démonstration. Il initialise un `ref` à `partial`, n’enregistre pas le choix entre rechargements et ne fournit ni activation côté serveur, ni ciblage d’utilisateurs, ni stratégie de déploiement. Ne l’utilisez pas comme mécanisme de feature flag en production.

En cas d’échec d’un remote, le shell affiche l’erreur et propose une nouvelle tentative ; il ne bascule pas automatiquement vers l’autre framework. Toute stratégie de déploiement, d’observabilité ou de repli de production reste à concevoir explicitement.
