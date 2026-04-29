---
title: "Kullanıcıları Yönetme"
description: "users, user grupları, permissions ve user rolleri oluşturma dahil olmak üzere XOOPS'de user yönetimine ilişkin kapsamlı kılavuz"
---
# XOOPS'deki Kullanıcıları Yönetme

XOOPS'de user hesapları oluşturmayı, kullanıcıları gruplar halinde nasıl organize edeceğinizi ve izinleri nasıl yöneteceğinizi öğrenin.

## user Yönetimine Genel Bakış

XOOPS aşağıdakilerle kapsamlı user yönetimi sağlar:
```
Users > Accounts
├── Individual users
├── User profiles
├── Registration requests
└── Online users

Users > Groups
├── User groups/roles
├── Group permissions
└── Group membership

System > Permissions
├── Module access
├── Content access
├── Function permissions
└── Group capabilities
```
## user Yönetimine Erişim

### Yönetici Panelinde Gezinme

1. Admin'de oturum açın: `http://your-domain.com/xoops/admin/`
2. Sol kenar çubuğunda **users**'ı tıklayın
3. Seçenekler arasından seçim yapın:
   - **users:** Bireysel hesapları yönetin
   - **Gruplar:** user gruplarını yönetin
   - **Çevrimiçi users:** Şu anda aktif olan kullanıcıları görün
   - **user İstekleri:** Kayıt isteklerini işleyin

## user Rollerini Anlamak

XOOPS önceden tanımlanmış user rolleriyle birlikte gelir:

| Grup | Rol | Yetenekler | Kullanım Örneği |
|---|---|---|---|
| **Web Yöneticileri** | Yönetici | Tam saha kontrolü | Ana yöneticiler |
| **Yöneticiler** | Yönetici | Sınırlı yönetici erişimi | Güvenilir users |
| **Moderatörler** | İçerik kontrolü | İçeriği onayla | Topluluk yöneticileri |
| **Editörler** | İçerik oluşturma | Create/edit içerik | İçerik personeli |
| **Kayıtlı** | Üye | Gönderi, yorum, profil | Düzenli users |
| **Anonim** | Ziyaretçi | Salt okunur | Oturum açmamış users |

## user Hesapları Oluşturma

### Yöntem 1: Yönetici user Oluşturur

**1. Adım: user Oluşturmaya Erişin**

1. **users > users**'a gidin
2. **"Yeni user Ekle"** veya **"user Oluştur"** seçeneğini tıklayın

**2. Adım: user Bilgilerini Girin**

user ayrıntılarını girin:
```
Username: [4+ characters, letters/numbers/underscore only]
Example: john_smith

Email Address: [Valid email address]
Example: john@example.com

Password: [Strong password]
Example: MyStr0ng!Pass2025

Confirm Password: [Repeat password]
Example: MyStr0ng!Pass2025

Real Name: [User's full name]
Example: John Smith

URL: [Optional user website]
Example: https://johnsmith.com

Signature: [Optional forum signature]
Example: "Happy XOOPS user!"
```
**3. Adım: user Ayarlarını Yapılandırın**
```
User Status: ☑ Active
             ☐ Inactive
             ☐ Pending Approval

User Groups:
☑ Registered Users
☐ Webmasters
☐ Admins
☐ Moderators
```
**4. Adım: Ek Seçenekler**
```
Notify User: ☑ Send welcome email
Allow Avatar: ☑ Yes
User Theme: [Default theme]
Show Email: ☐ Public / ☑ Private
```
**5. Adım: Hesap Oluşturun**

**"user Ekle"** veya **"Oluştur"** seçeneğini tıklayın

Onay:
```
User created successfully!
Username: john_smith
Email: john@example.com
Groups: Registered Users
```
### Yöntem 2: Kullanıcının Kendi Kendine Kaydı

Kullanıcıların kendilerini kaydetmesine izin ver:

