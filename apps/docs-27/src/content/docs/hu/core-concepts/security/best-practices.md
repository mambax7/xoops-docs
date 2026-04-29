---
title: "Bevált biztonsági gyakorlatok"
description: "Átfogó biztonsági útmutató a XOOPS modul fejlesztéséhez"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tipp[A biztonsági API-k változatlanok stabilak]
Az itt dokumentált biztonsági gyakorlatok és API-k a XOOPS 2.5.x és a XOOPS 4.0.x verzióban is működnek. Az alapvető biztonsági osztályok (`XOOPSSecurity`, `MyTextSanitizer`) stabilak maradnak.
:::

Ez a dokumentum átfogó biztonsági bevált gyakorlatokat tartalmaz a XOOPS modulfejlesztők számára. Ezen irányelvek betartásával biztosíthatja, hogy a modulok biztonságosak legyenek, és ne okozzanak sebezhetőséget a XOOPS telepítésekben.

## Biztonsági alapelvek

Minden XOOPS fejlesztőnek követnie kell az alábbi alapvető biztonsági elveket:

1. **Mélységben történő védelem**: A biztonsági ellenőrzések több rétegű alkalmazása
2. **Least Privilege**: Csak a minimálisan szükséges hozzáférési jogokat adja meg
3. **Input Validation**: Soha ne bízzon a felhasználói bevitelben
4. **Alapértelmezés szerint biztonságos**: A biztonság legyen az alapértelmezett konfiguráció
5. **Keep It Simple**: Az összetett rendszereket nehezebb biztosítani

## Kapcsolódó dokumentáció

- CSRF-védelem - Token rendszer és XOOPS biztonsági osztály
- Input-Sanitization - MyTextSanitizer és érvényesítés
- SQL - Befecskendezés - Megelőzés - Adatbázis biztonsági gyakorlatok

## Gyorsreferencia ellenőrzőlista

A modul kiadása előtt ellenőrizze:

- [ ] Minden űrlap tartalmaz XOOPS tokeneket
- [ ] Minden felhasználói bevitel érvényesítve és megtisztítva
- [ ] Minden kimenet megfelelően kikerült
- [ ] Minden adatbázis-lekérdezés paraméterezett utasításokat használ
- [ ] A fájlfeltöltések megfelelően érvényesek
- [ ] A hitelesítési és engedélyezési ellenőrzések működnek
- [ ] A hibakezelés nem tár fel bizalmas információkat
- [ ] Az érzékeny konfiguráció védett
- [ ] A harmadik féltől származó könyvtárak naprakészek
- [ ] A biztonsági tesztelés megtörtént

## Hitelesítés és engedélyezés

### Felhasználói hitelesítés ellenőrzése

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Felhasználói engedélyek ellenőrzése

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

### modulengedélyek beállítása

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

## Session Security

### Munkamenet-kezelési bevált gyakorlatok

1. Ne tároljon érzékeny információkat a munkamenetben
2. A login/privilege módosítások után generálja újra a munkamenet-azonosítókat
3. Használat előtt ellenőrizze a munkamenet adatait

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### Munkamenetrögzítés megelőzése

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

## Fájlfeltöltés biztonsága

### Fájlfeltöltések érvényesítése

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

### A XOOPS Uploader használata

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

### A feltöltött fájlok biztonságos tárolása

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

## Hibakezelés és naplózás

### Biztonságos hibakezelés

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

### Biztonsági események naplózása

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Konfigurációs biztonság

### Érzékeny konfiguráció tárolása

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

### Konfigurációs fájlok védelme

Használja a `.htaccess`-t a konfigurációs fájlok védelmére:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Harmadik féltől származó könyvtárak

### Könyvtárak kiválasztása

1. Válasszon aktívan karbantartott könyvtárakat
2. Ellenőrizze a biztonsági réseket
3. Ellenőrizze, hogy a könyvtár licence kompatibilis-e a XOOPS-val

### Könyvtárak frissítése

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Könyvtárak elkülönítése

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

## Biztonsági tesztelés

### Kézi tesztelés ellenőrzőlista

1. Teszteljen minden érvénytelen adatot tartalmazó űrlapot
2. Kísérlet a hitelesítés és az engedélyezés megkerülésére
3. Tesztelje a fájlfeltöltési funkciót rosszindulatú fájlokkal
4. Ellenőrizze a XSS sebezhetőséget az összes kimeneten
5. Tesztelje a SQL injekciót az összes adatbázis-lekérdezésben

### Automatizált tesztelés

Használjon automatizált eszközöket a sebezhetőségek kereséséhez:

1. Statikus kódelemző eszközök
2. Webalkalmazás-szkennerek
3. Függőség-ellenőrzők harmadik féltől származó könyvtárak számára

## Output Escape

### HTML Kontextus

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript kontextus

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL Kontextus

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Sablonváltozók

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Források

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP biztonsági csalólap](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS dokumentáció](https://xoops.org/)

---

#biztonság #legjobb gyakorlatok #xoops #modulfejlesztés #hitelesítés #engedélyezés
