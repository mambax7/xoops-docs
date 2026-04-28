---
title: "Examen de compatibilité XOOPS 2.7.0 pour ce guide"
---

Ce document énumère les modifications nécessaires dans ce dépôt afin que le guide d'installation corresponde à XOOPS 2.7.0.

Base d'examen:

- Dépôt de guide actuel: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- Noyau XOOPS 2.7.0 examiné à: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Sources principales 2.7.0 vérifiées:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Portée

Ce dépôt contient actuellement:

- Fichiers Markdown anglais au niveau racine utilisés comme guide principal.
- Une copie `en/` partielle.
- Arbres complets `de/` et `fr/` avec leurs propres actifs.

Les fichiers au niveau racine ont besoin d'une première passe. Après cela, des modifications équivalentes doivent être réfléchies dans `de/book/` et `fr/book/`. L'arborescence `en/` a également besoin d'un nettoyage car elle semble seulement partiellement maintenue.

## 1. Modifications du référentiel mondial

### 1.1 Versioning et métadonnées

Mettez à jour toutes les références au niveau du guide de XOOPS 2.5.x à XOOPS 2.7.0.

Fichiers affectés:

- `README.md`
- `SUMMARY.md` — table des matières live principale pour le guide racine; les étiquettes de navigation et les titres de section doivent correspondre aux nouveaux titres de chapitres et à la section Notes de mise à niveau historiques renommée
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- `de/book/*.md` et `fr/book/*.md` localisés

Modifications requises:

- Changez `for XOOPS 2.5.7.x` en `for XOOPS 2.7.0`.
- Mettez à jour l'année du droit d'auteur de `2018` à `2026`.
- Remplacez les anciennes références XOOPS 2.5.x et 2.6.0 où elles décrivent la version actuelle.
- Remplacez les anciennes orientations de téléchargement SourceForge par les versions GitHub:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Rafraîchissement des liens

`about-xoops-cms.md` et les fichiers `10aboutxoops.md` localisés pointent toujours vers les anciens emplacements GitHub 2.5.x et 2.6.0. Ces liens doivent être mises à jour vers les emplacements actuels du projet 2.7.x.

### 1.3 Rafraîchissement des captures d'écran

Toutes les captures d'écran montrant l'installateur, l'interface utilisateur de mise à niveau, le tableau de bord administrateur, le sélecteur de thème, le sélecteur de module et les écrans post-installation sont obsolètes.

Arbres d'actifs affectés:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Il s'agit d'un rafraîchissement complet, pas d'un partiel. L'installateur 2.7.0 utilise une disposition basée sur Bootstrap différente et une structure visuelle différente.

## 2. Chapitre 2: Introduction

Fichier:

- `chapter-2-introduction.md`

### 2.1 Les exigences du système doivent être réécrites

Le chapitre actuel ne dit que Apache, MySQL et PHP. XOOPS 2.7.0 a des minimums explicites:

| Composant | Minimum 2.7.0 | Recommandation 2.7.0 |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Serveur web | Tout serveur supportant le PHP requis | Apache ou Nginx recommandés |

Remarques à ajouter:

- IIS est toujours répertorié dans l'installateur comme possible, mais Apache et Nginx sont les exemples recommandés.
- Les notes de version appellent également la compatibilité MySQL 9.0.

### 2.2 Ajouter une liste de vérification requise et recommandée des extensions PHP

L'installateur 2.7.0 sépare maintenant les exigences strictes des extensions recommandées.

Contrôles requis affichés par l'installateur:

- MySQLi
- Session
- PCRE
- filter
- `file_uploads`
- fileinfo

Extensions recommandées:

- mbstring
- intl
- iconv
- xml
- zlib
- gd
- exif
- curl

### 2.3 Supprimer les instructions de somme de contrôle

L'étape 5 actuelle décrit `checksum.php` et `checksum.mdi`. Ces fichiers ne font pas partie de XOOPS 2.7.0.

Action:

- Supprimez complètement la section de vérification de la somme de contrôle.

### 2.4 Mettre à jour les instructions de package et de téléchargement

Conservez la description de la mise en page du package `docs/`, `extras/`, `htdocs/`, `upgrade/`, mais mettez à jour le texte de téléchargement et de préparation pour refléter les attentes du chemin actuel accessible en écriture:

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Le guide sousestime actuellement cela.

