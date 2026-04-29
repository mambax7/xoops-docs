---
title: "CSRF védelem"
description: "A CSRF-védelem megértése és megvalósítása XOOPS-ban XOOPSSecurity osztály használatával"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

A Cross-Site Request Forgery (CSRF) támadások ráveszik a felhasználókat, hogy nem kívánt műveleteket hajtsanak végre egy olyan webhelyen, ahol hitelesítették őket. A XOOPS beépített CSRF védelmet biztosít a `XOOPSSecurity` osztályon keresztül.

## Kapcsolódó dokumentáció

- Biztonság – legjobb gyakorlatok – Átfogó biztonsági útmutató
- Input-Sanitization - MyTextSanitizer és érvényesítés
- SQL - Befecskendezés - Megelőzés - Adatbázis biztonsági gyakorlatok

## A CSRF támadások megértése

A CSRF támadás akkor történik, ha:

1. A felhasználó hitelesítése megtörtént az Ön XOOPS webhelyén
2. A felhasználó felkeres egy rosszindulatú webhelyet
3. A rosszindulatú webhely kérelmet küld az Ön XOOPS webhelyére a felhasználói munkamenet használatával
4. Az Ön webhelye úgy dolgozza fel a kérést, mintha a jogos felhasználótól származna

## A XOOPS biztonsági osztály

A XOOPS a `XOOPSSecurity` osztályt biztosítja a CSRF támadások elleni védelem érdekében. Ez az osztály kezeli a biztonsági tokeneket, amelyeket szerepeltetni kell az űrlapokon, és ellenőrizni kell a kérések feldolgozásakor.

### Token generáció

A biztonsági osztály egyedi tokeneket generál, amelyeket a felhasználó munkamenetében tárolnak, és ezeket az űrlapokon kell szerepeltetni:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Token ellenőrzése

Az űrlap beküldésekor ellenőrizze, hogy a token érvényes-e:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## XOOPS Token System használata

### XOOPSForm osztályokkal

XOOPS űrlaposztályok használata esetén a tokenvédelem egyszerű:

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

### Egyedi űrlapokkal

Az XOOPSForm-ot nem használó egyéni HTML űrlapokhoz:

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

### A Smarty sablonokban

Űrlapok létrehozásakor Smarty sablonokban:

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

## Űrlapbeküldések feldolgozása

### Alap tokenellenőrzés

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

### Egyéni hibakezeléssel

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

### AJAX kérésekhez

Amikor AJAX kérésekkel dolgozik, adja meg a tokent a kérésében:

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

## HTTP Referer ellenőrzése

További védelem érdekében, különösen a AJAX kérések esetén, ellenőrizheti a HTTP hivatkozást is:

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

### Kombinált biztonsági ellenőrzés

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Token konfiguráció

### Token élettartama

A tokenek korlátozott élettartammal rendelkeznek, hogy megakadályozzák az újrajátszható támadásokat. Ezt a XOOPS beállításaiban konfigurálhatja, vagy kecsesen kezelheti a lejárt tokeneket:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Több űrlap ugyanazon az oldalon

Ha több űrlap van ugyanazon az oldalon, mindegyiknek saját tokenje kell, hogy legyen:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Bevált gyakorlatok

### Mindig használjon tokeneket az állapotváltoztatási műveletekhez

Bármilyen formában tartalmazzon tokeneket, amelyek:

- Adatokat hoz létre
- Frissíti az adatokat
- Törli az adatokat
- Módosítja a felhasználói beállításokat
- Bármilyen adminisztratív tevékenységet végrehajt

### Ne hagyatkozzon kizárólag a hivatkozó ellenőrzésére

A HTTP hivatkozási fejléc lehet:

- Adatvédelmi eszközök megfosztják
- Néhány böngészőből hiányzik
- Egyes esetekben hamis

Mindig használja a token-ellenőrzést elsődleges védelemként.

### A tokeneket megfelelően generálja újra

Fontolja meg a token regenerálását:

- Az űrlap sikeres beküldése után
- login/logout után
- Rendszeres időközönként hosszú ülésekhez

### Kezelje kecsesen a token lejáratát

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

## Gyakori problémák és megoldások

### Token nem található hiba

**Probléma**: A biztonsági ellenőrzés sikertelen, ha „token nem található”

**Megoldás**: Győződjön meg arról, hogy a token mező szerepel az űrlapon:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Token lejárt hiba

**Probléma**: A felhasználók a „token lejárt” üzenetet látják az űrlap hosszú kitöltése után

**Megoldás**: Fontolja meg a JavaScript használatát a token rendszeres frissítéséhez:

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

### AJAX Token problémák

**Probléma**: AJAX-kérelmek sikertelen a token érvényesítése

**Megoldás**: Győződjön meg arról, hogy a tokent minden AJAX kérésnél átadja, és ellenőrizze a szerveroldalon:

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

## Példa: Az űrlap kitöltése

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

#biztonság #csrf #xoops #űrlapok #tokens #XOOPSSecurity
