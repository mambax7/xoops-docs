---
title: "Sorun Raporlama Yönergeleri"
description: "Hatalar, özellik istekleri ve diğer sorunlar etkili bir şekilde nasıl raporlanır?"
---
> Etkili hata raporları ve özellik talepleri XOOPS geliştirmesi için çok önemlidir. Bu kılavuz, yüksek kaliteli sorunlar oluşturmanıza yardımcı olur.

---

## Rapor Etmeden Önce

### Mevcut Sorunları Kontrol Edin

**Her zaman önce arayın:**

1. [GitHub Sorunları](https://github.com/XOOPS/XoopsCore27/issues)'na gidin
2. Sorununuzla ilgili anahtar kelimeleri arayın
3. Kapatılan sorunları kontrol edin - zaten çözülmüş olabilir
4. Çekme isteklerine bakın; devam ediyor olabilir

Arama filtrelerini kullanın:
- `is:issue is:open label:bug` - Hataları aç
- `is:issue is:open label:feature` - Özellik isteklerini aç
- `is:issue sort:updated` - Son güncellenen sorunlar

### Bu Gerçekten Bir Sorun mu?

İlk önce şunu düşünün:

- **Yapılandırma sorunu mu var?** - Belgeleri kontrol edin
- **Kullanım sorusu?** - Forumlarda veya Discord topluluğunda sorun
- **Güvenlik sorunu mu?** - Aşağıdaki #güvenlik sorunları bölümüne bakın
- **module özel mi?** - module bakımcısına rapor verin
- **Temaya özel mi?** - theme yazarına rapor verin

---

## Sorun Türleri

### Hata Raporu

Hata, beklenmeyen bir davranış veya kusurdur.

**Örnekler:**
- Giriş çalışmıyor
- database hataları
- Eksik form doğrulaması
- Güvenlik açığı

### Özellik İsteği

Özellik isteği, yeni işlevsellik için bir öneridir.

**Örnekler:**
- Yeni özellik için destek ekleyin
- Mevcut işlevselliği iyileştirin
- Eksik belgeleri ekleyin
- Performans iyileştirmeleri

### Geliştirme

Bir geliştirme mevcut işlevselliği geliştirir.

**Örnekler:**
- Daha iyi hata mesajları
- Geliştirilmiş performans
- Daha iyi API tasarımı
- Daha iyi user deneyimi

### Belgeler

Dokümantasyon sorunları arasında eksik veya yanlış dokümantasyon yer alır.

**Örnekler:**
- Eksik API belgeleri
- Eski kılavuzlar
- Eksik kod örnekleri
- Dokümantasyondaki yazım hataları

---

## Hata Bildirme

### Hata Raporu Şablonu
```markdown
## Description
Brief, clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Operating System: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
If applicable, add screenshots showing the issue.

## Additional Context
Any other relevant information.

## Possible Fix
If you have suggestions for fixing the issue (optional).
```
### İyi Hata Raporu Örneği
```markdown
## Description
Login page shows blank page when database connection fails.

## Steps to Reproduce
1. Stop the MySQL service
2. Navigate to the login page
3. Observe the behavior

## Expected Behavior
Show a user-friendly error message explaining the database connection issue.

## Actual Behavior
The page is completely blank - no error message, no interface visible.

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Database: MySQL 5.7
- Operating System: Ubuntu 20.04
- Browser: Chrome 120

## Additional Context
This likely affects other pages too. The error should be displayed to admins or logged appropriately.

## Possible Fix
Check database connection in header.php before rendering the template.
```
### Kötü Hata Raporu Örneği
```markdown
## Description
Login doesn't work

## Steps to Reproduce
It doesn't work

## Expected Behavior
It should work

## Actual Behavior
It doesn't

## Environment
Latest version
```
---

## Özellik İsteğini Rapor Etme

### Özellik İsteği Şablonu
```markdown
## Description
Clear, concise description of the feature.

## Problem Statement
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe your ideal implementation or UX.

## Alternatives Considered
Are there other ways to achieve this goal?

## Additional Context
Any mockups, examples, or references.

## Expected Impact
How would this benefit users? Would it be breaking?
```
### İyi Özellik İsteği Örneği
```markdown
## Description
Add two-factor authentication (2FA) for user accounts.

## Problem Statement
With increasing security breaches, many CMS platforms now offer 2FA. XOOPS users want stronger account security beyond passwords.

## Proposed Solution
Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.).
- Users can enable 2FA in their profile
- Display QR code for setup
- Generate backup codes for recovery
- Require 2FA code at login

## Alternatives Considered
- SMS-based 2FA (requires carrier integration, less secure)
- Hardware keys (too complex for average users)

## Additional Context
Similar to GitHub, GitLab, and WordPress implementations.
Reference: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Expected Impact
Increases account security. Could be optional initially, mandatory in future versions.
```
---

## Güvenlik Sorunları

### NOT Herkese Açık Rapor Yapın

**Güvenlik açıkları konusunda asla kamuya açık bir sorun oluşturmayın.**

### Özel Olarak Rapor Edin

1. **Güvenlik ekibine e-posta gönderin:** Security@xoops.org
2. **Şunları ekleyin:**
   - Güvenlik açığının açıklaması
   - Yeniden üretme adımları
   - Potansiyel etki
   - İletişim bilgileriniz

### Sorumlu Açıklama

- Alındığını 48 saat içinde onaylayacağız
- Her 7 günde bir güncelleme sağlayacağız
- Sabit bir zaman çizelgesi üzerinde çalışacağız
- Keşif için kredi talep edebilirsiniz
- Kamuya açıklama zamanlamasını koordine edin

### Güvenlik Sorunu Örneği
```
Subject: [SECURITY] XSS Vulnerability in Comment Form

Description:
The comment form in Publisher module does not properly escape user input,
allowing stored XSS attacks.

Steps to Reproduce:
1. Create a comment with: <img src=x onerror="alert('xss')">
2. Submit the form
3. The JavaScript executes when viewing the comment

Impact:
Attackers can steal user session tokens, perform actions as users,
or deface the website.

Environment:
- XOOPS 2.7.0
- Publisher Module 1.x
```
---

## Sayı Başlığı En İyi Uygulamalar

### İyi Başlıklar
```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```
### Kötü Başlıklar
```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```
### Başlık Yönergeleri

- **Belirgin olun** - Neyi ve nerede olduğunu belirtin
- **Kısa ve öz olun** - 75 karakterden az
- **Şimdiki zamanı kullanın** - "boş gösterilen" değil "boş sayfayı gösterir"
- **Bağlamı dahil et** - "yönetici panelinde", "kurulum sırasında"
- **Genel sözcüklerden kaçının** - "Düzeltme", "yardım", "sorun" değil

---

## Sorun Açıklaması En İyi Uygulamalar

### Temel Bilgileri Dahil Edin

1. **Ne** - Sorunun net açıklaması
2. **Nerede** - Hangi sayfa, module veya özellik
3. **Ne zaman** - Yeniden oluşturma adımları
4. **Ortam** - Sürüm, İşletim Sistemi, tarayıcı, PHP
5. **Neden** - Bu neden önemlidir?

### Kod Biçimlendirmesini Kullan
```markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```
### Ekran Görüntülerini Ekle

user arayüzü sorunları için şunları ekleyin:
- Sorunun ekran görüntüsü
- Beklenen davranışın ekran görüntüsü
- Neyin yanlış olduğunu açıklayın (oklar, daireler)

### Etiketleri Kullan

Kategorize etmek için etiketler ekleyin:
- `bug` - Hata raporu
- `enhancement` - Geliştirme isteği
- `documentation` - Dokümantasyon sorunu
- `help wanted` - Yardım arıyorum
- `good first issue` - Yeni katkıda bulunanlar için iyi

---

## Raporlamadan Sonra

### Duyarlı Olun

- Sorun yorumlarındaki soruları kontrol edin
- İstenirse ek bilgi sağlayın
- Önerilen düzeltmeleri test edin
- Yeni sürümlerde hatanın hala mevcut olduğunu doğrulayın

### Görgü Kurallarını Takip Edin

- Saygılı ve profesyonel olun
- İyi niyetli olduğunuzu varsayın
- Düzeltme talep etmeyin - geliştiriciler gönüllüdür
- Mümkünse yardım etmeyi teklif edin
- Katkıda bulunanlara çalışmaları için teşekkür ederiz

### Soruna Odaklı Tutun

- Konunun üzerinde kalın
- İlgisiz konuları tartışmayın
- Bunun yerine ilgili konulara bağlantı verin
- Özellik oylaması için sorunları kullanmayın

---

## Sorunlara Ne Olur?

### Triyaj Süreci

1. **Yeni sayı oluşturuldu** - GitHub bakımcıları bilgilendiriyor
2. **İlk inceleme** - Netlik ve kopyalar açısından kontrol edildi
3. **Etiket ataması** - Kategorilere ayrılmış ve önceliklendirilmiş
4. **Ödeme** - Uygunsa birine atanır
5. **Tartışma** - Gerektiğinde ek bilgi toplanır

### Öncelik Düzeyleri

- **Kritik** - Veri kaybı, güvenlik, tamamen kırılma
- **Yüksek** - Temel özellik bozuk, birçok kullanıcıyı etkiliyor
- **Orta** - Özelliğin bir kısmı bozuk, geçici çözüm mevcut
- **Düşük** - Küçük sorun, kozmetik veya özel kullanım durumu

### Çözüm Sonuçları

- **Düzeltildi** - Sorun PR'da çözüldü
- **Düzeltilemez** - Teknik veya stratejik nedenlerle reddedildi
- **Kopya** - Başka bir sorunla aynı
- **Geçersiz** - Aslında bir sorun değil
- **Daha fazla bilgi gerekiyor** - Ek ayrıntılar bekleniyor

---

## Sorun Örnekleri

### Örnek: İyi Hata Raporu
```markdown
## Description
Admin users cannot delete items when using MySQL with strict mode enabled.

## Steps to Reproduce
1. Enable `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigate to Publisher admin panel
3. Click delete button on any article
4. Error is shown

## Expected Behavior
Article should be deleted or show meaningful error.

## Actual Behavior
Error: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Database: MySQL 8.0.32 with STRICT_TRANS_TABLES
- Operating System: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot of error message]

