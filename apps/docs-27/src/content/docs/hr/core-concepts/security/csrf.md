---
title: "CSRF zaštita"
description: "Razumijevanje i implementacija CSRF zaštite u XOOPS pomoću XoopsSecurity class"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Cross-Site Request Forgery (CSRF) napadi varaju korisnike da izvrše neželjene radnje na web-mjestu na kojem su autentificirani. XOOPS pruža ugrađenu CSRF zaštitu kroz `XoopsSecurity` class.

## Povezana dokumentacija

- Najbolje sigurnosne prakse - Opsežan sigurnosni vodič
- Sanitizacija unosa - MyTextSanitizer i provjera valjanosti
- SQL-Injection-Prevention - Sigurnosne prakse baze podataka

## Razumijevanje CSRF napada

Napad CSRF događa se kada:

1. Korisnik je autentificiran na vašoj XOOPS stranici
2. Korisnik posjećuje zlonamjernu web stranicu
3. Zlonamjerna stranica šalje zahtjev vašoj XOOPS stranici koristeći sesiju korisnika
4. Vaša stranica obrađuje zahtjev kao da dolazi od legitimnog korisnika

## XoopsSecurity Class

XOOPS pruža `XoopsSecurity` class za zaštitu od CSRF napada. Ovaj class upravlja sigurnosnim tokenima koji moraju biti included u obrascima i potvrđeni prilikom obrade zahtjeva.

### Generiranje tokena

Sigurnosni class generira jedinstvene tokene koji su pohranjeni u korisničkoj sesiji i moraju biti included u obrascima:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Provjera tokena

Prilikom obrade slanja obrasca provjerite je li token valjan:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Korištenje sustava tokena XOOPS

### S XoopsForm klasama

Kada koristite XOOPS obrazac classes, zaštita tokena je jednostavna:

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

### S prilagođenim obrascima

Za prilagođene HTML obrasce koji ne koriste XoopsForm:

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

### U predlošcima Smarty

Prilikom generiranja obrazaca u Smarty templates:

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

## Obrada slanja obrazaca

### Osnovna verifikacija tokena

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

### S prilagođenim rukovanjem pogreškama

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

### Za AJAX zahtjeve

Kada radite sa zahtjevima AJAX, include token u vašem zahtjevu:

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

## Provjera HTTP referera

Za dodatnu zaštitu, posebno za AJAX zahtjeve, također možete provjeriti HTTP referer:

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

### Kombinirana sigurnosna provjera

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Konfiguracija tokena

### Životni vijek tokena

Tokeni imaju ograničen vijek trajanja kako bi spriječili napade ponavljanjem. Ovo možete konfigurirati u postavkama XOOPS ili elegantno rukovati isteklim tokenima:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Više obrazaca na istoj stranici

Kada imate više obrazaca na istoj stranici, svaki bi trebao imati svoj token:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Najbolji primjeri iz prakse

### Uvijek koristite tokene za operacije promjene stanja

Uključite tokene u bilo kojem obliku koji:

- Stvara podatke
- Ažurira podatke
- Briše podatke
- Mijenja korisničke postavke
- Izvodi bilo koju radnju administrative

### Nemojte se oslanjati isključivo na provjeru preporuke

Zaglavlje HTTP referera može biti:

- Ogoljen alatima za privatnost
- Nedostaje u nekim preglednicima
- Lažna u nekim slučajevima

Uvijek koristite provjeru tokena kao svoju primarnu obranu.

### Regenerirajte tokene na odgovarajući način

Razmotrite ponovno generiranje tokena:- Nakon uspješne predaje obrasca
- Nakon prijave/odjave
- U redovitim intervalima za duge sesije

### Postupajte elegantno s istekom tokena

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

## Uobičajeni problemi i rješenja

### Token nije pronađen Greška

**Problem**: Sigurnosna provjera ne uspijeva s "token nije pronađen"

**Rješenje**: Provjerite je li polje tokena included u vašem obrascu:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Pogreška isteka tokena

**Problem**: Korisnici vide "token je istekao" nakon dugog ispunjavanja obrasca

**Rješenje**: Razmotrite korištenje JavaScript za povremeno osvježavanje tokena:

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

### AJAX Problemi s tokenom

**Problem**: AJAX zahtjevi nisu uspjeli provjeriti valjanost tokena

**Rješenje**: Osigurajte da se token prosljeđuje sa svakim AJAX zahtjevom i provjerite ga na strani poslužitelja:

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

## Primjer: Kompletna implementacija obrasca

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

#sigurnost #csrf #xoops #forms #tokeni #XoopsSecurity
