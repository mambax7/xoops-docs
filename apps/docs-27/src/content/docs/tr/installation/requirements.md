---
title: "Gereksinimler"
---
## Yazılım Ortamı (Yığın)

Çoğu XOOPS üretim sitesi _LAMP_ yığınında (**A**pache, **M**ySQL ve **P**HP çalıştıran bir **L**inux sistemi) çalışır, ancak birçok farklı olası yığın vardır.

Yerel bir makinede yeni bir sitenin prototipini oluşturmak genellikle en kolay yoldur. Bu durumda, birçok XOOPS kullanıcısı bir ¤PH000035 yığını seçer (işletim sistemi olarak **W**indows'u kullanır), diğerleri ise _LAMP_ veya _MAMP_ (**M**AC) yığınlarını çalıştırır.

### PHP

Herhangi bir PHP sürümü >= 8.2.0 (PHP 8.4 veya üzeri şiddetle tavsiye edilir)

> **Önemli:** XOOPS 2.7.0, **PHP 8.2 veya daha yenisini** gerektirir. PHP 7.x ve önceki sürümler artık desteklenmemektedir. Daha eski bir siteyi yükseltiyorsanız, başlamadan önce barındırıcınızın PHP 8.2+ sunduğunu doğrulayın.

### MySQL

MySQL sunucu 5.7 veya üstü (MySQL Sunucu 8.4 veya üstü şiddetle tavsiye edilir.) MySQL 9.0 da desteklenir. MariaDB, MySQL'nin geriye dönük olarak uyumlu, ikili bir değiştirmesidir ve XOOPS ile de sorunsuz çalışır.

### Web sunucusu

Apache, NGINX, LiteSpeed vb. gibi PHP komut dosyalarının çalıştırılmasını destekleyen bir web sunucusu.

### Gerekli PHP Uzantılar

XOOPS yükleyicisi, kurulumun devam etmesine izin vermeden önce aşağıdaki uzantıların yüklendiğini doğrular:

* `mysqli` — MySQL database sürücüsü
* `session` — oturum yönetimi
* `pcre` — Perl uyumlu düzenli ifadeler
* `filter` — giriş filtreleme ve doğrulama
* `fileinfo` — Yüklemeler için MIME tipi algılama

### Gerekli PHP Ayarlar

Yükleyici, yukarıdaki uzantılara ek olarak aşağıdaki `php.ini` ayarını doğrular:

* `file_uploads` **Açık** olmalıdır — bu olmadan XOOPS yüklenen dosyaları kabul edemez

### Önerilen PHP Uzantılar

Yükleyici ayrıca bu uzantıları da kontrol eder. Bunlar kesinlikle gerekli değildir, ancak XOOPS ve çoğu module tam işlevsellik için bunlara güvenir. Ana makinenizin izin verdiği sayıda etkinleştirin:

* `mbstring` — çok baytlı dize işleme
* `intl` — uluslararasılaştırma
* `iconv` — karakter seti dönüşümü
* `xml` — XML ayrıştırma
* `zlib` — sıkıştırma
* `gd` — görüntü işleme
* `exif` — resim meta verileri
* `curl` — HTTP beslemeler ve API çağrılar için istemci

## Hizmetler

### Dosya Sistemi Erişimi (Web Yöneticisi Erişimi için)

XOOPS dağıtım dosyalarını web sunucusuna aktarmak için bazı yöntemlere (FTP, SFTP vb.) ihtiyacınız olacaktır.

### Dosya Sistemi Erişimi (Web Sunucusu İşlemi için)

XOOPS'yi çalıştırmak için dosya ve dizin oluşturma, okuma ve silme becerisi gereklidir. Normal bir kurulum ve normal günlük çalışma için aşağıdaki yolların web sunucusu işlemi tarafından yazılabilir olması gerekir:

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (kurulum ve yükseltme sırasında yazılabilir)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### database

XOOPS'nin MySQL'da tabloları oluşturması, değiştirmesi ve sorgulaması gerekecektir. Bunun için ihtiyacınız olacak:

* MySQL user hesabı ve şifresi
* Kullanıcının tüm ayrıcalıklara sahip olduğu bir MySQL database (veya alternatif olarak, user böyle bir database oluşturma ayrıcalığına da sahip olabilir)

### E-postaCanlı bir site için, XOOPS'in hesap aktivasyonları ve şifre sıfırlama gibi user iletişimi için kullanabileceği, çalışan bir e-posta adresine ihtiyacınız olacaktır. Kesin olarak zorunlu olmasa da, mümkünse XOOPS'nizin çalıştığı alan adıyla eşleşen bir e-posta adresinin kullanılması önerilir. Bu, iletişimlerinizin reddedilmesini veya spam olarak işaretlenmesini önlemeye yardımcı olur.

## Araçlar

XOOPS kurulumunuzu ayarlamak ve özelleştirmek için bazı ek araçlara ihtiyacınız olabilir. Bunlar şunları içerebilir:

* FTP İstemci Yazılımı
* Metin Düzenleyici
* XOOPS sürümü (_.zip_ veya _.tar.gz_) dosyalarıyla çalışacak Arşiv Yazılımı.

Uygun araçlara ve gerekirse web sunucusu yığınlarına ilişkin bazı öneriler için [Ticaret Araçları](../tools/tools.md) bölümüne bakın.

## Özel Konular

Bazı özel sistem yazılımı kombinasyonlarının XOOPS ile çalışması için bazı ek yapılandırmalar gerekebilir. Bir SELinux ortamı kullanıyorsanız veya özel temalara sahip eski bir siteyi yükseltiyorsanız, daha fazla bilgi için lütfen [Özel Konular](specialtopics.md)'a bakın.