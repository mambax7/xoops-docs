---
title: "CSRF Zaščita"
description: "Razumevanje in implementacija zaščite CSRF v XOOPS z uporabo razreda XoopsSecurity"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Napadi Cross-Site Request Forgery (CSRF) zavedejo uporabnike, da izvedejo neželena dejanja na spletnem mestu, kjer so overjeni. XOOPS zagotavlja vgrajeno CSRF zaščito prek razreda `XoopsSecurity`.

## Povezana dokumentacija

– Najboljše varnostne prakse – Obsežen varnostni vodnik
- Input-Sanitization - MyTextSanitizer in validacija
- SQL-Injection-Prevention - Varnostne prakse baze podatkov

## Razumevanje CSRF napadov

Do napada CSRF pride, ko:

1. Na vašem spletnem mestu XOOPS je uporabnik overjen
2. Uporabnik obišče zlonamerno spletno stran
3. Zlonamerno spletno mesto pošlje zahtevo vašemu spletnemu mestu XOOPS z uporabo uporabnikove seje.
4. Vaše spletno mesto obdela zahtevo, kot da bi prišla od zakonitega uporabnika

## Varnostni razred XOOPS

XOOPS zagotavlja razred `XoopsSecurity` za zaščito pred napadi CSRF. Ta razred upravlja varnostne žetone, ki morajo biti vključeni v obrazce in preverjeni pri obdelavi zahtev.

### Generiranje žetonov

Varnostni razred ustvari edinstvene žetone, ki so shranjeni v uporabnikovi seji in jih je treba vključiti v obrazce:
```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```
### Preverjanje žetona

Pri obdelavi oddaje obrazca preverite, ali je žeton veljaven:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```
## Uporaba XOOPS sistema žetonov

### Z razredi XoopsForm

Pri uporabi razredov obrazcev XOOPS je zaščita žetonov enostavna:
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
### Z obrazci po meri

Za obrazce po meri HTML, ki ne uporabljajo XoopsForm:
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
### V predlogah Smarty

Pri ustvarjanju obrazcev v predlogah Smarty:
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
## Obdelava oddanih obrazcev

### Osnovno preverjanje žetona
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
### Z obravnavo napak po meri
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
### Za AJAX zahtevkov

Pri delu z zahtevami AJAX vključite žeton v zahtevo:
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
## Preverjanje HTTP Napotitelj

Za dodatno zaščito, predvsem za zahteve AJAX, lahko preverite tudi napotitelja HTTP:
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
### Kombinirano varnostno preverjanje
```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```
## Konfiguracija žetona

### Življenjska doba žetona

Žetoni imajo omejeno življenjsko dobo, da preprečijo napade ponovitve. To lahko konfigurirate v nastavitvah XOOPS ali elegantno ravnate s preteklimi žetoni:
```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```
### Več obrazcev na isti strani

Ko imate na isti strani več obrazcev, mora imeti vsak svoj žeton:
```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```
## Najboljše prakse

### Vedno uporabljajte žetone za operacije spreminjanja stanja

Vključite žetone v kateri koli obliki, ki:

- Ustvari podatke
- Posodablja podatke
- Izbriše podatke
- Spremeni uporabniške nastavitve
- Izvaja morebitna upravna dejanja

### Ne zanašajte se samo na preverjanje napotnikov

Glava napotitelja HTTP je lahko:

- Brez orodij za zasebnost
- Manjka v nekaterih brskalnikih
- V nekaterih primerih ponarejen

Vedno uporabljajte preverjanje žetonov kot glavno obrambo.

### Ustrezno obnovite žetone

Razmislite o regeneraciji žetonov:

- Po uspešni oddaji obrazca
- Po login/logout
- V rednih intervalih za dolge seje

### Ravnajte z iztekom žetona elegantno
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
## Pogoste težave in rešitve

### Napaka žetona ni bilo mogoče najti

**Težava**: Varnostno preverjanje ne uspe z "žetona ni bilo mogoče najti"

**Rešitev**: Zagotovite, da je polje žetona vključeno v vaš obrazec:
```php
$form->addElement(new XoopsFormHiddenToken());
```
### Napaka potečenega žetona

**Težava**: uporabniki po dolgem izpolnjevanju obrazca vidijo »žeton je potekel«.

**Rešitev**: razmislite o uporabi JavaScripta za občasno osveževanje žetona:
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
### AJAX Težave z žetoni

**Težava**: AJAX zahteve ne uspejo preveriti veljavnosti žetona

**Rešitev**: Zagotovite, da je žeton posredovan z vsako zahtevo AJAX in jo preverite na strani strežnika:
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
## Primer: Implementacija celotnega obrazca
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

#security #csrf #XOOPS #forms #tokens #XoopsSecurity