### 2.5 Remplacer la langue de traduction/téléchargement SourceForge

Le texte actuel dit toujours de visiter XOOPS sur SourceForge pour d'autres paquets de langue. Cela doit être remplacé par les orientations actuelles de téléchargement de projets/communauté.

## 3. Chapitre 3: Vérification de la configuration du serveur

Fichier:

- `chapter-3-server-configuration-check.md`

Modifications requises:

- Réécrivez la description de la page autour de la mise en page actuelle à deux blocs:
  - Exigences
  - Extensions recommandées
- Remplacez l'ancienne capture d'écran.
- Documentez explicitement les vérifications d'exigences énumérées ci-dessus.

## 4. Chapitre 4: Prendre le bon chemin

Fichier:

- `chapter-4-take-the-right-path.md`

Modifications requises:

- Ajoutez le nouveau champ `Cookie Domain`.
- Mettez à jour les noms et les descriptions des champs de chemin pour correspondre à 2.7.0:
  - XOOPS Root Path
  - XOOPS Data Path
  - XOOPS Library Path
  - XOOPS URL
  - Cookie Domain
- Ajoutez une note que la modification du chemin de la bibliothèque nécessite maintenant un autoloader Composer valide à `vendor/autoload.php`.

C'est une vérification de compatibilité réelle dans 2.7.0 et devrait être documentée clairement. Le guide actuel ne mentionne pas Composer du tout.

## 5. Chapitre 5: Connexions de base de données

Fichier:

- `chapter-5-database-connections.md`

Modifications requises:

- Gardez la déclaration que seul MySQL est pris en charge.
- Mettez à jour la section de configuration de la base de données pour refléter:
  - le jeu de caractères par défaut est maintenant `utf8mb4`
  - la sélection du classement se met à jour dynamiquement lorsque le jeu de caractères change
- Remplacez les captures d'écran pour les pages de connexion et de configuration de la base de données.

Le texte actuel disant que le jeu de caractères et le classement ne nécessitent pas d'attention est trop faible pour 2.7.0. Il devrait au moins mentionner le nouveau défaut `utf8mb4` et le sélecteur de classement dynamique.

## 6. Chapitre 6: Configuration finale du système

Fichier:

- `chapter-6-final-system-configuration.md`

### 6.1 Les fichiers de configuration générés ont changé

Le guide dit actuellement que l'installateur écrit `mainfile.php` et `secure.php`.

En 2.7.0, il installe également des fichiers de configuration dans `xoops_data/configs/`, y compris:

- `xoopsconfig.php`
- fichiers de configuration du captcha
- fichiers de configuration du textsanitizer

### 6.2 Les fichiers de configuration existants dans `xoops_data/configs/` ne sont pas remplacés

Le comportement de non-remplacement est **étendu**, pas global. Deux chemins de code distincts dans `page_configsave.php` écrivent les fichiers de configuration:

- `writeConfigurationFile()` (appelé aux lignes 59 et 66) **toujours** régénère `xoops_data/data/secure.php` et `mainfile.php` à partir de l'entrée de l'assistant. Il n'y a pas de vérification d'existence; une copie existante est remplacée.
- `copyConfigDistFiles()` (appelé à la ligne 62, défini à la ligne 317) ne copie que les fichiers `xoops_data/configs/` (`xoopsconfig.php`, les configurations du captcha, les configurations du textsanitizer) **si la destination n'existe pas déjà**.

La réecriture du chapitre doit refléter les deux comportements clairement:

- Pour `mainfile.php` et `secure.php`: avertissez que toute édition manuelle de ces fichiers sera remplacée lorsque l'installateur sera relancé.
- Pour les fichiers `xoops_data/configs/`: expliquez que les personnalisations locales sont préservées entre les réexécutions et les mises à niveau, et que la restauration des paramètres par défaut expédiés nécessite la suppression du fichier et la réexécution (ou la copie manuelle du `.dist.php` correspondant).

Ne généralisez pas "les fichiers existants sont préservés" dans tous les fichiers de configuration écrits par l'installateur — ce n'est pas exact et pourrait tromper les administrateurs éditant `mainfile.php` ou `secure.php`.

