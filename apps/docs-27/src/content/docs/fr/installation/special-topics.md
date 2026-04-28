---
title: "Sujets spéciaux"
---

Certaines combinaisons spécifiques de logiciels système pourraient nécessiter des configurations supplémentaires pour fonctionner avec XOOPS. Voici quelques détails des problèmes connus et des conseils pour les gérer.

## Environnements SELinux

Certains fichiers et répertoires doivent être accessibles en écriture pendant l'installation, la mise à niveau et le fonctionnement normal de XOOPS. Dans un environnement Linux traditionnel, ceci est réalisé en veillant à ce que l'utilisateur système exécutant le serveur web ait des permissions sur les répertoires XOOPS, généralement en définissant le groupe approprié pour ces répertoires.

Les systèmes SELinux activés (comme CentOS et RHEL) ont un contexte de sécurité supplémentaire, qui peut restreindre la capacité d'un processus à changer le système de fichiers. Ces systèmes pourraient nécessiter des modifications au contexte de sécurité pour que XOOPS fonctionne correctement.

XOOPS s'attend à être capable d'écrire librement dans certains répertoires pendant le fonctionnement normal. De plus, pendant les installations et mises à jour de XOOPS, certains fichiers doivent être accessibles en écriture.

Pendant le fonctionnement normal, XOOPS s'attend à être capable de créer des fichiers et des sous-répertoires dans ces répertoires :

- `uploads` dans la racine web principale de XOOPS
- `xoops_data` partout où il est déplacé lors de l'installation

Pendant un processus d'installation ou de mise à niveau, XOOPS devra écrire dans ce fichier :

- `mainfile.php` dans la racine web principale de XOOPS

Pour un système Apache typique basé sur CentOS, les modifications du contexte de sécurité pourraient être accomplies avec ces commandes :

```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```

Vous pouvez rendre mainfile.php accessible en écriture avec :

```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```

Remarque : Lors de l'installation, vous pouvez copier un mainfile.php vide du répertoire *extras*.

Vous devez également permettre à httpd d'envoyer du courrier :

```
setsebool -P httpd_can_sendmail=1
```

D'autres paramètres dont vous pourriez avoir besoin incluent :

Permettre à httpd de faire des connexions réseau, c'est-à-dire récupérer les flux rss ou faire des appels API :

```
setsebool -P httpd_can_network_connect 1
```

Activer la connexion réseau à une base de données avec :

```
setsebool -P httpd_can_network_connect_db=1
```

Pour plus d'informations, consultez la documentation de votre système et/ou votre administrateur système.

## Smarty 4 et thèmes personnalisés

XOOPS 2.7.0 a amélioré son moteur de modélisation de Smarty 3 à **Smarty 4**. Smarty 4 est plus strict sur la syntaxe des modèles que Smarty 3, et quelques modèles qui ont été tolérés dans les anciens modèles causeront maintenant des erreurs. Si vous installez une copie fraîche de XOOPS 2.7.0 en utilisant uniquement les thèmes et les modules livrés avec la version, il n'y a rien à craindre — chaque modèle livré a été mis à jour pour la compatibilité Smarty 4.

La préoccupation s'applique lorsque vous êtes :

- Mise à niveau d'un site XOOPS 2.5.x existant qui a des thèmes personnalisés, ou
- Installation de thèmes personnalisés ou de modules tiers plus anciens dans XOOPS 2.7.0.

Avant de basculer le trafic actif vers un site mis à niveau, exécutez le scanner de pré-vol livré dans le répertoire `/upgrade/`. Il scanne `/themes/` et `/modules/` à la recherche d'incompatibilités Smarty 4 et peut réparer automatiquement beaucoup d'entre elles. Consultez la page [Vérification de pré-vol](../upgrading/upgrade/preflight.md) pour les détails.

Si vous rencontrez des erreurs de modèle après une installation ou une mise à niveau :

1. Réexécutez `/upgrade/preflight.php` et adressez tous les problèmes signalés.
2. Effacez le cache du modèle compilé en supprimant tout sauf `index.html` de
   `xoops_data/caches/smarty_compile/`.
3. Basculez temporairement vers un thème livré tel que `xbootstrap5` ou `default` pour confirmer que le problème est spécifique aux thèmes plutôt qu'à l'échelle du site.
4. Validez toute personnalisation de thème personnalisé ou de module avant de remettre le site en production.
