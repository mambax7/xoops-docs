---
title: "Najlepsze praktyki bezpieczeństwa"
description: "Kompleksowy przewodnik bezpieczeństwa dla deweloperów modułów XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[Interfejsy API bezpieczeństwa są stabilne na wszystkich wersjach]
Praktyki bezpieczeństwa i interfejsy API udokumentowane tutaj działają zarówno w XOOPS 2.5.x, jak i XOOPS 4.0.x. Klasy podstawowego bezpieczeństwa (`XoopsSecurity`, `MyTextSanitizer`) pozostają stabilne.
:::

Dokument ten zawiera kompleksowe najlepsze praktyki bezpieczeństwa dla deweloperów modułów XOOPS. Zastosowanie się do tych wytycznych pomoże zapewnić, że Twoje moduły są bezpieczne i nie wprowadzają podatności do instalacji XOOPS.

## Zasady bezpieczeństwa

Każdy deweloper XOOPS powinien postępować zgodnie z tymi podstawowymi zasadami bezpieczeństwa:

1. **Obrona w głąb**: Wdrażaj wiele warstw kontroli bezpieczeństwa
2. **Najmniejsze przywileje**: Zapewniaj tylko minimum niezbędnych uprawnień dostępu
3. **Walidacja danych wejściowych**: Nigdy nie ufaj danym od użytkownika
4. **Bezpieczne domyślnie**: Bezpieczeństwo powinno być domyślną konfiguracją
5. **Utrzymuj prostotę**: Złożone systemy są trudniejsze do zabezpieczenia

## Dokumentacja pokrewna

- CSRF-Protection - System tokenów i klasa XoopsSecurity
- Input-Sanitization - MyTextSanitizer i walidacja
- SQL-Injection-Prevention - Praktyki bezpieczeństwa bazy danych

## Szybka lista kontrolna

Przed wydaniem modułu upewnij się, że:

- [ ] Wszystkie formularze zawierają tokeny XOOPS
- [ ] Wszystkie dane wejściowe od użytkownika są walidowane i sanityzowane
- [ ] Wszystkie dane wyjściowe są prawidłowo escapowane
- [ ] Wszystkie zapytania do bazy danych wykorzystują instrukcje sparametryzowane
- [ ] Przesyłanie plików jest prawidłowo walidowane
- [ ] Sprawdzenia uwierzytelniania i autoryzacji są na miejscu
- [ ] Obsługa błędów nie ujawnia poufnych informacji
- [ ] Poufna konfiguracja jest chroniona
- [ ] Biblioteki stron trzecich są aktualne
- [ ] Przeprowadzono testy bezpieczeństwa

## Uwierzytelnianie i autoryzacja

### Sprawdzanie uwierzytelniania użytkownika

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Sprawdzanie uprawnień użytkownika

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

### Konfigurowanie uprawnień modułu

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

## Bezpieczeństwo sesji

### Najlepsze praktyki obsługi sesji

1. Nie przechowuj poufnych informacji w sesji
2. Regeneruj identyfikatory sesji po zalogowaniu/zmianach uprawnień
3. Waliduj dane sesji przed ich użyciem

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### Zapobieganie fiksacji sesji

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

## Bezpieczeństwo przesyłania plików

### Walidacja przesyłanych plików

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

### Korzystanie z narzędzia XOOPS Uploader

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

### Bezpieczne przechowywanie przesyłanych plików

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

## Obsługa błędów i rejestrowanie zdarzeń

### Bezpieczna obsługa błędów

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

### Rejestrowanie zdarzeń bezpieczeństwa

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Bezpieczeństwo konfiguracji

### Przechowywanie poufnej konfiguracji

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

### Ochrona plików konfiguracyjnych

Użyj `.htaccess` do ochrony plików konfiguracyjnych:

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Biblioteki stron trzecich

### Wybieranie bibliotek

1. Wybieraj aktywnie utrzymywane biblioteki
2. Sprawdzaj podatności bezpieczeństwa
3. Weryfikuj, czy licencja biblioteki jest kompatybilna z XOOPS

### Aktualizowanie bibliotek

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Izolowanie bibliotek

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

## Testy bezpieczeństwa

### Ręczna lista kontrolna testowania

1. Testuj wszystkie formularze za pomocą nieprawidłowych danych wejściowych
2. Spróbuj obejść uwierzytelnianie i autoryzację
3. Testuj funkcjonalność przesyłania plików przy użyciu złośliwych plików
4. Sprawdzaj podatności XSS we wszystkich wynikach
5. Testuj wstrzykiwanie SQL we wszystkich zapytaniach do bazy danych

### Testy automatyczne

Użyj zautomatyzowanych narzędzi do skanowania podatności:

1. Narzędzia analizy kodu statycznego
2. Skanery aplikacji internetowych
3. Kontrolery zależności dla bibliotek stron trzecich

## Escapowanie danych wyjściowych

### Kontekst HTML

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

### Kontekst URL

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Zmienne szablonu

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Zasoby

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Documentation](https://xoops.org/)

---

#security #best-practices #xoops #module-development #authentication #authorization
