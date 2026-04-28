---
title: "Déplacer un site"
---

C'est une technique très utile de prototyper un nouveau site XOOPS sur un système local ou un serveur de développement. C'est aussi très prudent de tester une mise à niveau de XOOPS sur une copie de votre site de production d'abord, juste au cas où quelque chose tournerait mal. Pour accomplir cela, vous devez pouvoir déplacer votre site XOOPS d'un site à un autre. Voici ce que vous devez savoir pour déplacer avec succès votre site XOOPS.

La première étape est d'établir votre nouvel environnement de site. Les mêmes éléments couverts dans la section [Préparations préalables](../installation/preparations/) s'appliquent également ici.

En résumé, les étapes sont :

* obtenir l'hébergement, y compris tout domaine ou exigences de messagerie
* obtenir un compte utilisateur MySQL et un mot de passe
* obtenir une base de données MySQL que l'utilisateur ci-dessus a tous les privilèges

Le reste du processus est très similaire à une installation normale, mais :

* au lieu de copier les fichiers de la distribution XOOPS, vous les copierez du site existant
* au lieu d'exécuter le programme d'installation, vous importerez une base de données déjà remplie
* au lieu d'entrer les réponses dans le programme d'installation, vous changerez les réponses précédentes dans les fichiers et la base de données

## Copier les fichiers du site existant

Faites une copie complète des fichiers de votre site existant sur votre machine locale où vous pouvez les éditer. Si vous travaillez avec un hôte distant, vous pouvez utiliser FTP pour copier les fichiers. Vous avez besoin d'une copie avec laquelle travailler même si le site s'exécute sur votre machine locale, faites simplement une autre copie des répertoires du site dans ce cas.

Il est important de se souvenir d'inclure les répertoires _xoops_data_ et _xoops_lib_ même s'ils ont été renommés et/ou déplacés.

Pour que les choses se passent mieux, vous devriez éliminer les fichiers de cache et les modèles compilés Smarty de votre copie. Ces fichiers seront recréés dans votre nouvel environnement et pourraient causer des problèmes avec les anciennes informations incorrectes conservées s'ils ne sont pas effacés. Pour ce faire, supprimez tous les fichiers, sauf _index.html_, dans tous ces trois répertoires :

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Remarque :** L'effacement de `smarty_compile` est particulièrement important lors du déplacement d'un site vers ou depuis XOOPS 2.7.0. XOOPS 2.7.0 utilise Smarty 4, et les modèles compilés Smarty 4 ne sont pas interchangeables avec les modèles compilés Smarty 3. Laisser les anciens fichiers compilés en place provoquera des erreurs de modèle au premier chargement de page sur le nouveau site.

### `xoops_lib` et les dépendances Composer

XOOPS 2.7.0 gère ses dépendances PHP via Composer, à l'intérieur de `xoops_lib/`. Le répertoire `xoops_lib/vendor/` contient les bibliothèques tierces dont XOOPS a besoin au runtime (Smarty 4, PHPMailer, HTMLPurifier, etc.). Lors du déplacement d'un site, vous devez copier l'ensemble de l'arborescence `xoops_lib/` — y compris `vendor/` — sur le nouvel hôte. N'essayez pas de régénérer `vendor/` sur l'hôte cible à moins que vous ne soyez un développeur qui a personnalisé `composer.json` et a Composer disponible sur la cible.

## Configurer le nouvel environnement

Les mêmes éléments couverts dans la section [Préparations préalables](../installation/preparations/) s'appliquent également ici. Nous supposerons ici que vous avez l'hébergement dont vous avez besoin pour le site que vous déplacez.

### Informations clés (mainfile.php et secure.php)

Le déplacement réussi d'un site implique de changer toutes les références aux noms et chemins de fichiers absolus, URLs, paramètres de base de données et identifiants d'accès.

Deux fichiers, `mainfile.php` dans la racine web de votre site, et `data/secure.php` dans le répertoire _xoops_data_ de votre site (renommé et/ou déplacé) définissent les paramètres de base de votre site, comme son URL, où il se trouve dans le système de fichiers hôte, et comment il se connecte à la base de données.

Vous devez connaître à la fois les valeurs dans l'ancien système et ce qu'elles seront dans le nouveau système.

#### mainfile.php

| Nom | Ancienne valeur dans mainfile.php | Nouvelle valeur dans mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Ouvrez _mainfile.php_ dans votre éditeur. Modifiez les valeurs des définitions affichées dans le tableau ci-dessus des anciennes valeurs aux valeurs appropriées pour le nouveau site.

Prenez des notes sur les anciennes et nouvelles valeurs, car nous en aurons besoin dans d'autres endroits dans d'autres étapes.

Par exemple, si vous déplacez un site de votre PC local vers un service d'hébergement commercial, vos valeurs pourraient ressembler à ceci :

| Nom | Ancienne valeur dans mainfile.php | Nouvelle valeur dans mainfile.php |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | localhost | example.com |

Après avoir modifié _mainfile.php_, enregistrez-le.

Il est possible que certains autres fichiers contiennent des références codées en dur à votre URL ou même à des chemins. C'est plus probable dans les thèmes personnalisés et les menus, mais avec votre éditeur, vous pouvez chercher dans tous les fichiers, juste pour être sûr.

