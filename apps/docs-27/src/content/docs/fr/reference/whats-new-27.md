---
title: "Nouveautés de XOOPS 2.7.0"
---

XOOPS 2.7.0 est une mise à jour importante par rapport à la série 2.5.x. Avant d'installer ou de mettre à niveau, consultez les modifications sur cette page afin de savoir à quoi vous attendre. La liste ci-dessous se concentre sur les éléments qui affectent l'installation et l'administration du site — pour une liste complète des modifications, consultez les notes de version livrées avec la distribution.

## PHP 8.2 est le nouveau minimum

XOOPS 2.7.0 nécessite **PHP 8.2 ou plus récent**. PHP 7.x et versions antérieures ne sont plus pris en charge. PHP 8.4 ou supérieur est fortement recommandé.

**Action:** Confirmez que votre hôte offre PHP 8.2+ avant de commencer. Voir [Exigences](installation/requirements.md).

## MySQL 5.7 est le nouveau minimum

Le nouveau minimum est **MySQL 5.7** (ou une MariaDB compatible). MySQL 8.4 ou supérieur est fortement recommandé. MySQL 9.0 est également pris en charge.

Les anciens avertissements concernant les problèmes de compatibilité PHP/MySQL 8 ne s'appliquent plus, car les versions PHP affectées ne sont plus prises en charge par XOOPS.

## Smarty 4 remplace Smarty 3

C'est le plus grand changement pour les sites existants. XOOPS 2.7.0 utilise **Smarty 4** comme moteur de templating. Smarty 4 est plus strict qu'un Smarty 3 concernant la syntaxe des modèles, et certains modèles personnalisés de thèmes et de modules peuvent nécessiter des ajustements avant de s'afficher correctement.

Pour vous aider à identifier et réparer ces problèmes, XOOPS 2.7.0 livre un **scanner de contrôle en amont** dans le répertoire `upgrade/` qui examine vos modèles existants à la recherche d'incompatibilités Smarty 4 connues et peut réparer automatiquement beaucoup d'entre elles.

**Action:** Si vous effectuez une mise à niveau à partir de 2.5.x et disposez de thèmes personnalisés ou de modules plus anciens, exécutez le [Contrôle en amont](upgrading/upgrade/preflight.md) _avant_ d'exécuter le programme de mise à niveau principal.

## Dépendances gérées par Composer

XOOPS 2.7.0 utilise **Composer** pour gérer ses dépendances PHP. Celles-ci résident dans `xoops_lib/vendor/`. Les bibliothèques tierces qui étaient auparavant intégrées au noyau ou aux modules — PHPMailer, HTMLPurifier, Smarty et autres — sont maintenant fournies via Composer.

**Action:** La plupart des opérateurs de site n'ont rien à faire — les archives distribuées sont livrées avec `vendor/` déjà rempli. Si vous déplacez ou mettez à niveau un site, copiez l'arborescence complète `xoops_lib/`, y compris `vendor/`. Les développeurs clonant le dépôt git doivent exécuter `composer install` à l'intérieur de `htdocs/xoops_lib/`. Voir [Notes pour les développeurs](notes-for-developers/developers.md).

## Préférences de cookie de session renforcées

Deux nouvelles préférences sont ajoutées lors de la mise à niveau:

* **`session_cookie_samesite`** — contrôle l'attribut SameSite sur les cookies de session (`Lax`, `Strict` ou `None`).
* **`session_cookie_secure`** — lorsqu'elle est activée, les cookies de session ne sont envoyés que via HTTPS.

**Action:** Après la mise à niveau, passez en revue ces paramètres sous Options système → Préférences → Paramètres généraux. Voir [Après la mise à niveau](upgrading/upgrade/ustep-04.md).

## Nouvelle table `tokens`

XOOPS 2.7.0 ajoute une table de base de données `tokens` pour le stockage de jetons délimités génériques. Le programme de mise à niveau crée cette table automatiquement dans le cadre de la mise à niveau 2.5.11 → 2.7.0.

## Stockage de mots de passe modernisé

La colonne `bannerclient.passwd` a été élargie à `VARCHAR(255)` pour pouvoir contenir des hachages de mots de passe modernes (bcrypt, argon2). Le programme de mise à niveau élargit la colonne automatiquement.

## Gamme de thèmes et de modules mise à jour

XOOPS 2.7.0 est livré avec des thèmes front-end mis à jour:

* `default`, `xbootstrap` (héritage), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Un nouveau thème d'administration **Modern** est inclus aux côtés du thème Transition existant.

Un nouveau module **DebugBar** basé sur Symfony VarDumper est livré comme l'un des modules installables optionnels. C'est utile pour le développement et l'exploitation, mais n'est généralement pas installé sur les sites de production publique.

Voir [Sélectionner le thème](installation/installation/step-12.md) et [Installation des modules](installation/installation/step-13.md).

## La copie d'une nouvelle version ne remplace plus la configuration

Auparavant, la copie d'une nouvelle distribution XOOPS sur un site existant nécessitait de la prudence pour éviter de remplacer `mainfile.php` et d'autres fichiers de configuration. Dans 2.7.0, le processus de copie laisse les fichiers de configuration existants intacts, ce qui rend les mises à niveau notablement plus sûres.

Vous devez toujours faire une sauvegarde complète avant toute mise à niveau.

## Capacité de surcharge de modèle dans les thèmes d'administration système

Les thèmes d'administration dans XOOPS 2.7.0 peuvent maintenant remplacer les modèles d'administration système individuels, ce qui facilite la personnalisation de l'interface utilisateur d'administration sans forker l'ensemble du module système.

## Ce qui n'a pas changé

Pour vous rassurer, ces parties de XOOPS fonctionnent de la même manière dans 2.7.0 que dans 2.5.x:

* L'ordre et le flux global des pages d'installation
* La division de configuration `mainfile.php` plus `xoops_data/data/secure.php`
* La pratique recommandée de relocaliser `xoops_data` et `xoops_lib` en dehors de la racine Web
* Le modèle d'installation de module et le format de manifeste `xoops_version.php`
* Le flux de travail du déplacement de site (sauvegarde, édition de `mainfile.php`/`secure.php`, utilisation de SRDB ou similaire)

## Où aller ensuite

* Partir de zéro? Passez à [Exigences](installation/requirements.md).
* Mise à niveau à partir de 2.5.x? Commencez par [Mise à niveau](upgrading/upgrade/README.md), puis exécutez le [Contrôle en amont](upgrading/upgrade/preflight.md).