**Yönetici Paneli > Sistem > Tercihler > user Ayarları**
```
Allow User Registration: ☑ Yes

Registration Type:
☐ Instant (Approve automatically)
☑ Email Verification (Email confirmation)
☐ Admin Approval (You approve each)

Send Verification Email: ☑ Yes
```
Sonra:
1. users kayıt sayfasını ziyaret eder
2. Temel bilgileri girin
3. E-postayı doğrulayın veya onay için bekleyin
4. Hesap etkinleştirildi

## user Hesaplarını Yönetme

### Tüm Kullanıcıları Görüntüle

**Konum:** users > users

user listesini şununla gösterir:
- user adı
- E-posta adresi
- Kayıt tarihi
- Son giriş
- user durumu (Active/Inactive)
- Grup üyeliği

### user Hesabını Düzenle

1. user listesinde user adına tıklayın
2. Herhangi bir alanı değiştirin:
   - E-posta adresi
   - Şifre
   - Gerçek isim
   - user grupları
   - Durum

3. **"Kaydet"** veya **"Güncelle"**'yi tıklayın

### user Şifresini Değiştir

1. Listedeki kullanıcıyı tıklayın
2. "Şifreyi Değiştir" bölümüne gidin
3. Yeni şifreyi girin
4. Şifreyi onaylayın
5. **"Şifreyi Değiştir"**'e tıklayın

user bir sonraki girişte yeni şifreyi kullanacak.

### Deactivate/Suspend user

Hesabı silmeden geçici olarak devre dışı bırakın:

1. Listedeki kullanıcıyı tıklayın
2. **user Durumu**'nu "Aktif Değil" olarak ayarlayın
3. **"Kaydet"**'i tıklayın

user etkin değilken oturum açamaz.

### Kullanıcıyı Yeniden Etkinleştir

1. Listedeki kullanıcıyı tıklayın
2. **user Durumu**'nu "Etkin" olarak ayarlayın
3. **"Kaydet"**'i tıklayın

user tekrar giriş yapabilir.

### user Hesabını Sil

Kullanıcıyı kalıcı olarak kaldır:

1. Listedeki kullanıcıyı tıklayın
2. Aşağıya doğru kaydırın
3. **"Kullanıcıyı Sil"**'e tıklayın
4. Onaylayın: "user ve tüm veriler silinsin mi?"
5. **"Evet"**'i tıklayın

**Uyarı:** Silme işlemi kalıcıdır!

### user Profilini Görüntüle

user profili ayrıntılarına bakın:

1. user listesinde user adına tıklayın
2. Profil bilgilerini inceleyin:
   - Gerçek isim
   - E-posta
   - Web sitesi
   - Katılma tarihi
   - Son giriş
   - user biyografisi
   -Avatar
   - Posts/contributions

## user Gruplarını Anlamak

### Varsayılan user Grupları

XOOPS varsayılan grupları içerir:

| Grup | Amaç | Özel | Düzenle |
|---|---|---|---|
| **Anonim** | Oturum açmamış users | Sabit | Hayır |
| **Kayıtlı users** | Düzenli üyeler | Varsayılan | Evet |
| **Web Yöneticileri** | Site yöneticileri | Yönetici | Evet |
| **Yöneticiler** | Sınırlı yöneticiler | Yönetici | Evet |
| **Moderatörler** | İçerik moderatörleri | Özel | Evet |

### Özel Grup Oluştur

Belirli bir rol için grup oluşturun:

**Konum:** users > Gruplar

1. **"Yeni Grup Ekle"**'ye tıklayın
2. Grup ayrıntılarını girin:
```
Group Name: Content Editors
Group Description: Users who can create and edit content

Display Group: ☑ Yes (Show in member profiles)
Group Type: ☑ Regular / ☐ Admin
```
3. **"Grup Oluştur"**'a tıklayın

### Grup Üyeliğini Yönet

Kullanıcıları gruplara atayın:

**Seçenek A: user Listesinden**

1. **users > users**'a gidin
2. Kullanıcıya tıklayın
3. "user Grupları" bölümündeki Check/uncheck grupları
4. **"Kaydet"**'i tıklayın

**B Seçeneği: Gruplardan**

1. **users > Gruplar**'a gidin
2. Grup adına tıklayın
3. View/edit üye listesi
4. user ekleyin veya kaldırın
5. **"Kaydet"**'i tıklayın

