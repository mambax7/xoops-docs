---
title: "XMF Permintaan"
description: 'HTTP pengendalian permintaan dan pengesahan input yang selamat dengan kelas XMF\Request'
---
Kelas `XMF\Request` menyediakan akses terkawal kepada pembolehubah permintaan HTTP dengan sanitasi terbina dalam dan penukaran jenis. Ia melindungi daripada suntikan yang berpotensi berbahaya secara lalai sambil mematuhi input kepada jenis tertentu.

## Gambaran Keseluruhan

Pengendalian permintaan ialah salah satu aspek pembangunan web yang paling kritikal keselamatan. Kelas XMF Permintaan:

- Membersihkan input secara automatik untuk mengelakkan serangan XSS
- Menyediakan pengakses jenis selamat untuk jenis data biasa
- Menyokong berbilang sumber permintaan (GET, POST, COOKIE, dsb.)
- Menawarkan pengendalian nilai lalai yang konsisten

## Penggunaan Asas
```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```
## Kaedah Permintaan

### getMethod()

Mengembalikan kaedah permintaan HTTP untuk permintaan semasa.
```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```
### getVar($name, $default, $hash, $type, $mask)

Kaedah teras yang digunakan oleh kebanyakan kaedah `get*()` yang lain. Mengambil dan mengembalikan pembolehubah bernama daripada data permintaan.

**Parameter:**
- `$name` - Nama boleh ubah untuk diambil
- `$default` - Nilai lalai jika pembolehubah tidak wujud
- `$hash` - Hash sumber: GET, POST, FILES, COOKIE, ENV, SERVER, 000,020 (default)
- `$type` - Jenis data untuk pembersihan (lihat jenis Input Penapis di bawah)
- `$mask` - Bitmask untuk pilihan pembersihan

**Nilai Topeng:**

| Pemalar Topeng | Kesan |
|--------------|--------|
| `MASK_NO_TRIM` | Jangan potong leading/trailing ruang putih |
| `MASK_ALLOW_RAW` | Langkau pembersihan, benarkan input mentah |
| `MASK_ALLOW_HTML` | Benarkan set "selamat" terhad bagi HTML markup |
```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```
## Kaedah Khusus Jenis

### getInt($name, $default, $hash)

Mengembalikan nilai integer. Hanya digit dibenarkan.
```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```
### getFloat($name, $default, $hash)

Mengembalikan nilai apungan. Hanya digit dan noktah dibenarkan.
```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```
### getBool($name, $default, $hash)

Mengembalikan nilai boolean.
```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```
### getWord($name, $default, $hash)

Mengembalikan rentetan dengan hanya huruf dan garis bawah `[A-Za-z_]`.
```php
$action = Request::getWord('action', 'view');
```
### getCmd($name, $default, $hash)

Mengembalikan rentetan arahan dengan hanya `[A-Za-z0-9.-_]`, terpaksa menggunakan huruf kecil.
```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```
### getString($name, $default, $hash, $mask)

Mengembalikan rentetan yang telah dibersihkan dengan kod HTML buruk dialih keluar (melainkan ditindih oleh topeng).
```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```
### getArray($name, $default, $hash)

Mengembalikan tatasusunan, diproses secara rekursif untuk mengalih keluar XSS dan kod buruk.
```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```
### getText($name, $default, $hash)

Mengembalikan teks mentah tanpa pembersihan. Gunakan dengan berhati-hati.
```php
$rawContent = Request::getText('raw_content', '');
```
### getUrl($name, $default, $hash)

Mengembalikan web yang disahkan URL (skim relatif, http atau https sahaja).
```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```
### getPath($name, $default, $hash)

Mengembalikan sistem fail atau laluan web yang disahkan.
```php
$filePath = Request::getPath('file', '');
```
### getEmail($name, $default, $hash)

Mengembalikan alamat e-mel yang disahkan atau lalai.
```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```
### getIP($name, $default, $hash)

Mengembalikan alamat IPv4 atau IPv6 yang disahkan.
```php
$userIp = Request::getIP('client_ip', '');
```
### getHeader($headerName, $default)

Mengembalikan nilai pengepala permintaan HTTP.
```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```
## Kaedah Utiliti

### hasVar($name, $hash)

Semak sama ada pembolehubah wujud dalam cincang yang ditentukan.
```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```
### setVar($name, $value, $hash, $overwrite)

Tetapkan pembolehubah dalam cincang yang ditentukan. Mengembalikan nilai sebelumnya atau null.
```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```
### dapatkan($hash, $mask)

Mengembalikan salinan keseluruhan tatasusunan cincang yang telah dibersihkan.
```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```
### set($array, $hash, $overwrite)

Menetapkan berbilang pembolehubah daripada tatasusunan.
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```
## Penyepaduan Input Penapis

Kelas Permintaan menggunakan `XMF\FilterInput` untuk pembersihan. Jenis penapis yang tersedia:

| Taip | Penerangan |
|------|-------------|
| ALPHANUM / ALNUM | Alfanumerik sahaja |
| ARRAY | Bersihkan secara rekursif setiap elemen |
| BASE64 | Rentetan berkod Base64 |
| BOOLEAN / BOOL | Betul atau salah |
| CMD | Perintah - A-Z, 0-9, garis bawah, sempang, noktah (huruf kecil) |
| EMAIL | Alamat e-mel yang sah |
| FLOAT / DOUBLE | Nombor titik terapung |
| INTEGER / INT | Nilai integer |
| IP | Alamat IP yang sah |
| PATH | Sistem fail atau laluan web |
| STRING | Rentetan am (lalai) |
| USERNAME | Format nama pengguna |
| WEBURL | Web URL |
| WORD | Huruf A-Z dan garis bawah sahaja |

## Contoh Praktikal

### Pemprosesan Borang
```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```
### AJAX Pengendali
```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```
### Penomboran
```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```
### Borang Carian
```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```
## Amalan Terbaik Keselamatan

1. **Sentiasa gunakan kaedah khusus jenis** - Gunakan `getInt()` untuk ID, `getEmail()` untuk e-mel, dsb.

2. **Berikan lalai yang wajar** - Jangan sekali-kali menganggap input wujud

3. **Sahkan selepas sanitasi** - Sanitasi membuang data yang tidak baik, pengesahan memastikan data yang betul

4. **Gunakan cincang yang sesuai** - Tentukan POST untuk data borang, GET untuk parameter pertanyaan

5. **Elakkan input mentah** - Hanya gunakan `getText()` atau `MASK_ALLOW_RAW` apabila benar-benar perlu
```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```
## Lihat Juga

- Bermula-dengan-XMF - Konsep asas XMF
- XMF-Modul-Helper - Kelas pembantu modul
- ../XMF-Rangka Kerja - Gambaran keseluruhan rangka kerja

---

#XMF #request #security #input-validation #sanitization