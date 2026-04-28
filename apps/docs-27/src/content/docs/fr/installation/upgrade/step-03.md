---
title: "Dépannage"
---

## Erreurs de modèle Smarty 4

La classe de problèmes la plus courante lors de la mise à niveau de XOOPS 2.5.x vers 2.7.0 est l'incompatibilité du modèle Smarty 4. Si vous avez sauté ou n'avez pas terminé la [Vérification de pré-vol](preflight.md), vous pouvez voir des erreurs de modèle sur le front-end ou dans la zone d'administration après la mise à niveau.

Pour récupérer :

1. **Réexécutez le scanner de pré-vol** à `/upgrade/preflight.php`. Appliquez les réparations automatiques qu'il propose ou corrigez manuellement les modèles signalés.
2. **Effacez le cache du modèle compilé.** Supprimez tout sauf `index.html` de `xoops_data/caches/smarty_compile/`. Les modèles compilés Smarty 3 ne sont pas compatibles avec Smarty 4 et les anciens fichiers peuvent causer des erreurs déroutantes.
3. **Basculez temporairement vers un thème livré.** À partir de la zone d'administration, sélectionnez `xbootstrap5` ou `default` comme thème actif. Cela confirmera si le problème est limité à un thème personnalisé ou l'ensemble du site.
4. **Validez tous les thèmes personnalisés et les modèles de modules** avant de remettre le trafic de production en marche. Portez une attention particulière aux modèles qui utilisent les blocs `{php}`, les modificateurs dépréciés ou la syntaxe délimitée non-standard — ce sont les casses Smarty 4 les plus courants.

Consultez également la section Smarty 4 dans [Sujets spéciaux](../../installation/specialtopics.md).

## Problèmes d'autorisation

La mise à niveau XOOPS pourrait avoir besoin d'écrire dans des fichiers qui ont précédemment été rendus en lecture seule. Si c'est le cas, vous verrez un message comme ceci :

![Erreur rendre accessible en écriture de la mise à niveau XOOPS](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

La solution consiste à changer les permissions. Vous pouvez changer les permissions en utilisant FTP si vous n'avez pas un accès plus direct. Voici un exemple utilisant FileZilla :

![Changement de permission FileZilla](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Sortie de débogage

Vous pouvez activer la sortie de débogage supplémentaire dans le journaliste en ajoutant un paramètre de débogage à l'URL utilisée pour lancer la mise à niveau :

```text
http://example.com/upgrade/?debug=1
```
