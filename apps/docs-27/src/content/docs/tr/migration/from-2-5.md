---
title: XOOPS 2,5'tan 2,7'ye yükseltme
description: XOOPS kurulumunuzu güvenli bir şekilde 2.5.x'ten 2.7.x'e yükseltmek için adım adım kılavuz.
---
:::dikkat[Önce yedekleyin]
Yükseltmeden önce daima veritabanınızı ve dosyalarınızı yedekleyin. İstisna yok.
:::

## 2.7'de Neler Değişti?

- **PHP 8.2+ gerekli** — PHP 7.x artık desteklenmiyor
- **Composer tarafından yönetilen bağımlılıklar** — `composer.json` aracılığıyla yönetilen Core kitaplıklar
- **PSR-4 otomatik yükleme** — module sınıfları ad alanlarını kullanabilir
- **Geliştirilmiş XoopsObject** — Yeni `getVar()` tipi güvenlik, kullanımdan kaldırıldı `obj2Array()`
- **Bootstrap 5 admin** — Yönetici paneli Bootstrap 5 ile yeniden oluşturuldu

## Yükseltme Öncesi Kontrol Listesi

- [ ] PHP 8.2+ sunucunuzda mevcut
- [ ] Tam database yedeklemesi (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Kurulumunuzun tam dosya yedeği
- [ ] Kurulu modüllerin ve versiyonlarının listesi
- [ ] Özel theme ayrı olarak yedeklenir

## Yükseltme Adımları

### 1. Siteyi bakım moduna alın
```php
// mainfile.php — add temporarily
define('XOOPS_MAINTENANCE', true);
```
### 2. XOOPS 2.7'yi indirin
```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```
### 3. Core dosyaları değiştirin

Yeni dosyaları yükleyin, **hariç**:
- `uploads/` — yüklediğiniz dosyalar
- `xoops_data/` — yapılandırmanız
- `modules/` — kurulu modülleriniz
- `themes/` — temalarınız
- `mainfile.php` — site yapılandırmanız
```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```
### 4. Yükseltme komut dosyasını çalıştırın

Tarayıcınızda `https://yourdomain.com/upgrade/` adresine gidin.
Yükseltme sihirbazı database geçişlerini uygulayacaktır.

### 5. Modülleri güncelleyin

XOOPS 2.7 modülleri PHP 8.2 uyumlu olmalıdır.
Güncellenmiş sürümler için [module Ekosistemi](/xoops-docs/2.7/module-guide/introduction/)'ni kontrol edin.

Yönetici → modules'de, yüklü her module için **Güncelle**'ye tıklayın.

### 6. Bakım modunu kaldırın ve test edin

`XOOPS_MAINTENANCE` satırını `mainfile.php`'den kaldırın ve
tüm sayfaların doğru şekilde yüklendiğini doğrulayın.

## Yaygın Sorunlar

**Yükseltme sonrasında "Sınıf bulunamadı" hataları**
- XOOPS kökünde `composer dump-autoload` komutunu çalıştırın
- `xoops_data/caches/` dizinini temizleyin

**module güncellemeden sonra bozuldu**
- 2.7 uyumlu bir sürüm için modülün GitHub sürümlerini kontrol edin
- Modülün PHP 8.2 için kod değişikliklerine ihtiyacı olabilir (kullanımdan kaldırılmış işlevler, yazılan özellikler)

**Yönetici paneli CSS bozuk**
- Tarayıcınızın önbelleğini temizleyin
- Dosya yükleme sırasında `xoops_lib/`'nin tamamen değiştirildiğinden emin olun