---
title: "Najbolje sigurnosne prakse"
description: "Sveobuhvatni sigurnosni vodič za razvoj modula XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Sigurnosni API-ji stabilni su u svim verzijama]
Sigurnosne prakse i API-ji koji su ovdje dokumentirani rade iu XOOPS 2.5.x iu XOOPS 4.0.x. Sigurnost jezgre classes (`XoopsSecurity`, `MyTextSanitizer`) ostaje stabilna.
:::

Ovaj dokument pruža opsežne najbolje sigurnosne prakse za programere XOOPS modula. Slijeđenje ovih smjernica pomoći će osigurati da je vaš modules siguran i da ne uvodi ranjivosti u instalacije XOOPS.

## Sigurnosna načela

Svaki XOOPS programer trebao bi slijediti ova temeljna sigurnosna načela:

1. **Dubinska obrana**: Implementirajte više slojeva sigurnosnih kontrola
2. **Najmanja privilegija**: Osigurajte samo minimalna potrebna prava pristupa
3. **Provjera unosa**: Nikad ne vjerujte korisničkom unosu
4. **Zadano sigurno**: Sigurnost bi trebala biti zadana konfiguracija
5. **Neka bude jednostavno**: Složene sustave teže je osigurati

## Povezana dokumentacija

- CSRF-Protection - Token sustav i XoopsSecurity class
- Sanitizacija unosa - MyTextSanitizer i provjera valjanosti
- SQL-Injection-Prevention - Sigurnosne prakse baze podataka

## Kontrolni popis brzih referenci

Prije puštanja modula provjerite:

- [ ] Svi oblici include XOOPS tokena
- [ ] Svi korisnički unosi provjeravaju se i dezinficiraju
- [ ] Sav izlaz je pravilno označen
- [ ] Svi upiti baze podataka koriste parametrizirane izjave
- [ ] Datoteka uploads ispravno je provjerena
- [ ] Provjere autentičnosti i autorizacije su na mjestu
- [ ] Rješavanje pogrešaka ne otkriva osjetljive informacije
- [ ] Osjetljiva konfiguracija je zaštićena
- [ ] Knjižnice trećih strana su ažurne
- [ ] Sigurnosno testiranje je izvršeno

## Autentifikacija i autorizacija

### Provjera autentifikacije korisnika

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Provjera korisničkih dopuštenja

```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Postavljanje dopuštenja modula

```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## Sigurnost sesije

### Najbolje prakse rukovanja sesijom

1. Nemojte pohranjivati osjetljive informacije u sesiji
2. Ponovno generirajte ID-ove sesije nakon promjene prijave/privilegija
3. Provjerite podatke o sesiji prije korištenja

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### Sprječavanje fiksacije sesije

```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## Sigurnost prijenosa datoteka

### Provjera valjanosti prijenosa datoteka

```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### Koristeći XOOPS Uploader

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### Sigurno pohranjivanje učitanih datoteka

```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## Rukovanje pogreškama i bilježenje

### Sigurno rukovanje pogreškama

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### Bilježenje sigurnosnih događaja

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Sigurnost konfiguracije

### Pohranjivanje osjetljive konfiguracije

```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```

### Zaštita konfiguracijskih datoteka

Koristite `.htaccess` za zaštitu konfiguracijskih datoteka:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Biblioteke trećih strana

### Odabir knjižnica

1. Odaberite knjižnice koje se aktivno održavaju
2. Provjerite postoje li sigurnosne ranjivosti
3. Provjerite je li licenca knjižnice kompatibilna sa XOOPS

### Ažuriranje knjižnica

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Izoliranje knjižnica

```php
// Load library in a controlled way
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## Sigurnosno testiranje

### Kontrolni popis za ručno testiranje1. Testirajte sve obrasce s nevažećim unosom
2. Pokušaj zaobići provjeru autentičnosti i autorizaciju
3. Testirajte funkcionalnost učitavanja datoteka sa zlonamjernim datotekama
4. Provjerite ima li XSS ranjivosti u svim izlaznim podacima
5. Testirajte ubacivanje SQL u svim upitima baze podataka

### Automatizirano testiranje

Koristite automatizirane alate za skeniranje ranjivosti:

1. Statički alati za analizu koda
2. Skeneri web aplikacija
3. Provjera ovisnosti za biblioteke trećih strana

## Bježanje izlaza

### HTML Kontekst

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript Kontekst

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL Kontekst

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Varijable predloška

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Resursi

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Sigurnosna šifra](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS dokumentacija](https://xoops.org/)

---

#sigurnost #najbolje prakse #xoops #modul-development #authentication #authorization