### 6.3 Le traitement HTTPS et reverse proxy a changé

Le `mainfile.php` généré prend désormais en charge une détection de protocole plus large, y compris les en-têtes de proxy inverse. Le guide devrait mentionner cela au lieu d'impliquer que seule la détection directe `http` ou `https`.

### 6.4 Le nombre de tables est faux

Le chapitre actuel dit qu'un nouveau site crée `32` tables.

XOOPS 2.7.0 crée `33` tables. La table manquante est:

- `tokens`

Action:

- Mettez à jour le décompte de 32 à 33.
- Ajoutez `tokens` à la liste des tables.

## 7. Chapitre 7: Paramètres d'administration

Fichier:

- `chapter-7-administration-settings.md`

### 7.1 La description de l'interface utilisateur du mot de passe est obsolète

L'installateur inclut toujours la génération de mot de passe, mais il inclut maintenant également:

- Indicateur de force de mot de passe basé sur zxcvbn
- étiquettes de force visuelles
- générateur de 16 caractères et flux de copie

Mettez à jour le texte et les captures d'écran pour décrire le panneau de mot de passe actuel.

### 7.2 La validation des e-mails est maintenant appliquée

L'e-mail administrateur est validé avec `FILTER_VALIDATE_EMAIL`. Le chapitre devrait mentionner que les valeurs d'e-mail invalides sont rejetées.

### 7.3 La section de la clé de licence est fausse

C'est l'une des corrections factuelles les plus importantes.

Le guide actuel dit:

- il y a une `License System Key`
- elle est stockée dans `/include/license.php`
- `/include/license.php` doit être accessible en écriture lors de l'installation

Ce n'est plus exact.

Ce que 2.7.0 fait réellement:

- l'installation écrit les données de licence dans `xoops_data/data/license.php`
- `htdocs/include/license.php` est maintenant juste un wrapper obsolète qui charge le fichier depuis `XOOPS_VAR_PATH`
- la formulation ancienne à propos de rendre `/include/license.php` accessible en écriture devrait être supprimée

Action:

- Réécrivez cette section au lieu de la supprimer.
- Mettez à jour le chemin de `/include/license.php` à `xoops_data/data/license.php`.

### 7.4 La liste des thèmes est obsolète

Le guide actuel fait toujours référence à Zetagenesis et à l'ancien ensemble de thèmes de l'ère 2.5.

Les thèmes présents dans XOOPS 2.7.0:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Notez également:

- `xswatch4` est le thème par défaut actuel inséré par les données du programme d'installation.
- Zetagenesis ne fait plus partie de la liste des thèmes empaquetés.

### 7.5 La liste des modules est obsolète

Les modules présents dans le package 2.7.0:

- `system` — installé automatiquement lors des étapes de remplissage de table / insertion de données. Toujours présent, jamais visible dans le sélecteur.
- `debugbar` — sélectionnable à l'étape du programme d'installation.
- `pm` — sélectionnable à l'étape du programme d'installation.
- `profile` — sélectionnable à l'étape du programme d'installation.
- `protector` — sélectionnable à l'étape du programme d'installation.

Important: la page du programme d'installation du module (`htdocs/install/page_moduleinstaller.php`) construit sa liste de candidats en itérant sur `XoopsLists::getModulesList()` et **en filtrant tout ce qui est déjà dans la table des modules** (les lignes 95-102 collectent `$listed_mods`; la ligne 116 ignore tout répertoire présent dans cette liste). Comme `system` est installé avant cette étape, il n'apparaît jamais comme case à cocher.

Les modifications du guide nécessaires:

- Arrêtez de dire qu'il y a seulement trois modules intégrés.
- Décrivez l'étape du programme d'installation comme montrant **quatre modules sélectionnables** (`debugbar`, `pm`, `profile`, `protector`), pas cinq.
- Documentez `system` séparément comme le module principal toujours installé qui n'apparaît pas dans le sélecteur.
- Ajoutez `debugbar` à la description du module intégré comme nouveau dans 2.7.0.
- Notez que la présélection du module par défaut du programme d'installation est maintenant vide; les modules sont disponibles à choisir, mais pas pré-cochés par la configuration du programme d'installation.

## 8. Chapitre 8: Prêt à partir

Fichier:

