---
title: Démarrage rapide
description: Lancez XOOPS 2.7 en moins de 5 minutes.
---

## Exigences

| Composant  | Minimum                 | Recommandé   |
|------------|-------------------------|---------------|
| PHP        | 8.2                    | 8.4+         |
| MySQL      | 5.7                     | 8.0+          |
| MariaDB    | 10.4                    | 10.11+        |
| Serveur web | Apache 2.4 / Nginx 1.20 | Dernière version stable |

## Téléchargement

Téléchargez la dernière version depuis [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases).

```bash
# Ou clonez directement
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```

## Étapes d'installation

1. **Téléchargez les fichiers** vers la racine des documents de votre serveur web (par ex. `public_html/`).
2. **Créez une base de données MySQL** et un utilisateur ayant tous les privilèges sur celle-ci.
3. **Ouvrez votre navigateur** et naviguez vers votre domaine — l'installateur XOOPS démarre automatiquement.
4. **Suivez l'assistant à 5 étapes** — il configure les chemins, crée les tables et configure votre compte administrateur.
5. **Supprimez le dossier `install/`** lorsque vous êtes invité à le faire. Ceci est obligatoire pour la sécurité.

## Vérifiez l'installation

Après la configuration, visitez:

- **Page d'accueil:** `https://votredomaine.com/`
- **Panneau d'administration:** `https://votredomaine.com/xoops_data/` *(chemin que vous avez choisi lors de l'installation)*

## Étapes suivantes

- [Guide d'installation complet](./installation/) — configuration du serveur, permissions, dépannage
- [Guide des modules](./module-guide/introduction/) — construisez votre premier module
- [Guide des thèmes](./theme-guide/introduction/) — créez ou personnalisez un thème
