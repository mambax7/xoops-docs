---
title: "JWT - JSON Token Web"
description: "XMF JWT pelaksanaan untuk pengesahan berasaskan token selamat dan perlindungan AJAX"
---
Ruang nama `XMF\Jwt` menyediakan sokongan JSON Web Token (JWT) untuk modul XOOPS. JWT mendayakan pengesahan yang selamat, tanpa kewarganegaraan dan amat berguna untuk melindungi AJAX permintaan.

## Apakah itu JSON Token Web?

JSON Token Web ialah cara standard untuk menerbitkan satu set *tuntutan* (data) sebagai rentetan teks, dengan pengesahan kriptografi bahawa tuntutan tersebut tidak diusik. Untuk spesifikasi terperinci, lihat:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Ciri-ciri Utama

- **Ditandatangani**: Token ditandatangani secara kriptografi untuk mengesan gangguan
- **Sendiri**: Semua maklumat yang diperlukan ada dalam token itu sendiri
- **Stateless**: Tiada storan sesi sebelah pelayan diperlukan
- **Boleh luput**: Token boleh termasuk masa tamat tempoh

> **Nota:** JWT ditandatangani, bukan disulitkan. Data adalah Base64 dikodkan dan boleh dilihat. Gunakan JWT untuk pengesahan integriti, bukan untuk menyembunyikan data sensitif.

## Mengapa Gunakan JWT dalam XOOPS?

### Masalah AJAX Token

Borang XOOPS menggunakan token nonce untuk perlindungan CSRF. Walau bagaimanapun, nonces tidak berfungsi dengan baik dengan AJAX kerana:

1. **Penggunaan Sekali**: Nonces biasanya sah untuk satu penyerahan
2. **Isu Asynchronous**: Berbilang AJAX permintaan mungkin tiba di luar pesanan
3. **Kerumitan Segar Semula**: Tiada cara yang boleh dipercayai untuk memuat semula token secara tidak segerak
4. **Pengikatan Konteks**: Token standard tidak mengesahkan skrip yang mengeluarkannya### JWT Kelebihan

JWT menyelesaikan masalah ini dengan:

- Termasuk masa tamat tempoh (`exp` tuntutan) untuk kesahihan terhad masa
- Menyokong tuntutan tersuai untuk mengikat token pada skrip tertentu
- Mendayakan berbilang permintaan dalam tempoh sah
- Menyediakan pengesahan kriptografi asal token

## Kelas Teras

### JsonWebToken

Kelas `XMF\Jwt\JsonWebToken` mengendalikan penciptaan dan penyahkodan token.
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
#### Kaedah

**`new JsonWebToken($key, $algorithm)`**

Mencipta pengendali JWT baharu.
- `$key`: Objek `XMF\Key\KeyAbstract`
- `$algorithm`: Algoritma tandatangan (lalai: 'HS256')

**`create($payload, $expirationOffset)`**

Mencipta rentetan token yang ditandatangani.
- `$payload`: Susunan tuntutan
- `$expirationOffset`: Saat sehingga tamat tempoh (pilihan)

**`decode($jwtString, $assertClaims)`**

Menyahkod dan mengesahkan token.
- `$jwtString`: Token untuk menyahkod
- `$assertClaims`: Tuntutan untuk mengesahkan (tatasusunan kosong untuk tiada)
- Pulangan: muatan stdClass atau palsu jika tidak sah

**`setAlgorithm($algorithm)`**

Mengubah algoritma signing/verification.

### TokenFactory

`XMF\Jwt\TokenFactory` menyediakan cara yang mudah untuk mencipta token.
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

- `$key`: Rentetan nama kunci atau objek KeyAbstract
- `$payload`: Susunan tuntutan
- `$expirationOffset`: Tamat tempoh dalam beberapa saat

Melemparkan pengecualian pada kegagalan: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### Pembaca Token

Kelas `XMF\Jwt\TokenReader` memudahkan membaca token daripada pelbagai sumber.
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
Semua kaedah mengembalikan muatan sebagai `stdClass` atau `false` jika tidak sah.

### KeyFactory

`XMF\Jwt\KeyFactory` mencipta dan mengurus kunci kriptografi.
```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```
Kunci disimpan secara berterusan. Storan lalai menggunakan sistem fail.

## AJAX Contoh Perlindungan

Berikut ialah contoh lengkap yang menunjukkan JWT-dilindungi AJAX.

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
## Amalan Terbaik

### Tamat Tempoh Token

Tetapkan masa tamat tempoh yang sesuai berdasarkan kes penggunaan:
```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```
### Pengesahan Tuntutan

Sentiasa sahkan tuntutan `aud` (khalayak) untuk memastikan token digunakan dengan skrip yang dimaksudkan:
```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```
### Penamaan Kunci

Gunakan nama kunci deskriptif untuk tujuan yang berbeza:
```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```
### Pengendalian Ralat
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
## Kaedah Pengangkutan Token

### Pengepala Kebenaran (Disyorkan)
```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```
### Kuki
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
## Pertimbangan Keselamatan

1. **Gunakan HTTPS**: Sentiasa gunakan HTTPS untuk mengelakkan pemintasan token
2. **Tamat Tempoh Singkat**: Gunakan masa tamat tempoh praktikal yang paling singkat
3. **Tuntutan Khusus**: Sertakan tuntutan yang mengikat token dengan konteks tertentu
4. **Pengesahan Bahagian Pelayan**: Sentiasa sahkan bahagian pelayan token
5. **Jangan Simpan Data Sensitif**: Ingat token boleh dibaca (tidak disulitkan)

## API Rujukan

### XMF\Jwt\JsonWebToken

| Kaedah | Penerangan |
|--------|--------------|
| `__construct($key, $algorithm)` | Buat pengendali JWT |
| `setAlgorithm($algorithm)` | Tetapkan algoritma tandatangan |
| `create($payload, $expiration)` | Cipta token bertandatangan |
| `decode($token, $assertClaims)` | Nyahkod dan sahkan token |

### XMF\Jwt\TokenFactory

| Kaedah | Penerangan |
|--------|--------------|
| `build($key, $payload, $expiration)` | Cipta rentetan token |

### XMF\Jwt\TokenReader

| Kaedah | Penerangan |
|--------|--------------|
| `fromString($key, $token, $claims)` | Nyahkod daripada rentetan |
| `fromCookie($key, $name, $claims)` | Nyahkod daripada kuki |
| `fromRequest($key, $name, $claims)` | Nyahkod daripada permintaan |
| `fromHeader($key, $claims, $header)` | Nyahkod daripada pengepala |

### XMF\Jwt\KeyFactory

| Kaedah | Penerangan |
|--------|--------------|
| `build($name, $storage)` | Dapatkan atau cipta kunci |## Lihat Juga

- ../Asas/XMF-Permintaan - Permintaan pengendalian
- ../XMF-Rangka Kerja - Gambaran keseluruhan rangka kerja
- Pangkalan Data - Utiliti pangkalan data

---

#XMF #jwt #security #ajax #authentication #token