- `chapter-8-ready-to-go.md`

### 8.1 Le processus de nettoyage après installation doit être réécrit

Le guide actuel dit que le programme d'installation renomme le dossier d'installation en un nom unique.

C'est toujours vrai en effet, mais le mécanisme a changé:

- un script de nettoyage externe est créé à la racine web
- la page finale déclenche le nettoyage via AJAX
- le dossier d'installation est renommé en `install_remove_<suffixe unique>`
- le secours à `cleanup.php` existe toujours

Action:

- Mettez à jour l'explication.
- Gardez l'instruction accessible à l'utilisateur simple: supprimez le répertoire d'installation renommé après l'installation.

### 8.2 Les références du tableau de bord d'administration du chapitre 8 sont obsolètes

Le chapitre 8 pointe toujours les lecteurs vers l'ancienne expérience d'administration de l'ère Oxygen. Cela doit s'aligner avec les thèmes d'administration actuels:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 L'orientation d'édition de chemin post-installation doit être corrigée

Le texte actuel dit aux lecteurs de mettre à jour `secure.php` avec les définitions de chemin. En 2.7.0, ces constantes de chemin sont définies dans `mainfile.php`, tandis que `secure.php` contient les données sécurisées. Le bloc d'exemple de ce chapitre devrait être corrigé en conséquence.

### 8.4 Les paramètres de production doivent être ajoutés

Le guide devrait explicitement mentionner les défauts de production maintenant présents dans `mainfile.dist.php`:

- `XOOPS_DB_LEGACY_LOG` devrait rester `false`
- `XOOPS_DEBUG` devrait rester `false`

## 9. Chapitre 9: Mise à niveau d'une installation XOOPS existante

Fichier:

- `chapter-9-upgrade-existing-xoops-installation.md`

Ce chapitre nécessite la réécriture la plus importante.

### 9.1 Ajouter l'étape de contrôle en amont obligatoire Smarty 4

Le flux de mise à niveau XOOPS 2.7.0 force maintenant le processus de contrôle en amont avant la fin de la mise à niveau.

Nouveau flux requis:

1. Copiez le répertoire `upgrade/` à la racine du site.
2. Exécutez `/upgrade/preflight.php`.
3. Scannez `/themes/` et `/modules/` pour l'ancienne syntaxe Smarty.
4. Utilisez le mode de réparation optionnel le cas échéant.
5. Relancez jusqu'à ce que ce soit propre.
6. Continuez dans `/upgrade/`.

Le chapitre actuel ne mentionne pas cela du tout, ce qui le rend incompatible avec l'orientation 2.7.0.

### 9.2 Remplacez la narrative de fusion manuelle de l'ère 2.5.2

Le chapitre actuel décrit toujours une mise à niveau manuelle de style 2.5.2 avec des fusions de framework, des notes AltSys et une restructuration de fichier gérée à la main. Cela devrait être remplacé par la séquence de mise à niveau réelle 2.7.x à partir de `release_notes.txt` et `upgrade/README.md`.

Contour du chapitre recommandé:

1. Sauvegardez les fichiers et la base de données.
2. Éteignez le site.
3. Copiez `htdocs/` sur la racine active.
4. Copiez `htdocs/xoops_lib` dans le chemin de la bibliothèque active.
5. Copiez `htdocs/xoops_data` dans le chemin de données actif.
6. Copiez `upgrade/` à la racine web.
7. Exécutez `preflight.php`.
8. Exécutez `/upgrade/`.
9. Complétez les invites du programme de mise à jour.
10. Mettez à jour le module `system`.
11. Mettez à jour `pm`, `profile` et `protector` s'ils sont installés.
12. Supprimez `upgrade/`.
13. Réactivez le site.

### 9.3 Documenter les vrais changements de mise à niveau 2.7.0

Le programme de mise à jour pour 2.7.0 inclut au moins ces changements concrets:

- créer la table `tokens`
- élargir `bannerclient.passwd` pour les hachages de mots de passe modernes
- ajouter les paramètres de préférence des cookies de session
- supprimer les répertoires intégrés obsolètes

Le guide n'a pas besoin d'exposer tous les détails d'implémentation, mais il devrait arrêter d'impliquer que la mise à niveau ne copie que des fichiers plus une mise à jour de module.