### Grup Özelliklerini Düzenle

Grup ayarlarını özelleştirin:

1. **users > Gruplar**'a gidin
2. Grup adına tıklayın
3. Değiştirin:
   - Grup adı
   - Grup açıklaması
   - Görüntüleme grubu (show/hide)
   - Grup türü
4. **"Kaydet"**'i tıklayın

## user İzinleri

### İzinleri Anlamak

Üç izin düzeyi:

| Seviye | Kapsam | Örnek |
|---|---|---|
| **module Erişimi** | Can see/use modülü | Forum modülüne erişebilir |
| **İçerik İzinleri** | Belirli içeriği görüntüleyebilir | Yayınlanan haberleri okuyabilir |
| **İşlev İzinleri** | Eylemler gerçekleştirebilir | Yorum gönderebilir |

### module Erişimini Yapılandırma

**Konum:** Sistem > permissions

Her bir modüle hangi grupların erişebileceğini kısıtlayın:
```
Module: News

Admin Access:
☑ Webmasters
☑ Admins
☐ Moderators
☐ Registered Users
☐ Anonymous

User Access:
☐ Webmasters
☐ Admins
☑ Moderators
☑ Registered Users
☑ Anonymous
```
Başvurmak için **"Kaydet"**'i tıklayın.

### İçerik İzinlerini Ayarlayın

Belirli içeriğe erişimi kontrol edin:

Örnek - Haber makalesi:
```
View Permission:
☑ All groups can read

Post Permission:
☑ Registered Users
☑ Content Editors
☐ Anonymous

Moderate Comments:
☑ Moderators required
```
### İzinlere İlişkin En İyi Uygulamalar
```
Public Content (News, Pages):
├── View: All groups
├── Post: Registered Users + Editors
└── Moderate: Admins + Moderators

Community (Forum, Comments):
├── View: All groups
├── Post: Registered Users
└── Moderate: Moderators + Admins

Admin Tools:
├── View: Webmasters + Admins only
├── Configure: Webmasters only
└── Delete: Webmasters only
```
## user Kayıt Yönetimi

### Kayıt İsteklerini Ele Alın

"Yönetici Onayı" etkinse:

1. **users > user İstekleri**'ne gidin
2. Bekleyen kayıtları görüntüleyin:
   - user adı
   - E-posta
   - Kayıt tarihi
   - Talep durumu

3. Her talep için:
   - İncelemek için tıklayın
   - Etkinleştirmek için **"Onayla"** seçeneğini tıklayın
   - Reddetmek için **"Reddet"** seçeneğini tıklayın

### Kayıt E-postası Gönder

welcome/verification e-postasını yeniden gönderin:

1. **users > users**'a gidin
2. Kullanıcıya tıklayın
3. **"E-posta Gönder"** veya **"Doğrulamayı Yeniden Gönder"** seçeneğini tıklayın
4. Kullanıcıya gönderilen e-posta

## Çevrimiçi Kullanıcıları İzleme

### Şu Anda Çevrimiçi Kullanıcıları Görüntüle

Aktif site ziyaretçilerini takip edin:

**Konum:** users > Çevrimiçi users

Gösterir:
- Mevcut çevrimiçi users
- Misafir ziyaretçi sayısı
- Son aktivite zamanı
- IP adresi
- Gezinme konumu

### user Etkinliğini İzleyin

user davranışını anlayın:
```
Active Users: 12
Registered: 8
Anonymous: 4

Recent Activity:
- User1 - Forum post (2 min ago)
- User2 - Comment (5 min ago)
- User3 - Page view (8 min ago)
```
## user Profili Özelleştirmesi

### user Profillerini Etkinleştir

user profili seçeneklerini yapılandırın:

**Yönetici > Sistem > Tercihler > user Ayarları**
```
Allow User Profiles: ☑ Yes
Show Member List: ☑ Yes
Users Can Edit Profile: ☑ Yes
Show User Avatar: ☑ Yes
Show Last Online: ☑ Yes
Show Email Address: ☐ Yes / ☑ No
```
### Profil Alanları

