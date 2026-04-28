---
title: "Créer votre première page"
description: "Guide étape par étape pour créer et publier du contenu dans XOOPS, y compris le formatage, l'intégration de médias et les options de publication"
---

# Créer votre première page dans XOOPS

Apprenez comment créer, formater et publier votre premier contenu dans XOOPS.

## Comprendre le contenu XOOPS

### Qu'est-ce qu'une page/publication ?

Dans XOOPS, le contenu est géré par des modules. Les types de contenu les plus courants sont :

| Type | Description | Cas d'utilisation |
|---|---|---|
| **Page** | Contenu statique | À propos de nous, Contact, Services |
| **Publication/Article** | Contenu horodaté | Nouvelles, Articles de blog |
| **Catégorie** | Organisation du contenu | Regrouper le contenu connexe |
| **Commentaire** | Retours des utilisateurs | Permettre l'interaction des visiteurs |

Ce guide couvre la création d'une page/article de base à l'aide du module de contenu par défaut de XOOPS.

## Accès à l'éditeur de contenu

### Depuis le panneau d'administration

1. Connectez-vous au panneau d'administration : `http://your-domain.com/xoops/admin/`
2. Accédez à **Contenu > Pages** (ou votre module de contenu)
3. Cliquez sur "Ajouter une nouvelle page" ou "Nouvelle publication"

### Frontend (si activé)

Si votre XOOPS est configuré pour permettre la création de contenu frontend :

1. Connectez-vous en tant qu'utilisateur enregistré
2. Allez à votre profil
3. Cherchez l'option "Soumettre du contenu"
4. Suivez les mêmes étapes ci-dessous

## Interface de l'éditeur de contenu

L'éditeur de contenu comprend :

```
┌─────────────────────────────────────┐
│ Éditeur de contenu                  │
├─────────────────────────────────────┤
│                                     │
│ Titre : [________________]           │
│                                     │
│ Catégorie : [Dropdown]              │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Entrez votre contenu ici...     │ │
│ │                                 │ │
│ │ Vous pouvez utiliser des balises HTML ici │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta) : [____________] │
│                                     │
│ [Publier] [Enregistrer brouillon] [Aperçu] │
│                                     │
└─────────────────────────────────────┘
```

## Guide étape par étape : Créer votre première page

### Étape 1 : Accédez à l'éditeur de contenu

1. Dans le panneau d'administration, cliquez sur **Contenu > Pages**
2. Cliquez sur **"Ajouter une nouvelle page"** ou **"Créer"**
3. Vous verrez l'éditeur de contenu

### Étape 2 : Entrez le titre de la page

Dans le champ "Titre", entrez le nom de votre page :

```
Titre : Bienvenue sur notre site Web
```

Meilleures pratiques pour les titres :
- Clair et descriptif
- Inclure des mots-clés si possible
- 50-60 caractères idéaux
- Éviter TOUTES LES MAJUSCULES (difficile à lire)
- Être spécifique (pas "Page 1")

### Étape 3 : Sélectionnez une catégorie

Choisissez où organiser ce contenu :

```
Catégorie : [Dropdown ▼]
```

Les options peuvent inclure :
- Général
- Nouvelles
- Blog
- Annonces
- Services

Si les catégories n'existent pas, demandez à l'administrateur de les créer.

### Étape 4 : Écrivez votre contenu

Cliquez dans la zone d'éditeur de contenu et tapez votre texte.

#### Formatage basique du texte

Utilisez la barre d'outils de l'éditeur :

| Bouton | Action | Résultat |
|---|---|---|
| **B** | Gras | **Texte en gras** |
| *I* | Italique | *Texte en italique* |
| <u>U</u> | Souligné | <u>Texte souligné</u> |

#### Utilisation du HTML

XOOPS permet les balises HTML sûres. Exemples courants :

