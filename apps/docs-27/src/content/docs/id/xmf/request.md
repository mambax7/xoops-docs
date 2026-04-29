---
title: "Permintaan XMF"
description: 'Penanganan permintaan HTTP yang aman dan validasi input dengan kelas Xmf\Request'
---

Kelas `Xmf\Request` menyediakan akses terkontrol ke variabel permintaan HTTP dengan sanitasi bawaan dan konversi tipe. Ini melindungi terhadap suntikan yang berpotensi membahayakan secara default sambil menyesuaikan input ke jenis tertentu.

## Ikhtisar

Penanganan permintaan adalah salah satu aspek keamanan yang paling penting dalam pengembangan web. Kelas Permintaan XMF:

- Secara otomatis membersihkan input untuk mencegah serangan XSS
- Menyediakan pengakses tipe-aman untuk tipe data umum
- Mendukung berbagai sumber permintaan (GET, POST, COOKIE, dll.)
- Menawarkan penanganan nilai default yang konsisten

## Penggunaan Dasar

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## Metode Permintaan

### getMethod()

Mengembalikan metode permintaan HTTP untuk permintaan saat ini.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

Metode core yang digunakan sebagian besar metode `get*()` lainnya. Mengambil dan mengembalikan variabel bernama dari data permintaan.

**Parameter:**
- `$name` - Nama variabel yang akan diambil
- `$default` - Nilai default jika variabel tidak ada
- `$hash` - Sumber hash: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD, atau REQUEST (default)
- `$type` - Tipe data untuk pembersihan (lihat tipe FilterInput di bawah)
- `$mask` - Bitmask untuk opsi pembersihan

**Nilai Masker:**

| Topeng Konstan | Efek |
|---------------|--------|
| `MASK_NO_TRIM` | Jangan pangkas spasi leading/trailing |
| `MASK_ALLOW_RAW` | Lewati pembersihan, izinkan masukan mentah |
| `MASK_ALLOW_HTML` | Izinkan kumpulan markup HTML "aman" yang terbatas |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## Metode Tipe-Khusus

### getInt($name, $default, $hash)

Mengembalikan nilai integer. Hanya angka yang diperbolehkan.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### dapatkanFloat($name, $default, $hash)

Mengembalikan nilai float. Hanya angka dan titik yang diperbolehkan.

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

Mengembalikan string yang hanya berisi huruf dan garis bawah `[A-Za-z_]`.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

Mengembalikan string perintah dengan hanya `[A-Za-z0-9.-_]`, yang dipaksa menjadi huruf kecil.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

Mengembalikan string yang telah dibersihkan dengan kode HTML yang buruk telah dihapus (kecuali diganti dengan mask).

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

Mengembalikan array, diproses secara rekursif untuk menghapus XSS dan kode buruk.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

Mengembalikan teks mentah tanpa dibersihkan. Gunakan dengan hati-hati.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

Mengembalikan web URL yang divalidasi (hanya skema relatif, http, atau https).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### dapatkanPath($name, $default, $hash)

Mengembalikan sistem file atau jalur web yang divalidasi.

```php
$filePath = Request::getPath('file', '');
```

### dapatkanEmail($name, $default, $hash)

Mengembalikan alamat email yang divalidasi atau default.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### dapatkanIP($name, $default, $hash)

Mengembalikan alamat IPv4 atau IPv6 yang divalidasi.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

Mengembalikan nilai header permintaan HTTP.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## Metode Utilitas

### hasVar($name, $hash)

Periksa apakah ada variabel dalam hash yang ditentukan.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

Tetapkan variabel dalam hash yang ditentukan. Mengembalikan nilai sebelumnya atau null.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### dapatkan($hash, $mask)

Mengembalikan salinan bersih dari seluruh array hash.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### set($array, $hash, $overwrite)

Menetapkan beberapa variabel dari array.
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## Integrasi Masukan Filter

Kelas Permintaan menggunakan `Xmf\FilterInput` untuk pembersihan. Jenis filter yang tersedia:

| Ketik | Deskripsi |
|------|-------------|
| ALPHANUM/ALNUM | Hanya alfanumerik |
| ARRAY | Bersihkan setiap elemen |
| BASE64 | String yang dikodekan Base64 |
| BOOLEAN / BOOL | Benar atau salah |
| cmd | Perintah - A-Z, 0-9, garis bawah, tanda hubung, titik (huruf kecil) |
| EMAIL | Alamat email yang valid |
| MENGAPUNG / GANDA | Nomor titik mengambang |
| BULAT / INT | Nilai bilangan bulat |
| IP | Alamat IP yang valid |
| JALUR | Sistem file atau jalur web |
| STRING | String umum (default) |
| NAMA PENGGUNA | Format nama pengguna |
| URL WEB | Web URL |
| KATA | Huruf A-Z dan garis bawah saja |

## Contoh Praktis

### Pemrosesan Formulir

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

### Pengendali AJAX

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

### Paginasi

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

### Formulir Pencarian

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

## Praktik Terbaik Keamanan

1. **Selalu gunakan metode khusus jenis** - Gunakan `getInt()` untuk ID, `getEmail()` untuk email, dll.

2. **Berikan default yang masuk akal** - Jangan pernah berasumsi ada masukan

3. **Validasi setelah sanitasi** - Sanitasi menghilangkan data buruk, validasi memastikan data benar

4. **Gunakan hash yang sesuai** - Tentukan POST untuk data formulir, GET untuk parameter kueri

5. **Hindari input mentah** - Hanya gunakan `getText()` atau `MASK_ALLOW_RAW` bila benar-benar diperlukan

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## Lihat Juga

- Memulai-dengan-XMF - Konsep dasar XMF
- XMF-Module-Helper - Kelas pembantu module
- ../XMF-Framework - Ikhtisar kerangka kerja

---

#xmf #permintaan #keamanan #validasi masukan #sanitisasi
