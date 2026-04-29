---
title: "Bedste praksis for sikkerhed"
description: "Omfattende sikkerhedsvejledning til udvikling af XOOPS modul"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Sikkerheds-API'er er stabile på tværs af versioner]
Sikkerhedspraksis og API'er, der er dokumenteret her, fungerer i både XOOPS 2.5.x og XOOPS 4.0.x. Kernesikkerhedsklasser (`XoopsSecurity`, `MyTextSanitizer`) forbliver stabile.
:::

Dette dokument giver omfattende bedste praksis for sikkerhed for XOOPS-moduludviklere. At følge disse retningslinjer hjælper med at sikre, at dine moduler er sikre og ikke introducerer sårbarheder i XOOPS-installationer.

## Sikkerhedsprincipper

Hver XOOPS-udvikler bør følge disse grundlæggende sikkerhedsprincipper:

1. **Forsvar i dybden**: Implementer flere lag af sikkerhedskontrol
2. **Mindste privilegium**: Giv kun de mindst nødvendige adgangsrettigheder
3. **Inputvalidering**: Stol aldrig på brugerinput
4. **Sikker som standard**: Sikkerhed bør være standardkonfigurationen
5. **Keep It Simple**: Komplekse systemer er sværere at sikre

## Relateret dokumentation

- CSRF-beskyttelse - Tokensystem og XoopsSecurity klasse
- Input-sanering - MyTextSanitizer og validering
- SQL-Injection-Prevention - Databasesikkerhedspraksis

## Hurtig referencetjekliste

Før du frigiver dit modul, skal du kontrollere:

- [ ] Alle formularer inkluderer XOOPS-tokens
- [ ] Alt brugerinput er valideret og renset
- [ ] Alt output er korrekt escaped
- [ ] Alle databaseforespørgsler bruger parametriserede sætninger
- [ ] Filuploads er korrekt valideret
- [ ] Godkendelses- og godkendelsestjek er på plads
- [ ] Fejlhåndtering afslører ikke følsomme oplysninger
- [ ] Følsom konfiguration er beskyttet
- [ ] Tredjepartsbiblioteker er opdaterede
- [ ] Sikkerhedstest er blevet udført

## Godkendelse og autorisation

### Kontrollerer brugergodkendelse

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Kontrollerer brugertilladelser

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

### Opsætning af modultilladelser

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

## Sessionssikkerhed

### Best Practices for sessionshåndtering

1. Gem ikke følsomme oplysninger i sessionen
2. Gendan sessions-id'er efter login-/privilegieændringer
3. Valider sessionsdata, før du bruger dem

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### Forebyggelse af sessionsfiksering

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

## Filoverførselssikkerhed

### Validering af filuploads

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

### Brug af XOOPS Uploader

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

### Lagring af uploadede filer sikkert

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

## Fejlhåndtering og logning

### Sikker fejlhåndtering

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

### Logning af sikkerhedshændelser

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Konfigurationssikkerhed

### Lagring af følsom konfiguration

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

### Beskyttelse af konfigurationsfiler

Brug `.htaccess` til at beskytte konfigurationsfiler:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Tredjepartsbiblioteker

### Valg af biblioteker

1. Vælg aktivt vedligeholdte biblioteker
2. Tjek for sikkerhedssårbarheder
3. Bekræft, at bibliotekets licens er kompatibel med XOOPS

### Opdatering af biblioteker

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Isolering af biblioteker

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

## Sikkerhedstest

### Tjekliste til manuel test

1. Test alle formularer med ugyldigt input
2. Forsøg på at omgå godkendelse og autorisation
3. Test fil upload funktionalitet med ondsindede filer
4. Tjek for XSS-sårbarheder i alt output
5. Test for SQL-injektion i alle databaseforespørgsler

### Automatiseret test

Brug automatiserede værktøjer til at scanne for sårbarheder:

1. Værktøjer til statisk kodeanalyse
2. Webapplikationsscannere
3. Afhængighedskontrol for tredjepartsbiblioteker

## Output escape

### HTML kontekst

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript kontekst

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL kontekst

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Skabelonvariabler

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Ressourcer

- [OWASP Top Ti](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS dokumentation](https://xoops.org/)

---

#sikkerhed #bedste praksis #xoops #moduludvikling #godkendelse #autorisation