```html
<!-- Paragraphes -->
<p>Ceci est un paragraphe.</p>

<!-- Titres -->
<h1>Titre principal</h1>
<h2>Sous-titre</h2>

<!-- Listes -->
<ul>
  <li>Élément 1</li>
  <li>Élément 2</li>
  <li>Élément 3</li>
</ul>

<!-- Gras et italique -->
<strong>Texte en gras</strong>
<em>Texte en italique</em>

<!-- Liens -->
<a href="https://example.com">Texte du lien</a>

<!-- Sauts de ligne -->
<br>

<!-- Ligne horizontale -->
<hr>
```

#### Exemples de HTML sûr

**Balises recommandées :**
- Paragraphes : `<p>`, `<br>`
- Titres : `<h1>` à `<h6>`
- Texte : `<strong>`, `<em>`, `<u>`
- Listes : `<ul>`, `<ol>`, `<li>`
- Liens : `<a href="">`
- Guillemets : `<blockquote>`
- Tableaux : `<table>`, `<tr>`, `<td>`

**Évitez ces balises** (peuvent être désactivées pour la sécurité) :
- Scripts : `<script>`
- Styles : `<style>`
- Iframes : `<iframe>` (sauf si configuré)
- Formulaires : `<form>`, `<input>`

### Étape 5 : Ajoutez des images

#### Option 1 : Insérez une URL d'image

Utilisation de l'éditeur :

