---
title: "Vstupní dezinfekce"
description: "Použití MyTextSanitizer a ověřovacích technik v XOOPS"
---

Nikdy nedůvěřujte uživatelskému vstupu. Před použitím vždy ověřte a dezinfikujte všechna vstupní data. XOOPS poskytuje třídu `MyTextSanitizer` pro dezinfekci zadávání textu a různé pomocné funkce pro ověřování.

## Související dokumentace

- Bezpečnostní-Best-Practices - Komplexní bezpečnostní průvodce
- CSRF-Protection - Systém tokenů a třída XOOPSSecurity
- SQL-Injection-Prevention - Postupy zabezpečení databáze

## Zlaté pravidlo

**Nikdy nedůvěřujte uživatelskému vstupu.** Všechna data z externích zdrojů musí být:

1. **Ověřeno**: Zkontrolujte, zda odpovídá očekávanému formátu a typu
2. **Dezinfikováno**: Odstraňte nebo unikněte potenciálně nebezpečným postavám
3. **Escaped**: Při výstupu, escape pro konkrétní kontext (HTML, JavaScript, SQL)

## Třída MyTextSanitizer

XOOPS poskytuje třídu `MyTextSanitizer` (běžně známá jako `$myts`) pro dezinfekci textu.

### Získání instance

```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```

### Základní dezinfekce textu

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

### Zpracování obsahu textové oblasti

Metoda `displayTarea()` poskytuje komplexní zpracování textové oblasti:

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

### Běžné metody sanitace

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

## Ověření vstupu

### Ověřování celočíselných hodnot

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

### Ověřování e-mailových adres

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### Ověřování adres URL

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

### Ověřování dat

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

### Ověřování názvů souborů

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

## Práce s různými typy vstupů

### Vstup řetězce

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

### Numerický vstup

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

### Booleovský vstup

```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### Vstup pole

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

### Vstup Select/Option

```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Objekt požadavku (XMF)

Při použití XMF poskytuje třída Request čistší zpracování vstupu:

```php
use XMF\Request;

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

## Vytvoření ověřovací třídy

Pro složité formuláře vytvořte vyhrazenou třídu ověření:

```php
<?php
namespace XOOPSModules\MyModule;

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

Použití:

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

## Dezinfekce pro úložiště databáze

Při ukládání dat do databáze:

```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Dezinfekce displeje

Různé kontexty vyžadují různé úniky:

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

## Běžná úskalí

### Dvojité kódování

**Problém**: Data jsou zakódována několikrát

```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```

### Nekonzistentní kódování

**Problém**: Některé výstupy jsou kódované, některé ne

**Řešení**: Vždy používejte konzistentní přístup, nejlépe kódování na výstupu:

```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### Chybí ověření

**Problém**: Pouze dezinfekce bez ověření

**Řešení**: Vždy nejprve ověřte a poté dezinfikujte:

```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```

## Shrnutí osvědčených postupů

1. **Použijte MyTextSanitizer** pro zpracování textového obsahu
2. **Použijte filter_var()** pro ověření konkrétního formátu
3. **Pro číselné hodnoty použijte přetypování**
4. **Povolené hodnoty na seznamu povolených vstupů** pro vybrané vstupy
5. **Ověřte před dezinfekcí**
6. **Escape na výstupu**, ne na vstupu
7. **Použijte připravené příkazy** pro databázové dotazy
8. **Vytvořte třídy ověření** pro složité formuláře
9. **Nikdy nedůvěřujte ověřování na straně klienta** – vždy ověřujte na straně serveru

---

#zabezpečení #sanitizace #validace #xoops #MyTextSanitizer #zpracování vstupu