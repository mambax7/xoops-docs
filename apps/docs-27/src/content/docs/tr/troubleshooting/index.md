---
title: "Sorun giderme"
description: "Yaygın XOOPS sorunlarına yönelik çözümler, hata ayıklama teknikleri ve FAQ"
---
> XOOPS CMS için sık karşılaşılan sorunların çözümleri ve hata ayıklama teknikleri.

---

## 📋 Hızlı Teşhis

Belirli sorunlara dalmadan önce şu yaygın nedenleri kontrol edin:

1. **Dosya İzinleri** - Dizinlerin 755'e, dosyaların ise 644'e ihtiyacı vardır
2. **PHP Sürüm** - PHP 7.4+ (8.x önerilir) olduğundan emin olun
3. **Hata Günlükleri** - `xoops_data/logs/` ve PHP hata günlüklerini kontrol edin
4. **cache** - Yönetici → Sistem → Bakım'da önbelleği temizleyin

---

## 🗂️ Bölüm İçeriği

### Yaygın Sorunlar
- Ölümün Beyaz Ekranı (WSOD)
- database Bağlantı Hataları
- İzin Reddedildi Hataları
- module Kurulum Hataları
- template Derleme Hataları

### FAQ
- Kurulum FAQ
- module FAQ
- theme FAQ
- Performans FAQ

### Hata ayıklama
- Hata Ayıklama Modunu Etkinleştirme
- Ray Hata Ayıklayıcısını Kullanma
- database Sorgulama Hata Ayıklama
- Smarty template Hata Ayıklama

---

## 🚨 Yaygın Sorunlar ve Çözümler

### Ölümün Beyaz Ekranı (WSOD)

**Belirtiler:** Boş beyaz sayfa, hata mesajı yok

**Çözümler:**

1. ** PHP hata ekranını geçici olarak etkinleştirin:**   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```
2. **PHP hata günlüğünü kontrol edin:**   
```bash
   tail -f /var/log/php/error.log
   
```
3. **Genel nedenler:**
   - Bellek sınırı aşıldı
   - Önemli PHP sözdizimi hatası
   - Gerekli uzantı eksik

4. **Bellek sorunlarını düzeltin:**   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```
---

### database Bağlantı Hataları

**Belirtiler:** "Veritabanına bağlanılamıyor" veya benzeri

**Çözümler:**

1. **Mainfile.php dosyasındaki kimlik bilgilerini doğrulayın:**   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```
2. **Bağlantıyı manuel olarak test edin:**   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```
3. **MySQL hizmetini kontrol edin:**   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```
4. **user izinlerini doğrulayın:**   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```
---

### İzin Reddedildi Hataları

**Belirtiler:** Dosyalar yüklenemiyor, ayarlar kaydedilemiyor

**Çözümler:**

1. **Doğru izinleri ayarlayın:**   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```
2. **Doğru sahipliği ayarlayın:**   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```
3. **SELinux'u kontrol edin (CentOS/RHEL):**   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```
---

### module Kurulum Hataları

**Belirtiler:** module yüklenmiyor, SQL hataları

**Çözümler:**

1. **module gereksinimlerini kontrol edin:**
   - PHP sürüm uyumluluğu
   - Gerekli PHP uzantıları
   - XOOPS sürüm uyumluluğu

2. **Manuel SQL kurulumu:**   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```
3. **module önbelleğini temizleyin:**   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```
4. **xoops_version.php sözdizimini kontrol edin:**   
```bash
   php -l modules/mymodule/xoops_version.php
   
```
---

### template Derleme Hataları

**Belirtiler:** Smarty hatalar, template bulunamadı

**Çözümler:**

1. **Smarty önbelleğini temizleyin:**   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```
2. **template sözdizimini kontrol edin:**   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```
3. **Şablonun mevcut olduğunu doğrulayın:**   
```bash
   ls modules/mymodule/templates/
   
```
4. **Şablonları yeniden oluşturun:**
   - Yönetici → Sistem → Bakım → templates → Yeniden Oluştur

---

## 🐛 Hata Ayıklama Teknikleri

### XOOPS Hata Ayıklama Modunu Etkinleştir
```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```
### Ray Hata Ayıklayıcısını Kullanma

Ray, PHP için mükemmel bir hata ayıklama aracıdır:
```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```
### Smarty Hata Ayıklama Konsolu
```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```
### database Sorgu Günlüğü
```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```
---

## ❓ Sıkça Sorulan Sorular

### Kurulum

**S: Kurulum sihirbazı boş sayfa gösteriyor**
C: PHP hata günlüklerini kontrol edin, PHP'nin yeterli belleğe sahip olduğundan emin olun, dosya izinlerini doğrulayın.

**S: Kurulum sırasında mainfile.php dosyasına yazılamıyor**
C: İzinleri ayarlayın: kurulum sırasında `chmod 666 mainfile.php`, ardından `chmod 444`.

**S: database tabloları oluşturulmadı**
C: MySQL kullanıcısının CREATE TABLE ayrıcalıklarına sahip olup olmadığını kontrol edin, veritabanının mevcut olduğunu doğrulayın.

### modules

**S: module yönetici sayfası boş**
C: Önbelleği temizleyin, modülün admin/menu.php'sinde sözdizimi hataları olup olmadığını kontrol edin.

**S: module blokları gösterilmiyor**
C: Yönetici → Bloklar bölümünde engelleme izinlerini kontrol edin, bloğun sayfalara atandığını doğrulayın.

**S: module güncellemesi başarısız oluyor**
C: Veritabanını yedekleyin, manuel SQL güncellemelerini deneyin, sürüm gereksinimlerini kontrol edin.

### themes

**S: theme doğru şekilde uygulanmıyor**
C: Smarty önbelleğini temizleyin, theme.html'nin var olup olmadığını kontrol edin, theme izinlerini doğrulayın.

**S: Özel CSS yüklenmiyor**
C: Dosya yolunu kontrol edin, tarayıcı önbelleğini temizleyin, CSS sözdizimini doğrulayın.

**S: Resimler görüntülenmiyor**
C: Resim yollarını kontrol edin, yükleme klasörü izinlerini doğrulayın.

### Performans

**S: Site çok yavaş**
C: Önbelleğe almayı etkinleştirin, veritabanını optimize edin, yavaş sorguları kontrol edin, OpCache'i etkinleştirin.

**S: Yüksek bellek kullanımı**
C: Memory_limit'i artırın, büyük sorguları optimize edin, sayfalandırmayı uygulayın.

---

## 🔧 Bakım Komutları

### Tüm Önbellekleri Temizle
```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```
### database Optimizasyonu
```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```
### Dosya Bütünlüğünü Kontrol Edin
```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```
---

## 🔗 İlgili Belgeler

- Başlarken
- En İyi Güvenlik Uygulamaları
- XOOPS 4.0 Yol Haritası

---

## 📚 Dış Kaynaklar

- [XOOPS Forumlar](https://xoops.org/modules/newbb/)
- [GitHub Sorunları](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Hata Referansı](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #sorun giderme #hata ayıklama #sss #hatalar #çözümler