1. Cliquez sur le bouton **Insérer une image** (icône d'image)
2. Entrez l'URL de l'image : `https://example.com/image.jpg`
3. Entrez le texte alt : "Description de l'image"
4. Cliquez sur "Insérer"

Équivalent HTML :

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### Option 2 : Téléchargez une image

1. Téléchargez d'abord une image dans XOOPS :
   - Allez à **Contenu > Gestionnaire média**
   - Téléchargez votre image
   - Copiez l'URL de l'image

2. Dans l'éditeur de contenu, insérez à l'aide de l'URL (étapes ci-dessus)

#### Meilleures pratiques pour les images

- Utilisez des tailles de fichier appropriées (optimisez les images)
- Utilisez des noms de fichier descriptifs
- Incluez toujours du texte alt (accessibilité)
- Formats supportés : JPG, PNG, GIF, WebP
- Largeur recommandée : 600-800 pixels pour le contenu

### Étape 6 : Intégrez des médias

#### Intégrez une vidéo depuis YouTube

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

Remplacez `VIDEO_ID` par l'ID de la vidéo YouTube.

**Pour trouver l'ID de la vidéo YouTube :**
1. Ouvrez la vidéo sur YouTube
2. L'URL est : `https://www.youtube.com/watch?v=VIDEO_ID`
3. Copiez l'ID (caractères après `v=`)

#### Intégrez une vidéo depuis Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### Étape 7 : Ajoutez une méta-description

Dans le champ "Description", ajoutez un bref résumé :

```
Description : Apprenez à commencer avec notre site Web.
Cette page donne un aperçu de nos services et comment nous pouvons vous aider.
```

**Meilleures pratiques pour la méta-description :**
- 150-160 caractères
- Inclure le mot-clé principal naturellement
- Résumer précisément le contenu
- Utilisé dans les résultats des moteurs de recherche
- Rendre le texte attrayant (les utilisateurs le voient)

### Étape 8 : Configurez les options de publication

#### État de publication

Choisissez l'état de publication :

```
Statut : ☑ Publié
```

Options :
- **Publié :** Visible au public
- **Brouillon :** Visible uniquement pour les administrateurs
- **En attente d'examen :** En attente d'approbation
- **Archivé :** Caché mais conservé

#### Visibilité

Définissez qui peut voir ce contenu :

```
Visibilité : ☐ Public
           ☐ Utilisateurs enregistrés uniquement
           ☐ Privé (administrateur uniquement)
```

#### Date de publication

Définissez quand le contenu devient visible :

```
Date de publication : [Sélecteur de date] [Heure]
```

Laissez vide pour "Maintenant" pour publier immédiatement.

#### Autoriser les commentaires

Activer ou désactiver les commentaires des visiteurs :

```
Autoriser les commentaires : ☑ Oui
```

Si activé, les visiteurs peuvent ajouter des retours.

### Étape 9 : Enregistrez votre contenu

Options d'enregistrement multiples :

```
[Publier maintenant]  [Enregistrer comme brouillon]  [Planifier]  [Aperçu]
```

- **Publier maintenant :** Rendre visible immédiatement
- **Enregistrer comme brouillon :** Garder privé pour maintenant
- **Planifier :** Publier à une date/heure future
- **Aperçu :** Voir comment cela ressemble avant d'enregistrer

Cliquez sur votre choix :

```
Cliquez sur [Publier maintenant]
```

### Étape 10 : Vérifiez votre page

Après la publication, vérifiez votre contenu :

1. Allez à la page d'accueil de votre site Web
2. Accédez à votre zone de contenu
3. Cherchez votre page nouvellement créée
4. Cliquez pour la voir
5. Vérifiez :
   - [ ] Le contenu s'affiche correctement
   - [ ] Les images apparaissent
   - [ ] Le formatage a l'air bon
   - [ ] Les liens fonctionnent
   - [ ] Le titre et la description sont corrects

## Exemple : Page complète

### Titre
```
Démarrer avec XOOPS
```

### Contenu
```html
<h2>Bienvenue dans XOOPS</h2>

<p>XOOPS est un système de gestion de contenu open-source
puissant et flexible. Il vous permet de créer des sites Web
dynamiques avec une connaissance technique minimale.</p>

<h3>Caractéristiques clés</h3>

<ul>
  <li>Gestion de contenu facile</li>
  <li>Enregistrement et gestion des utilisateurs</li>
  <li>Système de modules pour l'extensibilité</li>
  <li>Système de thème flexible</li>
  <li>Fonctionnalités de sécurité intégrées</li>
</ul>

<h3>Commencer</h3>

<p>Voici les premiers pas pour mettre en place votre site XOOPS :</p>

<ol>
  <li>Configurer les paramètres de base</li>
  <li>Créer votre première page</li>
  <li>Configurer les comptes d'utilisateurs</li>
  <li>Installer des modules supplémentaires</li>
  <li>Personnaliser l'apparence</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="Logo XOOPS">

<p>Pour plus d'informations, visitez
<a href="https://xoops.org/">xoops.org</a></p>
```

### Méta-description
```
Commencez avec XOOPS CMS. Apprenez les fonctionnalités
et les premiers pas pour lancer votre site Web dynamique.
```

## Fonctionnalités avancées de contenu

### Utilisation de l'éditeur WYSIWYG

Si un éditeur de texte enrichi est installé :

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

Cliquez sur les boutons pour formater le texte sans HTML.

### Insertion de blocs de code

Afficher les exemples de code :

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### Créer des tableaux

Organiser les données dans des tableaux :

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Fonctionnalité</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Facile à personnaliser</td>
  </tr>
  <tr>
    <td>Puissant</td>
    <td>Système de gestion de contenu complet</td>
  </tr>
</table>
```

### Citations intégrées

Mettre en évidence du texte important :

```html
<blockquote>
"XOOPS est un puissant système de gestion de contenu
qui vous permet de créer des sites Web dynamiques."
</blockquote>
```

## Meilleures pratiques SEO pour le contenu

Optimisez votre contenu pour les moteurs de recherche :

### Titre
- Inclure le mot-clé principal
- 50-60 caractères
- Unique par page

### Méta-description
- Inclure le mot-clé naturellement
- 150-160 caractères
- Convaincant et précis

### Contenu
- Écrire naturellement, éviter le bourrage de mots-clés
- Utiliser les titres (h2, h3) de manière appropriée
- Inclure les liens internes vers d'autres pages
- Utiliser le texte alt sur toutes les images
- Viser 300+ mots pour les articles

### Structure d'URL
- Gardez les URL courtes et descriptives
- Utiliser des tirets pour séparer les mots
- Éviter les caractères spéciaux
- Exemple : `/about-our-company`

## Gestion de votre contenu

### Modifier une page existante

1. Allez à **Contenu > Pages**
2. Trouvez votre page dans la liste
3. Cliquez sur **Modifier** ou le titre de la page
4. Apportez des modifications
5. Cliquez sur **Mettre à jour**

### Supprimer une page

1. Allez à **Contenu > Pages**
2. Trouvez votre page
3. Cliquez sur **Supprimer**
4. Confirmez la suppression

### Modifier le statut de publication

1. Allez à **Contenu > Pages**
2. Trouvez la page, cliquez sur **Modifier**
3. Modifiez le statut dans la liste déroulante
4. Cliquez sur **Mettre à jour**

## Dépannage de la création de contenu

### Le contenu n'apparaît pas

**Symptôme :** La page publiée n'apparaît pas sur le site Web

**Solution :**
1. Vérifiez l'état de publication : Doit être "Publié"
2. Vérifiez la date de publication : Doit être actuelle ou passée
3. Vérifiez la visibilité : Doit être "Public"
4. Videz le cache : Admin > Outils > Vider le cache
5. Vérifiez les permissions : Le groupe d'utilisateurs doit avoir accès

### Le formatage ne fonctionne pas

**Symptôme :** Les balises HTML ou le formatage apparaissent sous forme de texte

**Solution :**
1. Vérifiez que le HTML est activé dans les paramètres du module
2. Utilisez une syntaxe HTML appropriée
3. Fermez toutes les balises : `<p>Texte</p>`
4. Utilisez uniquement les balises autorisées
5. Utilisez les entités HTML : `&lt;` pour `<`, `&amp;` pour `&`

### Les images ne s'affichent pas

**Symptôme :** Les images affichent une icône cassée

**Solution :**
1. Vérifiez que l'URL de l'image est correcte
2. Vérifiez que le fichier image existe
3. Vérifiez les permissions appropriées sur l'image
4. Essayez de télécharger l'image dans XOOPS à la place
5. Vérifier le blocage externe (peut nécessiter CORS)

### Problèmes d'encodage de caractères

**Symptôme :** Les caractères spéciaux apparaissent comme du charabia

**Solution :**
1. Enregistrez le fichier en encodage UTF-8
2. Assurez-vous que le jeu de caractères de la page est UTF-8
3. Ajoutez à l'en-tête HTML : `<meta charset="UTF-8">`
4. Évitez de copier-coller depuis Word (utilisez du texte brut)

## Meilleures pratiques du flux de travail de contenu

### Processus recommandé

1. **Écrire dans l'éditeur d'abord :** Utilisez l'éditeur de contenu administrateur
2. **Aperçu avant la publication :** Cliquez sur le bouton Aperçu
3. **Ajouter les métadonnées :** Complétez le titre, la description, les balises
4. **Enregistrer d'abord comme brouillon :** Enregistrez comme brouillon pour éviter de perdre du travail
5. **Examen final :** Relisez avant de publier
6. **Publier :** Cliquez sur Publier lorsque vous êtes prêt
7. **Vérifier :** Vérifiez sur le site en direct
8. **Modifier si nécessaire :** Apportez rapidement des corrections

### Contrôle de version

Toujours garder les sauvegardes :

1. **Avant les modifications majeures :** Enregistrez en tant que nouvelle version ou sauvegarde
2. **Archiver l'ancien contenu :** Conservez les versions non publiées
3. **Datez vos brouillons :** Utilisez un nommage clair : "Page-Draft-2025-01-28"

## Publier plusieurs pages

Créer une stratégie de contenu :

```
Page d'accueil
├── À propos de nous
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```

Créez des pages pour suivre cette structure.

## Étapes suivantes

Après avoir créé votre première page :

1. Configurez les comptes d'utilisateurs
2. Installez des modules supplémentaires
3. Explorez les fonctionnalités administrateur
4. Configurez les paramètres
5. Optimisez avec les paramètres de performance

---

**Balises :** #content-creation #pages #publishing #editor

**Articles connexes :**
- Admin-Panel-Overview
- Managing-Users
- Installing-Modules
- ../Configuration/Basic-Configuration
