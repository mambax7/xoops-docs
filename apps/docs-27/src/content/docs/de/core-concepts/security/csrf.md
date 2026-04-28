---
title: "CSRF-Schutz"
description: "Verständnis und Implementierung von CSRF-Schutz in XOOPS mit der XoopsSecurity-Klasse"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Cross-Site Request Forgery (CSRF)-Angriffe verleiten Benutzer dazu, unerwünschte Aktionen auf einer Website auszuführen, auf der sie authentifiziert sind. XOOPS bietet einen integrierten CSRF-Schutz durch die `XoopsSecurity`-Klasse.

## Verwandte Dokumentation

- Security-Best-Practices - Umfassender Sicherheitsleitfaden
- Input-Sanitization - MyTextSanitizer und Validierung
- SQL-Injection-Prevention - Datenbanksicherheitspraktiken

## Verständnis von CSRF-Angriffen

Ein CSRF-Angriff tritt auf, wenn:

1. Ein Benutzer auf Ihrer XOOPS-Website authentifiziert ist
2. Der Benutzer eine bösartige Website besucht
3. Die bösartige Website eine Anfrage an Ihre XOOPS-Website mit der Sitzung des Benutzers sendet
4. Ihre Website die Anfrage verarbeitet, als ob sie vom legitimen Benutzer kam

## Die XoopsSecurity-Klasse

XOOPS bietet die `XoopsSecurity`-Klasse zum Schutz vor CSRF-Angriffen. Diese Klasse verwaltet Sicherheits-Tokens, die in Formularen enthalten sein müssen und bei der Verarbeitung von Anfragen überprüft werden.

### Token-Generierung

Die Sicherheitsklasse generiert eindeutige Tokens, die in der Sitzung des Benutzers gespeichert und in Formularen enthalten sein müssen:

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### Token-Verifizierung

Bei der Verarbeitung von Formularübermittlungen überprüfen Sie, ob der Token gültig ist:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Verwendung des XOOPS-Token-Systems

### Mit XoopsForm-Klassen

Bei der Verwendung von XOOPS-Formularklassen ist der Token-Schutz unkompliziert:

```php
// Formular erstellen
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Formularelemente hinzufügen
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Verstecktes Token-Feld hinzufügen - IMMER einbinden
$form->addElement(new XoopsFormHiddenToken());

// Schaltfläche "Senden" hinzufügen
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### Mit benutzerdefinierten Formularen

Für benutzerdefinierte HTML-Formulare, die XoopsForm nicht verwenden:

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

### In Smarty-Templates

Bei der Generierung von Formularen in Smarty-Templates:

```php
// In Ihrer PHP-Datei
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* In Ihrem Template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Token einbinden *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## Verarbeitung von Formularübermittlungen

### Grundlegende Token-Verifizierung

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

### Mit benutzerdefinierter Fehlerbehandlung

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Detaillierte Fehlerinformationen abrufen
    $errors = $security->getErrors();

    // Fehler protokollieren
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Mit Fehlermeldung umleiten
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### Für AJAX-Anfragen

Beim Arbeiten mit AJAX-Anfragen beziehen Sie den Token in Ihre Anfrage ein:

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

## Überprüfung des HTTP-Referers

Für zusätzlichen Schutz, besonders bei AJAX-Anfragen, können Sie auch den HTTP-Referer überprüfen:

```php
$security = new XoopsSecurity();

// Referer-Header überprüfen
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Überprüfen Sie auch den Token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### Kombinierte Sicherheitsprüfung

```php
$security = new XoopsSecurity();

// Führen Sie beide Prüfungen durch
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Token-Konfiguration

### Token-Lebensdauer

Tokens haben eine begrenzte Lebensdauer, um Replay-Angriffe zu verhindern. Sie können dies in den XOOPS-Einstellungen konfigurieren oder abgelaufene Tokens elegant behandeln:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token ist möglicherweise abgelaufen
    // Formuliar mit neuem Token regenerieren
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Mehrere Formulare auf derselben Seite

Wenn Sie mehrere Formulare auf derselben Seite haben, sollte jedes seinen eigenen Token haben:

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Best Practices

### Verwenden Sie Token immer für statusändernde Operationen

Beziehen Sie Tokens in alle Formulare ein, die:

- Daten erstellen
- Daten aktualisieren
- Daten löschen
- Benutzereinstellungen ändern
- Administrative Maßnahmen durchführen

### Verlassen Sie sich nicht nur auf die Referer-Überprüfung

Der HTTP-Referer-Header kann:

- Von Datenschutz-Tools entfernt werden
- In einigen Browsern fehlen
- In einigen Fällen gefälscht werden

Verwenden Sie Token-Verifizierung immer als Ihre primäre Verteidigung.

### Token ordnungsgemäß regenerieren

Erwägen Sie die Regenerierung von Tokens:

- Nach erfolgreicher Formularübermittlung
- Nach Login/Logout
- In regelmäßigen Abständen für lange Sitzungen

### Token-Ablauf elegant behandeln

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Formulardaten vorübergehend speichern
    $_SESSION['form_backup'] = $_POST;

    // Zurück zum Formular mit Nachricht umleiten
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## Häufige Probleme und Lösungen

### Token nicht gefunden Fehler

**Problem**: Sicherheitsprüfung schlägt mit "token not found" fehl

**Lösung**: Stellen Sie sicher, dass das Token-Feld in Ihrem Formular enthalten ist:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Token abgelaufen Fehler

**Problem**: Benutzer sehen "token expired" nach langer Formularausfüllung

**Lösung**: Erwägen Sie die Verwendung von JavaScript, um den Token regelmäßig zu aktualisieren:

```javascript
// Token alle 10 Minuten aktualisieren
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### AJAX-Token-Probleme

**Problem**: AJAX-Anfragen schlagen bei der Token-Validierung fehl

**Lösung**: Stellen Sie sicher, dass der Token mit jeder AJAX-Anfrage übergeben wird und server-seitig überprüft wird:

```php
// AJAX-Handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Token nicht löschen für AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## Beispiel: Komplette Formularimplementierung

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Formularübermittlung behandeln
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Gültige Übermittlung verarbeiten
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... in der Datenbank speichern

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Formular anzeigen
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
