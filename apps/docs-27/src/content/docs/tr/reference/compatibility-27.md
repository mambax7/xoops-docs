---
title: "XOOPS 2.7.0 Bu Kılavuz İçin Uyumluluk İncelemesi"
---
Bu belge, Kurulum Kılavuzu'nun XOOPS 2.7.0 ile eşleşmesi için bu depoda gereken değişiklikleri listeler.

İnceleme temeli:

- Güncel rehber deposu: `L:\GitHub\XoopsDocs\xoops-installation-guide`
- XOOPS 2.7.0 çekirdeği şu adreste incelendi: `L:\GitHub\MAMBAX7\CORE\XoopsCore27`
- Birincil 2.7.0 kaynakları kontrol edildi:
  - `README.md`
  - `release_notes.txt`
  - `htdocs/install/language/english/welcome.php`
  - `htdocs/install/include/config.php`
  - `htdocs/install/include/page.php`
  - `htdocs/install/class/pathcontroller.php`
  - `htdocs/install/page_dbsettings.php`
  - `htdocs/install/page_configsave.php`
  - `htdocs/install/page_siteinit.php`
  - `htdocs/install/page_end.php`
  - `htdocs/mainfile.dist.php`
  - `upgrade/preflight.php`
  - `upgrade/README.md`
  - `upgrade/upd_2.5.11-to-2.7.0/index.php`

## Kapsam

Bu depo şu anda şunları içeriyor:

- Ana kılavuz olarak kullanılan kök düzeyinde İngilizce Markdown dosyaları.
- Kısmi bir `en/` kopyası.
- Kendi varlıkları olan tam `de/` ve `fr/` kitap ağaçları.

Kök düzeyindeki dosyaların ilk geçişe ihtiyacı vardır. Bundan sonra eşdeğer değişikliklerin `de/book/` ve `fr/book/`'ye yansıtılması gerekir. `en/` ağacının da temizlenmesi gerekiyor çünkü yalnızca kısmen korunuyor gibi görünüyor.

## 1. Küresel Depo Değişiklikleri

### 1.1 Sürüm oluşturma ve meta veriler

Kılavuz düzeyindeki tüm referansları XOOPS 2.5.x'ten XOOPS 2.7.0'a güncelleyin.

Etkilenen dosyalar:

