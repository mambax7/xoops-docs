---
title: "Protection CSRF"
description: "Comprendre et mettre en œuvre la protection CSRF dans XOOPS à l'aide de la classe XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Les attaques de falsification de demande inter-sites (CSRF) trompent les utilisateurs pour qu'ils effectuent des actions indésirables sur un site où ils sont authentifiés. XOOPS fournit une protection CSRF intégrée via la classe `XoopsSecurity`.

## Documentation associée

- Security-Best-Practices - Guide de sécurité complet
- Input-Sanitization - MyTextSanitizer et validation
- SQL-Injection-Prevention - Pratiques de sécurité de base de données

## Comprendre les attaques CSRF

Une attaque CSRF se produit lorsque :

1. Un utilisateur est authentifié sur votre site XOOPS
2. L'utilisateur visite un site malveillant
3. Le site malveillant soumet une demande à votre site XOOPS en utilisant la session de l'utilisateur
4. Votre site traite la demande comme si elle venait de l'utilisateur légitime

## La classe XoopsSecurity

XOOPS fournit la classe `XoopsSecurity` pour se protéger contre les attaques CSRF. Cette classe gère les jetons de sécurité qui doivent être inclus dans les formulaires et vérifiés lors du traitement des demandes.

### Génération de jetons

La classe de sécurité génère des jetons uniques qui sont stockés dans la session de l'utilisateur et doivent être inclus dans les formulaires :

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Vérification du jeton

Lors du traitement des soumissions de formulaire, vérifiez que le jeton est valide :

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Utilisation du système de jetons XOOPS

### Avec les classes XoopsForm

Lors de l'utilisation des classes de formulaire XOOPS, la protection par jeton est simple :

```php
// Create a form
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Add form elements
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Add hidden token field - ALWAYS include this
$form->addElement(new XoopsFormHiddenToken());

// Add submit button
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### Avec des formulaires personnalisés

Pour les formulaires HTML personnalisés qui n'utilisent pas XoopsForm :

```php
// In your form template or PHP file
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Include the token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### Dans les modèles Smarty

Lors de la génération de formulaires dans les modèles Smarty :

```php
// In your PHP file
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* In your template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Include the token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## Traitement des soumissions de formulaire

### Vérification de base du jeton

```php
// In your form processing script
$security = new XoopsSecurity();

// Verify the token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token is valid, process the form
$title = $_POST['title'];
// ... continue processing
```

### Avec gestion d'erreurs personnalisée

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Get detailed error information
    $errors = $security->getErrors();

    // Log the error
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Redirect with error message
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### Pour les demandes AJAX

Lors du travail avec les demandes AJAX, incluez le jeton dans votre demande :

```javascript
// JavaScript - get token from hidden field
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Include in AJAX request
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAX handler
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```

## Vérification du référent HTTP

Pour une protection supplémentaire, en particulier pour les demandes AJAX, vous pouvez également vérifier le référent HTTP :

```php
$security = new XoopsSecurity();

// Check referer header
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Also verify the token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### Vérification de sécurité combinée

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Configuration du jeton

### Durée de vie du jeton

Les jetons ont une durée de vie limitée pour prévenir les attaques par relecture. Vous pouvez configurer cela dans les paramètres XOOPS ou gérer les jetons expirés avec grâce :

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Plusieurs formulaires sur la même page

Lorsque vous avez plusieurs formulaires sur la même page, chacun doit avoir son propre jeton :

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Meilleures pratiques

### Toujours utiliser des jetons pour les opérations qui modifient l'état

Incluez des jetons dans tout formulaire qui :

- Crée des données
- Met à jour les données
- Supprime les données
- Modifie les paramètres utilisateur
- Effectue toute action administrative

### Ne pas dépendre uniquement de la vérification du référent

L'en-tête du référent HTTP peut être :

- Supprimé par les outils de confidentialité
- Manquant dans certains navigateurs
- Usurpé dans certains cas

Utilisez toujours la vérification du jeton comme votre défense principale.

### Régénérer les jetons de manière appropriée

Envisagez de régénérer les jetons :

- Après soumission réussie du formulaire
- Après connexion/déconnexion
- À intervalles réguliers pour les longues sessions

### Gérer l'expiration du jeton avec grâce

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## Problèmes courants et solutions

### Erreur de jeton non trouvé

**Problème** : La vérification de sécurité échoue avec "jeton non trouvé"

**Solution** : Assurez-vous que le champ de jeton est inclus dans votre formulaire :

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Erreur de jeton expiré

**Problème** : Les utilisateurs voient "jeton expiré" après une longue completion du formulaire

**Solution** : Envisagez d'utiliser JavaScript pour actualiser le jeton périodiquement :

```javascript
// Refresh token every 10 minutes
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### Problèmes de jeton AJAX

**Problème** : Les demandes AJAX échouent la validation du jeton

**Solution** : Assurez-vous que le jeton est transmis avec chaque demande AJAX et vérifiez-le côté serveur :

```php
// AJAX handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## Exemple : Implémentation de formulaire complet

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Process valid submission
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... save to database

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Display form
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#sécurité #csrf #xoops #formulaires #jetons #XoopsSecurity
