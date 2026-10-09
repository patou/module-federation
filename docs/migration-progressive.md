# Guide de migration progressive

Ce guide montre comment déplacer une URL d’Angular vers Vue sans modifier la responsabilité du shell. L’implémentation se trouve dans [apps/shell/src/route-ownership.ts](../apps/shell/src/route-ownership.ts).

## Point de départ

Chaque entrée de `routeOwnership` associe une route à son libellé et à son propriétaire dans chacun des trois scénarios :

```ts
{
  path: "/clients/:id",
  label: "Détail client",
  owners: {
    angular: "angular",
    partial: "angular",
    vue: "vue",
  },
}
```

Le scénario `angular` représente la situation avant migration ; `vue` représente la situation après migration. Dans le scénario `partial`, seule `/clients` est actuellement passée à Vue. Le détail `/clients/:id` demeure en Angular, ce qui permet de vérifier que la liste et son détail peuvent avoir des propriétaires différents.

## Migrer une route

Avant de changer le propriétaire, identifiez les paramètres de route, les query strings, les fragments et les liens entrants de la page Angular. Implémentez l’équivalent Vue avec les mêmes données métier et enregistrez sa route dans [router.ts](../apps/vue-remote/src/router.ts). Le [tutoriel de création de pages](ajouter-une-page.md) détaille ces étapes ; pour le détail client, cette implémentation existe déjà dans les deux remotes.

Pour faire également passer le détail client à Vue dans le scénario intermédiaire, changez **uniquement** son propriétaire `partial` :

```diff
 {
   path: "/clients/:id",
   label: "Détail client",
-  owners: { angular: "angular", partial: "angular", vue: "vue" },
+  owners: { angular: "angular", partial: "vue", vue: "vue" },
 },
```

Vérifiez que les deux remotes enregistrent la route `/clients/:id` et que chacun sait afficher l’URL avec son routeur interne. La query et le fragment (`?source=liste#fiche`) sont transmis avec le chemin, mais n’interviennent pas dans la sélection du propriétaire.

Le shell construit son menu principal depuis `routeOwnership` ; une route statique telle que `/aide` y apparaît automatiquement. Les routes contenant un paramètre comme `:id` sont filtrées du menu, mais restent accessibles via un lien dans une page.

### Mettre à jour le test de propriété

Le test actuel dans [route-ownership.test.ts](../tests/route-ownership.test.ts) attend Angular pour `/clients/1?source=liste#fiche` dans le scénario `partial`. Après le changement ci-dessus, mettez à jour cette attente en `vue`. Conservez les assertions qui vérifient que `/clients` et `/clients/:id` restent des routes distinctes.

Exécutez ensuite :

```sh
npm test
npm run typecheck
npm run build
```

Dans le navigateur, vérifiez `/clients`, `/clients/1?source=liste#fiche`, les liens retour, les changements de scénario et la navigation précédent/suivant. L’URL reste sous la responsabilité du shell même lorsque la page de détail change de framework.

### Parcours de démonstration et contrôles

1. Ouvrez `/clients` dans le shell et choisissez **Avant : tout Angular**.
2. Passez à **Pendant : liste clients en Vue** : l’URL est inchangée et la liste devient Vue.
3. Cliquez sur Alice : `/clients/1?source=liste#fiche` affiche encore Angular dans la configuration initiale.
4. Choisissez **Après : tout Vue** sur cette page : le détail devient Vue sans modifier l’URL.
5. Revenez à **Avant** : la même page redevient Angular.

Après un changement de configuration, contrôlez aussi :

- l’ouverture directe d’une URL profonde et son rechargement ;
- le menu principal et les liens internes des deux remotes ;
- précédent/suivant sans entrée supplémentaire dans l’historique ;
- la conservation de l’identifiant, de la query et du fragment ;
- une URL inconnue et un remote arrêté, avec une erreur explicite ;
- le fonctionnement des builds servis séparément, pas seulement des serveurs de développement.

Le sélecteur modifie uniquement la configuration en mémoire. Le diff de `routeOwnership` change la configuration du code et nécessite un nouveau build pour être déployé.

## Retour arrière

Si la route migrée n’est pas prête, restaurez son propriétaire `partial` :

```diff
-  owners: { angular: "angular", partial: "vue", vue: "vue" },
+  owners: { angular: "angular", partial: "angular", vue: "vue" },
```

Mettez aussi à jour l’assertion de test pour refléter ce retour à Angular, puis reconstruisez et redéployez ensemble le changement de table et les versions de remotes compatibles. La réversibilité illustrée ici concerne la sélection d’interface ; elle ne migre ni ne restaure des données ou un état métier.

## Retirer l’ancienne implémentation

Conservez la page Angular pendant la période de validation et de retour arrière. Supprimez-la uniquement lorsque plus aucune configuration utilisée ne lui attribue cette URL et que le retour arrière n’est plus nécessaire. Pour retirer complètement le remote Angular, migrez toutes ses URL, retirez les scénarios qui le sélectionnent, puis retirez son loader et sa déclaration de remote du shell ainsi que ses scripts de démarrage. Vérifiez les anciens liens profonds après ce nettoyage.

Module Federation ne convertit pas les composants, les services, les formulaires ou la logique métier Angular en Vue. La migration de ces éléments et le transfert éventuel d’état sont des travaux séparés.

## À ne pas confondre avec un feature flag

Le sélecteur de scénario dans [App.vue](../apps/shell/src/App.vue) sert uniquement à comparer les répartitions de routes pendant la démonstration. Il initialise un `ref` à `partial`, n’enregistre pas le choix entre rechargements et ne fournit ni activation côté serveur, ni ciblage d’utilisateurs, ni stratégie de déploiement. Ne l’utilisez pas comme mécanisme de feature flag en production.

En cas d’échec d’un remote, le shell affiche l’erreur et propose une nouvelle tentative ; il ne bascule pas automatiquement vers l’autre framework. Toute stratégie de déploiement, d’observabilité ou de repli de production reste à concevoir explicitement.
