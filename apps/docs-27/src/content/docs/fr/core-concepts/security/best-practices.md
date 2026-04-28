---
title: "Meilleures pratiques de sécurité"
description: "Guide de sécurité complet pour le développement de modules XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Les API de sécurité sont stables entre les versions]
Les pratiques de sécurité et les API documentées ici fonctionnent à la fois dans XOOPS 2.5.x et XOOPS 4.0.x. Les classes de sécurité principales (`XoopsSecurity`, `MyTextSanitizer`) restent stables.
:::

Ce document fournit des meilleures pratiques de sécurité complètes pour les développeurs de modules XOOPS. En suivant ces directives, vous vous assurerez que vos modules sont sécurisés et n'introduisent pas de vulnérabilités dans les installations XOOPS.

## Principes de sécurité

Chaque développeur XOOPS doit suivre ces principes de sécurité fondamentaux :

1. **Défense en profondeur** : Mettre en œuvre plusieurs couches de contrôles de sécurité
2. **Privilège minimum** : Fournir uniquement les droits d'accès minimum nécessaires
3. **Validation des données d'entrée** : Ne jamais faire confiance à l'entrée utilisateur
4. **Sécurisé par défaut** : La sécurité doit être la configuration par défaut
5. **Garder la simplicité** : Les systèmes complexes sont plus difficiles à sécuriser

## Documentation associée

- CSRF-Protection - Système de jetons et classe XoopsSecurity
- Input-Sanitization - MyTextSanitizer et validation
- SQL-Injection-Prevention - Pratiques de sécurité de base de données

## Liste de contrôle de référence rapide

Avant de publier votre module, vérifiez :

- [ ] Tous les formulaires incluent les jetons XOOPS
- [ ] Tous les données d'entrée utilisateur sont validées et assainies
- [ ] Toutes les sorties sont correctement échappées
- [ ] Toutes les requêtes de base de données utilisent des instructions paramétrées
- [ ] Les envois de fichiers sont correctement validés
- [ ] Les vérifications d'authentification et d'autorisation sont en place
- [ ] La gestion des erreurs ne révèle pas d'informations sensibles
- [ ] La configuration sensible est protégée
- [ ] Les bibliothèques tierces sont à jour
- [ ] Les tests de sécurité ont été effectués

## Authentification et autorisation

### Vérification de l'authentification utilisateur

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Vérification des permissions utilisateur

```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Configuration des permissions du module

```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## Sécurité des sessions

### Meilleures pratiques de gestion des sessions

1. Ne pas stocker d'informations sensibles dans la session
2. Régénérer les ID de session après la connexion/changements de privilèges
3. Valider les données de session avant de les utiliser

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### Prévention de la fixation de session

```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## Sécurité du téléchargement de fichier

### Validation des envois de fichiers

```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### Utilisation du téléchargeur XOOPS

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### Stockage sécurisé des fichiers téléchargés

```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## Gestion des erreurs et journalisation

### Gestion sécurisée des erreurs

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### Journalisation des événements de sécurité

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Sécurité de la configuration

### Stockage de la configuration sensible

```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```

### Protection des fichiers de configuration

Utilisez `.htaccess` pour protéger les fichiers de configuration :

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Bibliothèques tierces

### Sélection de bibliothèques

1. Choisir des bibliothèques activement maintenues
2. Vérifier les vulnérabilités de sécurité
3. Vérifier que la licence de la bibliothèque est compatible avec XOOPS

### Mise à jour des bibliothèques

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Isolement des bibliothèques

```php
// Load library in a controlled way
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## Tests de sécurité

### Liste de contrôle des tests manuels

1. Tester tous les formulaires avec une entrée invalide
2. Tenter de contourner l'authentification et l'autorisation
3. Tester la fonctionnalité de téléchargement de fichier avec des fichiers malveillants
4. Vérifier les vulnérabilités XSS dans toutes les sorties
5. Tester l'injection SQL dans toutes les requêtes de base de données

### Tests automatisés

Utilisez des outils automatisés pour scanner les vulnérabilités :

1. Outils d'analyse de code statique
2. Scanners d'applications web
3. Vérificateurs de dépendances pour les bibliothèques tierces

## Échappement de la sortie

### Contexte HTML

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### Contexte JavaScript

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### Contexte URL

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Variables de template

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Ressources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Documentation](https://xoops.org/)

---

#sécurité #meilleures-pratiques #xoops #développement-module #authentification #autorisation
