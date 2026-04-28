---
title: "Enregistrer la configuration"
---

Cette page affiche les résultats de l'enregistrement des informations de configuration que vous avez saisies jusqu'à présent.

Après examen et correction de tout problème, sélectionnez le bouton "Continuer" pour continuer.

## En cas de succès

La section _Enregistrement de la configuration de votre système_ affiche les informations qui ont été enregistrées. Les paramètres sont enregistrés dans l'un des deux fichiers. Un fichier est _mainfile.php_ à la racine Web. L'autre est _data/secure.php_ dans le répertoire _xoops_data_.

![Enregistrement de la configuration du programme d'installation XOOPS](/xoops-docs/2.7/img/installation/installer-07.png)

Les deux fichiers sont générés à partir de fichiers modèles fournis avec XOOPS 2.7.0 :

* `mainfile.php` est généré à partir de `mainfile.dist.php` à la racine Web.
* `xoops_data/data/secure.php` est généré à partir de `xoops_data/data/secure.dist.php`.

En plus des chemins et de l'URL que vous avez saisis, `mainfile.php` inclut maintenant plusieurs constantes qui sont nouvelles dans XOOPS 2.7.0 :

* `XOOPS_TRUST_PATH` — gardé comme un alias rétro-compatible de `XOOPS_PATH`; vous n'avez pas besoin de le configurer séparément.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — par défaut à `true`; utilise la liste de suffixes publics pour dériver le bon domaine de cookie.
* `XOOPS_DB_LEGACY_LOG` — par défaut à `false`; définissez sur `true` en développement pour enregistrer l'utilisation des API de base de données héritées.
* `XOOPS_DEBUG` — par défaut à `false`; définissez sur `true` en développement pour activer les rapports d'erreur supplémentaires.

Vous n'avez pas besoin de modifier ces éléments à la main pendant l'installation — les valeurs par défaut sont appropriées pour un site de production. Ils sont mentionnés ici afin que vous sachiez quoi chercher si vous ouvrez `mainfile.php` plus tard.

## Erreurs

Si XOOPS détecte des erreurs lors de l'écriture des fichiers de configuration, il affichera des messages détaillant ce qui ne va pas.

![Erreurs d'enregistrement de la configuration du programme d'installation XOOPS](/xoops-docs/2.7/img/installation/installer-07-errors.png)

Dans de nombreux cas, une installation par défaut d'un système dérivé de Debian utilisant mod_php dans Apache est la source d'erreurs. La plupart des fournisseurs d'hébergement ont des configurations qui n'ont pas ces problèmes.

### Problèmes de permission de groupe

Le processus PHP s'exécute à l'aide des permissions d'un utilisateur. Les fichiers sont également appartenant à un utilisateur. Si ces deux ne sont pas le même utilisateur, les permissions de groupe peuvent être utilisées pour permettre au processus PHP de partager les fichiers avec votre compte d'utilisateur. Cela signifie généralement que vous devez modifier le groupe des fichiers et répertoires dont XOOPS a besoin d'écrire.

Pour la configuration par défaut mentionnée ci-dessus, cela signifie que le groupe _www-data_ doit être spécifié comme groupe des fichiers et répertoires, et ces fichiers et répertoires doivent être accessibles en écriture par le groupe.

Vous devriez examiner attentivement votre configuration et choisir soigneusement comment résoudre ces problèmes pour une boîte disponible sur l'Internet ouvert.

Les commandes d'exemple pourraient être :

```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```

### Impossible de créer mainfile.php

Dans les systèmes de type Unix, la permission de créer un nouveau fichier dépend des permissions accordées sur le dossier parent. Dans certains cas, cette permission n'est pas disponible, et l'accorder peut être une préoccupation de sécurité.

Si vous avez un problème de configuration, vous pouvez trouver une variable _mainfile.php_ factice dans le répertoire _extras_ de la distribution XOOPS. Copiez ce fichier dans la racine Web et définissez les permissions sur le fichier :

```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```

### Environnements SELinux

Les contextes de sécurité SELinux peuvent être une source de problèmes. Si cela vous concerne, veuillez vous reporter à [Special Topics](../specialtopics.md) pour plus d'informations.
