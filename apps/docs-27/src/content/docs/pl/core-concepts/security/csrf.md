---
title: "Ochrona przed atakami CSRF"
description: "Zrozumienie i wdrażanie ochrony CSRF w XOOPS za pomocą klasy XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Ataki Cross-Site Request Forgery (CSRF) oszukują użytkowników, aby wykonywali niechciane akcje na stronie, na której są uwierzytelnieni. XOOPS zapewnia wbudowaną ochronę CSRF poprzez klasę `XoopsSecurity`.

## Dokumentacja pokrewna

- Security-Best-Practices - Kompleksowy przewodnik bezpieczeństwa
- Input-Sanitization - MyTextSanitizer i walidacja
- SQL-Injection-Prevention - Praktyki bezpieczeństwa bazy danych

## Zrozumienie ataków CSRF

Atak CSRF występuje, gdy:

1. Użytkownik jest uwierzytelniony na Twojej stronie XOOPS
2. Użytkownik odwiedza złośliwą stronę internetową
3. Złośliwa strona przesyła żądanie do Twojej strony XOOPS, używając sesji użytkownika
4. Twoja strona przetwarza żądanie, jakby pochodziło od prawowitego użytkownika

## Klasa XoopsSecurity

XOOPS zapewnia klasę `XoopsSecurity` do ochrony przed atakami CSRF. Ta klasa zarządza tokenami bezpieczeństwa, które muszą być zawarte w formularzach i zweryfikowane podczas przetwarzania żądań.

### Generowanie tokenów

Klasa bezpieczeństwa generuje unikalne tokeny, które są przechowywane w sesji użytkownika i muszą być zawarte w formularzach:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Weryfikacja tokenów

Podczas przetwarzania przesłanych formularzy sprawdź, czy token jest prawidłowy:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Korzystanie z systemu tokenów XOOPS

### Ze klasami XoopsForm

Przy używaniu klas formularzy XOOPS, ochrona tokenów jest prosta:

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

### Z formami niestandardowymi

Dla niestandardowych formularzy HTML, które nie używają XoopsForm:

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

### W szablonach Smarty

Podczas generowania formularzy w szablonach Smarty:

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

## Przetwarzanie przesłań formularzy

### Weryfikacja tokenów podstawowych

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

### Z niestandardową obsługą błędów

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

### Dla żądań AJAX

Podczas pracy z żądaniami AJAX, dołącz token do żądania:

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

## Sprawdzanie nagłówka HTTP Referer

Aby uzyskać dodatkową ochronę, szczególnie dla żądań AJAX, możesz również sprawdzić nagłówek HTTP referer:

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

### Połączone sprawdzenie bezpieczeństwa

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Konfiguracja tokenów

### Okres ważności tokenu

Tokeny mają ograniczony okres ważności, aby zapobiec atakom powtórzeniowym. Możesz skonfigurować to w ustawieniach XOOPS lub obsłużyć wygasłe tokeny gracefully:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Wiele formularzy na tej samej stronie

Jeśli masz wiele formularzy na tej samej stronie, każdy powinien mieć własny token:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Najlepsze praktyki

### Zawsze używaj tokenów dla operacji zmieniających stan

Uwzględnij tokeny w każdym formularzu, który:

- Tworzy dane
- Aktualizuje dane
- Usuwa dane
- Zmienia ustawienia użytkownika
- Wykonuje jakąkolwiek akcję administracyjną

### Nie polegaj wyłącznie na sprawdzaniu Referer

Nagłówek HTTP referer może:

- Być usunięty przez narzędzia ochrony prywatności
- Brakować w niektórych przeglądarkach
- W niektórych przypadkach być sfałszowany

Zawsze używaj weryfikacji tokenów jako swojej głównej obrony.

### Regeneruj tokeny odpowiednio

Rozważ regenerowanie tokenów:

- Po pomyślnym przesłaniu formularza
- Po logowaniu/wylogowaniu
- W regularnych odstępach czasu dla długich sesji

### Obsługuj wygaśnięcie tokenów gracefully

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

## Typowe problemy i rozwiązania

### Błąd tokenu nie znaleziony

**Problem**: Sprawdzenie bezpieczeństwa kończy się niepowodzeniem z komunikatem "token not found"

**Rozwiązanie**: Upewnij się, że pole tokenu jest zawarte w formularzu:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Błąd tokenu wygasłego

**Problem**: Użytkownicy widzą "token expired" po długim wypełnianiu formularza

**Rozwiązanie**: Rozważ użycie JavaScript do okresowego odświeżania tokenu:

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

### Problemy z tokenami AJAX

**Problem**: Żądania AJAX nie przejdą weryfikacji tokenów

**Rozwiązanie**: Upewnij się, że token jest przesyłany z każdym żądaniem AJAX i weryfikuj go po stronie serwera:

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

## Przykład: Kompletna implementacja formularza

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
