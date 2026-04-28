---
title: "Vérification de pré-vol"
---

XOOPS 2.7.0 a amélioré son moteur de modélisation de Smarty 3 à Smarty 4. Smarty 4 est plus strict sur la syntaxe des modèles que Smarty 3, et certains thèmes personnalisés et modèles de modules pourraient avoir besoin d'être ajustés avant qu'ils ne fonctionnent correctement sur XOOPS 2.7.0.

Pour aider à identifier et réparer ces problèmes _avant_ d'exécuter le principal upgraded, XOOPS 2.7.0 est livré avec un **scanner de pré-vol** dans le répertoire `upgrade/`. Vous devez exécuter le scanner de pré-vol au moins une fois avant que le principal flux de mise à niveau ne vous permette de continuer.

## Ce que le scanner fait

Le scanner de pré-vol parcourt vos thèmes existants et les modèles de modules à la recherche d'incompatibilités connues de Smarty 4. Il peut :

* **Analyser** vos répertoires `themes/` et `modules/` pour les fichiers modèles `.tpl` et `.html` qui pourraient avoir besoin de modifications
* **Signaler** les problèmes groupés par fichier et par type de problème
* **Réparer automatiquement** beaucoup de problèmes courants quand vous le demandez

Tout problème ne peut pas être réparé automatiquement. Certains modèles devront être édités manuellement, en particulier s'ils utilisent des idiomes Smarty 3 plus anciens qui n'ont pas d'équivalent direct dans Smarty 4.

## Exécution du scanner

1. Copiez le répertoire `upgrade/` de la distribution dans votre racine web du site (si vous ne l'avez pas déjà fait dans le cadre de l'étape [Préparations pour la mise à niveau](ustep-01.md)).
2. Pointez votre navigateur vers l'URL de pré-vol :

   ```text
   http://example.com/upgrade/preflight.php
   ```

3. Connectez-vous avec un compte administrateur quand on vous le demande.
4. Le scanner présente un formulaire avec trois contrôles :
   * **Répertoire de modèle** — laisser vide pour analyser à la fois `themes/` et `modules/`. Entrez un chemin comme `/themes/mytheme/` pour réduire l'analyse à un seul répertoire.
   * **Extension de modèle** — laisser vide pour analyser à la fois les fichiers `.tpl` et `.html`. Entrez une seule extension pour réduire l'analyse.
   * **Tentez une correction automatique** — cochez cette case si vous voulez que le scanner répare les problèmes qu'il sait comment corriger. Laissez-le décoché pour une analyse en lecture seule.
5. Appuyez sur le bouton **Exécuter**. Le scanner parcourt les répertoires sélectionnés et signale chaque problème trouvé.

## Interprétation des résultats

Le rapport d'analyse répertorie tous les fichiers qu'il a examinés et tous les problèmes trouvés. Chaque entrée de problème vous indique :

* Quel fichier contient le problème
* Quelle règle Smarty 4 il viole
* Si le scanner pouvait le réparer automatiquement

Si vous avez exécuté l'analyse avec _Tentez une correction automatique_ activée, le rapport confirmera également quels fichiers ont été réécrits.

## Corriger les problèmes manuellement

Pour les problèmes que le scanner ne peut pas réparer automatiquement, ouvrez le fichier modèle signalé dans un éditeur et apportez les modifications requises. Les incompatibilités courantes de Smarty 4 incluent :

* Les blocs `{php} ... {/php}` (ne sont plus supportés dans Smarty 4)
* Les modificateurs dépréciés et les appels de fonction
* L'utilisation délimitée sensible à l'espace blanc
* Les hypothèses d'enregistrement au moment du plugin qui ont changé dans Smarty 4

Si vous n'êtes pas à l'aise pour éditer les modèles, l'approche la plus sûre est de basculer vers un thème livré (`xbootstrap5`, `default`, `xswatch5`, etc.) et de gérer le thème personnalisé séparément après la mise à niveau.

## Réexécution jusqu'à ce que ce soit propre

Après avoir apporté des corrections — qu'elles soient automatiques ou manuelles — réexécutez le scanner de pré-vol. Répétez jusqu'à ce que l'analyse ne signale aucun problème restant.

Une fois l'analyse propre, vous pouvez terminer la session de pré-vol en appuyant sur le bouton **Quitter le scanner** dans l'interface utilisateur du scanner. Cela marque le pré-vol comme terminé et permet au principal upgraded à `/upgrade/` de procéder.

## Continuer vers la mise à niveau

Avec le pré-vol terminé, vous pouvez lancer le principal upgraded à :

```text
http://example.com/upgrade/
```

Consultez [Exécution de la mise à niveau](ustep-02.md) pour les prochaines étapes.

## Si vous sautez le pré-vol

Sauter le pré-vol est fortement déconseillé, mais si vous avez mis à niveau sans l'exécuter et que vous voyez maintenant des erreurs de modèle, consultez la section Erreurs de modèle Smarty 4 du [Dépannage](ustep-03.md). Vous pouvez exécuter le pré-vol après le fait et effacer `xoops_data/caches/smarty_compile/` pour récupérer.
