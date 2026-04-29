---
title: "Yapılandırmayı Kaydet"
---
Bu sayfada, bu noktaya kadar girdiğiniz konfigürasyon bilgilerinin kaydedilmesinin sonuçları görüntülenir.

Sorunları inceleyip düzelttikten sonra devam etmek için "Devam Et" düğmesini seçin.

## Başarı Üzerine

_Sistem yapılandırmanızı kaydetme_ bölümü kaydedilen bilgileri gösterir. Ayarlar iki dosyadan birine kaydedilir. Web kökündeki dosyalardan biri _mainfile.php_'dir. Diğeri ise _xoops_data_ dizinindeki _data/secure.php_'dir.

![XOOPS Installer Save Configuration](/xoops-docs/2.7/img/installation/installer-07.png)

Her iki dosya da XOOPS 2.7.0 ile birlikte gönderilen template dosyalarından oluşturulmuştur:

* `mainfile.php` web kökündeki `mainfile.dist.php`'den oluşturulur.
* `xoops_data/data/secure.php`, `xoops_data/data/secure.dist.php`'den üretilmiştir.

Girdiğiniz yollara ve URL'ya ek olarak, `mainfile.php` artık XOOPS 2.7.0'da yeni olan birkaç sabit içerir:

* `XOOPS_TRUST_PATH` — `XOOPS_PATH`'nin geriye dönük uyumlu takma adı olarak tutulur; ayrı olarak yapılandırmanıza gerek yoktur.
* `XOOPS_COOKIE_DOMAIN_USE_PSL` — varsayılan olarak `true`'dir; doğru çerez alanını türetmek için Genel Son Ek Listesini kullanır.
* `XOOPS_DB_LEGACY_LOG` — varsayılan olarak `false`'dir; Eski database APIs'nin kullanımını günlüğe kaydetmek için geliştirme aşamasında `true` olarak ayarlandı.
* `XOOPS_DEBUG` — varsayılan olarak `false`'dir; Ek hata raporlamayı etkinleştirmek için geliştirme aşamasında `true` olarak ayarlandı.

Bunları kurulum sırasında elle düzenlemenize gerek yoktur; varsayılanlar üretim tesisi için uygundur. Daha sonra `mainfile.php`'yi açarsanız nelere dikkat etmeniz gerektiğini bilmeniz için burada bunlardan bahsediliyor.

## Hatalar

XOOPS, yapılandırma dosyalarını yazarken hata tespit ederse, neyin yanlış olduğunu ayrıntılarıyla anlatan mesajlar görüntüler.

![XOOPS Installer Save Configuration Errors](/xoops-docs/2.7/img/installation/installer-07-errors.png)

Çoğu durumda, hataların kaynağı, Debian'dan türetilmiş bir sistemin Apache'de mod_php kullanılarak varsayılan kurulumudur. Çoğu barındırma sağlayıcısının bu sorunları olmayan yapılandırmaları vardır.

### Grup izin sorunları

PHP işlemi bazı kullanıcıların izinleri kullanılarak çalıştırılır. Dosyalar ayrıca bazı kullanıcılara aittir. Bu ikisi aynı user değilse, PHP işleminin user hesabınızla dosya paylaşmasına izin vermek için grup izinleri kullanılabilir. Bu genellikle XOOPS'ün yazması gereken dosya ve dizin grubunu değiştirmeniz gerektiği anlamına gelir.

Yukarıda belirtilen varsayılan yapılandırma için bu, dosyalar ve dizinler için grup olarak _www-data_ grubunun belirtilmesi gerektiği ve bu dosya ve dizinlerin gruba göre yazılabilir olması gerektiği anlamına gelir.

Yapılandırmanızı dikkatlice gözden geçirmeli ve açık internette bulunan bir kutu için bu sorunları nasıl çözeceğinizi dikkatlice seçmelisiniz.

Örnek komutlar şunlar olabilir:
```text
chgrp -R www-data xoops_data
chmod -R g+w xoops_data
chgrp -R www-data uploads
chmod -R g+w uploads
```
### Mainfile.php oluşturulamıyor

Unix benzeri sistemlerde yeni bir dosya oluşturma izni, üst klasörde verilen izinlere bağlıdır. Bazı durumlarda bu izin mevcut değildir ve bu iznin verilmesi güvenlik açısından endişe verici olabilir.

Yapılandırmada sorun yaşıyorsanız, XOOPS dağıtımındaki _extras_ dizininde sahte bir _mainfile.php_ bulabilirsiniz. Bu dosyayı web köküne kopyalayın ve dosyadaki izinleri ayarlayın:
```text
chgrp www-data mainfile.php
chmod g+w mainfile.php
```
### SELinux Ortamları

SELinux güvenlik bağlamları sorunların kaynağı olabilir. Bu geçerliyse daha fazla bilgi için lütfen [Özel Konular](../specialtopics.md)'a bakın.