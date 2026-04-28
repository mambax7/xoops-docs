---
title: "FAQ thèmes"
description: "Questions fréquemment posées sur les thèmes XOOPS"
---

# Questions fréquemment posées sur les thèmes

> Questions et réponses courantes sur les thèmes XOOPS, la personnalisation et la gestion.

---

## Installation et activation des thèmes

### Q: Comment installer un nouveau thème dans XOOPS?

**R:**
1. Télécharger le fichier zip du thème
2. Aller à XOOPS Admin > Apparence > Thèmes
3. Cliquer sur "Télécharger" et sélectionner le fichier zip
4. Le thème apparaît dans la liste des thèmes
5. Cliquer pour l'activer pour votre site

Alternative: Extraire manuellement dans le répertoire `/themes/` et rafraîchir le panneau d'administration.

---

### Q: Le téléchargement du thème échoue avec "Permission refusée"

**R:** Corriger les permissions du répertoire des thèmes:

```bash
# Rendre le répertoire des thèmes accessible en écriture
chmod 755 /path/to/xoops/themes

# Corriger les uploads si applicable
chmod 777 /path/to/xoops/uploads

# Corriger la propriété si nécessaire
chown -R www-data:www-data /path/to/xoops/themes
```

---

### Q: Comment définir un thème différent pour des utilisateurs spécifiques?

**R:**
1. Aller à Gestionnaire d'utilisateurs > Éditer l'utilisateur
2. Aller à l'onglet "Autre"
3. Sélectionner le thème préféré dans la liste déroulante "Thème utilisateur"
4. Enregistrer

Les thèmes sélectionnés par l'utilisateur remplacent le thème par défaut du site.

---

### Q: Puis-je avoir des thèmes différents pour l'administration et le site utilisateur?

**R:** Oui, définir dans XOOPS Admin > Paramètres:

1. **Thème frontend** - Thème du site par défaut
2. **Thème admin** - Thème du panneau de contrôle d'administration (généralement séparé)

Chercher les paramètres comme:
- `theme_set` - Thème frontend
- `admin_theme` - Thème d'administration

---

## Personnalisation des thèmes

### Q: Comment personnaliser un thème existant?

**R:** Créer un thème enfant pour préserver les mises à jour:

```
themes/
├── original_theme/
│   ├── style.css
│   ├── templates/
│   └── images/
└── custom_theme/          {* Créer une copie pour édition *}
    ├── style.css
    ├── templates/
    └── images/
```

Puis éditer `theme.html` dans votre thème personnalisé.

---

### Q: Comment changer les couleurs du thème?

**R:** Éditer le fichier CSS du thème:

```bash
# Localiser le CSS du thème
themes/mytheme/style.css

# Ou le modèle du thème
themes/mytheme/theme.html
```

Pour les thèmes XOOPS:

```css
/* themes/mytheme/style.css */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
}

body {
    background-color: var(--primary-color);
    color: #333;
}

a {
    color: var(--secondary-color);
}

.button {
    background-color: var(--accent-color);
}
```

---

## Structure des thèmes

### Q: Quels fichiers sont requis dans un thème?

**R:** Structure minimale:

```
themes/mytheme/
├── theme.html              {* Modèle principal (requis) *}
├── style.css              {* Feuille de style (optionnel mais recommandé) *}
├── screenshot.png         {* Image d'aperçu pour admin (optionnel) *}
├── images/                {* Images du thème *}
│   └── logo.png
└── templates/             {* Modèles optionnels: En-têtes, pieds de page *}
    ├── header.html
    ├── footer.html
    └── sidebar.html
```

Voir Structure des thèmes pour les détails.

---

### Q: Comment créer un thème à partir de zéro?

**R:** Créer la structure:

```bash
mkdir -p themes/mytheme/images
cd themes/mytheme
```

Créer `theme.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="{$xoops_charset}">
    <title>{$xoops_pagetitle}</title>
    <link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css">
</head>
<body>
    <header>{$xoops_headers}</header>
    <main>{$xoops_contents}</main>
    <footer>{$xoops_footers}</footer>
</body>
</html>
```

Créer `style.css`:
```css
* { margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; }
header { background: #333; color: #fff; padding: 20px; }
main { padding: 20px; }
footer { background: #f5f5f5; padding: 20px; border-top: 1px solid #ddd; }
```

---

## Variables de thème

### Q: Quelles variables sont disponibles dans les modèles de thème?

**R:** Variables courantes des thèmes XOOPS:

