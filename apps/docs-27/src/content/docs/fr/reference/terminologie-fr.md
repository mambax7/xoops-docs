---
title: "Terminologie française officielle XOOPS"
description: "Glossaire de référence des traductions françaises standardisées pour les termes XOOPS — à utiliser dans toute la documentation francophone"
---

# Terminologie française officielle XOOPS

Ce document établit les traductions françaises standardisées pour les termes techniques et fonctionnels de XOOPS. Son objectif est d'assurer la cohérence dans l'ensemble de la documentation francophone.

> **Principe directeur :** Les noms de classes, fonctions, méthodes, variables et fichiers PHP/Smarty restent **toujours en anglais**, même à l'intérieur d'un texte rédigé en français. Seuls les concepts généraux et les descriptions sont traduits.

---

## Système de base (Core System)

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Module | Module (m.) | Même terme, genre masculin |
| Block | Bloc (m.) | |
| Theme | Thème (m.) | |
| Template | Gabarit (m.) / modèle (m.) | Préférer **gabarit** pour les fichiers `.tpl` Smarty ; **modèle** pour le concept général |
| Hook | Crochet (m.) | Ex. : *crochet d'événement* |
| Event | Événement (m.) | |
| Preload | Préchargement (m.) | Peut rester « preload » dans un contexte très technique |
| Plugin | Extension (f.) | Éviter *greffon* |
| Filter | Filtre (m.) | |
| Handler | Gestionnaire (m.) | Ex. : *gestionnaire d'objets* ; les noms de classes restent en anglais (`XoopsObjectHandler`) |
| Bootstrap | Démarrage (m.) | Le fichier `mainfile.php` reste en anglais |
| Kernel | Noyau (m.) | |
| Core | Noyau (m.) / cœur (m.) | |

---

## Utilisateurs et permissions

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| User | Utilisateur (m.) | |
| Group | Groupe (m.) | |
| Permission | Permission (f.) / Droit (m.) | **Permission** pour l'entité ; **droit** dans une phrase (ex. : *droit d'accès*) |
| Role | Rôle (m.) | |
| Administrator | Administrateur (m.) | |
| Authentication | Authentification (f.) | |
| Authorization | Autorisation (f.) | |
| Login | Connexion (f.) | Verbe : *se connecter* |
| Logout | Déconnexion (f.) | Verbe : *se déconnecter* |
| Session | Session (f.) | |
| Credentials | Identifiants (m. pl.) | |
| Guest | Invité (m.) | |

---

## Base de données

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Database | Base de données (f.) | |
| Query | Requête (f.) | |
| Table | Table (f.) | |
| Schema | Schéma (m.) | |
| Migration | Migration (f.) | |
| Criteria | Critères (m. pl.) | La classe `Criteria` reste en anglais |
| Record | Enregistrement (m.) | |
| Row | Ligne (f.) / enregistrement (m.) | |
| Field / Column | Champ (m.) / colonne (f.) | |
| Index | Index (m.) | |
| Foreign key | Clé étrangère (f.) | |
| Primary key | Clé primaire (f.) | |
| Join | Jointure (f.) | |
| Transaction | Transaction (f.) | |

---

## Développement orienté objet

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Class | Classe (f.) | |
| Object | Objet (m.) | |
| Method | Méthode (f.) | |
| Property | Propriété (f.) | |
| Constructor | Constructeur (m.) | |
| Interface | Interface (f.) | |
| Namespace | Espace de noms (m.) | |
| Inheritance | Héritage (m.) | |
| Abstraction | Abstraction (f.) | |
| Encapsulation | Encapsulation (f.) | |
| Instance | Instance (f.) | |
| Instantiation | Instanciation (f.) | |
| Dependency Injection | Injection de dépendances (f.) | |
| Service Container | Conteneur de services (m.) | |
| Singleton | Singleton (m.) | Reste en anglais |
| Callback | Rappel (m.) / callback (m.) | *Callback* admis en contexte technique |
| Autoloader | Chargeur automatique (m.) | |

---

## Patrons de conception (Design Patterns)

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Design Pattern | Patron de conception (m.) | |
| MVC (Model-View-Controller) | MVC (Modèle-Vue-Contrôleur) | Sigle MVC conservé |
| Repository Pattern | Patron Référentiel (m.) | |
| Service Layer | Couche de service (f.) | |
| DTO (Data Transfer Object) | DTO / Objet de transfert de données | Sigle DTO conservé |
| Domain Model | Modèle de domaine (m.) | |
| Unit of Work | Unité de travail (f.) | |
| Factory | Fabrique (f.) | |
| Observer | Observateur (m.) | |
| Decorator | Décorateur (m.) | |

---

## Sécurité

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Token | Jeton (m.) | |
| CSRF | CSRF (m.) | Sigle conservé ; *falsification de demande inter-sites* en description complète |
| SQL Injection | Injection SQL (f.) | |
| XSS (Cross-Site Scripting) | XSS (m.) | Sigle conservé |
| Sanitization | Assainissement (m.) | Ou *nettoyage* dans un contexte plus simple |
| Validation | Validation (f.) | |
| Escaping | Échappement (m.) | Verbe : *échapper* |
| Hashing | Hachage (m.) | |
| Encryption | Chiffrement (m.) | Éviter *cryptage* |
| Hardening | Durcissement (m.) | |
| Referer check | Vérification du référent (f.) | |

