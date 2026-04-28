---
title: "Protezione CSRF"
description: "Comprensione e implementazione della protezione CSRF in XOOPS utilizzando la classe XoopsSecurity"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Gli attacchi Cross-Site Request Forgery (CSRF) inducono gli utenti a eseguire azioni non desiderate su un sito dove sono autenticati. XOOPS fornisce protezione CSRF integrata attraverso la classe `XoopsSecurity`.

## Documentazione Correlata

- Security-Best-Practices - Guida completa alla sicurezza
- Input-Sanitization - MyTextSanitizer e validazione
- SQL-Injection-Prevention - Pratiche di sicurezza del database

## Comprensione degli Attacchi CSRF

Un attacco CSRF si verifica quando:

1. Un utente è autenticato sul tuo sito XOOPS
2. L'utente visita un sito web dannoso
3. Il sito dannoso invia una richiesta al tuo sito XOOPS utilizzando la sessione dell'utente
4. Il tuo sito elabora la richiesta come se provenisse dall'utente legittimo

## La Classe XoopsSecurity

XOOPS fornisce la classe `XoopsSecurity` per proteggere dagli attacchi CSRF. Questa classe gestisce i token di sicurezza che devono essere inclusi nei moduli e verificati durante l'elaborazione delle richieste.

### Generazione dei Token

La classe di sicurezza genera token univoci archiviati nella sessione dell'utente e che devono essere inclusi nei moduli:

```php
$security = new XoopsSecurity();

// Ottieni il campo di input HTML del token
$tokenHTML = $security->getTokenHTML();

// Ottieni solo il valore del token
$tokenValue = $security->createToken();
```

### Verifica del Token

Durante l'elaborazione dell'invio del modulo, verifica che il token sia valido:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## Utilizzo del Sistema di Token XOOPS

### Con Classi XoopsForm

Quando utilizzi le classi di modulo XOOPS, la protezione con token è semplice:

```php
// Crea un modulo
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Aggiungi elementi del modulo
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Aggiungi campo token nascosto - INCLUDI SEMPRE QUESTO
$form->addElement(new XoopsFormHiddenToken());

// Aggiungi pulsante di invio
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### Con Moduli Personalizzati

Per moduli HTML personalizzati che non utilizzano XoopsForm:

```php
// Nel tuo file di modulo o PHP
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Includi il token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### Nei Template Smarty

Quando si generano moduli nei template Smarty:

```php
// Nel tuo file PHP
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* Nel tuo template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Includi il token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## Elaborazione dell'Invio del Modulo

### Verifica Basica del Token

```php
// Nel tuo script di elaborazione del modulo
$security = new XoopsSecurity();

// Verifica il token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Il token è valido, elabora il modulo
$title = $_POST['title'];
// ... continua l'elaborazione
```

### Con Gestione Errori Personalizzata

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Ottieni informazioni sull'errore dettagliate
    $errors = $security->getErrors();

    // Registra l'errore
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Reindirizza con messaggio di errore
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### Per Richieste AJAX

Quando si lavora con richieste AJAX, includi il token nella tua richiesta:

```javascript
// JavaScript - ottieni il token dal campo nascosto
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Includi nella richiesta AJAX
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// Gestore AJAX PHP
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Elabora la richiesta AJAX
```

## Verifica del Referer HTTP

Per protezione aggiuntiva, specialmente per richieste AJAX, puoi anche verificare il referer HTTP:

```php
$security = new XoopsSecurity();

// Verifica l'intestazione referer
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Verifica anche il token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### Verifica di Sicurezza Combinata

```php
$security = new XoopsSecurity();

// Esegui entrambe le verifiche
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## Configurazione del Token

### Durata del Token

I token hanno una durata limitata per prevenire attacchi di riproduzione. Puoi configurarla nelle impostazioni XOOPS o gestire i token scaduti elegantemente:

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Il token potrebbe essere scaduto
    // Rigenera il modulo con un nuovo token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### Moduli Multipli sulla Stessa Pagina

Quando hai più moduli sulla stessa pagina, ognuno dovrebbe avere il suo token:

```php
// Modulo 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Modulo 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## Best Practices

### Usa Sempre i Token per le Operazioni che Modificano lo Stato

Includi i token in qualsiasi modulo che:

- Crea dati
- Aggiorna dati
- Elimina dati
- Modifica le impostazioni dell'utente
- Esegue qualsiasi azione amministrativa

### Non Affidarti Solo alla Verifica del Referer

L'intestazione referer HTTP può essere:

- Rimossa da strumenti di privacy
- Assente in alcuni browser
- Falsificata in alcuni casi

Usa sempre la verifica del token come tua difesa principale.

### Rigenera i Token in Modo Appropriato

Considera di rigenerare i token:

- Dopo l'invio riuscito del modulo
- Dopo il login/logout
- A intervalli regolari per sessioni lunghe

### Gestisci la Scadenza del Token Elegantemente

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Salva i dati del modulo temporaneamente
    $_SESSION['form_backup'] = $_POST;

    // Reindirizza al modulo con messaggio
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## Problemi Comuni e Soluzioni

### Errore Token Non Trovato

**Problema**: Controllo di sicurezza non riuscito con "token not found"

**Soluzione**: Assicurati che il campo del token sia incluso nel tuo modulo:

```php
$form->addElement(new XoopsFormHiddenToken());
```

### Errore Token Scaduto

**Problema**: Gli utenti vedono "token expired" dopo il completamento del modulo

**Soluzione**: Considera l'uso di JavaScript per aggiornare periodicamente il token:

```javascript
// Aggiorna il token ogni 10 minuti
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### Problemi di Token AJAX

**Problema**: Le richieste AJAX non superano la validazione del token

**Soluzione**: Assicurati che il token sia passato ad ogni richiesta AJAX e verificato lato server:

```php
// Gestore AJAX
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Non cancellare il token per AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## Esempio: Implementazione Completa del Modulo

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Gestisci l'invio del modulo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Elabora l'invio valido
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... salva nel database

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Visualizza il modulo
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
