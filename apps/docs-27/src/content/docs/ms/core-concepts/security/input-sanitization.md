---
title: "Pembersihan Input"
description: "Menggunakan MyTextSanitizer dan teknik pengesahan dalam XOOPS"
---
Jangan sekali-kali mempercayai input pengguna. Sentiasa sahkan dan bersihkan semua data input sebelum menggunakannya. XOOPS menyediakan kelas `MyTextSanitizer` untuk membersihkan input teks dan pelbagai fungsi pembantu untuk pengesahan.## Dokumentasi Berkaitan- Amalan Terbaik Keselamatan - Panduan keselamatan yang komprehensif
- CSRF-Protection - Sistem token dan kelas XoopsSecurity
- SQL-Injection-Prevention - Amalan keselamatan pangkalan data## Peraturan Emas**Jangan sekali-kali mempercayai input pengguna.** Semua data daripada sumber luaran mestilah:1. **Disahkan**: Semak sama ada ia sepadan dengan format dan jenis yang dijangkakan
2. **Disanitasi**: Alih keluar atau larikan watak yang berpotensi berbahaya
3. **Escaped**: Apabila mengeluarkan, escape untuk konteks tertentu (HTML, JavaScript, SQL)## Kelas MyTextSanitizerXOOPS menyediakan kelas `MyTextSanitizer` (biasanya dialias sebagai `$myts`) untuk pembersihan teks.### Mendapatkan Contoh
```
php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```
### Pembersihan Teks Asas
```
php
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
### Pemprosesan Kandungan TextareaKaedah `displayTarea()` menyediakan pemprosesan kawasan teks yang komprehensif:
```
php
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
### Kaedah Pembersihan Biasa
```
php
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
## Pengesahan Input### Mengesahkan Nilai Integer
```
php
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
### Mengesahkan Alamat E-mel
```
php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```
### Mengesahkan URL
```
php
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
### Mengesahkan Tarikh
```
php
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
### Mengesahkan Nama Fail
```
php
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
## Mengendalikan Jenis Input Berbeza### Input Rentetan
```
php
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
### Input Berangka
```
php
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
### Input Boolean
```
php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```
### Input Tatasusunan
```
php
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
### Input Select/Option
```
php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```
## Objek Permintaan (XMF)Apabila menggunakan XMF, kelas Permintaan menyediakan pengendalian input yang lebih bersih:
```
php
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
## Membuat Kelas PengesahanUntuk borang yang kompleks, buat kelas pengesahan khusus:
```
php
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
penggunaan:
```
php
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
## Membersihkan untuk Penyimpanan Pangkalan DataApabila menyimpan data dalam pangkalan data:
```
php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```
## Membersihkan untuk PaparanKonteks yang berbeza memerlukan pelarian yang berbeza:
```
php
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
## Perangkap Biasa### Pengekodan Berganda**Masalah**: Data dikodkan beberapa kali
```
php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```
### Pengekodan Tidak Konsisten**Masalah**: Sesetengah output dikodkan, ada yang tidak**Penyelesaian**: Sentiasa gunakan pendekatan yang konsisten, sebaik-baiknya pengekodan pada output:
```
php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```
### Pengesahan Tiada**Masalah**: Hanya membersihkan tanpa mengesahkan**Penyelesaian**: Sentiasa sahkan dahulu, kemudian bersihkan:
```
php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```
## Ringkasan Amalan Terbaik1. **Gunakan MyTextSanitizer** untuk pemprosesan kandungan teks
2. **Gunakan filter_var()** untuk pengesahan format tertentu
3. **Gunakan penghantaran jenis** untuk nilai berangka
4. **Senarai putih nilai yang dibenarkan** untuk input terpilih
5. **Sahkan sebelum membersihkan**
6. **Escape pada output**, bukan pada input
7. **Gunakan pernyataan yang disediakan** untuk pertanyaan pangkalan data
8. **Buat kelas pengesahan** untuk borang yang kompleks
9. **Jangan sekali-kali mempercayai pengesahan pihak klien** - sentiasa sahkan bahagian pelayan---

#security #sanitization #validation #XOOPS #MyTextSanitizer #input-handling