---

## Gabarits et thèmes (Templates & Themes)

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Template file | Fichier gabarit (m.) | |
| Template variable | Variable de gabarit (f.) | |
| Layout | Mise en page (f.) | |
| Smarty | Smarty | Toujours en anglais (nom propre) |
| Block template | Gabarit de bloc (m.) | |
| Theme folder | Dossier de thème (m.) | |
| CSS | CSS (m.) | Sigle conservé |
| Breakpoint | Point de rupture (m.) | |

---

## Cycle de vie des requêtes

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Request | Demande (f.) | Préférer *demande* ; *requête* est réservé aux requêtes SQL |
| Response | Réponse (f.) | |
| Routing | Routage (m.) | |
| Middleware | Intergiciel (m.) | *Middleware* admis en contexte très technique |
| Controller | Contrôleur (m.) | |
| Action | Action (f.) | |
| Render | Rendu (m.) | Verbe : *afficher*, *rendre* |
| Page Controller | Contrôleur de page (m.) | |

---

## Administration et installation

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Installation | Installation (f.) | |
| Upgrade / Update | Mise à niveau (f.) | *Mise à jour* pour un correctif mineur ; *mise à niveau* pour un changement de version |
| Migration | Migration (f.) | |
| Configuration | Configuration (f.) | |
| Settings | Paramètres (m. pl.) | |
| Dashboard | Tableau de bord (m.) | |
| Admin panel | Panneau d'administration (m.) | |
| Wizard | Assistant (m.) | |
| Preflight | Vérification préalable (f.) | |
| Backup | Sauvegarde (f.) | |
| Restore | Restauration (f.) | |
| Deploy | Déployer (v.) / déploiement (m.) | |

---

## Développement de modules

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Module manifest | Manifeste de module (m.) | Fichier `xoops_version.php` |
| Module handler | Gestionnaire de module (m.) | |
| Object handler | Gestionnaire d'objets (m.) | |
| Block handler | Gestionnaire de blocs (m.) | |
| Module structure | Structure de module (f.) | |
| Best practice | Bonne pratique (f.) | |
| Code smell | Odeur de code (f.) | |
| Refactoring | Remaniement (m.) | *Refactoring* admis en contexte technique |
| Unit test | Test unitaire (m.) | |
| Integration test | Test d'intégration (m.) | |
| Debugging | Débogage (m.) | |
| Logging | Journalisation (f.) | |
| Error handling | Gestion des erreurs (f.) | |

---

## Contribution et collaboration

| Terme anglais | Terme français officiel | Notes |
|---------------|------------------------|-------|
| Pull request | Demande de fusion (f.) | *Pull request* admis dans le contexte Git |
| Commit | Commit (m.) | Terme technique, reste en anglais |
| Branch | Branche (f.) | |
| Repository | Dépôt (m.) | |
| Issue | Problème (m.) / ticket (m.) | |
| Code review | Revue de code (f.) | |
| Changelog | Journal des modifications (m.) | |
| Release | Version publiée (f.) / publication (f.) | |
| Contributor | Contributeur (m.) | |
| Maintainer | Mainteneur (m.) | |
| Fork | Bifurcation (f.) | *Fork* admis en contexte technique |

---

## Règles d'écriture

### Noms propres et sigles — ne jamais traduire

Les éléments suivants restent toujours en anglais, même dans un texte entièrement français :

- Noms de classes : `XoopsObject`, `XoopsPersistableObjectHandler`, `XoopsSecurity`, etc.
- Noms de méthodes : `getVar()`, `setVar()`, `initVar()`, etc.
- Noms de fichiers : `mainfile.php`, `xoops_version.php`, etc.
- Noms de chemins : `/modules/`, `/templates/`, etc.
- Sigles : PHP, SQL, HTML, CSS, MVC, CSRF, XSS, JWT, PSR, API
- Frameworks et bibliothèques : Smarty, Composer, PHPUnit, Ray

### Genre des termes importants

| Terme | Genre |
|-------|-------|
| un module | masculin |
| un bloc | masculin |
| un thème | masculin |
| un gabarit | masculin |
| une base de données | féminin |
| une requête | féminin |
| une permission | féminin |
| une session | féminin |
| un gestionnaire | masculin |
| un jeton | masculin |

### Cohérence dans les phrases

- ✅ « Le **gestionnaire** d'objets (`XoopsObjectHandler`) gère les opérations CRUD »
- ✅ « Utilisez la classe `XoopsSecurity` pour générer un **jeton** de formulaire »
- ✅ « Le **gabarit** Smarty reçoit les variables assignées »
- ❌ « Le handler d'objets » ← utiliser *gestionnaire*
- ❌ « Le template Smarty » ← utiliser *gabarit*
- ❌ « La sécurité token » ← utiliser *jeton*

---

*Document maintenu par l'équipe de documentation XOOPS. Dernière mise à jour : 2026-04-28.*
