---
title: "Notes pour les Développeurs"
---

Bien que l'installation réelle de XOOPS pour une utilisation en développement soit similaire à l'installation normale déjà décrite, il y a des différences clés lors de la construction d'un système prêt pour les développeurs.

Une grande différence dans une installation de développeur est que, au lieu de se concentrer uniquement sur le contenu du répertoire _htdocs_, une installation de développeur conserve tous les fichiers et les maintient sous contrôle de code source en utilisant git.

Une autre différence est que les répertoires _xoops_data_ et _xoops_lib_ peuvent généralement rester en place sans renommage, tant que votre système de développement n'est pas directement accessible sur Internet ouvert (c'est-à-dire sur un réseau privé, par exemple derrière un routeur.)

La plupart des développeurs travaillent sur un système _localhost_, qui contient le code source, une pile de serveur web et tous les outils nécessaires pour travailler avec le code et la base de données.

Vous pouvez trouver plus d'informations dans le chapitre [Outils du Métier](../tools/tools.md).

## Git et Hôtes Virtuels

La plupart des développeurs veulent pouvoir rester à jour avec les sources actuelles et contribuer les modifications apportées en amont vers le référentiel [XOOPS/XoopsCore27 sur GitHub](https://github.com/XOOPS/XoopsCore27). Cela signifie qu'au lieu de télécharger une archive de version, vous voudrez [forker](https://help.github.com/articles/fork-a-repo/) une copie de XOOPS et utiliser **git** pour [cloner](https://help.github.com/categories/bootcamp/) ce référentiel sur votre boîte de développement.

Puisque le référentiel a une structure spécifique, au lieu de _copier_ les fichiers du répertoire _htdocs_ vers votre serveur web, il est préférable de pointer votre serveur web vers le dossier htdocs à l'intérieur de votre référentiel cloné localement. Pour accomplir cela, nous créons généralement un nouvel _Hôte Virtuel_, ou _vhost_, qui pointe vers notre code source contrôlé par git.

Dans un environnement [WAMP](http://www.wampserver.com/), la page [localhost](http://localhost/) par défaut a dans la section _Tools_ un lien vers _Add a Virtual Host_ qui mène ici :

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

En utilisant ceci, vous pouvez configurer une entrée VirtualHost qui descendra directement dans votre référentiel (toujours) contrôlé par git.

Voici un exemple d'entrée dans `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`

```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```

Vous devrez peut-être également ajouter une entrée dans `Windows/System32/drivers/etc/hosts` :

```text
127.0.0.1    xoops.localhost
```

Maintenant, vous pouvez installer sur `http://xoops.localhost/` pour tester, tout en gardant votre référentiel intact et en gardant le serveur web dans le répertoire htdocs avec une URL simple. De plus, vous pouvez mettre à jour votre copie locale de XOOPS vers le dernier master à tout moment sans avoir à réinstaller ou copier les fichiers. Et vous pouvez apporter des améliorations et des corrections au code pour contribuer à XOOPS via GitHub.

## Dépendances Composer

XOOPS 2.7.0 utilise [Composer](https://getcomposer.org/) pour gérer ses dépendances PHP. L'arborescence des dépendances se trouve dans `htdocs/xoops_lib/` à l'intérieur du référentiel source :

* `composer.dist.json` est la liste principale des dépendances fournies avec la version.
* `composer.json` est la copie locale, que vous pouvez personnaliser pour votre environnement de développement si nécessaire.
* `composer.lock` épingle les versions exactes pour que les installations soient reproductibles.
* `vendor/` contient les bibliothèques installées (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom et autres).

Pour un clone git frais de XOOPS 2.7.0, à partir de la racine du référentiel, exécutez :

```text
cd htdocs/xoops_lib
composer install
```

Notez qu'il n'y a pas de `composer.json` à la racine du référentiel — le projet se trouve sous `htdocs/xoops_lib/`, donc vous devez `cd` dans ce répertoire avant d'exécuter Composer.

Les tarballs de version livrent le `vendor/` pré-rempli, mais les clones git peuvent ne pas l'être. Gardez `vendor/` intact sur les installations de développement — XOOPS chargera ses dépendances à partir de là au moment de l'exécution.

La bibliothèque [XMF (XOOPS Module Framework)](https://github.com/XOOPS/xmf) est fournie en tant que dépendance Composer dans 2.7.0, vous pouvez donc utiliser `Xmf\Request`, `Xmf\Database\TableLoad` et les classes connexes dans le code de votre module sans aucune installation supplémentaire.

## Module DebugBar

XOOPS 2.7.0 expédie un module **DebugBar** basé sur Symfony VarDumper. Il ajoute une barre d'outils de débogage aux pages rendues qui expose les informations de requête, de base de données et de modèle. Installez-le à partir de la zone Modules admin sur les sites de développement et d'intermédiaire. Ne le laissez pas installé sur un site de production public à moins que vous ne sachiez que vous le voulez.