## Additional Context
This only happens with strict SQL mode. Works fine with default settings.
The query is in class/PublisherItem.php:248

## Possible Fix
Use single quotes around 'deleted_at' or use backticks for all column names.
```
### Örnek: İyi Özellik İsteği
```markdown
## Description
Add REST API endpoints for read-only access to public content.

## Problem Statement
Developers want to build mobile apps and external services using XOOPS data.
Currently limited to SOAP API which is outdated and poorly documented.

## Proposed Solution
Implement RESTful API with:
- Endpoints for articles, users, comments (read-only)
- Token-based authentication
- Standard HTTP status codes and errors
- OpenAPI/Swagger documentation
- Pagination support

## Alternatives Considered
- Enhanced SOAP API (legacy, not standards-compliant)
- GraphQL (more complex, maybe future)

## Additional Context
See Publisher module API refactoring for similar patterns.
Would align with modern web development practices.

## Expected Impact
Enable ecosystem of third-party tools and mobile apps.
Would improve XOOPS adoption and ecosystem.
```
---

## İlgili Belgeler

- Davranış Kuralları
- Katkı İş Akışı
- Çekme Talebi Yönergeleri
- Katkıda Bulunmaya Genel Bakış

---

#xoops #sorunlar #hata raporlama #özellik istekleri #github
