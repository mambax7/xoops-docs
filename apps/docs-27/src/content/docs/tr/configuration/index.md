---
title: "Temel Yapılandırma"
description: "Mainfile.php ayarları, site adı, e-posta ve saat dilimi yapılandırmasını içeren ilk XOOPS kurulumu"
---
# Temel XOOPS Yapılandırma

Bu kılavuz, XOOPS sitenizin kurulumdan sonra düzgün çalışmasını sağlamak için gerekli yapılandırma ayarlarını kapsar.

## mainfile.php Yapılandırması

`mainfile.php` dosyası, XOOPS kurulumunuz için kritik yapılandırmayı içerir. Kurulum sırasında oluşturulur ancak manuel olarak düzenlemeniz gerekebilir.

### Konum
```
/var/www/html/xoops/mainfile.php
```
### Dosya Yapısı
```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```
### Kritik Ayarlar Açıklaması

| Ayar | Amaç | Örnek |
|---|---|---|
| `XOOPS_DB_TYPE` | database sistemi | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | database sunucusu konumu | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | database user adı | `xoops_user` |
| `XOOPS_DB_PASS` | database şifresi | [güvenli_şifre] |
| `XOOPS_DB_NAME` | database adı | `xoops_db` |
| `XOOPS_DB_PREFIX` | Tablo adı öneki | `xoops_` (bir DB'de birden fazla XOOPS'ye izin verir) |
| `XOOPS_ROOT_PATH` | Fiziksel dosya sistemi yolu | `/var/www/html/xoops` |
| `XOOPS_URL` | Web'den erişilebilir URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Güvenilir yol (web kökü dışında) | `/var/www/xoops_var` |

### Mainfile.php'yi düzenleme

Mainfile.php'yi bir metin düzenleyicide açın:
```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```
### Yaygın mainfile.php Değişiklikleri

**Siteyi değiştir URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```
**Hata ayıklama modunu etkinleştirin (yalnızca geliştirme):**
```php
define('XOOPS_DEBUG', 1);
```
**Tablo önekini değiştirin (gerekirse):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```
**Güven yolunu web kökünün dışına taşı (gelişmiş):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```
## Yönetici Paneli Yapılandırması

XOOPS yönetici paneli aracılığıyla temel ayarları yapılandırın.

### Sistem Ayarlarına Erişim

1. Yönetici paneline giriş yapın: `http://your-domain.com/xoops/admin/`
2. Şuraya gidin: **Sistem > Tercihler > Genel Ayarlar**
3. Ayarları değiştirin (aşağıya bakın)
4. Alttaki "Kaydet"i tıklayın

### Site Adı ve Açıklaması

Sitenizin nasıl görüneceğini yapılandırın:
```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```
### İletişim Bilgileri

Site iletişim ayrıntılarını ayarlayın:
```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```
### Dil ve Bölge

Varsayılan dili ve bölgeyi ayarlayın:
```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```
## E-posta Yapılandırması

Bildirimler ve user iletişimleri için e-posta ayarlarını yapılandırın.

### E-posta Ayarları Konum

**Yönetici Paneli:** Sistem > Tercihler > E-posta Ayarları

### SMTP Yapılandırma

Güvenilir e-posta teslimatı için PHP mail() yerine SMTP kullanın:
```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```
### Gmail Yapılandırma Örneği

Gmail aracılığıyla e-posta göndermek için XOOPS'yi kurun:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```
**Not:** Gmail, Gmail şifrenizi değil, Uygulama Şifresini gerektirir:
1. https://myaccount.google.com/apppasswords'ye gidin
2. "Posta" ve "Windows Bilgisayar" için uygulama şifresi oluşturun
3. XOOPS'de oluşturulan şifreyi kullanın.

### PHP mail() Yapılandırma (Daha Basit Ama Daha Az Güvenilir)

SMTP mevcut değilse, PHP mail() kullanın:
```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```
Sunucunuzda sendmail veya postfix'in yapılandırılmış olduğundan emin olun:
```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```
### E-posta İşlev Ayarları

E-postaları neyin tetikleyeceğini yapılandırın:
```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```
## Saat Dilimi Yapılandırması

Doğru zaman damgaları ve planlama için uygun saat dilimini ayarlayın.

### Yönetici Panelinde Saat Dilimini Ayarlama

**Yol:** Sistem > Tercihler > Genel Ayarlar
```
Default Timezone: [Select your timezone]
```
**Ortak Saat Dilimleri:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Saat Dilimini Doğrulayın

Geçerli sunucu saat dilimini kontrol edin:
```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```
### Sistem Saat Dilimini Ayarla (Linux)
```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```
## URL Yapılandırma

### Temizlemeyi Etkinleştir URLs (Dostu URLs)

