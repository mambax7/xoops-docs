---
title: "JWT - JSON Token Web"
description: "Implementasi XMF JWT untuk otentikasi berbasis token yang aman dan perlindungan AJAX"
---

namespace `Xmf\Jwt` menyediakan dukungan JSON Web Token (JWT) untuk module XOOPS. JWT memungkinkan otentikasi yang aman dan tanpa kewarganegaraan dan sangat berguna untuk melindungi permintaan AJAX.

## Apa itu Token Web JSON?

Token Web JSON adalah cara standar untuk mempublikasikan sekumpulan *klaim* (data) sebagai string teks, dengan verifikasi kriptografi bahwa klaim tersebut belum diubah. Untuk spesifikasi detailnya, lihat:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Karakteristik Utama

- **Ditandatangani**: Token ditandatangani secara kriptografis untuk mendeteksi gangguan
- **Mandiri**: Semua informasi yang diperlukan ada di token itu sendiri
- **Tanpa kewarganegaraan**: Tidak diperlukan penyimpanan sesi sisi server
- **Dapat kedaluwarsa**: Token dapat mencakup waktu kedaluwarsa

> **Catatan:** JWT ditandatangani, bukan dienkripsi. Data dikodekan Base64 dan terlihat. Gunakan JWT untuk verifikasi integritas, bukan untuk menyembunyikan data sensitif.

## Mengapa Menggunakan JWT di XOOPS?

### Masalah Token AJAX

Formulir XOOPS menggunakan token nonce untuk perlindungan CSRF. Namun, nonces bekerja buruk dengan AJAX karena:

1. **Sekali Pakai**: Nonce biasanya berlaku untuk satu pengiriman
2. **Masalah Asinkron**: Beberapa permintaan AJAX mungkin tidak berurutan
3. **Segarkan Kompleksitas**: Tidak ada cara yang dapat diandalkan untuk menyegarkan token secara asinkron
4. **Context Binding**: Token standar tidak memverifikasi skrip mana yang menerbitkannya

### JWT Keuntungan

JWT memecahkan masalah ini dengan:

- Termasuk waktu kedaluwarsa (klaim `exp`) untuk validitas waktu terbatas
- Mendukung klaim khusus untuk mengikat token ke skrip tertentu
- Mengaktifkan beberapa permintaan dalam masa berlaku
- Menyediakan verifikasi kriptografi asal token

## Kelas core

### JsonWebToken

Kelas `Xmf\Jwt\JsonWebToken` menangani pembuatan dan decoding token.

```php
use Xmf\Jwt\JsonWebToken;
use Xmf\Jwt\KeyFactory;

// Create a key
$key = KeyFactory::build('my_application_key');

// Create a JsonWebToken instance
$jwt = new JsonWebToken($key, 'HS256');

// Create a token
$payload = ['user_id' => 123, 'aud' => 'myaction'];
$token = $jwt->create($payload, 300); // Expires in 300 seconds

// Decode and verify a token
$assertClaims = ['aud' => 'myaction'];
$decoded = $jwt->decode($tokenString, $assertClaims);
```

#### Metode

**`new JsonWebToken($key, $algorithm)`**

Membuat pengendali JWT baru.
- `$key`: Objek `Xmf\Key\KeyAbstract`
- `$algorithm`: Algoritma penandatanganan (default: 'HS256')

**`create($payload, $expirationOffset)`**

Membuat string token yang ditandatangani.
- `$payload`: Berbagai klaim
- `$expirationOffset`: Detik hingga habis masa berlakunya (opsional)

**`decode($jwtString, $assertClaims)`**

Mendekode dan memvalidasi token.
- `$jwtString`: Token yang akan didekode
- `$assertClaims`: Klaim untuk diverifikasi (array kosong tidak ada)
- Pengembalian: payload stdClass atau false jika tidak valid

**`setAlgorithm($algorithm)`**

Mengubah algoritma signing/verification.

### Pabrik Token

`Xmf\Jwt\TokenFactory` menyediakan cara mudah untuk membuat token.

```php
use Xmf\Jwt\TokenFactory;

// Create a token with automatic key handling
$claims = [
    'aud' => 'myaction.php',
    'user_id' => $userId,
    'item_id' => $itemId
];

$token = TokenFactory::build('my_key', $claims, 120);
// Token expires in 120 seconds
```

**`TokenFactory::build($key, $payload, $expirationOffset)`**

- `$key`: String nama kunci atau objek KeyAbstract
- `$payload`: Berbagai klaim
- `$expirationOffset`: Kedaluwarsa dalam hitungan detik

Melemparkan pengecualian pada kegagalan: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### Pembaca Token

Kelas `Xmf\Jwt\TokenReader` menyederhanakan pembacaan token dari berbagai sumber.

```php
use Xmf\Jwt\TokenReader;

$assertClaims = ['aud' => 'myaction.php'];

// From a string
$payload = TokenReader::fromString('my_key', $tokenString, $assertClaims);

// From a cookie
$payload = TokenReader::fromCookie('my_key', 'token_cookie', $assertClaims);

// From a request parameter
$payload = TokenReader::fromRequest('my_key', 'token', $assertClaims);

// From Authorization header (Bearer token)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
```

Semua metode mengembalikan payload sebagai `stdClass` atau `false` jika tidak valid.

### Pabrik Kunci

`Xmf\Jwt\KeyFactory` membuat dan mengelola kunci kriptografi.

