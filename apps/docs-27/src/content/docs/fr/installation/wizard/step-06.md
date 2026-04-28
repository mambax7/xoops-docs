---
title: "Configuration de la base de données"
---

Cette page collecte les informations sur la base de données que XOOPS utilisera.

Après avoir entré les informations demandées et corrigé tout problème, sélectionnez le bouton "Continuer" pour continuer.

![Configuration de la base de données du programme d'installation XOOPS](/xoops-docs/2.7/img/installation/installer-06.png)

## Données collectées dans cette étape

### Base de données

#### Nom de la base de données

Le nom de la base de données sur l'hôte que XOOPS doit utiliser. L'utilisateur de la base de données saisi à l'étape précédente doit avoir tous les privilèges sur cette base de données. Le programme d'installation tentera de créer cette base de données si elle n'existe pas.

#### Préfixe de table

Ce préfixe sera ajouté aux noms de toutes les nouvelles tables créées par XOOPS. Cela aide à éviter les conflits de noms si la base de données est partagée avec d'autres applications. Un préfixe unique rend également plus difficile la deviner des noms de table, ce qui a des avantages de sécurité. Si vous n'êtes pas sûr, conservez simplement la valeur par défaut

#### Jeu de caractères de la base de données

Le programme d'installation est par défaut `utf8mb4`, qui prend en charge la plage Unicode complète, y compris les emoji et les caractères supplémentaires. Vous pouvez sélectionner un jeu de caractères différent ici, mais `utf8mb4` est recommandé pour pratiquement toutes les langues et paramètres régionaux et doit être conservé tel quel à moins que vous ayez une raison spécifique de le modifier.

#### Collation de la base de données

Le champ de collation est vide par défaut. Lorsqu'il est vide, MySQL applique la collation par défaut pour le jeu de caractères sélectionné ci-dessus (pour `utf8mb4`, c'est généralement `utf8mb4_general_ci` ou `utf8mb4_0900_ai_ci`, selon la version de MySQL). Si vous avez besoin d'une collation spécifique — par exemple pour correspondre à une base de données existante — sélectionnez-la ici. Sinon, laisser vide est le choix recommandé.
