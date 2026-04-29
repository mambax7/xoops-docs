---
title: "Najboljše varnostne prakse"
description: "Obsežen varnostni vodnik za XOOPS razvoj modulov"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Varnostni API-ji so stabilni med različicami]
Tukaj dokumentirani varnostni postopki in API-ji delujejo tako v XOOPS 2.5.x kot v XOOPS 4.0.x. Osnovni varnostni razredi (`XoopsSecurity`, `MyTextSanitizer`) ostajajo stabilni.
:::

Ta dokument ponuja obsežne najboljše prakse glede varnosti za XOOPS razvijalce modulov. Upoštevanje teh smernic bo pomagalo zagotoviti, da so vaši moduli varni in ne bodo vnašali ranljivosti v namestitve XOOPS.

## Varnostna načela

Vsak XOOPS razvijalec mora upoštevati ta temeljna varnostna načela:

1. **Defense in Depth**: Implementirajte več plasti varnostnih kontrol
2. **Najmanj privilegij**: Zagotovite samo minimalne potrebne pravice dostopa
3. **Preverjanje vnosa**: Nikoli ne zaupajte uporabniškemu vnosu
4. **Privzeto varno**: Varnost mora biti privzeta konfiguracija
5. **Naj bo preprosto**: Zapletene sisteme je težje zavarovati

## Povezana dokumentacija

- CSRF-Zaščita - Sistem žetonov in varnostni razred XOOPS
- Input-Sanitization - MyTextSanitizer in validacija
- SQL-Injection-Prevention - Varnostne prakse baze podatkov

## Hitri referenčni kontrolni seznamPred izdajo modula preverite:

- [ ] Vsi obrazci vključujejo XOOPS žetonov
- [ ] Vsi uporabniški vnosi so potrjeni in razčiščeni
- [ ] Vsi izhodi so pravilno ubežni
- [ ] Vse poizvedbe po bazi podatkov uporabljajo parametrizirane stavke
- [ ] Nalaganje datotek je pravilno potrjeno
- [ ] Preverjanja pristnosti in avtorizacije so na voljo
- [ ] Obravnava napak ne razkrije občutljivih informacij
- [ ] Občutljiva konfiguracija je zaščitena
- [ ] Knjižnice tretjih oseb so posodobljene
- [ ] Varnostno testiranje je bilo izvedeno

## Preverjanje pristnosti in avtorizacija

### Preverjanje pristnosti uporabnika
```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```
### Preverjanje uporabniških dovoljenj
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
### Nastavitev dovoljenj modula
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
## Varnost seje

### Najboljše prakse upravljanja sej

1. Ne shranjujte občutljivih informacij v seji
2. Ponovno ustvarite ID-je seje po login/privilege spremembah
3. Pred uporabo preverite podatke o seji
```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```
### Preprečevanje fiksiranja seje
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
## Varnost nalaganja datotek

### Preverjanje nalaganja datotek
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
### Uporaba XOOPS Uploader
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
### Varno shranjevanje naloženih datotek
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
## Obravnava in beleženje napak

### Varno obravnavanje napak
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
### Beleženje varnostnih dogodkov
```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```
## Varnost konfiguracije

### Shranjevanje občutljive konfiguracije
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
### Zaščita konfiguracijskih datotek

Za zaščito konfiguracijskih datotek uporabite `.htaccess`:
```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```
## Knjižnice tretjih oseb

### Izbiranje knjižnic

1. Izberite aktivno vzdrževane knjižnice
2. Preverite varnostne ranljivosti
3. Preverite, ali je licenca knjižnice združljiva z XOOPS

### Posodabljanje knjižnic
```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```
### Izolacijske knjižnice
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
## Varnostno testiranje

### Kontrolni seznam za ročno testiranje

1. Preizkusite vse obrazce z neveljavnim vnosom
2. Poskus obiti avtentikacijo in avtorizacijo
3. Preizkusite funkcijo nalaganja datotek z zlonamernimi datotekami
4. Preverite XSS ranljivosti v vseh izhodih
5. Preizkusite vstavljanje SQL v vse poizvedbe baze podatkov

### Samodejno testiranje

Uporabite avtomatizirana orodja za iskanje ranljivosti:

1. Orodja za analizo statične kode
2. Skenerji spletnih aplikacij
3. Preverjevalniki odvisnosti za knjižnice tretjih oseb

## Ubežanje izhoda

### HTML Kontekst
```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```
### Kontekst JavaScript
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
### Spremenljivke predloge
```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```
## Viri

- [OWASP Prvih deset](https://owasp.org/www-project-top-ten/)
- [PHP Varnostni goljuf](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Dokumentacija](https://XOOPS.org/)

---

#security #best-practices #XOOPS #module-development #authentication #authorization