## 10. Pages de mise à niveau historiques

Fichiers:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Statut:** la décision structurelle est déjà résolue — le `SUMMARY.md` racine déplace ces derniers dans une section **Notes de mise à niveau historiques** dédiée, et chaque fichier porte une mention "Référence historique" pointant les lecteurs vers le chapitre 9 pour les mises à niveau 2.7.0. Ils ne sont plus des orientations de mise à niveau de première classe.

**Travaux restants (cohérence seulement):**

- Assurez-vous que `README.md` (racine) énumère ces derniers sous le même titre "Notes de mise à niveau historiques", pas sous un en-tête "Upgrades" générique.
- Refléchez la même séparation dans `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` et `en/SUMMARY.md`.
- Assurez-vous que chaque page de mise à niveau historique (racine et les copies localisées `de/book/upg*.md` / `fr/book/upg*.md`) porte un appel de contenu obsolète se reliant au chapitre 9.

## 11. Appendice 1: Interface utilisateur d'administration

Fichier:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Cet appendice est lié à l'interface utilisateur d'administration Oxygen et a besoin d'une réécriture.

Modifications requises:

- remplacer toutes les références Oxygen
- remplacer les anciennes captures d'écran d'icônes/menus
- documenter les thèmes d'administration actuels:
  - default
  - dark
  - modern
  - transition
- mentionner les capacités actuelles d'administration 2.7.0 appelées dans les notes de version:
  - capacité de surcharge de modèle dans les thèmes d'administration système
  - ensemble de thèmes d'administration mis à jour

## 12. Appendice 2: Téléchargement de XOOPS via FTP

Fichier:

- `appendix-2-uploading-xoops-via-ftp.md`

Modifications requises:

- supprimez les hypothèses spécifiques à HostGator et cPanel
- modernisez la formulation du téléchargement de fichiers
- notez que `xoops_lib` inclut maintenant les dépendances Composer, donc les téléchargements sont plus importants et ne doivent pas être délibérément réduits

## 13. Appendice 5: Sécurité

Fichier:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Modifications requises:

- supprimer complètement la discussion `register_globals`
- supprimer l'ancienne langue de ticket d'hébergement obsolète
- corriger le texte des permissions de `404` à `0444` où le mode lecture seule est prévu
- mettre à jour la discussion `mainfile.php` et `secure.php` pour correspondre à la mise en page 2.7.0
- ajouter le contexte de constante liée à la sécurité du domaine de cookie nouveau:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- ajouter l'orientation de production pour:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Impact de la maintenance multilingue

Après correction des fichiers anglais au niveau racine, des mises à jour équivalentes sont nécessaires dans:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

L'arborescence `en/` a également besoin d'examen car elle contient un README et un ensemble d'actifs séparés, mais ne semble avoir qu'un `book/` partiel.

## 15. Ordre de priorité

### Critique avant la version

1. Mettez à jour les références du dépôt/version à 2.7.0.
2. Réécrivez le chapitre 9 autour du flux de mise à niveau réel 2.7.0 et du contrôle en amont Smarty 4.
3. Mettez à jour les exigences du système à PHP 8.2+ et MySQL 5.7.8+.
4. Corrigez le chemin du fichier de clé de licence du chapitre 7.
5. Corrigez les inventaires de thèmes et de modules.
6. Corrigez le décompte de table du chapitre 6 de 32 à 33.

### Important pour la précision

7. Réécrivez l'orientation du chemin accessible en écriture.
8. Ajoutez l'exigence du chargeur automatique Composer à la configuration du chemin.
9. Mettez à jour l'orientation du jeu de caractères de base de données à `utf8mb4`.
10. Corrigez l'orientation de l'édition de chemin du chapitre 8 afin que les constantes soient documentées dans le bon fichier.
11. Supprimer les instructions de somme de contrôle.
12. Supprimez `register_globals` et autres orientations PHP mortes.

### Nettoyage de qualité de version

13. Remplacez toutes les captures d'écran du programme d'installation et de l'administration.
14. Déplacez les pages de mise à niveau historiques hors du flux principal.
15. Synchronisez les copies allemandes et françaises après correction de l'anglais.
16. Nettoyez les liens obsolètes et les lignes README dupliquées.
