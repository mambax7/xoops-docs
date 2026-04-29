---
title: "Bemeneti fertőtlenítés"
description: "A MyTextSanitizer és az érvényesítési technikák használata XOOPS-ban"
---
Soha ne bízzon a felhasználói bevitelben. Használat előtt mindig ellenőrizze és tisztítsa meg az összes bemeneti adatot. A XOOPS biztosítja a `MyTextSanitizer` osztályt a szövegbevitel megtisztítására, valamint különféle segédfunkciókat az érvényesítéshez.

## Kapcsolódó dokumentáció

- Biztonság – legjobb gyakorlatok – Átfogó biztonsági útmutató
- CSRF-védelem - Token rendszer és XOOPS biztonsági osztály
- SQL - Befecskendezés - Megelőzés - Adatbázis biztonsági gyakorlatok

## Az aranyszabály

**Soha ne bízzon a felhasználói bevitelben.** Minden külső forrásból származó adatnak a következőnek kell lennie:

1. **Érvényesített**: Ellenőrizze, hogy megfelel-e a várt formátumnak és típusnak
2. **Sanitized**: A potenciálisan veszélyes karakterek eltávolítása vagy menekülése
3. **Escaped**: Kiadáskor használja az Escape billentyűt az adott kontextushoz (HTML, JavaScript, SQL)

## MyTextSanitizer osztály

A XOOPS a `MyTextSanitizer` osztályt (általános nevén `$myts`) biztosítja a szövegtisztításhoz.

### A példány lekérése

```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```

### Alapvető szövegfertőtlenítés

```php
$myts = MyTextSanitizer::getInstance();

// For plain text fields (no HTML allowed)
$title = $myts->htmlSpecialChars($_POST['title']);

// This converts:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```

### Textarea tartalomfeldolgozás

A `displayTarea()` módszer átfogó szövegterület-feldolgozást biztosít:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = No HTML allowed, 1 = HTML allowed
    $allowsmiley = 1,    // 1 = Smilies enabled
    $allowxcode = 1,     // 1 = XOOPS codes enabled (BBCode)
    $allowimages = 1,    // 1 = Images allowed
    $allowlinebreak = 1  // 1 = Line breaks converted to <br>
);
```

### Általános fertőtlenítési módszerek

```php
$myts = MyTextSanitizer::getInstance();

// HTML special characters escaping
$safe_text = $myts->htmlSpecialChars($text);

// Strip slashes if magic quotes are on
$text = $myts->stripSlashesGPC($text);

// Convert XOOPS codes (BBCode) to HTML
$html = $myts->xoopsCodeDecode($text);

// Convert smileys to images
$html = $myts->smiley($text);

// Make clickable links
$html = $myts->makeClickable($text);

// Complete text processing for preview
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## Bevitel ellenőrzése

### Egész értékek érvényesítése

```php
// Validate integer ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternative with filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### E-mail címek érvényesítése

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### URL-ek érvényesítése

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Additional check for allowed protocols
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### Dátumok érvényesítése

```php
$date = $_POST['date'] ?? '';

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validate actual date validity
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### Fájlnevek érvényesítése

```php
// Remove all characters except alphanumeric, underscore, and hyphen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Or use a whitelist approach
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## Különböző beviteli típusok kezelése

### Karakterlánc bemenet

```php
$myts = MyTextSanitizer::getInstance();

// Short text (titles, names)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limit length
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Check for empty required fields
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### Numerikus bevitel

```php
// Integer
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Ensure range 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Round to 2 decimal places

// Validate range
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### Logikai bemenet

```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### Tömb bemenet

```php
// Validate array input (e.g., multiple checkboxes)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### Select/Option bemenet

```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Objektum kérése (XMF)

XMF használata esetén a Request osztály tisztább bemenetkezelést biztosít:

```php
use Xmf\Request;

// Get integer
$id = Request::getInt('id', 0);

// Get string
$title = Request::getString('title', '');

// Get array
$ids = Request::getArray('ids', []);

// Get with method specification
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Check request method
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## Érvényesítési osztály létrehozása

Összetett űrlapokhoz hozzon létre egy dedikált érvényesítési osztályt:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Title validation
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Email validation
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Status validation
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

Használat:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Display errors to user
}
```

## Megtisztítás az adatbázis-tároláshoz

Adattároláskor az adatbázisban:

```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Megjelenítési fertőtlenítés

A különböző kontextusok eltérő menekülést igényelnek:

```php
$myts = MyTextSanitizer::getInstance();

// HTML context
echo $myts->htmlSpecialChars($title);

// Within HTML attributes
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript context
echo json_encode($title);

// URL parameter
echo urlencode($title);

// Full URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## Gyakori buktatók

### Dupla kódolás

**Probléma**: Az adatok többször kódolásra kerülnek

```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```

### Inkonzisztens kódolás

**Probléma**: Egyes kimenetek kódoltak, mások nem

**Megoldás**: Mindig alkalmazzon következetes megközelítést, lehetőleg kódolást a kimeneten:

```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### Hiányzó érvényesítés

**Probléma**: Csak fertőtlenítés érvényesítés nélkül

**Megoldás**: Először mindig érvényesítse, majd fertőtlenítse:

```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```

## A legjobb gyakorlatok összefoglalása

1. **Használja a MyTextSanitizert** a szöveges tartalom feldolgozásához
2. **Használja a filter_var()** formátumot az adott formátum érvényesítéséhez
3. **Használja a típusöntést** a numerikus értékekhez
4. **A megengedett értékek engedélyezése** a kiválasztott bemenetekhez
5. **Érvényesítés a fertőtlenítés előtt**
6. **Escape a kimeneten**, nem a bemeneten
7. **Használjon előkészített utasításokat** az adatbázis-lekérdezésekhez
8. **Hozzon létre érvényesítési osztályokat** az összetett űrlapokhoz
9. **Soha ne bízzon a kliensoldali érvényesítésben** - mindig kiszolgálóoldali érvényesítést végezzen

---

#biztonság #fertőtlenítés #érvényesítés #xoops #MyTextSanitizer #bevitel-kezelés