```smarty
{* Informations du site *}
{$xoops_sitename}          {* Nom du site *}
{$xoops_url}               {* URL du site *}
{$xoops_theme}             {* Nom du thème actuel *}

{* Contenu de la page *}
{$xoops_contents}          {* Contenu principal de la page *}
{$xoops_pagetitle}         {* Titre de la page *}
{$xoops_headers}           {* Balises meta, styles dans l'en-tête *}

{* Informations du module *}
{$xoops_module_header}     {* En-tête spécifique au module *}
{$xoops_moduledesc}        {* Description du module *}

{* Informations utilisateur *}
{$xoops_isuser}            {* L'utilisateur est-il connecté? *}
{$xoops_userid}            {* ID utilisateur *}
{$xoops_uname}             {* Nom d'utilisateur *}

{* Blocs *}
{$xoops_blocks}            {* Contenu de tous les blocs *}

{* Autre *}
{$xoops_charset}           {* Jeu de caractères du document *}
{$xoops_version}           {* Version de XOOPS *}
```

---

## Problèmes de thème

### Q: Le thème affiche des erreurs "variable de modèle non reconnue"

**R:** La variable n'est pas passée au modèle. Vérifier:

1. **La variable est assignée** en PHP:
```php
<?php
$xoopsTpl->assign('variable_name', $value);
?>
```

2. **Le modèle existe** là où spécifié
3. **La syntaxe du modèle est correcte**:
```smarty
{* Correct *}
{$variable_name}

{* Mauvais *}
$variable_name
{variable_name}
```

---

### Q: Les modifications CSS n'apparaissent pas dans le navigateur

**R:** Vider le cache du navigateur:

1. Actualisation forcée: `Ctrl+Shift+R` (Cmd+Shift+R sur Mac)
2. Vider le cache du thème sur le serveur:
```bash
rm -rf xoops_data/caches/smarty_cache/themes/*
rm -rf xoops_data/caches/smarty_compile/themes/*
```

3. Vérifier le chemin du fichier CSS dans le thème:
```bash
ls -la themes/mytheme/style.css
```

---

### Q: Les images du thème ne se chargent pas

**R:** Vérifier les chemins des images:

```html
{* MAUVAIS - chemin relatif depuis la racine web *}
<img src="themes/mytheme/images/logo.png">

{* CORRECT - utiliser xoops_url *}
<img src="{$xoops_url}/themes/{$xoops_theme}/images/logo.png">

{* Ou en CSS *}
background-image: url('{$xoops_url}/themes/{$xoops_theme}/images/bg.png');
```

---

## Performance des thèmes

### Q: Comment rendre mon thème réactif?

**R:** Utiliser CSS Grid ou Flexbox:

```css
/* themes/mytheme/style.css */

/* Approche mobile-first */
body {
    font-size: 14px;
}

.container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

main {
    order: 2;
}

aside {
    order: 3;
}

/* Tablette et plus */
@media (min-width: 768px) {
    .container {
        grid-template-columns: 2fr 1fr;
    }
}

/* Bureau et plus */
@media (min-width: 1200px) {
    .container {
        grid-template-columns: 3fr 1fr;
    }
}
```

Ou utiliser l'intégration Bootstrap:
```html
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<div class="container">
    <div class="row">
        <div class="col-md-9">{$xoops_contents}</div>
        <div class="col-md-3">{* Sidebar *}</div>
    </div>
</div>
```

---

### Q: Comment optimiser les performances des thèmes?

**R:**
1. **Minifier CSS/JS** - Supprimer le code inutilisé
2. **Optimiser les images** - Utiliser les bons formats (WebP, AVIF)
3. **Utiliser un CDN** pour les ressources
4. **Chargement différé** des images:
```html
<img src="image.jpg" loading="lazy">
```

5. **Cache-busting des versions**:
```html
<link rel="stylesheet" href="{$xoops_url}/themes/{$xoops_theme}/style.css?v={$xoops_version}">
```

Voir FAQ sur les performances pour plus de détails.

---

## Distribution des thèmes

### Q: Comment empaqueter un thème pour la distribution?

**R:** Créer un zip distributable:

```bash
# Structure
mytheme/
├── theme.html           {* Requis *}
├── style.css
├── screenshot.png       {* 300x225 recommandé *}
├── README.txt
├── LICENSE
├── images/
│   ├── logo.png
│   └── favicon.ico
└── templates/           {* Optionnel *}
    ├── header.html
    └── footer.html

# Créer le zip
zip -r mytheme.zip mytheme/
```

---

## Documentation connexe

- Erreurs de modèles
- Structure des thèmes
- FAQ sur les performances
- Débogage de Smarty

---

#xoops #themes #faq #troubleshooting #customization