URLs için `/index.php?page=about` yerine `/page/about` gibi

**Gereksinimler:**
- Mod_rewrite etkinleştirilmiş Apache
- XOOPS kökündeki `.htaccess` dosyası

**Yönetici Panelinde etkinleştirin:**

1. Şuraya gidin: **Sistem > Tercihler > URL Ayarlar**
2. Kontrol edin: "Dostluğu Etkinleştir URLs"
3. Seçin: "URL Tür" (Yol Bilgisi veya Sorgu)
4. Kaydet

**.htaccess'in Varlığını Doğrulayın:**
```bash
cat /var/www/html/xoops/.htaccess
```
Örnek .htaccess içeriği:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```
**Sorun Giderme Temizle URLs:**
```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```
### Siteyi Yapılandırın URL

**Yönetici Paneli:** Sistem > Tercihler > Genel Ayarlar

Alanınız için doğru URL değerini ayarlayın:
```
Site URL: http://your-domain.com/xoops/
```
Veya XOOPS kökteyse:
```
Site URL: http://your-domain.com/
```
## Arama Motoru Optimizasyonu (SEO)

Daha iyi arama motoru görünürlüğü için SEO ayarlarını yapılandırın.

### Meta Etiketleri

Genel meta etiketleri ayarlayın:

**Yönetici Paneli:** Sistem > Tercihler > SEO Ayarlar
```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```
Bunlar `<head>` sayfasında görünür:
```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```
### Site Haritası

Arama motorları için XML site haritasını etkinleştirin:

1. Şuraya gidin: **Sistem > modules**
2. "Site Haritası" modülünü bulun
3. Kurmak ve etkinleştirmek için tıklayın
4. Site haritasına şu adresten erişin: `/xoops/sitemap.xml`

### Robots.txt

Arama motoru taramasını kontrol edin:

`/var/www/html/xoops/robots.txt` oluşturun:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```
## user Ayarları

Varsayılan kullanıcıyla ilgili ayarları yapılandırın.

### user Kaydı

**Yönetici Paneli:** Sistem > Tercihler > user Ayarları
```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```
### user Profili
```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### user E-postası Görüntüleme
```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```
## cache Yapılandırması

Uygun önbelleğe almayla performansı artırın.

### cache Ayarları

**Yönetici Paneli:** Sistem > Tercihler > cache Ayarları
```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```
### Önbelleği Temizle

Eski cache dosyalarını temizleyin:
```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```
## Başlangıç Ayarları Kontrol Listesi

Kurulumdan sonra yapılandırın:

- [ ] Site adı ve açıklaması doğru şekilde ayarlandı
- [ ] Yönetici e-postası yapılandırıldı
- [ ] SMTP e-posta ayarları yapılandırıldı ve test edildi
- [ ] Saat dilimi bölgenize ayarlandı
- [ ] URL doğru yapılandırılmış
- [ ] İstenirse temizleme URLs (dost URLs) etkinleştirilir
- [ ] user kayıt ayarları yapılandırıldı
- [ ] SEO için meta etiketleri yapılandırıldı
- [ ] Varsayılan dil seçildi
- [ ] cache ayarları etkinleştirildi
- [ ] Yönetici user şifresi güçlüdür (16+ karakter)
- [ ] user kaydını test edin
- [ ] E-posta işlevselliğini test edin
- [ ] Test dosyası yükleme
- [ ] Ana sayfayı ziyaret edin ve görünümü doğrulayın

## Yapılandırmanın Test Edilmesi

### Test E-postası

Bir test e-postası gönderin:

**Yönetici Paneli:** Sistem > E-posta Testi

Veya manuel olarak:
```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```
### database Bağlantısını Test Edin
```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```
**Önemli:** Testten sonra test dosyalarını silin!
```bash
rm /var/www/html/xoops/test-*.php
```
## Yapılandırma Dosyaları Özeti

| Dosya | Amaç | Yöntemi Düzenle |
|---|---|---|
| anadosya.php | database ve temel ayarlar | Metin editörü |
| Yönetici Paneli | Çoğu ayar | Web arayüzü |
| .htaccess | URL yeniden yazma | Metin editörü |
| robots.txt | Arama motoru taraması | Metin editörü |

## Sonraki Adımlar

Temel konfigürasyondan sonra:

1. Sistem ayarlarını ayrıntılı olarak yapılandırın
2. Güvenliği güçlendirin
3. Yönetici panelini keşfedin
4. İlk içeriğinizi oluşturun
5. user hesaplarını ayarlayın

---

**Etiketler:** #yapılandırma #kurulum #eposta #saat dilimi #seo

**İlgili Makaleler:**
- ../Installation/Installation
- Sistem Ayarları
- Güvenlik Yapılandırması
- Performans-Optimizasyon