Kullanıcıların profillere neler ekleyebileceğini yapılandırın:

Örnek profil alanları:
- Gerçek isim
- Web sitesi URL
- Biyografi
- Konum
- Avatar (resim)
- İmza
- İlgi alanları
- Sosyal medya bağlantıları

module ayarlarında özelleştirin.

## user Kimlik Doğrulaması

### İki Faktörlü Kimlik Doğrulamayı Etkinleştir

Gelişmiş güvenlik seçeneği (varsa):

**Yönetici > users > Ayarlar**
```
Two-Factor Authentication: ☑ Enabled

Methods:
☑ Email
☑ SMS
☑ Authenticator App
```
Kullanıcıların ikinci yöntemle doğrulama yapması gerekir.

### Şifre Politikası

Güçlü şifreler uygulayın:

**Yönetici > Sistem > Tercihler > user Ayarları**
```
Minimum Password Length: 8 characters
Require Uppercase: ☑ Yes
Require Numbers: ☑ Yes
Require Special Chars: ☑ Yes

Password Expiration: 90 days
Force Change on First Login: ☑ Yes
```
### Giriş Denemeleri

Kaba kuvvet saldırılarını önleyin:
```
Lock After Failed Attempts: 5
Lock Duration: 15 minutes
Log All Attempts: ☑ Yes
Notify Admin: ☑ Yes
```
## user E-posta Yönetimi

### Gruba Toplu E-posta Gönder

Birden fazla kullanıcıya mesaj gönderin:

1. **users > users**'a gidin
2. Birden fazla user seçin (onay kutuları)
3. **"E-posta Gönder"**'e tıklayın
4. Mesajı oluşturun:
   - Konu
   - Mesaj gövdesi
   - İmzayı ekle
5. **"Gönder"**'i tıklayın

### E-posta Bildirim Ayarları

Kullanıcıların hangi e-postaları alacağını yapılandırın:

**Yönetici > Sistem > Tercihler > E-posta Ayarları**
```
New Registration: ☑ Send welcome email
Password Reset: ☑ Send reset link
Comments: ☑ Notify on replies
Messages: ☑ Notify new messages
Notifications: ☑ Site announcements
Frequency: ☐ Immediate / ☑ Daily / ☐ Weekly
```
## user İstatistikleri

### user Raporlarını Görüntüle

user metriklerini izleyin:

**Yönetici > Sistem > Kontrol Paneli**
```
User Statistics:
├── Total Users: 256
├── Active Users: 189
├── New This Month: 24
├── Registration Requests: 3
├── Currently Online: 12
└── Last 24h Posts: 45
```
### user Büyüme Takibi

Kayıt eğilimlerini izleyin:
```
Registrations Last 7 Days: 12 users
Registrations Last 30 Days: 48 users
Active Users (30 days): 156
Inactive Users (30+ days): 100
```
## Ortak user Yönetimi Görevleri

### Yönetici user Oluştur

1. Yeni user oluşturun (yukarıdaki adımlar)
2. **Web Yöneticileri** veya **Yöneticiler** grubuna atayın
3. Sistem > permissions bölümünde izinleri verin
4. Yönetici erişiminin çalıştığını doğrulayın

### Moderatör Oluştur

1. Yeni user oluşturun
2. **Moderatörler** grubuna atayın
3. Belirli modülleri denetlemek için izinleri yapılandırın
4. user içeriği onaylayabilir, yorumları yönetebilir

### İçerik Düzenleyicilerini Kur

1. **İçerik Düzenleyicileri** grubu oluşturun
2. user oluşturun, gruba atayın
3. Şunlara izin verin:
   - Create/edit sayfalar
   - Create/edit gönderileri
   - Yorumları ılımlılaştırın
4. Yönetici paneli erişimini kısıtlayın

### Unutulan Şifreyi Sıfırla

user şifresini unuttu:

