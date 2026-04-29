---
title: "Nejlepší bezpečnostní postupy"
description: "Komplexní bezpečnostní průvodce pro vývoj modulu XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Bezpečnostní API jsou stabilní napříč verzemi]
Zde popsané bezpečnostní postupy a API fungují v XOOPS 2.5.xa XOOPS 4.0.x. Základní třídy zabezpečení (`XOOPSSecurity`, `MyTextSanitizer`) zůstávají stabilní.
:::

Tento dokument poskytuje komplexní osvědčené postupy zabezpečení pro vývojáře modulů XOOPS. Dodržování těchto pokynů vám pomůže zajistit, že vaše moduly jsou bezpečné a nezanášejí zranitelnosti do instalací XOOPS.

## Zásady zabezpečení

Každý vývojář XOOPS by měl dodržovat tyto základní bezpečnostní zásady:

1. **Defense in Depth**: Implementujte několik vrstev bezpečnostních kontrol
2. **Nejmenší oprávnění**: Poskytněte pouze minimální nezbytná přístupová práva
3. **Ověření vstupu**: Nikdy nedůvěřujte uživatelskému vstupu
4. **Secure by Default**: Zabezpečení by mělo být výchozí konfigurací
5. **Keep It Simple**: Složité systémy se hůře zajišťují

## Související dokumentace

- CSRF-Protection - Systém tokenů a třída XOOPSSecurity
- Input-Sanitization - MyTextSanitizer a validace
- SQL-Injection-Prevention - Postupy zabezpečení databáze

## Kontrolní seznam pro rychlé reference

Před uvolněním modulu ověřte:

- [ ] Všechny formuláře zahrnují tokeny XOOPS
- [ ] Všechny uživatelské vstupy jsou ověřeny a dezinfikovány
- [ ] Veškerý výstup je správně escapován
- [ ] Všechny databázové dotazy používají parametrizované příkazy
- [ ] Odeslané soubory jsou řádně ověřeny
- [ ] Probíhají kontroly autentizace a autorizace
- [ ] Zpracování chyb neodhalí citlivé informace
- [ ] Citlivá konfigurace je chráněna
- [ ] Knihovny třetích stran jsou aktuální
- [ ] Bylo provedeno bezpečnostní testování

## Autentizace a autorizace

### Kontrola ověření uživatele

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Kontrola uživatelských oprávnění

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

### Nastavení oprávnění modulu

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

## Zabezpečení relace

### Nejlepší postupy pro zpracování relací

1. Neukládejte v relaci citlivé informace
2. Znovu vygenerujte ID relace po změnách login/privilege
3. Před použitím ověřte data relace

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### Prevence fixace relace

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

## Zabezpečení nahrávání souborů

### Ověřování nahraných souborů

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

### Pomocí XOOPS Uploader

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XOOPSMediaUploader(
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

### Bezpečné ukládání nahraných souborů

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

## Zpracování chyb a protokolování

### Zabezpečené zpracování chyb

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

### Protokolování událostí zabezpečení

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Zabezpečení konfigurace

### Ukládání citlivé konfigurace

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

### Ochrana konfiguračních souborů

Použijte `.htaccess` k ochraně konfiguračních souborů:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Knihovny třetích stran

### Výběr knihoven

1. Vyberte si aktivně udržované knihovny
2. Zkontrolujte bezpečnostní zranitelnosti
3. Ověřte, zda je licence knihovny kompatibilní s XOOPS

### Aktualizace knihoven

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Izolace knihoven

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

## Testování zabezpečení

### Kontrolní seznam ručního testování

1. Otestujte všechny formuláře s neplatným vstupem
2. Pokuste se obejít ověřování a autorizaci
3. Otestujte funkčnost nahrávání souborů se škodlivými soubory
4. Zkontrolujte zranitelnosti XSS ve všech výstupech
5. Otestujte vkládání SQL ve všech databázových dotazech

### Automatické testování

Použijte automatizované nástroje k vyhledávání zranitelností:

1. Nástroje pro analýzu statického kódu
2. Skenery webových aplikací
3. Kontroly závislostí pro knihovny třetích stran

## Output Escape

### Kontext HTML

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### Kontext JavaScript

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### Kontext URL

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Proměnné šablony

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Zdroje

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP bezpečnostní cheat](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [Dokumentace XOOPS](https://xoops.org/)

---

#zabezpečení #osvědčené postupy #xoops #vývoj modulů #ověření #autorizace