```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```

Kunci disimpan secara terus-menerus. Penyimpanan default menggunakan sistem file.

## Contoh Perlindungan AJAX

Berikut adalah contoh lengkap yang menunjukkan AJAX yang dilindungi JWT.

### Skrip Halaman (Menghasilkan Token)

```php
<?php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;
use Xmf\Module\Helper;
use Xmf\Request;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Claims to include and verify
$assertClaims = ['aud' => basename(__FILE__)];

// Check if this is an AJAX request
$isAjax = (0 === strcasecmp(Request::getHeader('X-Requested-With', ''), 'XMLHttpRequest'));

if ($isAjax) {
    // Handle AJAX request
    $GLOBALS['xoopsLogger']->activated = false;

    // Verify the token from the Authorization header
    $token = TokenReader::fromHeader('ajax_key', $assertClaims);

    if (false === $token) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authorized']);
        exit;
    }

    // Token is valid - process the request
    $action = Request::getCmd('action', '');
    $itemId = isset($token->item_id) ? $token->item_id : 0;

    // Your AJAX logic here
    $response = ['success' => true, 'item_id' => $itemId];

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Regular page request - generate token and display page
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper(basename(__DIR__));

// Create token with claims
$claims = array_merge($assertClaims, [
    'item_id' => 42,
    'user_id' => $GLOBALS['xoopsUser']->getVar('uid')
]);

// Token valid for 2 minutes
$token = TokenFactory::build('ajax_key', $claims, 120);

// JavaScript for AJAX calls
$script = <<<JS
<script>
function performAction(action) {
    $.ajax({
        url: window.location.href,
        method: 'POST',
        data: { action: action },
        dataType: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer {$token}');
        },
        success: function(data) {
            if (data.success) {
                console.log('Action completed:', data);
                // Update UI
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 401) {
                alert('Session expired. Please refresh the page.');
            } else {
                alert('An error occurred: ' + error);
            }
        }
    });
}
</script>
JS;

echo $script;
echo '<button onclick="performAction(\'save\')">Save Item</button>';
echo '<button onclick="performAction(\'delete\')">Delete Item</button>';

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Praktik Terbaik

### Kedaluwarsa Token

Tetapkan waktu kedaluwarsa yang sesuai berdasarkan kasus penggunaan:

```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```

### Verifikasi Klaim

Selalu verifikasi klaim `aud` (audiens) untuk memastikan token digunakan dengan skrip yang dimaksudkan:

```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```

### Penamaan Kunci

Gunakan nama kunci deskriptif untuk tujuan berbeda:

```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```

### Penanganan Kesalahan

```php
use Xmf\Jwt\TokenFactory;
use Xmf\Jwt\TokenReader;

try {
    $token = TokenFactory::build('my_key', $claims, 300);
} catch (\DomainException $e) {
    // Invalid algorithm
    error_log('JWT Error: ' . $e->getMessage());
} catch (\InvalidArgumentException $e) {
    // Invalid argument
    error_log('JWT Error: ' . $e->getMessage());
} catch (\UnexpectedValueException $e) {
    // Unexpected value
    error_log('JWT Error: ' . $e->getMessage());
}

// Reading tokens returns false on failure (no exception)
$payload = TokenReader::fromHeader('my_key', $assertClaims);
if ($payload === false) {
    // Token invalid, expired, or tampered
}
```

## Metode Transportasi Token

### Tajuk Otorisasi (Disarankan)

```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```

### Kue

```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```

### Parameter Permintaan

```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```

## Pertimbangan Keamanan1. **Gunakan HTTPS**: Selalu gunakan HTTPS untuk mencegah intersepsi token
2. **Kedaluwarsa Singkat**: Gunakan waktu kedaluwarsa praktis yang paling singkat
3. **Klaim Spesifik**: Sertakan klaim yang mengaitkan token dengan konteks tertentu
4. **Validasi Sisi Server**: Selalu validasi token di sisi server
5. **Jangan Simpan Data Sensitif**: Ingat token dapat dibaca (tidak dienkripsi)

## Referensi API

### Xmf\Jwt\JsonWebToken

| Metode | Deskripsi |
|--------|-------------|
| `__construct($key, $algorithm)` | Buat pengendali JWT |
| `setAlgorithm($algorithm)` | Tetapkan algoritma penandatanganan |
| `create($payload, $expiration)` | Buat token yang ditandatangani |
| `decode($token, $assertClaims)` | Dekode dan verifikasi token |

### Xmf\Jwt\TokenFactory

| Metode | Deskripsi |
|--------|-------------|
| `build($key, $payload, $expiration)` | Buat string token |

### Xmf\Jwt\TokenReader

| Metode | Deskripsi |
|--------|-------------|
| `fromString($key, $token, $claims)` | Dekode dari string |
| `fromCookie($key, $name, $claims)` | Dekode dari cookie |
| `fromRequest($key, $name, $claims)` | Dekode dari permintaan |
| `fromHeader($key, $claims, $header)` | Dekode dari header |

### Xmf\Jwt\KeyFactory

| Metode | Deskripsi |
|--------|-------------|
| `build($name, $storage)` | Dapatkan atau buat kunci |

## Lihat Juga

- ../Basics/XMF-Request - Penanganan permintaan
- ../XMF-Framework - Ikhtisar kerangka kerja
- Basis Data - Utilitas basis data

---

#xmf #jwt #keamanan #ajax #authentication #tokens
