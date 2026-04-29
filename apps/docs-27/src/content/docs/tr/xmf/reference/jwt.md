---
title: "JWT - JSON Web Jetonları"
description: "XMF JWT, güvenli belirteç tabanlı kimlik doğrulama ve AJAX koruması için uygulama"
---
`Xmf\Jwt` ad alanı, XOOPS modülleri için JSON Web Token (JWT) desteği sağlar. JWTs güvenli, durum bilgisi olmayan kimlik doğrulamayı etkinleştirir ve özellikle AJAX isteklerinin korunması için kullanışlıdır.

## JSON Web Tokenları nedir?

JSON Web Belirteçleri, bir takım *talepleri* (verileri) metin dizesi olarak yayınlamanın standart bir yoludur ve taleplerin tahrif edilmediğini kriptografik olarak doğrular. Ayrıntılı özellikler için bkz.:

- [jwt.io](https://jwt.io/)
- [RFC 7519](https://tools.ietf.org/html/rfc7519)

### Temel Özellikler

- **İmzalı**: Tokenlar, kurcalamayı tespit etmek için kriptografik olarak imzalanır
- **Kendi kendine yeten**: Gerekli tüm bilgiler jetonun kendisindedir
- **Durum bilgisi olmayan**: Sunucu tarafı oturum depolaması gerekmez
- **Son kullanma tarihi geçmiş**: Jetonlar son kullanma sürelerini içerebilir

> **Not:** JWTs imzalanmıştır, şifrelenmemiştir. Veriler Base64 ile kodlanmıştır ve görülebilir. JWTs'yi hassas verileri gizlemek için değil, bütünlük doğrulaması için kullanın.

## Neden XOOPS'da JWT Kullanılmalı?

### AJAX Token Sorunu

XOOPS formları, CSRF koruması için tek seferlik jetonlar kullanır. Ancak nonce'lar AJAX ile kötü çalışır çünkü:

1. **Tek Kullanımlık**: Tek seferlik başvurular genellikle tek bir gönderim için geçerlidir
2. **Eşzamansız Sorunlar**: Birden fazla AJAX isteği hatalı gelebilir
3. **Karmaşıklığı Yenile**: Belirteçleri eşzamansız olarak yenilemenin güvenilir bir yolu yok
4. **Bağlam Bağlama**: Standart belirteçler, onları hangi komut dosyasının yayınladığını doğrulamaz

### JWT Avantajları

JWTs bu sorunları şu şekilde çözebilirsiniz:

- Zaman sınırlı geçerlilik için bir sona erme süresi (`exp` talebi) dahil
- Belirteçleri belirli komut dosyalarına bağlamak için özel talepleri destekleme
- Geçerlilik süresi içinde birden fazla isteğin etkinleştirilmesi
- Token menşeinin kriptografik olarak doğrulanmasının sağlanması

## Temel Sınıflar

### JsonWebToken

`Xmf\Jwt\JsonWebToken` sınıfı belirteç oluşturmayı ve kod çözmeyi yönetir.
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
#### Yöntemler

**`new JsonWebToken($key, $algorithm)`**

Yeni bir JWT işleyicisi oluşturur.
- `$key`: Bir `Xmf\Key\KeyAbstract` nesnesi
- `$algorithm`: İmzalama algoritması (varsayılan: 'HS256')

**`create($payload, $expirationOffset)`**

İmzalı bir belirteç dizesi oluşturur.
- `$payload`: Talep dizisi
- `$expirationOffset`: Son kullanma tarihine kalan saniyeler (isteğe bağlı)

**`decode($jwtString, $assertClaims)`**

Bir jetonun kodunu çözer ve doğrular.
- `$jwtString`: Kodu çözülecek belirteç
- `$assertClaims`: Doğrulanacak talepler (hiçbiri için boş dizi)
- Döndürür: stdClass yükü veya geçersizse false

**`setAlgorithm($algorithm)`**

signing/verification algoritmasını değiştirir.

### TokenFactory

`Xmf\Jwt\TokenFactory`, jeton oluşturmanın kolay bir yolunu sunar.
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

- `$key`: Anahtar adı dizesi veya KeyAbstract nesnesi
- `$payload`: Talep dizisi
- `$expirationOffset`: Saniye cinsinden son kullanma tarihi

Başarısızlık durumunda istisnalar atar: `DomainException`, `InvalidArgumentException`, `UnexpectedValueException`

### TokenReader

`Xmf\Jwt\TokenReader` sınıfı, çeşitli kaynaklardan gelen belirteçlerin okunmasını kolaylaştırır.
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
Tüm yöntemler, geçersizse yükü `stdClass` veya `false` olarak döndürür.

### Anahtar Fabrikası

`Xmf\Jwt\KeyFactory` şifreleme anahtarlarını oluşturur ve yönetir.
```php
use Xmf\Jwt\KeyFactory;

// Build a key (creates if it doesn't exist)
$key = KeyFactory::build('my_application_key');

// With custom storage
$storage = new \Xmf\Key\FileStorage('/custom/path');
$key = KeyFactory::build('my_key', $storage);
```
Anahtarlar kalıcı olarak saklanır. Varsayılan depolama dosya sistemini kullanır.

## AJAX Koruma Örneği

Burada JWT-korumalı AJAX'yi gösteren tam bir örnek bulunmaktadır.

### Sayfa Komut Dosyası (Jeton Oluşturur)
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
## En İyi Uygulamalar

### Tokenın Sona Ermesi

Kullanım senaryosuna göre uygun son kullanma sürelerini ayarlayın:
```php
// Short-lived for sensitive operations (2 minutes)
$token = TokenFactory::build('key', $claims, 120);

// Longer for general page interactions (30 minutes)
$token = TokenFactory::build('key', $claims, 1800);
```
### Talep Doğrulaması

Belirteçlerin amaçlanan komut dosyasıyla kullanıldığından emin olmak için her zaman `aud` (izleyici) talebini doğrulayın:
```php
// When creating
$claims = ['aud' => 'process_order.php', 'order_id' => 123];

// When verifying
$assertClaims = ['aud' => 'process_order.php'];
$token = TokenReader::fromHeader('key', $assertClaims);
```
### Anahtar Adlandırma

Açıklayıcı anahtar adlarını farklı amaçlar için kullanın:
```php
// Separate keys for different features
$orderToken = TokenFactory::build('order_processing', $orderClaims, 300);
$commentToken = TokenFactory::build('comment_system', $commentClaims, 600);
```
### Hata İşleme
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
## Token Taşıma Yöntemleri

### Yetkilendirme Başlığı (Önerilen)
```javascript
xhr.setRequestHeader('Authorization', 'Bearer ' + token);
```

```php
$payload = TokenReader::fromHeader('key', $assertClaims);
```
### Çerez
```php
// Set cookie with token
setcookie('api_token', $token, time() + 300, '/', '', true, true);

// Read from cookie
$payload = TokenReader::fromCookie('key', 'api_token', $assertClaims);
```
### İstek Parametresi
```javascript
$.ajax({
    url: 'handler.php',
    data: { token: token, action: 'save' }
});
```

```php
$payload = TokenReader::fromRequest('key', 'token', $assertClaims);
```
## Güvenlik Hususları

1. ** HTTPS kullanın**: Jeton müdahalesini önlemek için her zaman HTTPS kullanın
2. **Kısa Sona Erme Süresi**: Pratikteki en kısa son kullanma süresini kullanın
3. **Özel İddialar**: Belirteçleri belirli bağlamlara bağlayan iddiaları içerir
4. **Sunucu Tarafı Doğrulaması**: Belirteçleri her zaman sunucu tarafında doğrulayın
5. **Hassas Verileri Saklamayın**: Belirteçlerin okunabilir olduğunu (şifrelenmediğini) unutmayın.

## API Referans

### Xmf\Jwt\JsonWebToken

| Yöntem | Açıklama |
|----------|----------------|
| `__construct($key, $algorithm)` | JWT işleyicisi oluşturun |
| `setAlgorithm($algorithm)` | İmzalama algoritmasını ayarlayın |
| `create($payload, $expiration)` | İmzalı jeton oluştur |
| `decode($token, $assertClaims)` | Belirtecin kodunu çözün ve doğrulayın |

### Xmf\Jwt\TokenFactory

| Yöntem | Açıklama |
|----------|----------------|
| `build($key, $payload, $expiration)` | Belirteç dizesi oluştur |

### Xmf\Jwt\TokenReader

| Yöntem | Açıklama |
|----------|----------------|
| `fromString($key, $token, $claims)` | Dizeden kod çözme |
| `fromCookie($key, $name, $claims)` | Çerezden kod çözme |
| `fromRequest($key, $name, $claims)` | İstekten kod çözme |
| `fromHeader($key, $claims, $header)` | Başlıktan kod çözme |

### Xmf\Jwt\KeyFactory

| Yöntem | Açıklama |
|----------|----------------|
| `build($name, $storage)` | Anahtar alın veya oluşturun |

## Ayrıca Bakınız

- ../Basics/XMF-Request - Talep işleme
- ../XMF-Framework - Çerçeveye genel bakış
- database - database yardımcı programları

---

#xmf #jwt #güvenlik #ajax #authentication #tokens