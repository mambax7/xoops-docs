---
title: "Assistant d'installation"
description: "Processus étape par étape de l'assistant d'installation XOOPS - 15 écrans expliqués."
---

L'assistant d'installation XOOPS vous guide à travers un processus de 15 étapes qui configure votre base de données, crée le compte administrateur et prépare votre site pour la première utilisation.

## Avant de commencer

- Vous avez [téléchargé XOOPS sur votre serveur](/xoops-docs/2.7/installation/ftp-upload/) ou configuré un environnement local
- Vous avez [vérifié les exigences](/xoops-docs/2.7/installation/requirements/)
- Vous avez vos identifiants de base de données prêts

## Étapes de l'assistant

| Étape | Écran | Qu'est-ce qui se passe |
|------|--------|--------------|
| 1 | [Sélection de la langue](./step-01/) | Choisissez la langue d'installation |
| 2 | [Bienvenue](./step-02/) | Accord de licence |
| 3 | [Vérification de la configuration](./step-03/) | Vérification de l'environnement PHP/serveur |
| 4 | [Définition du chemin](./step-04/) | Définir le chemin racine et l'URL |
| 5 | [Connexion à la base de données](./step-05/) | Entrez l'hôte de la base de données, l'utilisateur, le mot de passe |
| 6 | [Configuration de la base de données](./step-06/) | Définir le nom de la base de données et le préfixe de table |
| 7 | [Enregistrer la configuration](./step-07/) | Écrire mainfile.php |
| 8 | [Création de table](./step-08/) | Créer le schéma de la base de données |
| 9 | [Paramètres initiaux](./step-09/) | Nom du site, email de l'administrateur |
| 10 | [Insertion de données](./step-10/) | Remplir les données par défaut |
| 11 | [Configuration du site](./step-11/) | URL, fuseau horaire, langue |
| 12 | [Sélectionner le thème](./step-12/) | Choisissez un thème par défaut |
| 13 | [Installation du module](./step-13/) | Installer les modules fournis |
| 14 | [Bienvenue](./step-14/) | Message d'installation terminée |
| 15 | [Nettoyage](./step-15/) | Supprimer le dossier d'installation |

:::caution[Sécurité]
Après avoir terminé l'assistant, **supprimez ou renommez le dossier `install/`** — l'étape 15 vous guide à travers cela. Le laisser accessible est un risque de sécurité.
:::
