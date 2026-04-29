---
title: "XOOPS 2.7.0'daki Yenilikler"
---
XOOPS 2.7.0, 2.5.x serisinin önemli bir güncellemesidir. Yüklemeden veya yükseltmeden önce bu sayfadaki değişiklikleri inceleyin, böylece ne bekleyeceğinizi bilirsiniz. Aşağıdaki liste, kurulumu ve site yönetimini etkileyen öğelere odaklanmıştır; değişikliklerin tam listesi için dağıtımla birlikte gelen sürüm notlarına bakın.

## PHP 8,2 yeni minimumdur

XOOPS 2.7.0, **¤PH0000444¤ 8.2 veya daha yenisini** gerektirir. PHP 7.x ve önceki sürümler artık desteklenmemektedir. PHP 8.4 veya üzeri şiddetle tavsiye edilir.

**Eylem:** Başlamadan önce barındırıcınızın PHP 8.2+ teklifini doğrulayın. Bkz. [Gereksinimler](installation/requirements.md).

## MySQL 5,7 yeni minimumdur

Yeni minimum değer **MySQL 5,7**'dir (veya uyumlu bir MariaDB). MySQL 8.4 veya üzeri şiddetle tavsiye edilir. MySQL 9.0 da desteklenmektedir.

PHP/MySQL 8 uyumluluk sorunlarıyla ilgili eski uyarılar artık geçerli değil çünkü etkilenen PHP sürümleri artık XOOPS tarafından desteklenmiyor.

## Smarty 4, Smarty 3'ün yerine geçer

Bu, mevcut siteler için en büyük değişikliktir. XOOPS 2.7.0, template oluşturma motoru olarak **Smarty 4**'ü kullanır. Smarty 4, template sözdizimi konusunda Smarty 3'e göre daha katıdır ve bazı özel themes ve module şablonlarının doğru şekilde oluşturulmadan önce ayarlanması gerekebilir.

Bu sorunları belirlemenize ve onarmanıza yardımcı olmak için XOOPS 2.7.0, `upgrade/` dizininde mevcut şablonlarınızı bilinen Smarty 4 uyumsuzluklar açısından inceleyen ve çoğunu otomatik olarak onarabilen bir **ön kontrol tarayıcısı** gönderir.

**Eylem:** 2.5.x'ten yükseltme yapıyorsanız ve özel temalarınız veya daha eski modülleriniz varsa, ana yükselticiyi çalıştırmadan önce [Ön Kontrol Kontrolü](upgrading/upgrade/preflight.md) _before_ çalıştırın.

## Composer tarafından yönetilen bağımlılıklar

XOOPS 2.7.0, PHP bağımlılıklarını yönetmek için **Composer**'ı kullanır. Bunlar `xoops_lib/vendor/`'de yaşıyor. Daha önce çekirdeğe veya modüllere (PHPMailer, HTMLPurifier, Smarty ve diğerleri) paketlenen üçüncü taraf kitaplıklar artık Composer aracılığıyla sağlanıyor.

**Eylem:** Çoğu site operatörünün herhangi bir şey yapmasına gerek yoktur; önceden doldurulmuş `vendor/` ile gönderilen tarball'ları serbest bırakın. Bir siteyi taşıyorsanız veya yükseltiyorsanız, `vendor/` dahil `xoops_lib/` ağacının tamamını kopyalayın. Git deposunu klonlayan geliştiriciler `composer install`'yi `htdocs/xoops_lib/` içinde çalıştırmalıdır. Bkz. [Geliştiriciler için Notlar](notes-for-developers/developers.md).

## Yeni güçlendirilmiş oturum çerezi tercihleri

Yükseltme sırasında iki yeni tercih eklenir:

* **`session_cookie_samesite`** — oturum çerezlerindeki SameSite özelliğini kontrol eder (`Lax`, `Strict` veya `None`).
* **`session_cookie_secure`** — etkinleştirildiğinde, oturum çerezleri yalnızca HTTPS üzerinden gönderilir.

**Eylem:** Yükseltmeden sonra bunları Sistem Seçenekleri → Tercihler → Genel Ayarlar altında inceleyin. Bkz. [Yükseltme Sonrası](upgrading/upgrade/ustep-04.md).

## Yeni `tokens` tablosu

XOOPS 2.7.0, genel kapsamlı belirteç depolaması için bir `tokens` database tablosu ekler. Yükseltici bu tabloyu 2.5.11 → 2.7.0 yükseltmesinin bir parçası olarak otomatik olarak oluşturur.

## Modernize edilmiş şifre depolama

`bannerclient.passwd` sütunu, modern parola karmalarını (bcrypt, argon2) tutabilmesi için `VARCHAR(255)`'ye genişletildi. Yükseltici sütunu otomatik olarak genişletir.

## Güncellenmiş theme ve module dizisi

XOOPS 2.7.0, güncellenmiş ön uç temalarıyla birlikte gelir:

* `default`, `xbootstrap` (eski), `xbootstrap5`, `xswatch4`, `xswatch5`, `xtailwind`, `xtailwind2`

Mevcut Geçiş temasının yanı sıra yeni bir **Modern** yönetici teması eklenmiştir.Symfony VarDumper'ı temel alan yeni bir **DebugBar** modülü, isteğe bağlı kurulabilir modüllerden biri olarak gönderilir. Geliştirme ve aşamalandırma için kullanışlıdır ancak genellikle kamuya açık üretim sahalarına kurulmaz.

Bkz. [theme Seçin](installation/installation/step-12.md) ve [module Kurulumu](installation/installation/step-13.md).

## Yeni bir sürümde kopyalamak artık yapılandırmanın üzerine yazmıyor

Önceden, yeni bir XOOPS dağıtımını mevcut bir sitenin üzerine kopyalamak, `mainfile.php` ve diğer yapılandırma dosyalarının üzerine yazılmasını önlemek için dikkatli davranmayı gerektiriyordu. 2.7.0'da, kopyalama işlemi mevcut yapılandırma dosyalarını olduğu gibi bırakıyor, bu da yükseltmeleri gözle görülür derecede daha güvenli hale getiriyor.

Herhangi bir yükseltmeden önce yine de tam yedekleme yapmalısınız.

## Sistem yöneticisi temalarında template aşırı yükleme özelliği

XOOPS 2.7.0'daki yönetici temaları artık bireysel sistem yöneticisi şablonlarını geçersiz kılabilir, bu da tüm sistem modülünü çatallamadan yönetim user arayüzünü özelleştirmeyi kolaylaştırır.

## Ne değişmedi

Güvence sağlamak için, XOOPS'nin bu kısımları 2.7.0'da 2.5.x'te olduğu gibi çalışır:

* Yükleyici sayfa sırası ve genel akış
* `mainfile.php` artı `xoops_data/data/secure.php` yapılandırma bölünmesi
* `xoops_data` ve `xoops_lib`'nin web kökünün dışına taşınması için önerilen uygulama
* module kurulum modeli ve `xoops_version.php` manifest formatı
* Site taşıma iş akışı (yedekleme, `mainfile.php`/`secure.php`'yi düzenleyin, SRDB veya benzerini kullanın)

## Bundan sonra nereye gitmeli

* Yeni mi başlıyorsunuz? [Gereksinimler](installation/requirements.md) ile devam edin.
* 2.5.x'ten yükseltme mi yapıyorsunuz? [Yükseltme](upgrading/upgrade/README.md) ile başlayın, ardından [Ön Kontrol Kontrolünü](upgrading/upgrade/preflight.md) çalıştırın.