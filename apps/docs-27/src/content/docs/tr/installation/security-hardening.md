---
title: "Ek 5: XOOPS kurulumunuzun güvenliğini artırın"
---
XOOPS 2.7.0 yükledikten sonra siteyi sağlamlaştırmak için aşağıdaki adımları izleyin. Her adım ayrı ayrı isteğe bağlıdır, ancak hepsi birlikte kurulumun temel güvenliğini önemli ölçüde artırır.

## 1. Koruyucu modülünü kurun ve yapılandırın

Birlikte verilen `protector` modülü, XOOPS güvenlik duvarıdır. İlk sihirbaz sırasında yüklemediyseniz şimdi Yönetici → modules ekranından yükleyin.

![](/xoops-docs/2.7/img/installation/img_73.jpg)

Protector'ın yönetici panelini açın ve görüntülediği uyarıları inceleyin. `register_globals` gibi eski PHP direktifleri artık mevcut değil (PHP 8.2+ bunları kaldırdı), dolayısıyla bu uyarıları artık görmeyeceksiniz. Mevcut uyarılar genellikle dizin izinleri, oturum ayarları ve güven yolu yapılandırmasıyla ilgilidir.

## 2. `mainfile.php` ve `secure.php`'yi kilitleyin

Yükleyici işlemi tamamladığında her iki dosyayı da salt okunur olarak işaretlemeye çalışır, ancak bazı ana bilgisayarlar izinleri geri alır. Gerekiyorsa doğrulayın ve yeniden uygulayın:

- `mainfile.php` → `0444` (sahip, grup, diğer salt okunur)
- `xoops_data/data/secure.php` → `0444`

`mainfile.php` yol sabitlerini (`XOOPS_ROOT_PATH`, `XOOPS_PATH`, `XOOPS_VAR_PATH`, `XOOPS_URL`, `XOOPS_COOKIE_DOMAIN`, `XOOPS_COOKIE_DOMAIN_USE_PSL`) ve üretim bayraklarını tanımlar. `secure.php` database kimlik bilgilerini tutar:

- 2.5.x'te database kimlik bilgileri `mainfile.php`'de bulunuyordu. Artık çalışma zamanında `mainfile.php` tarafından yüklenen `xoops_data/data/secure.php`'de depolanıyorlar. `secure.php`'yi `xoops_data/`'nin (belge kökünün dışına taşımanız tavsiye edilen bir dizin) içinde tutmak, bir saldırganın HTTP üzerinden kimlik bilgilerine ulaşmasını çok daha zorlaştırır.

## 3. `xoops_lib/` ve `xoops_data/`'yi belge kökünün dışına taşıyın

Henüz yapmadıysanız, bu iki dizini web kökünüzün bir seviye yukarısına taşıyın ve yeniden adlandırın. Daha sonra `mainfile.php`'deki ilgili sabitleri güncelleyin:
```php
define('XOOPS_ROOT_PATH', '/home/you/www');
define('XOOPS_PATH',      '/home/you/zubra_mylib');
define('XOOPS_VAR_PATH',  '/home/you/zubra_mydata');
define('XOOPS_TRUST_PATH', XOOPS_PATH);
```
Bu dizinlerin belge kökünün dışına yerleştirilmesi, Composer'ın `vendor/` ağacına, önbelleğe alınmış şablonlara, oturum dosyalarına, yüklenen verilere ve `secure.php`'deki database kimlik bilgilerine doğrudan erişimi engeller.

## 4. Çerez alanı yapılandırması

XOOPS 2.7.0, `mainfile.php`'de iki çerez alanı sabiti sunar:
```php
// Use the Public Suffix List (PSL) to derive the registrable domain.
define('XOOPS_COOKIE_DOMAIN_USE_PSL', true);

// Explicit cookie domain; may be blank, the full host, or the registrable domain.
define('XOOPS_COOKIE_DOMAIN', '');
```
Yönergeler:

- XOOPS'yi tek bir ana bilgisayar adından veya bir IP'den sunuyorsanız `XOOPS_COOKIE_DOMAIN`'yi boş bırakın.
- Çerezlerin kapsamını yalnızca bu ana bilgisayar adına ayarlamak için tam ana bilgisayarı (örn. `www.example.com`) kullanın.
- Çerezlerin `www.example.com`, `blog.example.com` vb. arasında paylaşılmasını istediğinizde kaydedilebilir alan adını (örn. `example.com`) kullanın.
- `XOOPS_COOKIE_DOMAIN_USE_PSL = true`, etkin TLD'ye yanlışlıkla bir çerez yerleştirmek yerine XOOPS'nin bileşik TLD'leri (`co.uk`, `com.au`, …) doğru şekilde bölmesine olanak tanır.

## 5. `mainfile.php`'deki üretim bayrakları

`mainfile.dist.php`, üretim için şu iki bayrak `false` olarak ayarlanmış olarak gönderilir:
```php
define('XOOPS_DB_LEGACY_LOG', false); // disable legacy SQL usage logging
define('XOOPS_DEBUG',         false); // disable debug notices
```
Onları üretime bırakın. Aşağıdakileri yapmak istediğinizde bunları bir geliştirme veya hazırlama ortamında geçici olarak etkinleştirin:

- kalan eski database çağrılarını araştırın (`XOOPS_DB_LEGACY_LOG = true`);
- yüzey `E_USER_DEPRECATED` bildirimleri ve diğer hata ayıklama çıktısı (`XOOPS_DEBUG = true`).

## 6. Yükleyiciyi silin

Kurulum tamamlandıktan sonra:

1. Yeniden adlandırılan herhangi bir `install_remove_*` dizinini web kökünden silin.
2. Sihirbazın temizleme sırasında oluşturduğu tüm `install_cleanup_*.php` komut dosyalarını silin.
3. `install/` dizinine artık HTTP üzerinden ulaşılamadığını doğrulayın.

Devre dışı bırakılmış ancak mevcut bir yükleyici dizininden ayrılmak, düşük öneme sahip ancak önlenebilir bir risktir.

## 7. XOOPS ve modülleri güncel tutun

XOOPS düzenli bir yama ritmini takip eder. Sürüm bildirimleri için XoopsCore27 GitHub deposuna abone olun ve yeni bir sürüm gönderildiğinde sitenizi ve üçüncü taraf modüllerini güncelleyin. 2.7.x için güvenlik güncellemeleri veri havuzunun Sürümler sayfası aracılığıyla yayınlanır.