---
title: "Smarty 4 Taşıma"
description: "XOOPS şablonlarını Smarty 3'ten Smarty 4'e yükseltme kılavuzu"
---
Bu kılavuz, XOOPS'de Smarty 3'ten Smarty 4'e yükseltme yaparken gereken değişiklikleri ve geçiş adımlarını kapsar. Bu farklılıkları anlamak, modern XOOPS kurulumlarıyla uyumluluğu sürdürmek için çok önemlidir.

## İlgili Belgeler

- Smarty-Basics - XOOPS'de Smarty'nin temelleri
- theme Geliştirme - XOOPS temaları oluşturma
- template-Değişkenler - Şablonlarda mevcut değişkenler

## Değişikliklere Genel Bakış

Smarty 4, Smarty 3'ten birkaç önemli değişiklik getirdi:

1. Değişken atama davranışı değiştirildi
2. `{php}` etiketleri tamamen kaldırıldı
3. API değişikliklerini önbelleğe alma
4. Değiştirici işleme güncellemeleri
5. Güvenlik politikası değişiklikleri
6. Kullanımdan kaldırılan özellikler kaldırıldı

## Değişken Erişim Değişiklikleri

### Sorun

Smarty 2/3,'de atanmış değerlere doğrudan erişilebiliyordu:
```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```
Smarty 4'te değişkenler `Smarty_Variable` nesnelerine sarılır:
```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```
### 1. Çözüm: Value Özelliğine Erişin
```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```
### 2. Çözüm: Uyumluluk Modu

PHP'de uyumluluk modunu etkinleştirin:
```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```
Bu, Smarty 3 gibi doğrudan değişken erişimine izin verir.

### 3. Çözüm: Koşullu Sürüm Kontrolü

Her iki sürümde de çalışan templates yazın:
```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```
### Çözüm 4: Sarmalayıcı İşlevi

Ödevler için bir yardımcı işlev oluşturun:
```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```
## {php} Etiketlerini Kaldırma

### Sorun

Smarty 3+, güvenlik nedeniyle `{php}` etiketlerini desteklemez:
```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```
### Çözüm: Smarty Değişkenlerini kullanın
```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```
### Çözüm: Mantığı PHP'ye taşıyın

Karmaşık mantık şablonlarda değil, PHP'de olmalıdır:
```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```
### Çözüm: Özel Eklentiler

Yeniden kullanılabilir işlevsellik için Smarty eklentileri oluşturun:
```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```
## Önbelleğe Alma Değişiklikleri

### Smarty 3 Önbelleğe Alma
```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```
### Smarty 4 Önbelleğe Alma
```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```
### Sabitleri Önbelleğe Alma
```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```
### Şablonlarda Nocache
```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```
## Değiştirici Değişiklikleri

### Dize Değiştiriciler

Bazı değiştiriciler yeniden adlandırıldı veya kullanımdan kaldırıldı:
```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```
### Dizi Değiştiriciler

Dizi değiştiriciler `@` önekini gerektirir:
```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```
### Özel Değiştiriciler

Özel değiştiricilerin kaydedilmesi gerekir:
```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```
## Güvenlik Politikası Değişiklikleri

### Smarty 4 Güvenlik

Smarty 4'ün varsayılan güvenliği daha sıkıdır:
```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```
### İzin Verilen İşlevler

Varsayılan olarak Smarty 4, hangi PHP işlevlerinin kullanılabileceğini kısıtlar:
```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```
Gerekirse izin verilen işlevleri yapılandırın:
```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```
## template Devralma Güncellemeleri

### Blok Söz Dizimi

Blok sözdizimi aynı kalıyor ancak bazı değişiklikler var:
```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```
### Ekle ve Başına Ekle
```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```
## Kullanımdan Kaldırılan Özellikler

### Smarty 4'te kaldırıldı

| Özellik | Alternatif |
|-----------|------------|
| `{php}` etiketleri | Mantığı PHP'ye taşıyın veya eklentileri kullanın |
| `{include_php}` | Kayıtlı eklentileri kullanın |
| `$smarty.capture` | Hala çalışıyor ancak kullanımdan kaldırıldı |
| `{strip}` boşluklu | Küçültme araçlarını kullanın |

### Alternatifleri Kullan
```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```
## Geçiş Kontrol Listesi

### Taşımadan Önce

1. [ ] Tüm şablonları yedekleyin
2. [ ] Tüm `{php}` etiketi kullanımını listeleyin
3. [ ] Özel eklentileri belgeleyin
4. [ ] Mevcut işlevselliği test edin

### Taşıma Sırasında

1. [ ] Tüm `{php}` etiketlerini kaldırın
2. [ ] Değişken erişim sözdizimini güncelleyin
3. [ ] Değiştirici kullanımını kontrol edin
4. [ ] Önbelleğe alma yapılandırmasını güncelleyin
5. [ ] Güvenlik ayarlarını gözden geçirin

### Geçişten Sonra

1. [ ] Tüm şablonları test edin
2. [ ] Tüm formların çalışıp çalışmadığını kontrol edin
3. [ ] Önbelleğe almanın çalıştığını doğrulayın
4. [ ] Farklı user rolleriyle test edin

## Uyumluluk Testi

### Sürüm Tespiti
```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```
### template Sürümü Kontrolü
```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```
## Çapraz Uyumlu templates Yazma

### En İyi Uygulamalar

1. **`{php}` etiketlerinden tamamen kaçının** - Smarty'de çalışmazlar 3+

2. **Şablonları basit tutun** - Karmaşık mantık PHP'ye aittir

3. **Standart değiştiricileri kullanın** - Kullanımdan kaldırılmış olanlardan kaçının

4. **Her iki sürümü de test edin** - Her ikisini de desteklemeniz gerekiyorsa

5. **Karmaşık işlemler için eklentileri kullanın** - Daha kolay bakım yapılabilir

### Örnek: Çapraz Uyumlu template
```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```
## Yaygın Geçiş Sorunları

### Sorun: Değişkenler Boş Dönüyor

**Sorun**: `<{$mod_url}>`, Smarty'de hiçbir şey döndürmüyor 4

**Çözüm**: `<{$mod_url->value}>` kullanın veya uyumluluk modunu etkinleştirin

### Sorun: PHP Etiket Hataları

**Sorun**: template `{php}` etiketlerinde hata veriyor

**Çözüm**: Tüm PHP etiketlerini kaldırın ve mantığı PHP dosyalarına taşıyın

### Sorun: Değiştirici Bulunamadı

**Sorun**: Özel değiştirici "bilinmeyen değiştirici" hatası veriyor

**Çözüm**: Değiştiriciyi `registerPlugin()` ile kaydedin

### Sorun: Güvenlik Kısıtlaması

**Sorun**: Şablonda işleve izin verilmiyor

**Çözüm**: Güvenlik ilkesinin izin verilenler listesine işlev ekleyin

---

#smarty #migration #yükseltme #xoops #smarty4 #uyumluluk