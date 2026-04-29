---
title: "Ochrana CSRF"
description: "Pochopení a implementace ochrany CSRF v XOOPS pomocí třídy XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Útoky Cross-Site Request Forgery (CSRF) přimějí uživatele k provedení nechtěných akcí na webu, kde jsou ověřeni. XOOPS poskytuje vestavěnou ochranu CSRF prostřednictvím třídy `XOOPSSecurity`.

## Související dokumentace

- Bezpečnostní-Best-Practices - Komplexní bezpečnostní průvodce
- Input-Sanitization - MyTextSanitizer a validace
- SQL-Injection-Prevention - Postupy zabezpečení databáze

## Pochopení útoků CSRF

K útoku CSRF dochází, když:

1. Uživatel je ověřen na vašem webu XOOPS
2. Uživatel navštíví škodlivý web
3. Škodlivý web odešle požadavek na váš web XOOPS pomocí relace uživatele
4. Vaše stránky zpracují požadavek, jako by přišel od legitimního uživatele

## Třída XOOPSSecurity

XOOPS poskytuje třídu `XOOPSSecurity` k ochraně před útoky CSRF. Tato třída spravuje tokeny zabezpečení, které musí být zahrnuty do formulářů a ověřeny při zpracování požadavků.

### Generování tokenů

Třída zabezpečení generuje jedinečné tokeny, které jsou uloženy v relaci uživatele a musí být zahrnuty ve formulářích:

```php
$security = new XOOPSSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Ověření tokenu

Při zpracování odeslání formuláře ověřte, zda je token platný:

```php
$security = new XOOPSSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Pomocí systému tokenů XOOPS

### S třídami XOOPSForm

Při použití tříd formulářů XOOPS je ochrana tokenů přímočará:

```php
// Create a form
$form = new XOOPSThemeForm('Add Item', 'form_name', 'submit.php');

// Add form elements
$form->addElement(new XOOPSFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XOOPSFormTextArea('Content', 'content', ''));

// Add hidden token field - ALWAYS include this
$form->addElement(new XOOPSFormHiddenToken());

// Add submit button
$form->addElement(new XOOPSFormButton('', 'submit', _SUBMIT, 'submit'));
```

### S vlastními formuláři

Pro vlastní formuláře HTML, které nepoužívají XOOPSForm:

```php
// In your form template or PHP file
$security = new XOOPSSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Include the token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### V šablonách Smarty

Při generování formulářů v šablonách Smarty:

```php
// In your PHP file
$security = new XOOPSSecurity();
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

## Zpracování odeslání formuláře

### Základní ověření tokenu

```php
// In your form processing script
$security = new XOOPSSecurity();

// Verify the token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token is valid, process the form
$title = $_POST['title'];
// ... continue processing
```

### S vlastním zpracováním chyb

```php
$security = new XOOPSSecurity();

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

### Pro požadavky AJAX

Při práci s požadavky AJAX zahrňte token do požadavku:

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
$security = new XOOPSSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```

## Kontrola HTTP Referer

Pro další ochranu, zejména pro požadavky AJAX, můžete také zkontrolovat referer HTTP:

```php
$security = new XOOPSSecurity();

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

### Kombinovaná bezpečnostní kontrola

```php
$security = new XOOPSSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Konfigurace tokenu

### Životnost tokenu

Žetony mají omezenou životnost, aby se zabránilo opakovaným útokům. Můžete to nakonfigurovat v nastavení XOOPS nebo zpracovat tokeny, jejichž platnost vypršela, elegantně:

```php
$security = new XOOPSSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Více formulářů na stejné stránce

Pokud máte na stejné stránce více formulářů, každý by měl mít svůj vlastní token:

```php
// Form 1
$form1 = new XOOPSThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XOOPSFormHiddenToken('token1'));

// Form 2
$form2 = new XOOPSThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XOOPSFormHiddenToken('token2'));
```

## Nejlepší postupy

### Vždy používejte tokeny pro operace se změnou stavu

Zahrňte tokeny v jakékoli formě, které:

- Vytváří data
- Aktualizuje data
- Vymaže data
- Mění uživatelská nastavení
- Provádí veškeré administrativní úkony

### Nespoléhejte se pouze na kontrolu refererů

Referenční záhlaví HTTP může být:

- Odstraněno nástroji ochrany osobních údajů
- Chybí v některých prohlížečích
- V některých případech podvržený

Vždy používejte ověření tokenu jako primární obranu.

### Vhodně regenerujte tokeny

Zvažte regeneraci tokenů:

- Po úspěšném odeslání formuláře
- Po login/logout
- V pravidelných intervalech pro dlouhé sezení

### Zacházejte s vypršením platnosti tokenu elegantně

```php
$security = new XOOPSSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## Běžné problémy a řešení

### Chyba nenalezen token

**Problém**: Bezpečnostní kontrola se nezdařila s „token nenalezen“

**Řešení**: Ujistěte se, že je ve vašem formuláři zahrnuto pole tokenu:

```php
$form->addElement(new XOOPSFormHiddenToken());
```

### Chyba vypršela platnost tokenu

**Problém**: Uživatelům se po dlouhém vyplňování formuláře zobrazí „platnost tokenu vypršela“.

**Řešení**: Zvažte použití JavaScript k pravidelnému obnovování tokenu:

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

### Problémy s tokeny AJAX

**Problém**: Žádosti AJAX selžou při ověření tokenu

**Řešení**: Zajistěte, aby byl token předán s každým požadavkem AJAX a ověřte jej na straně serveru:

```php
// AJAX handler
header('Content-Type: application/json');

$security = new XOOPSSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## Příklad: Dokončete implementaci formuláře

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XOOPSSecurity();

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

$form = new XOOPSThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XOOPSFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XOOPSFormTextArea('Content', 'content', ''));
$form->addElement(new XOOPSFormHiddenToken());
$form->addElement(new XOOPSFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#security #csrf #xoops #formuláře #tokens #XOOPSSecurity