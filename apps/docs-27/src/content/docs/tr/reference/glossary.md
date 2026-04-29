---
title: "XOOPS Sözlük"
description: "XOOPS'ye özgü terim ve kavramların tanımları"
---
> XOOPS'ye özgü terminoloji ve kavramların kapsamlı sözlüğü.

---

## Bir

### Yönetici Çerçevesi
XOOPS 2.3'te tanıtılan standartlaştırılmış yönetim arayüzü çerçevesi, modules arasında tutarlı yönetici sayfaları sağlar.

### Otomatik yükleme
Modern XOOPS'deki PSR-4 standardını kullanarak PHP sınıflarının ihtiyaç duyulduğunda otomatik olarak yüklenmesi.

---

## B

### Blok
theme bölgelerine yerleştirilebilen bağımsız bir içerik birimi. Bloklar module içeriğini, özel HTML veya dinamik verileri görüntüleyebilir.
```php
// Block definition
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```
### Önyükleme
module kodunu çalıştırmadan önce XOOPS çekirdeğini başlatma işlemi, genellikle `mainfile.php` ve `header.php` aracılığıyla.

---

## C

### Kriter / Kriter Kompozisyonu
database sorgu koşullarını nesne yönelimli bir şekilde oluşturmaya yönelik sınıflar.
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```
### CSRF (Siteler Arası İstek Sahteciliği)
XOOPS'da, `XoopsFormHiddenToken` aracılığıyla güvenlik belirteçleri kullanılarak yapılan bir güvenlik saldırısı önlendi.

---

##D

### DI (Bağımlılık Enjeksiyonu)
Bağımlılıkların dahili olarak yaratılması yerine enjekte edildiği XOOPS 4.0 için planlanan bir tasarım modeli.

### Dirname
Sistem genelinde benzersiz bir tanımlayıcı olarak kullanılan bir modülün dizin adı.

### DTYPE (Veri Tipi)
XoopsObject değişkenlerinin nasıl saklanacağını ve sterilize edileceğini tanımlayan sabitler:
- `XOBJ_DTYPE_INT` - Tamsayı
- `XOBJ_DTYPE_TXTBOX` - Metin (tek satır)
- `XOBJ_DTYPE_TXTAREA` - Metin (çok satırlı)
- `XOBJ_DTYPE_EMAIL` - E-posta adresi

---

## E

### Etkinlik
XOOPS yaşam döngüsünde, ön yüklemeler veya hooks yoluyla özel kodu tetikleyebilen bir olay.

---

## F

### Çerçeve
XMF (XOOPS module Çerçevesi)'ne bakın.

### Form Öğesi
XOOPS form sisteminin bir HTML form alanını temsil eden bileşeni.

---

## G

### Grup
Paylaşılan izinlere sahip kullanıcılardan oluşan bir koleksiyon. Core gruplar şunları içerir: Web Yöneticileri, Kayıtlı users, Anonim.

---

## H

### İşleyici
XoopsObject örnekleri için CRUD işlemlerini yöneten bir sınıf.
```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```
### Yardımcı
module işleyicilerine, yapılandırmalara ve hizmetlere kolay erişim sağlayan bir yardımcı program sınıfı.
```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```
---

##K

### Core
Temel işlevleri sağlayan temel XOOPS sınıfları: database erişimi, user yönetimi, güvenlik vb.

---

## L

### Dil Dosyası
`language/[code]/` dizinlerinde saklanan, uluslararasılaştırmaya yönelik sabitleri içeren PHP dosyaları.

---

##M

### anadosya.php
XOOPS için database kimlik bilgilerini ve yol tanımlarını içeren birincil yapılandırma dosyası.

### MCP (Model-Kontrolör-Sunucu)
MVC'ye benzer bir mimari model olup sıklıkla XOOPS module geliştirmede kullanılır.

### Ara yazılım
İstek ile yanıt arasında yer alan yazılım, PSR-15 kullanılarak XOOPS 4.0 için planlanmıştır.

### module
XOOPS işlevselliğini genişleten, `modules/` dizinine yüklenen bağımsız bir paket.

### MOC (İçerik Haritası)
İlgili içeriğe bağlantı veren genel bakış notları için bir Obsidiyen konsepti.

---

## N

### Ad alanı
PHP sınıfları düzenleme özelliği, XOOPS 2.5+'da kullanılır:
```php
namespace XoopsModules\MyModule;
```
### Bildirim
Kullanıcıları events hakkında e-posta veya PM yoluyla uyarmak için XOOPS sistemi.

---

## O

### Nesne
XoopsObject'ye bakın.

---

##P

### İzin
Gruplar ve izin işleyicileri aracılığıyla yönetilen erişim kontrolü.

### Ön yükleme
XOOPS olaylarına bağlanan ve `preloads/` dizininden otomatik olarak yüklenen bir sınıf.

### PSR (PHP Standart Önerisi)
XOOPS 4.0'ın tam olarak uygulayacağı PHP-FIG standartları.

---

##R

### Oluşturucu
Form öğelerini veya diğer user arayüzü bileşenlerini belirli formatlarda (Bootstrap vb.) çıkaran bir sınıf.

---

## S

### Smarty
Sunumu mantıktan ayırmak için XOOPS tarafından kullanılan template motoru.
```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```
### Hizmet
Genellikle Yardımcı aracılığıyla erişilen, yeniden kullanılabilir iş mantığı sağlayan bir sınıf.

---

##T

### template
modules için sunum katmanını tanımlayan bir Smarty dosyası (`.tpl` veya `.html`).

### theme
Sitenin görsel görünümünü tanımlayan şablonlardan ve varlıklardan oluşan bir koleksiyon.

### Jeton
Form gönderimlerinin meşru kaynaklardan gelmesini sağlayan bir güvenlik mekanizması (CSRF koruması).

---

## U

### user kimliği
user Kimliği - sistemdeki her user için benzersiz tanımlayıcı.

---

## V

### Değişken (Var)
XoopsObject üzerinde `initVar()` kullanılarak tanımlanmış bir alan.

---

## W

### Widget
Bloklara benzer, küçük, bağımsız bir user arayüzü bileşeni.

---

##X

### XMF (XOOPS module Çerçevesi)
Modern XOOPS module geliştirmeye yönelik yardımcı programlardan ve sınıflardan oluşan bir koleksiyon.

### XOBJ_DTYPE
XoopsObject'da değişken veri türlerini tanımlamak için sabitler.

### XoopsDatabase
Sorgu yürütme ve kaçış sağlayan database soyutlama katmanı.

### XoopsForm
HTML formlarını programlı olarak oluşturmak için form oluşturma sistemi.

### XoopsObject
XOOPS'deki tüm veri nesneleri için değişken yönetimi ve temizleme sağlayan temel sınıf.

### xoops_version.php
module özelliklerini, tabloları, blokları, şablonları ve konfigürasyonu tanımlayan module bildirim dosyası.

---

## Yaygın Kısaltmalar

| Kısaltma | Anlamı |
|-----------|-----------|
| XOOPS | Genişletilebilir Nesneye Dayalı Portal Sistemi |
| XMF | XOOPS module Çerçevesi |
| CSRF | Siteler Arası İstek Sahteciliği |
| XSS | Siteler Arası Komut Dosyası Çalıştırma |
| ORM | Nesne-İlişkisel Haritalama |
| PSR | PHP Standart Önerisi |
| DI | Bağımlılık Enjeksiyonu |
| MVC | Model-Görünüm-Denetleyici |
| CRUD | Oluşturun, Okuyun, Güncelleyin, Sil |

---

## 🔗 İlgili Belgeler

- Temel Kavramlar
- API Referans
- Dış Kaynaklar

---

#xoops #sözlük #referans #terminoloji #tanımlar