Dans votre éditeur, faites une recherche dans les fichiers de votre copie, recherchant l'ancienne valeur XOOPS_URL, et remplacez-la par la nouvelle valeur.

Faites de même pour l'ancienne valeur XOOPS_ROOT_PATH, en remplaçant toutes les occurrences par la nouvelle valeur.

Gardez vos notes, car nous devrons les utiliser à nouveau plus tard à mesure que nous déplaçons la base de données.

#### data/secure.php

| Nom | Ancienne valeur dans data/secure.php | Nouvelle valeur dans data/secure.php |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Ouvrez le _data/secure.php_ dans le répertoire _xoops_data_ renommé et/ou déplacé dans votre éditeur. Modifiez les valeurs des définitions affichées dans le tableau ci-dessus des anciennes valeurs aux valeurs appropriées pour le nouveau site.

#### Autres fichiers

Il y a d'autres fichiers qui pourraient avoir besoin d'attention lors du déplacement de votre site. Des exemples courants sont les clés API pour divers services qui pourraient être liés au domaine, tels que :

* Google Maps
* Recaptch2
* Boutons "J'aime"
* Partage de liens et/ou publicité telle que Shareaholic ou AddThis

Changer ces types d'associations ne peut pas être facilement automatisé, car les connexions à l'ancien domaine font généralement partie de l'enregistrement du côté du service. Dans certains cas, cela pourrait simplement ajouter ou changer le domaine associé au service.

### Copier les fichiers vers le nouveau site

Copiez vos fichiers maintenant modifiés vers votre nouveau site. Les techniques sont les mêmes que celles utilisées lors de l'[Installation](../installation/installation/), c'est-à-dire en utilisant FTP.

## Copier la base de données du site existant

### Sauvegarder la base de données de l'ancien serveur

Pour cette étape, l'utilisation de _phpMyAdmin_ est hautement recommandée. Connectez-vous à _phpMyAdmin_ pour votre site existant, sélectionnez votre base de données et choisissez _Exporter_.

Les paramètres par défaut sont généralement corrects, il suffit de sélectionner la "Méthode d'exportation" de _Rapide_ et le "Format" de _SQL_.

Utilisez le bouton _Aller_ pour télécharger la sauvegarde de la base de données.

![Exporter une base de données avec phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

Si vous avez des tables dans votre base de données qui ne proviennent pas de XOOPS ou de ses modules, et ne sont PAS censées être déplacées, vous devez sélectionner la "Méthode d'exportation" de _Personnalisée_ et choisir uniquement les tables liées à XOOPS dans votre base de données. (Celles-ci commencent par le "préfixe" que vous avez spécifié lors de l'installation. Vous pouvez consulter votre préfixe de base de données dans le fichier `xoops_data/data/secure.php`.)

### Restaurer la base de données sur le nouveau serveur

Sur votre nouvel hôte, en utilisant votre nouvelle base de données, restaurez la base de données en utilisant des [outils](../tools/tools.md) tels que l'onglet _Importer_ dans _phpMyAdmin_ (ou _bigdump_ si nécessaire.)

### Mettre à jour les URLs et les chemins dans la base de données

Mettez à jour tous les liens http vers les ressources sur votre site dans votre base de données. Cela peut être un énorme effort, et il y a un [outil](../tools/tools.md) pour le rendre plus facile.

Interconnect/it a un produit appelé Search-Replace-DB qui peut aider à cela. Il est livré avec une prise de conscience des environnements Wordpress et Drupal intégrés. Tel quel, cet outil peut être très utile, mais c'est encore mieux quand il est conscient de votre XOOPS. Vous pouvez trouver une version consciente de XOOPS à [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Suivez les instructions du fichier README.md pour télécharger et installer temporairement cet utilitaire sur votre site. Plus tôt, nous avons changé la définition XOOPS_URL. Lorsque vous exécutez cet outil, vous voulez remplacer la définition XOOPS_URL originale par la nouvelle définition, c'est-à-dire remplacer [http://localhost/xoops](http://localhost/xoops) par [https://example.com](https://example.com)

![Utilisation de Seach and Replace DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Entrez vos anciens et nouveaux URL, et choisissez l'option d'exécution à blanc. Vérifiez les modifications et, si tout semble correct, passez à l'option d'exécution directe. Cette étape interceptera les éléments de configuration et les liens à l'intérieur de votre contenu qui font référence à votre URL de site.

![Vérification des modifications dans SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

Répétez le processus en utilisant vos anciennes et nouvelles valeurs pour XOOPS_ROOT_PATH.

#### Approche alternative sans SRDB

Un autre moyen d'accomplir cette étape sans l'outil srdb serait de décharger votre base de données, d'éditer le vidage dans un éditeur de texte en changeant les URL et les chemins, puis de recharger la base de données à partir de votre vidage édité. Oui, ce processus est assez impliqué et comporte assez de risques que les gens ont été motivés à créer des outils spécialisés comme Search-Replace-DB.

## Essayer votre site déplacé

À ce stade, votre site devrait être prêt à s'exécuter dans son nouvel environnement !

Bien sûr, il peut toujours y avoir des problèmes. N'ayez pas peur de poster vos questions sur les [Forums XOOPS](https://xoops.org/modules/newbb/index.php).
