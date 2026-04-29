---
title: "XMF Talep"
description: 'HTTP isteği işleme ve giriş doğrulamasını Xmf\Request sınıfıyla güvenli hale getirin'
---
`Xmf\Request` sınıfı, yerleşik temizleme ve tür dönüştürme özellikleriyle HTTP istek değişkenlerine kontrollü erişim sağlar. Girdiyi belirtilen türlere uygun hale getirirken varsayılan olarak zararlı olabilecek enjeksiyonlara karşı koruma sağlar.

## Genel Bakış

İstek işleme, web geliştirmenin güvenlik açısından en kritik yönlerinden biridir. XMF İstek sınıfı:

- XSS saldırılarını önlemek için girişi otomatik olarak temizler
- Yaygın veri türleri için tür açısından güvenli erişimciler sağlar
- Birden fazla istek kaynağını destekler (GET, POST, COOKIE, vb.)
- Tutarlı varsayılan değer işleme sunar

## Temel Kullanım
```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```
## İstek Yöntemleri

### getMethod()

Geçerli istek için HTTP istek yöntemini döndürür.
```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```
### getVar($name, $default, $hash, $type, $mask)

Diğer `get*()` yöntemlerinin çoğunun çağırdığı temel yöntem. İstek verilerinden adlandırılmış bir değişkeni getirir ve döndürür.

**Parametreler:**
- `$name` - Getirilecek değişken adı
- `$default` - Değişken yoksa varsayılan değer
- `$hash` - Kaynak karması: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD veya REQUEST (varsayılan)
- `$type` - Temizleme için veri türü (aşağıdaki FilterInput türlerine bakın)
- `$mask` - Temizleme seçenekleri için bit maskesi

**Maske Değerleri:**

| Maske Sabiti | Efekt |
|---------------|-----------|
| `MASK_NO_TRIM` | leading/trailing boşlukları kesmeyin |
| `MASK_ALLOW_RAW` | Temizlemeyi atlayın, ham girişe izin verin |
| `MASK_ALLOW_HTML` | Sınırlı "güvenli" bir HTML işaretleme kümesine izin ver |
```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```
## Türe Özel Yöntemler

### getInt($name, $default, $hash)

Bir tamsayı değeri döndürür. Yalnızca rakamlara izin verilir.
```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```
### getFloat($name, $default, $hash)

Bir kayan nokta değeri döndürür. Yalnızca rakamlara ve noktalara izin verilir.
```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```
### getBool($name, $default, $hash)

Bir boole değeri döndürür.
```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```
### getWord($name, $default, $hash)

Yalnızca harf ve alt çizgi içeren bir dize döndürür `[A-Za-z_]`.
```php
$action = Request::getWord('action', 'view');
```
### getCmd($name, $default, $hash)

Yalnızca `[A-Za-z0-9.-_]`'nin küçük harfe zorlandığı bir komut dizesi döndürür.
```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```
### getString($name, $default, $hash, $mask)

Bozuk HTML kodunun kaldırıldığı, temizlenmiş bir dize döndürür (maske tarafından geçersiz kılınmadığı sürece).
```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```
### getArray($name, $default, $hash)

XSS ve hatalı kodu kaldırmak için yinelemeli olarak işlenen bir diziyi döndürür.
```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```
### getText($name, $default, $hash)

Temizlemeden ham metni döndürür. Dikkatli kullanın.
```php
$rawContent = Request::getText('raw_content', '');
```
### getUrl($name, $default, $hash)

Doğrulanmış bir web URL döndürür (yalnızca göreceli, http veya https şemaları).
```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```
### getPath($name, $default, $hash)

Doğrulanmış bir dosya sistemi veya web yolu döndürür.
```php
$filePath = Request::getPath('file', '');
```
### getEmail($name, $default, $hash)

Doğrulanmış bir e-posta adresini veya varsayılanı döndürür.
```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```
### getIP($name, $default, $hash)

Doğrulanmış bir IPv4 veya IPv6 adresi döndürür.
```php
$userIp = Request::getIP('client_ip', '');
```
### getHeader($headerName, $default)

Bir HTTP istek başlığı değerini döndürür.
```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```
## Yardımcı Yöntemler

### hasVar($name, $hash)

Belirtilen karmada bir değişkenin mevcut olup olmadığını kontrol edin.
```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```
### setVar($name, $value, $hash, $overwrite)

Belirtilen karmada bir değişken ayarlayın. Önceki değeri veya null değerini döndürür.
```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```
### get($hash, $mask)

Karma dizisinin tamamının temizlenmiş bir kopyasını döndürür.
```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```
### set($array, $hash, $overwrite)

Bir diziden birden fazla değişken ayarlar.
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```
## FilterInput Entegrasyonu

İstek sınıfı temizlik için `Xmf\FilterInput` kullanır. Mevcut filtre türleri:

| Tür | Açıklama |
|------|-----------------|
| ALPHANUM / ALNUM | Yalnızca alfanümerik |
| ARRAY | Her öğeyi yinelemeli olarak temizleyin |
| BASE64 | Base64 kodlu dize |
| BOOLEAN / BOOL | Doğru veya yanlış |
| CMD | Komut - A-Z, 0-9, alt çizgi, tire, nokta (küçük harf) |
| EMAIL | Geçerli e-posta adresi |
| FLOAT / DOUBLE | Kayan nokta sayısı |
| INTEGER / INT | Tam sayı değeri |
| IP | Geçerli IP adresi |
| PATH | Dosya sistemi veya web yolu |
| STRING | Genel dize (varsayılan) |
| USERNAME | user adı formatı |
| WEBURL | Web URL |
| WORD | A'dan Z'ye harfler ve yalnızca alt çizgi |

## Pratik Örnekler

### Form İşleme
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
### AJAX İşleyici
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
### Sayfalandırma
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
### Arama Formu
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
## En İyi Güvenlik Uygulamaları

1. **Her zaman türe özel yöntemler kullanın** - Kimlikler için `getInt()`, e-postalar vb. için `getEmail()` kullanın.

2. **Mantıklı varsayılanlar sağlayın** - Hiçbir zaman girdinin var olduğunu varsaymayın

3. **Temizlemeden sonra doğrulayın** - Temizleme, kötü verileri kaldırır, doğrulama, doğru veriyi sağlar

4. **Uygun karma değerini kullanın** - Form verileri için POST, sorgu parametreleri için GET belirtin

5. **Ham girişten kaçının** - Yalnızca kesinlikle gerekli olduğunda `getText()` veya `MASK_ALLOW_RAW` kullanın
```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```
## Ayrıca Bakınız

- XMF ile Başlarken - Temel XMF kavramları
- XMF-Module-Helper - module yardımcı sınıfı
- ../XMF-Framework - Çerçeveye genel bakış

---

#xmf #istek #güvenlik #giriş doğrulama #temizleştirme