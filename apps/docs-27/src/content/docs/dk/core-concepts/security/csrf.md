---
title: "CSRF beskyttelse"
description: "Forståelse og implementering af CSRF-beskyttelse i XOOPS ved hjælp af XoopsSecurity-klassen"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Cross-Site Request Forgery (CSRF) angreb narrer brugere til at udføre uønskede handlinger på et websted, hvor de er autentificeret. XOOPS giver indbygget CSRF-beskyttelse gennem `XoopsSecurity`-klassen.

## Relateret dokumentation

- Sikkerhed-Bedste Praksis - Omfattende sikkerhedsvejledning
- Input-sanering - MyTextSanitizer og validering
- SQL-Injection-Prevention - Databasesikkerhedspraksis

## Forståelse af CSRF-angreb

Et CSRF-angreb opstår, når:

1. En bruger er godkendt på dit XOOPS-websted
2. Brugeren besøger en ondsindet hjemmeside
3. Det ondsindede websted sender en anmodning til dit XOOPS websted ved hjælp af brugerens session
4. Dit websted behandler anmodningen, som om den kom fra den legitime bruger

## XoopsSecurity-klassen

XOOPS leverer `XoopsSecurity`-klassen for at beskytte mod CSRF-angreb. Denne klasse administrerer sikkerhedstokens, der skal inkluderes i formularer og verificeres ved behandling af anmodninger.

### Token Generation

Sikkerhedsklassen genererer unikke tokens, der er gemt i brugerens session og skal inkluderes i formularer:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Tokenbekræftelse

Når du behandler formularindsendelser, skal du kontrollere, at tokenet er gyldigt:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Brug af XOOPS Token System

### Med XoopsForm klasser

Når du bruger XOOPS formularklasser, er tokenbeskyttelse ligetil:

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

### Med brugerdefinerede formularer

For tilpassede HTML-formularer, der ikke bruger XoopsForm:

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

### I Smarty skabeloner

Når du genererer formularer i Smarty-skabeloner:

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

## Behandler formularindsendelser

### Grundlæggende tokenbekræftelse

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

### Med tilpasset fejlhåndtering

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

### For AJAX-anmodninger

Når du arbejder med AJAX-anmodninger, skal du inkludere tokenet i din anmodning:

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

## Kontrollerer HTTP Referer

For yderligere beskyttelse, især for AJAX-anmodninger, kan du også tjekke HTTP-henviseren:

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

### Kombineret sikkerhedstjek

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Token-konfiguration

### Tokens levetid

Tokens har en begrænset levetid for at forhindre gentagelsesangreb. Du kan konfigurere dette i XOOPS-indstillinger eller håndtere udløbne tokens med ynde:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Flere formularer på samme side

Når du har flere formularer på samme side, bør hver have sit eget token:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Bedste praksis

### Brug altid tokens til tilstandsændrende operationer

Inkluder tokens i enhver form, der:

- Opretter data
- Opdaterer data
- Sletter data
- Ændrer brugerindstillinger
- Udfører enhver administrativ handling

### Stol ikke udelukkende på refererkontrol

HTTP-henvisningsoverskriften kan være:

- Strippet af privatlivsværktøjer
- Mangler i nogle browsere
- Forfalsket i nogle tilfælde

Brug altid tokenbekræftelse som dit primære forsvar.

### Regenerer tokens på passende vis

Overvej at regenerere tokens:

- Efter vellykket formularindsendelse
- Efter login/log ud
- Med jævne mellemrum til lange sessioner

### Håndter tokens udløb elegant

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

## Almindelige problemer og løsninger

### Token ikke fundet fejl

**Problem**: Sikkerhedstjek mislykkes med "token ikke fundet"

**Løsning**: Sørg for, at tokenfeltet er inkluderet i din formular:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Token udløbet fejl

**Problem**: Brugere ser "token udløbet" efter lang formularudfyldelse

**Løsning**: Overvej at bruge JavaScript til at opdatere tokenet med jævne mellemrum:

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

### AJAX Token-problemer

**Problem**: AJAX-anmodninger mislykkes tokenvalidering

**Løsning**: Sørg for, at tokenet sendes med hver AJAX-anmodning, og bekræft det på serversiden:

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

## Eksempel: Fuldfør formularimplementering

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

#sikkerhed #csrf #xoops #forms #tokens #XoopsSecurity
