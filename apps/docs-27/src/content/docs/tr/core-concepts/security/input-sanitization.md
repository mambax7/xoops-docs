---
title: "Giriş Sterilizasyonu"
description: "XOOPS'de MyTextSanitizer ve doğrulama tekniklerini kullanma"
---
user girişine asla güvenmeyin. Kullanmadan önce daima tüm giriş verilerini doğrulayın ve sterilize edin. XOOPS, metin girişini temizlemek için `MyTextSanitizer` sınıfını ve doğrulama için çeşitli yardımcı işlevleri sağlar.

## İlgili Belgeler

- En İyi Güvenlik Uygulamaları - Kapsamlı güvenlik kılavuzu
- CSRF-Koruma - Token sistemi ve XoopsSecurity sınıfı
- SQL-Enjeksiyon-Önleme - database güvenliği uygulamaları

## Altın Kural

**user girdilerine asla güvenmeyin.** Harici kaynaklardan alınan tüm veriler şu şekilde olmalıdır:

1. **Doğrulandı**: Beklenen biçim ve türle eşleştiğini kontrol edin
2. **Sterilize edilmiştir**: Potansiyel olarak tehlikeli karakterleri kaldırın veya bunlardan kaçının
3. **Kaçış**: Çıktı alırken, belirli bağlam için kaçış yapın (HTML, JavaScript, SQL)

## MyTextSanitizer Sınıfı

XOOPS, metin temizleme için `MyTextSanitizer` sınıfını (genellikle `$myts` olarak adlandırılır) sağlar.

### Örneği Alma
```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```
### Temel Metin Temizleme
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
### Textarea İçerik İşleme

`displayTarea()` yöntemi kapsamlı metin alanı işleme sağlar:
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
### Yaygın Temizleme Yöntemleri
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
## Giriş Doğrulaması

### Tam Sayı Değerlerini Doğrulama
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
### E-posta Adreslerini Doğrulama
```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```
### Doğrulanıyor URLs
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
### Tarihler Doğrulanıyor
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
### Dosya Adlarını Doğrulama
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
## Farklı Giriş Türlerini Kullanma

### Dizi Girişi
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
### Sayısal Giriş
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
### Boole Girişi
```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```
### Dizi Girişi
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
### Select/Option Giriş
```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```
## İstek Nesnesi (XMF)

XMF kullanıldığında, İstek sınıfı daha temiz giriş yönetimi sağlar:
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
## Doğrulama Sınıfı Oluşturma

Karmaşık formlar için özel bir doğrulama sınıfı oluşturun:
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
Kullanımı:
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
## database Depolaması için Temizleme

Veri tabanına veri kaydederken:
```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```
## Ekran için Sterilizasyon

Farklı bağlamlar farklı kaçışlar gerektirir:
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
## Yaygın Tuzaklar

### Çift Kodlama

**Sorun**: Veriler birden çok kez kodlanıyor
```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```
### Tutarsız Kodlama

**Sorun**: Bazı çıkışlar kodlanmış, bazıları kodlanmamış

**Çözüm**: Her zaman tutarlı bir yaklaşım kullanın, tercihen çıktıyı kodlayın:
```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```
### Eksik Doğrulama

**Sorun**: Yalnızca doğrulamadan temizleme

**Çözüm**: Her zaman önce doğrulayın, sonra temizleyin:
```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```
## En İyi Uygulamaların Özeti

1. **Metin içeriği işleme için MyTextSanitizer'ı kullanın**
2. **Belirli bir format doğrulaması için filter_var()** kullanın
3. **Sayısal değerler için **tip dökümü kullanın**
4. **Seçili girişler için izin verilen değerleri beyaz listeye alın**
5. **Sterilize etmeden önce doğrulayın**
6. **Çıkışta kaçış**, girişte değil
7. database sorguları için **hazırlanmış ifadeleri kullanın**
8. **Karmaşık formlar için doğrulama sınıfları oluşturun**
9. **İstemci tarafı doğrulamaya asla güvenmeyin** - her zaman sunucu tarafını doğrulayın

---

#güvenlik #sterilizasyon #doğrulama #xoops #MyTextSanitizer #giriş işleme