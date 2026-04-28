---
title: "Module Publisher"
description: "Documentation complète pour le module Publisher d'actualités et de blog pour XOOPS"
---

> Le principal module de publication d'actualités et de blog pour XOOPS CMS.

---

## Aperçu

Publisher est le module de gestion de contenu définitif pour XOOPS, évolution de SmartSection pour devenir la solution de blog et d'actualités la plus riche en fonctionnalités. Il fournit des outils complets pour créer, organiser et publier du contenu avec support complet du workflow éditorial.

**Exigences :**
- XOOPS 2.5.10+
- PHP 7.1+ (PHP 8.x recommandé)

---

## Principales fonctionnalités

### Gestion de contenu
- **Catégories et sous-catégories** - Organisation hiérarchique du contenu
- **Édition de texte enrichi** - Plusieurs éditeurs WYSIWYG pris en charge
- **Pièces jointes** - Ajouter des fichiers aux articles
- **Gestion d'images** - Images de page et de catégorie
- **Encapsulation de fichiers** - Encapsuler des fichiers comme des articles

### Workflow de publication
- **Publication programmée** - Définir des dates de publication futures
- **Dates d'expiration** - Contenu à expiration automatique
- **Modération** - Workflow d'approbation éditorial
- **Gestion des brouillons** - Enregistrer le travail en cours

### Affichage et modèles
- **Quatre modèles de base** - Mise en page d'affichage multiples
- **Modèles personnalisés** - Créer vos propres designs
- **Optimisation SEO** - URLs conviviales pour les moteurs de recherche
- **Conception réactive** - Sortie compatible mobile

### Interaction utilisateur
- **Évaluations** - Système d'évaluation d'articles
- **Commentaires** - Discussions des lecteurs
- **Partage social** - Partager sur les réseaux sociaux

### Permissions
- **Contrôle des soumissions** - Qui peut soumettre des articles
- **Permissions au niveau des champs** - Contrôler les champs du formulaire par groupe
- **Permissions par catégorie** - Contrôle d'accès par catégorie
- **Droits de modération** - Paramètres de modération globaux

---

## Contenu des sections

### Guide utilisateur
- Guide d'installation
- Configuration de base
- Création d'articles
- Gestion des catégories
- Mise en place des permissions

### Guide du développeur
- Extension de Publisher
- Création de modèles personnalisés
- Référence API
- Hooks et événements

---

## Démarrage rapide

### 1. Installation

```bash
# Télécharger depuis GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copier dans le répertoire des modules
cp -r publisher /path/to/xoops/htdocs/modules/
```

Puis installer via XOOPS Admin → Modules → Install.

### 2. Créer votre première catégorie

1. Allez à **Admin → Publisher → Categories**
2. Cliquez sur **Add Category**
3. Remplissez :
   - **Name**: News
   - **Description**: Latest news and updates
   - **Image**: Upload category image
4. Enregistrer

### 3. Créer votre premier article

1. Allez à **Admin → Publisher → Articles**
2. Cliquez sur **Add Article**
3. Remplissez :
   - **Title**: Welcome to Our Site
   - **Category**: News
   - **Content**: Your article content
4. Définir **Status**: Published
5. Enregistrer

---

## Options de configuration

### Paramètres généraux

| Paramètre | Description | Par défaut |
|---------|-------------|---------|
| Editor | Éditeur WYSIWYG à utiliser | XOOPS Default |
| Items per page | Articles affichés par page | 10 |
| Show breadcrumb | Afficher la barre de navigation | Yes |
| Allow ratings | Activer les évaluations d'articles | Yes |
| Allow comments | Activer les commentaires d'articles | Yes |

### Paramètres SEO

| Paramètre | Description | Par défaut |
|---------|-------------|---------|
| SEO URLs | Activer les URLs conviviales | No |
| URL rewriting | Apache mod_rewrite | None |
| Meta keywords | Auto-générer les mots-clés | Yes |

### Matrice des permissions

| Permission | Anonyme | Enregistré | Éditeur | Admin |
|------------|-----------|------------|--------|-------|
| View articles | ✓ | ✓ | ✓ | ✓ |
| Submit articles | ✗ | ✓ | ✓ | ✓ |
| Edit own articles | ✗ | ✓ | ✓ | ✓ |
| Edit all articles | ✗ | ✗ | ✓ | ✓ |
| Approve articles | ✗ | ✗ | ✓ | ✓ |
| Manage categories | ✗ | ✗ | ✗ | ✓ |

---

## Structure du module

```
modules/publisher/
├── admin/                  # Interface admin
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # Classes PHP
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Fichiers d'inclusion
│   ├── common.php
│   └── functions.php
├── templates/              # Modèles Smarty
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Traductions
│   └── english/
├── sql/                    # Schéma de base de données
│   └── mysql.sql
├── xoops_version.php       # Info du module
└── index.php               # Entrée du module
```

---

## Migration

### De SmartSection

Publisher inclut un outil de migration intégré :

1. Allez à **Admin → Publisher → Import**
2. Sélectionnez **SmartSection** comme source
3. Choisissez les options d'importation :
   - Categories
   - Articles
   - Comments
4. Cliquez sur **Import**

### Du module News

1. Allez à **Admin → Publisher → Import**
2. Sélectionnez **News** comme source
3. Mappez les catégories
4. Cliquez sur **Import**

---

## Documentation connexe

- Guide de développement du module
- Modèles Smarty
- Framework XMF

---

## Ressources

- [Référentiel GitHub](https://github.com/XoopsModules25x/publisher)
- [Suivi des problèmes](https://github.com/XoopsModules25x/publisher/issues)
- [Tutoriel original](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #publisher #module #blog #news #cms #content-management