- `README.md`
- `SUMMARY.md` — kök kılavuz için birincil canlı TOC; gezinme etiketleri ve bölüm başlıklarının yeni bölüm başlıklarıyla ve yeniden adlandırılan Geçmiş Yükseltme Notları bölümüyle eşleşmesi gerekir
- `en/README.md`
- `en/SUMMARY.md`
- `de/README.md`
- `de/SUMMARY.md`
- `fr/README.md`
- `fr/SUMMARY.md`
- `chapter-2-introduction.md`
- `about-xoops-cms.md`
- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`
- `appendix-5-increase-security-of-your-xoops-installation.md`
- yerelleştirilmiş `de/book/*.md` ve `fr/book/*.md`

Gerekli değişiklikler:

- `for XOOPS 2.5.7.x`'yi `for XOOPS 2.7.0` olarak değiştirin.
- Telif hakkı yılını `2018`'den `2026`'ye güncelleyin.
- Mevcut sürümü tanımladıkları eski XOOPS 2.5.x ve 2.6.0 referanslarını değiştirin.
- SourceForge dönemi indirme kılavuzunu GitHub Sürümleriyle değiştirin:
  - `https://github.com/XOOPS/XoopsCore27/releases`

### 1.2 Bağlantı yenileme

`about-xoops-cms.md` ve yerelleştirilmiş `10aboutxoops.md` dosyaları hâlâ eski 2.5.x ve 2.6.0 GitHub konumlarına işaret ediyor. Bu bağlantıların mevcut 2.7.x proje konumlarına güncellenmesi gerekiyor.

### 1.3 Ekran görüntüsü yenileme

Yükleyiciyi, yükseltme user arayüzünü, yönetici kontrol panelini, theme seçiciyi, module seçiciyi ve kurulum sonrası ekranları gösteren tüm ekran görüntüleri güncel değildir.

Etkilenen varlık ağaçları:

- `.gitbook/assets/`
- `en/assets/`
- `de/assets/`
- `fr/assets/`

Bu tam bir yenilemedir, kısmi bir yenileme değildir. 2.7.0 yükleyicisi farklı bir Bootstrap tabanlı düzen ve farklı bir görsel yapı kullanır.

## 2. Bölüm 2: Giriş

Dosya:

- `chapter-2-introduction.md`

### 2.1 Sistem gereksinimleri yeniden yazılmalıdır

Mevcut bölümde yalnızca Apache, MySQL ve PHP yazıyor. XOOPS 2.7.0'ın açık minimum değerleri vardır:

| Bileşen | minimum 2.7.0 | 2.7.0 önerisi |
| --- | --- | --- |
| PHP | 8.2.0 | 8.4+ |
| MySQL | 5.7.8 | 8.4+ |
| Web sunucusu | Destekleyen herhangi bir sunucu gereklidir PHP | Apache veya Nginx önerilir |

Eklenecek notlar:

- IIS hala yükleyicide mümkün olduğunca listeleniyor ancak önerilen örnekler Apache ve Nginx'tir.
- Sürüm notlarında ayrıca MySQL 9.0 uyumluluğu da belirtilmektedir.

### 2.2 Gerekli ve önerilen PHP uzantı kontrol listesini ekleyin

2.7.0 yükleyicisi artık zor gereksinimleri önerilen uzantılardan ayırıyor.

Kurulumcu tarafından gösterilen gerekli kontroller:

- MySQLi
- Oturum
- PCRE
- filtre
- `file_uploads`
- dosya bilgisi

Önerilen uzantılar:

- mbstring
- uluslararası
- iconv
-xml
-zlib
- tanrım
- exif
- kıvırmak

### 2.3 Sağlama toplamı talimatlarını kaldırın

Mevcut adım 5'te `checksum.php` ve `checksum.mdi` açıklanmaktadır. Bu dosyalar XOOPS 2.7.0'ın parçası değildir.

Eylem:

- Sağlama toplamı doğrulama bölümünü tamamen kaldırın.

### 2.4 Paketi güncelleyin ve talimatları yükleyin`docs/`, `extras/`, `htdocs/`, `upgrade/` paket düzeni açıklamasını koruyun, ancak yükleme ve hazırlık metnini mevcut yazılabilir yol beklentilerini yansıtacak şekilde güncelleyin:

- `mainfile.php`
- `uploads/`
- `uploads/avatars/`
- `uploads/files/`
- `uploads/images/`
- `uploads/ranks/`
- `uploads/smilies/`
- `xoops_data/caches/`
- `xoops_data/caches/xoops_cache/`
- `xoops_data/caches/smarty_cache/`
- `xoops_data/caches/smarty_compile/`
- `xoops_data/configs/`
- `xoops_data/configs/captcha/`
- `xoops_data/configs/textsanitizer/`
- `xoops_data/data/`
- `xoops_data/protector/`

Kılavuz şu anda bunu hafife alıyor.

### 2.5 SourceForge translation/download dilini değiştirin

Mevcut metin hala diğer dil paketleri için SourceForge'da XOOPS adresini ziyaret etmeniz gerektiğini söylüyor. Bunun mevcut project/community indirme kılavuzuyla değiştirilmesi gerekiyor.

## 3. Bölüm 3: Sunucu Yapılandırma Kontrolü

Dosya:

- `chapter-3-server-configuration-check.md`

Gerekli değişiklikler:

- Sayfa açıklamasını mevcut iki bloklu düzen etrafında yeniden yazın:
  - Gereksinimler
  - Önerilen uzantılar
- Eski ekran görüntüsünü değiştirin.
- Yukarıda listelenen gereksinim kontrollerini açıkça belgeleyin.

## 4. Bölüm 4: Doğru Yolu Seçin

Dosya:

- `chapter-4-take-the-right-path.md`

Gerekli değişiklikler:

- Yeni `Cookie Domain` alanını ekleyin.
- Yol alanlarının adlarını ve açıklamalarını 2.7.0 ile eşleşecek şekilde güncelleyin:
  - XOOPS Kök Yolu
  - XOOPS Veri Yolu
  - XOOPS Kütüphane Yolu
  - XOOPS URL
  - Çerez Alanı
- Kitaplık yolunu değiştirmenin artık `vendor/autoload.php` adresinde geçerli bir Composer otomatik yükleyicisi gerektirdiğini unutmayın.

Bu, 2.7.0'daki gerçek bir uyumluluk kontrolüdür ve açıkça belgelenmelidir. Mevcut kılavuzda Composer'dan hiç bahsedilmiyor.

## 5. Bölüm 5: database Bağlantıları

Dosya:

- `chapter-5-database-connections.md`

Gerekli değişiklikler:

- Yalnızca MySQL'nin desteklendiğine dair beyanı saklayın.
- database yapılandırması bölümünü aşağıdakileri yansıtacak şekilde güncelleyin:
  - varsayılan karakter kümesi artık `utf8mb4`'dir
  - karakter kümesi değiştiğinde harmanlama seçimi dinamik olarak güncellenir
- Hem database bağlantısı hem de yapılandırma sayfaları için ekran görüntülerini değiştirin.

Karakter kümesi ve harmanlamanın dikkate alınmasına gerek olmadığını söyleyen mevcut metin 2.7.0 için çok zayıf. En azından yeni `utf8mb4` varsayılanından ve dinamik harmanlama seçiciden bahsetmelidir.

## 6. Bölüm 6: Son Sistem Yapılandırması

Dosya:

- `chapter-6-final-system-configuration.md`

### 6.1 Oluşturulan konfigürasyon dosyaları değiştirildi

Kılavuz şu anda yükleyicinin `mainfile.php` ve `secure.php` yazdığını söylüyor.

2.7.0'da ayrıca aşağıdakiler de dahil olmak üzere yapılandırma dosyalarını `xoops_data/configs/`'ye yükler:

- `xoopsconfig.php`
- captcha yapılandırma dosyaları
- textsanitizer yapılandırma dosyaları

### 6.2 `xoops_data/configs/`'deki mevcut yapılandırma dosyalarının üzerine yazılmaz

Üzerine yazmama davranışı genel değil, **kapsamlıdır**. `page_configsave.php` yazma yapılandırma dosyalarında iki farklı kod yolu:

- `writeConfigurationFile()` (59. ve 66. satırlarda çağrılır) **her zaman** sihirbaz girişinden `xoops_data/data/secure.php` ve `mainfile.php`'yi yeniden oluşturur. Varlık kontrolü yoktur; mevcut bir kopya değiştirilir.
- `copyConfigDistFiles()` (62. satırda çağrılır, 317. satırda tanımlanır) yalnızca `xoops_data/configs/` dosyalarını (`xoopsconfig.php`, captcha yapılandırmaları, textsanitizer yapılandırmaları) kopyalar **hedef zaten mevcut değilse**.

Bölümün yeniden yazılması her iki davranışı da açıkça yansıtmalıdır:

- `mainfile.php` ve `secure.php` için: yükleyici yeniden çalıştırıldığında bu dosyalar üzerinde yapılan elle yapılan düzenlemelerin üzerine yazılacağı konusunda uyarıda bulunun.
- `xoops_data/configs/` dosyaları için: yerel özelleştirmelerin yeniden çalıştırmalarda ve yükseltmelerde korunduğunu ve gönderilen varsayılanların geri yüklenmesinin, dosyanın silinmesini ve yeniden çalıştırılmasını (veya karşılık gelen `.dist.php`'nin elle kopyalanmasını) gerektirdiğini açıklayın.

Yükleyici tarafından yazılan tüm yapılandırma dosyalarında "mevcut dosyalar korunur" ifadesini genelleştirmeyin; bu yanlıştır ve yöneticilerin `mainfile.php` veya `secure.php` düzenlemelerini yanıltmasına neden olur.### 6.3 HTTPS ve ters proxy kullanımı değiştirildi

Oluşturulan `mainfile.php` artık ters proxy başlıkları da dahil olmak üzere daha geniş protokol algılamayı destekliyor. Kılavuz yalnızca doğrudan `http` veya `https` tespitini ima etmek yerine bunu belirtmelidir.

### 6.4 Tablo sayımı yanlış

Mevcut bölümde yeni bir sitenin `32` tabloları oluşturduğu belirtiliyor.

XOOPS 2.7.0, `33` tablolarını oluşturur. Eksik tablo şu:

- `tokens`

Eylem:

- Sayıyı 32'den 33'e güncelleyin.
- Tablo listesine `tokens` ekleyin.

## 7. Bölüm 7: Yönetim Ayarları

Dosya:

- `chapter-7-administration-settings.md`

### 7.1 Şifre user arayüzü açıklaması güncel değil

Yükleyici hâlâ parola oluşturmayı içeriyor ancak artık şunları da içeriyor:

- zxcvbn tabanlı şifre gücü ölçer
- görsel güç etiketleri
- 16 karakter oluşturucu ve kopyalama akışı

Mevcut şifre panelini açıklamak için metni ve ekran görüntülerini güncelleyin.

### 7.2 E-posta doğrulaması artık zorunlu

Yönetici e-postası `FILTER_VALIDATE_EMAIL` ile doğrulanır. Bu bölümde geçersiz e-posta değerlerinin reddedildiğinden bahsedilmelidir.

### 7.3 Lisans anahtarı bölümü yanlış

Bu en önemli gerçek düzeltmelerden biridir.

Güncel rehber diyor ki:

- bir `License System Key` var
- `/include/license.php`'de saklanır
- `/include/license.php` kurulum sırasında yazılabilir olmalıdır

Bu artık doğru değil.

2.7.0'ın gerçekte yaptığı şey:

- kurulum lisans verilerini `xoops_data/data/license.php`'ye yazar
- `htdocs/include/license.php` artık dosyayı `XOOPS_VAR_PATH` adresinden yükleyen, kullanımdan kaldırılmış bir sarmalayıcıdır
- `/include/license.php`'nin yazılabilir hale getirilmesine ilişkin eski ifadeler kaldırılmalıdır

Eylem:

- Bu bölümü silmek yerine yeniden yazın.
- Yolu `/include/license.php`'den `xoops_data/data/license.php`'ye güncelleyin.

### 7.4 theme listesi güncel değil

Mevcut kılavuz hala Zetagenesis'e ve daha eski 2.5 dönem theme setine atıfta bulunuyor.

XOOPS 2.7.0'da bulunan themes:

- `default`
- `xbootstrap`
- `xbootstrap5`
- `xswatch4`
- `xswatch5`
- `xtailwind`
- `xtailwind2`

Ayrıca şunu da unutmayın:

- `xswatch4`, yükleyici verileri tarafından eklenen mevcut varsayılan temadır.
- Zetagenesis artık paketlenmiş theme listesinin bir parçası değil.

### 7.5 module listesi güncel değil

2.7.0 paketinde bulunan modules:

- `system` — tablo doldurma / veri ekleme adımları sırasında otomatik olarak yüklenir. Her zaman mevcuttur, seçicide asla görünmez.
- `debugbar` — kurulum adımında seçilebilir.
- `pm` — kurulum adımında seçilebilir.
- `profile` — kurulum adımında seçilebilir.
- `protector` — kurulum adımında seçilebilir.

Önemli: module yükleyici sayfası (`htdocs/install/page_moduleinstaller.php`) aday listesini `XoopsLists::getModulesList()` üzerinde yineleyerek ve **modules tablosunda zaten bulunan her şeyi filtreleyerek** oluşturur (95-102. satırlar `$listed_mods`'yi toplar; 116. satır bu listede bulunan herhangi bir dizini atlar). `system` bu adım çalıştırılmadan önce yüklendiğinden hiçbir zaman onay kutusu olarak görünmez.

Gerekli kılavuz değişiklikleri:

- Yalnızca üç paket module olduğunu söylemeyi bırakın.
- Kurulum adımını beş değil, **dört seçilebilir modülü** (`debugbar`, `pm`, `profile`, `protector`) gösterecek şekilde tanımlayın.
- Seçicide görünmeyen, her zaman kurulu Core module olarak `system`'yi ayrı olarak belgeleyin.
- 2.7.0'da yeni olarak paket module açıklamasına `debugbar`'yi ekleyin.
- Yükleyicinin varsayılan module ön seçiminin artık boş olduğunu unutmayın; modules seçilebilir ancak yükleyici yapılandırması tarafından önceden kontrol edilmez.

## 8. Bölüm 8: Başlamaya Hazır

Dosya:

- `chapter-8-ready-to-go.md`

### 8.1 Kurulum temizleme işleminin yeniden yazılması gerekiyor

Mevcut kılavuz, yükleyicinin yükleme klasörünü benzersiz bir adla yeniden adlandırdığını söylüyor.

Bu hala geçerli, ancak mekanizma değişti:- web kökünde harici bir temizleme komut dosyası oluşturulur
- son sayfa AJAX aracılığıyla temizliği tetikler
- kurulum klasörü `install_remove_<unique suffix>` olarak yeniden adlandırıldı
- `cleanup.php`'ye geri dönüş hâlâ mevcut

Eylem:

- Açıklamayı güncelleyin.
- Kullanıcıya yönelik talimatları basit tutun: kurulumdan sonra yeniden adlandırılan kurulum dizinini silin.

### 8.2 Yönetici kontrol paneli ek referansları artık kullanılmıyor

Bölüm 8, okuyucuları hâlâ eski Oksijen dönemi yönetici deneyimine yönlendiriyor. Bunun mevcut yönetici temalarıyla uyumlu olması gerekiyor:

- `default`
- `dark`
- `modern`
- `transition`

### 8.3 Kurulum sonrası yol düzenleme kılavuzunun düzeltilmesi gerekiyor

Mevcut metin okuyuculara `secure.php`'yi yol tanımlarıyla güncellemelerini söyler. 2.7.0'da bu yol sabitleri `mainfile.php`'de tanımlanırken, `secure.php` güvenli verileri tutar. Bu bölümdeki örnek blok buna göre düzeltilmelidir.

### 8.4 Üretim ayarları eklenmeli

Kılavuz şu anda `mainfile.dist.php`'de mevcut olan üretim varsayılanlarını açıkça belirtmelidir:

- `XOOPS_DB_LEGACY_LOG` `false` olarak kalmalı
- `XOOPS_DEBUG` `false` olarak kalmalı

## 9. Bölüm 9: Mevcut XOOPS Kurulumunu Yükseltme

Dosya:

- `chapter-9-upgrade-existing-xoops-installation.md`

Bu bölüm en büyük yeniden yazmayı gerektiriyor.

### 9.1 Zorunlu ekleme Smarty 4 ön kontrol adımı

XOOPS 2.7.0 yükseltme akışı artık yükseltme tamamlanmadan önce ön kontrol sürecini zorluyor.

Yeni gerekli akış:

1. `upgrade/` dizinini site köküne kopyalayın.
2. `/upgrade/preflight.php` komutunu çalıştırın.
3. Eski Smarty söz dizimi için `/themes/` ve `/modules/`'yi tarayın.
4. Uygun olduğu yerde isteğe bağlı onarım modunu kullanın.
5. Temizlenene kadar yeniden çalıştırın.
6. `/upgrade/` ile devam edin.

Mevcut bölümde bundan hiç bahsedilmiyor, bu da onu 2.7.0 kılavuzuyla uyumsuz kılıyor.

### 9.2 Manuel 2.5.2 dönemi birleştirme anlatımını değiştirin

Mevcut bölümde hala çerçeve birleştirmeleri, AltSys notları ve elle yönetilen dosya yeniden yapılandırmasıyla manuel 2.5.2 tarzı yükseltme anlatılmaktadır. Bunun, `release_notes.txt` ve `upgrade/README.md`'den gerçek 2.7.x yükseltme sırası ile değiştirilmesi gerekir.

Önerilen bölüm özeti:

1. Dosyaları ve veritabanını yedekleyin.
2. Siteyi kapatın.
3. `htdocs/`'yi canlı kök üzerine kopyalayın.
4. `htdocs/xoops_lib`'yi aktif kütüphane yoluna kopyalayın.
5. `htdocs/xoops_data`'yi etkin veri yoluna kopyalayın.
6. `upgrade/`'yi web köküne kopyalayın.
7. `preflight.php` komutunu çalıştırın.
8. `/upgrade/` komutunu çalıştırın.
9. Güncelleyici istemlerini tamamlayın.
10. `system` modülünü güncelleyin.
11. Yüklüyse `pm`, `profile` ve `protector`'yi güncelleyin.
12. `upgrade/`'yi silin.
13. Siteyi tekrar açın.

### 9.3 Gerçek 2.7.0 yükseltme değişikliklerini belgeleyin

2.7.0 güncelleyicisi en azından şu somut değişiklikleri içeriyor:

- `tokens` tablosunu oluştur
- modern şifre karmaları için `bannerclient.passwd`'yi genişletin
- oturum çerez tercihi ayarlarını ekleyin
- eski paketlenmiş dizinleri kaldırın

Kılavuzun her uygulama ayrıntısını açıklamasına gerek yoktur, ancak yükseltmenin yalnızca bir dosya kopyası artı module güncellemesi olduğunu ima etmekten vazgeçmelidir.

## 10. Tarihsel Yükseltme Sayfaları

Dosyalar:

- `upgrading-from-xoops-2.4.5-easy-way.md`
- `upgrading-from-xoops-2.0.-above-2.0.14-and-2.2..md`
- `upgrading-from-any-xoops-2.0.7-to-2.0.13.2.md`
- `upgrading-a-non-utf-8-site.md`
- `upgrading-xoopseditor-package.md`

**Durum:** yapısal karar zaten çözümlenmiştir — `SUMMARY.md` kökü bunları özel bir **Geçmişsel Yükseltme Notları** bölümüne taşır ve her dosya, okuyucuları 2.7.0 yükseltmeleri için Bölüm 9'a yönlendiren bir "Geçmişsel referans" açıklama metni taşır. Artık birinci sınıf yükseltme rehberliği değiller.

**Kalan çalışma (yalnızca tutarlılık):**- `README.md` (kök) öğesinin bunları genel bir "Yükseltmeler" başlığı altında değil, aynı "Geçmişsel Yükseltme Notları" başlığı altında listelediğinden emin olun.
- Aynı ayrımı `de/README.md`, `de/SUMMARY.md`, `fr/README.md`, `fr/SUMMARY.md` ve `en/SUMMARY.md`'ye yansıtın.
- Her bir geçmiş yükseltme sayfasının (kök ve yerelleştirilmiş `de/book/upg*.md` / `fr/book/upg*.md` kopyaları) Bölüm 9'a bağlantı veren eski bir içerik bilgisi taşıdığından emin olun.

## 11. Ek 1: Yönetici GUI

Dosya:

- `appendix-1-working-with-the-new-admin-gui-our-dashboard.md`

Bu ek, Oxygen admin GUI'ye bağlıdır ve yeniden yazılması gerekmektedir.

Gerekli değişiklikler:

- tüm Oksijen referanslarını değiştirin
- eski icon/menu ekran görüntülerini değiştirin
- mevcut yönetici temalarını belgeleyin:
  - varsayılan
  - karanlık
  - modern
  - geçiş
- sürüm notlarında belirtilen mevcut 2.7.0 yönetici özelliklerinden bahsedin:
  - sistem yöneticisi temalarında template aşırı yükleme özelliği
  - güncellenmiş yönetici theme seti

## 12. Ek 2: XOOPS yükleniyor FTP aracılığıyla

Dosya:

- `appendix-2-uploading-xoops-via-ftp.md`

Gerekli değişiklikler:

- HostGator'a özgü ve cPanel'e özgü varsayımları kaldırın
- dosya yükleme ifadesini modernleştirin
- `xoops_lib`'nin artık Composer bağımlılıklarını içerdiğini, dolayısıyla yüklemelerin daha büyük olduğunu ve seçici olarak kesilmemesi gerektiğini unutmayın

## 13. Ek 5: Güvenlik

Dosya:

- `appendix-5-increase-security-of-your-xoops-installation.md`

Gerekli değişiklikler:

- `register_globals` tartışmasını tamamen kaldırın
- güncel olmayan sunucu bileti dilini kaldırın
- salt okunur olması amaçlanan `404` ile `0444` arasındaki izin metnini düzeltin
- `mainfile.php` ve `secure.php` tartışmasını 2.7.0 düzeniyle eşleşecek şekilde güncelleyin
- yeni çerez alanı güvenliğiyle ilgili sabit bağlamı ekleyin:
  - `XOOPS_COOKIE_DOMAIN_USE_PSL`
  - `XOOPS_COOKIE_DOMAIN`
- aşağıdakiler için üretim kılavuzu ekleyin:
  - `XOOPS_DB_LEGACY_LOG`
  - `XOOPS_DEBUG`

## 14. Diller Arası Bakım Etkisi

Kök düzeyindeki İngilizce dosyalar düzeltildikten sonra aşağıdakilerde eşdeğer güncellemeler gerekir:

- `de/book/`
- `fr/book/`
- `de/README.md`
- `fr/README.md`
- `de/SUMMARY.md`
- `fr/SUMMARY.md`

`en/` ağacının da incelenmesi gerekiyor çünkü ayrı bir README ve varlık seti içeriyor, ancak yalnızca kısmi bir ¤PH000208 ağacı var gibi görünüyor.

## 15. Öncelik Sırası

### Yayınlanmadan önce kritik

1. repo/version referanslarını 2.7.0'a güncelleyin.
2. Bölüm 9'u gerçek 2.7.0 yükseltme akışı ve Smarty 4 ön kontrolü etrafında yeniden yazın.
3. Sistem gereksinimlerini PHP 8.2+ ve MySQL 5.7.8+ olarak güncelleyin.
4. Bölüm 7 lisans anahtarı dosya yolunu düzeltin.
5. theme ve module envanterlerini düzeltin.
6. Bölüm 6'daki tablo sayısını 32'den 33'e düzeltin.

### Doğruluk açısından önemli

7. Yazılabilir yol kılavuzunu yeniden yazın.
8. Yol kurulumuna Composer otomatik yükleyici gereksinimini ekleyin.
9. database karakter kümesi kılavuzunu `utf8mb4` olarak güncelleyin.
10. Sabitlerin doğru dosyada belgelenmesi için Bölüm 8'deki yol düzenleme kılavuzunu düzeltin.
11. Sağlama toplamı talimatlarını kaldırın.
12. `register_globals` ve diğer ölü PHP kılavuzunu kaldırın.

### Yayın kalitesinde temizleme

13. Tüm yükleyici ve yönetici ekran görüntülerini değiştirin.
14. Geçmiş yükseltme sayfalarını ana akışın dışına taşıyın.
15. İngilizce düzeltildikten sonra Almanca ve Fransızca kopyaları senkronize edin.
16. Eski bağlantıları ve kopyalanan README satırlarını temizleyin.