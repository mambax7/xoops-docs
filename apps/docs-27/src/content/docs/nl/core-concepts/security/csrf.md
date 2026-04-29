---
title: "CSRF-bescherming"
description: "CSRF-beveiliging begrijpen en implementeren in XOOPS met behulp van de XoopsSecurity-klasse"
---
<span class="version-badge versie-25x">2.5.x ✅</span> <span class="version-badge versie-40x">4.0.x ✅</span>

Cross-Site Request Forgery-aanvallen (CSRF) misleiden gebruikers zodat ze ongewenste acties uitvoeren op een site waarop ze zijn geverifieerd. XOOPS biedt ingebouwde CSRF-bescherming via de `XoopsSecurity`-klasse.

## Gerelateerde documentatie

- Best-practices op het gebied van beveiliging - Uitgebreide beveiligingsgids
- Invoer-opschoning - MyTextSanitizer en validatie
- SQL-Injectiepreventie - Databasebeveiligingspraktijken

## CSRF-aanvallen begrijpen

Een CSRF-aanval vindt plaats wanneer:

1. Een gebruiker wordt geverifieerd op uw XOOPS-site
2. De gebruiker bezoekt een kwaadaardige website
3. De kwaadwillende site dient een verzoek in bij uw XOOPS-site met behulp van de gebruikerssessie
4. Uw site verwerkt het verzoek alsof het afkomstig is van de legitieme gebruiker

## De XoopsSecurity-klasse

XOOPS biedt de klasse `XoopsSecurity` ter bescherming tegen CSRF-aanvallen. Deze klasse beheert beveiligingstokens die in formulieren moeten worden opgenomen en moeten worden geverifieerd bij het verwerken van verzoeken.

### Token genereren

De beveiligingsklasse genereert unieke tokens die worden opgeslagen in de sessie van de gebruiker en moeten worden opgenomen in formulieren:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Tokenverificatie

Controleer bij het verwerken van formulierinzendingen of het token geldig is:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## XOOPS-tokensysteem gebruiken

### Met XoopsForm-klassen

Wanneer u XOOPS-formulierklassen gebruikt, is tokenbescherming eenvoudig:

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

### Met aangepaste formulieren

Voor aangepaste HTML-formulieren die geen gebruik maken van XoopsForm:

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

### In Smarty-sjablonen

Bij het genereren van formulieren in Smarty-sjablonen:

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

## Formulierinzendingen verwerken

### Basistokenverificatie

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

### Met aangepaste foutafhandeling

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

### Voor AJAX-verzoeken

Wanneer u met AJAX-verzoeken werkt, neemt u het token op in uw verzoek:

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

## HTTP-verwijzing controleren

Voor extra bescherming, vooral voor AJAX-verzoeken, kunt u ook de HTTP-referer raadplegen:

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

### Gecombineerde veiligheidscontrole

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Tokenconfiguratie

### Tokenlevensduur

Tokens hebben een beperkte levensduur om herhalingsaanvallen te voorkomen. U kunt dit configureren in de XOOPS-instellingen of verlopen tokens netjes afhandelen:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Meerdere formulieren op dezelfde pagina

Als u meerdere formulieren op dezelfde pagina heeft, moet elk formulier een eigen token hebben:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Beste praktijken

### Gebruik altijd tokens voor statusveranderende bewerkingen

Voeg tokens toe in welke vorm dan ook die:

- Creëert gegevens
- Updatet gegevens
- Verwijdert gegevens
- Wijzigt gebruikersinstellingen
- Voert eventuele administratieve handelingen uit

### Vertrouw niet uitsluitend op de controle van verwijzingen

De HTTP-verwijzingsheader kan het volgende zijn:

- Gestript door privacytools
- Ontbreekt in sommige browsers
- In sommige gevallen vervalst

Gebruik tokenverificatie altijd als uw primaire verdediging.

### Genereer tokens op de juiste manier

Overweeg om tokens opnieuw te genereren:

- Na succesvolle indiening van het formulier
- Na inloggen/uitloggen
- Met regelmatige tussenpozen voor lange sessies

### Ga netjes om met het verlopen van tokens

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

## Veelvoorkomende problemen en oplossingen

### Fout token niet gevonden

**Probleem**: beveiligingscontrole mislukt met 'token niet gevonden'

**Oplossing**: zorg ervoor dat het tokenveld in uw formulier is opgenomen:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Fout token verlopen

**Probleem**: gebruikers zien "token verlopen" nadat het formulier lang is ingevuld

**Oplossing**: overweeg JavaScript te gebruiken om het token periodiek te vernieuwen:

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

### AJAX-tokenproblemen

**Probleem**: AJAX-aanvragen mislukken tokenvalidatie

**Oplossing**: Zorg ervoor dat het token wordt doorgegeven bij elk AJAX-verzoek en verifieer het op de server:

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

## Voorbeeld: volledige formulierimplementatie

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

#security #csrf #xoops #forms #tokens #XoopsSecurity