---
title: "Annexe 5 : Augmenter la sécurité de votre installation XOOPS"
---

Après l'installation de XOOPS 2.7.0, prenez les étapes suivantes pour renforcer le site. Chaque étape est optionnelle individuellement, mais ensemble, elles augmentent considérablement la sécurité de base de l'installation.

## 1. Installer et configurer le module Protector

Le module `protector` groupé est le pare-feu XOOPS. Si vous ne l'avez pas installé lors de l'assistant initial, installez-le à partir de l'écran Admin → Modules maintenant.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Ouvrez le panneau d'administration de Protector et passez en revue les avertissements qu'il affiche. Les directives PHP héritées telles que `register_globals` n'existent plus (PHP 8.2+ les a supprimées), vous ne verrez donc pas ces avertissements plus. Les avertissements actuels concernent généralement les permissions des répertoires, les paramètres de session et la configuration du chemin de confiance.

## 2. Verrouiller `mainfile.php` et `secure.php`

Quand le programme d'installation se termine, il essaie de marquer les deux fichiers en lecture seule, mais certains hébergeurs rétablissent les permissions. Vérifiez et réappliquez si nécessaire :

- `mainfile.php` → `0444` (propriétaire, groupe, autre lecture seule)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` définit les constantes de chemin (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) et les drapeaux de production. `secure.php` contient les identifiants de base de données :

- Dans 2.5.x, les identifiants de base de données avaient l'habitude de vivre dans `mainfile.php`. Ils sont maintenant stockés dans `xoops_data/data/secure.php`, qui est chargé par `mainfile.php` au runtime. Garder `secure.php` à l'intérieur de `xoops_data/` — un répertoire que vous êtes encouragé à déplacer en dehors de la racine du document — le rend beaucoup plus difficile pour un attaquant d'accéder aux identifiants via HTTP.

## 3. Déplacer `xoops_lib/` et `xoops_data/` en dehors de la racine du document

Si vous ne l'avez pas déjà fait, déplacez ces deux répertoires un niveau au-dessus de votre racine web et renommez-les. Ensuite, mettez à jour les constantes correspondantes dans `mainfile.php` :

```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```

Placer ces répertoires en dehors de la racine du document empêche l'accès direct à l'arborescence `vendor/` de Composer, aux modèles mis en cache, aux fichiers de session, aux données chargées et aux identifiants de base de données dans `secure.php`.

## 4. Configuration du domaine du cookie

XOOPS 2.7.0 introduit deux constantes de domaine de cookie dans `mainfile.php` :

```php
// Utilisez la Public Suffix List (PSL) pour dériver le domaine enregistrable.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Domaine de cookie explicite; peut être vide, l'hôte complet ou le domaine enregistrable.
define('XOOPS_COOKIE_DOMAIN', '');
```

Lignes directrices :

- Laissez `XOOPS_COOKIE_DOMAIN` vide si vous servez XOOPS à partir d'un seul nom d'hôte ou d'une IP.
- Utilisez l'hôte complet (par exemple `www.example.com`) pour limiter les cookies à cet hôte uniquement.
- Utilisez le domaine enregistrable (par exemple `example.com`) quand vous voulez que les cookies soient partagés entre `www.example.com`, `blog.example.com`, etc.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true` permet à XOOPS de diviser correctement les TLD composés (`co.uk`, `com.au`, …) au lieu de les définir accidentellement sur le TLD effectif.

## 5. Drapeaux de production dans `mainfile.php`

`mainfile.dist.php` est livré avec ces deux drapeaux définis sur `false` pour la production :

```php
define('XOOPS_DB_LEGACY_LOG', false); // désactiver la journalisation d'utilisation SQL héritée
define('XOOPS_DEBUG',         false); // désactiver les avis de débogage
```

Laissez-les désactivés en production. Activez-les temporairement dans un environnement de développement ou de staging quand vous voulez :

- Chasser les appels de base de données hérités restants (`XOOPS_DB_LEGACY_LOG = true`);
- Surface des avis `E_USER_DEPRECATED` et d'autres résultats de débogage (`XOOPS_DEBUG = true`).

## 6. Supprimer le programme d'installation

Après que l'installation soit terminée :

1. Supprimez tout répertoire renommé `install_remove_*` de la racine web.
2. Supprimez tous les scripts `install_cleanup_*.php` que l'assistant a créés lors du nettoyage.
3. Confirmez que le répertoire `install/` n'est plus accessible via HTTP.

Laisser un répertoire d'installation désactivé mais présent est un risque de faible sévérité mais évitable.

## 7. Gardez XOOPS et les modules à jour

XOOPS suit un cycle de patch régulier. Abonnez-vous au référentiel XoopsCore27 GitHub pour les notifications de version, et mettez à jour votre site et tous les modules tiers chaque fois qu'une nouvelle version est publiée. Les mises à jour de sécurité pour 2.7.x sont publiées via la page Versions du référentiel.