1. **users > users**'a gidin
2. Kullanıcıyı bulun
3. user adına tıklayın
4. **"Şifreyi Sıfırla"** seçeneğine tıklayın veya şifre alanını düzenleyin
5. Geçici şifre belirleyin
6. Kullanıcıyı bilgilendirin (e-posta gönder)
7. user oturum açar, şifreyi değiştirir

### Kullanıcıları Toplu İçe Aktarma

user listesini içe aktar (gelişmiş):

Birçok barındırma paneli aşağıdakileri gerçekleştirmek için araçlar sağlar:
1. user verilerini içeren CSV dosyasını hazırlayın
2. Yönetici paneli aracılığıyla yükleyin
3. Toplu hesap oluşturma

Veya içe aktarma için özel script/plugin kullanın.

## user Gizliliği

### user Gizliliğine Saygı Gösterin

Gizlilikle ilgili en iyi uygulamalar:
```
Do:
✓ Hide emails by default
✓ Let users choose visibility
✓ Protect against spam

Don't:
✗ Share private data
✗ Display without permission
✗ Use for marketing without consent
```
### GDPR Uyumluluk

AB kullanıcılarına hizmet veriyorsanız:

1. Veri toplanması için onay alın
2. Kullanıcıların verilerini indirmelerine izin verin
3. Hesabı silme seçeneğini sağlayın
4. Gizlilik politikasını sürdürün
5. Veri işleme faaliyetlerini günlüğe kaydedin

## user Sorunlarını Giderme

### user Giriş Yapamıyor

**Sorun:** user şifreyi unuttu veya hesaba erişemiyor

**Çözüm:**
1. user hesabının "Etkin" olduğunu doğrulayın
2. Şifreyi sıfırlayın:
   - Yönetici > users > user bul
   - Yeni geçici şifre belirleyin
   - Kullanıcıya e-posta yoluyla gönder
3. Kullanıcıyı temizle cookies/cache
4. Hesabın kilitli olup olmadığını kontrol edin

### user Kaydı Sıkıştı

**Sorun:** user kaydı tamamlayamıyor

**Çözüm:**
1. Çek kaydına izin verilir:
   - Yönetici > Sistem > Tercihler > user Ayarları
   - Kaydı etkinleştir
2. E-posta ayarlarının çalışıp çalışmadığını kontrol edin
3. E-posta doğrulaması gerekiyorsa:
   - Doğrulama e-postasını yeniden gönder
   - Spam klasörünü kontrol edin
4. Çok katı ise şifre gereksinimlerini azaltın

### Yinelenen Hesaplar

**Sorun:** Kullanıcının birden fazla hesabı var

**Çözüm:**
1. users listesinde yinelenen hesapları belirleyin
2. Birincil hesabı koruyun
3. Mümkünse verileri birleştirin
4. Yinelenen hesapları silin
5. Ayarlarda "Yinelenen E-postayı Önle" seçeneğini etkinleştirin

## user Yönetimi Kontrol Listesi

İlk kurulum için:

- [ ] user kayıt türünü ayarlayın (instant/email/admin)
- [ ] Gerekli user gruplarını oluşturun
- [ ] Grup izinlerini yapılandırın
- [ ] Şifre politikasını ayarlayın
- [ ] user profillerini etkinleştir
- [ ] E-posta bildirimlerini yapılandırın
- [ ] user avatarı seçeneklerini ayarlayın
- [ ] Test kayıt işlemi
- [ ] Test hesapları oluşturun
- [ ] İzinlerin çalıştığını doğrulayın
- [ ] Belge grubu yapısı
- [ ] user katılımını planlayın

## Sonraki Adımlar

Kullanıcıları ayarladıktan sonra:

1. Kullanıcıların ihtiyaç duyduğu modülleri yükleyin
2. users için içerik oluşturun
3. user hesaplarını güvenli hale getirin
4. Daha fazla yönetici özelliğini keşfedin
5. Sistem genelindeki ayarları yapılandırın

---

**Etiketler:** #users #gruplar #permissions #yönetim #erişim kontrolü

**İlgili Makaleler:**
- Yönetici Paneline Genel Bakış
- Modüllerin Kurulumu
- ../Configuration/Security-Configuration
- ../Configuration/System-Settings