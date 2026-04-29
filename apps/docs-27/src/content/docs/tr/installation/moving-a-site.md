---
title: "Bir Siteyi Taşıma"
---
Yerel bir sistemde veya geliştirme sunucusunda yeni bir XOOPS sitesinin prototipini oluşturmak çok yararlı bir teknik olabilir. Ayrıca bir şeyler ters giderse diye, ilk önce üretim sitenizin bir kopyasında XOOPS yükseltmesini test etmek çok akıllıca olabilir. Bunları gerçekleştirmek için XOOPS sitenizi bir siteden diğerine taşıyabilmeniz gerekir. İşte XOOPS sitenizi başarıyla taşımak için bilmeniz gerekenler.

İlk adım yeni site ortamınızı oluşturmaktır. [Ön Hazırlıklar](../installation/preparations/) bölümünde anlatılanların aynıları burada da geçerlidir.

İncelemede bu adımlar şunlardır:

* herhangi bir alan adı veya e-posta gereksinimi dahil olmak üzere barındırma hizmeti edinin
* MySQL user hesabı ve şifresini edinin
* Yukarıdaki kullanıcının tüm ayrıcalıklara sahip olduğu bir MySQL database edinin

Sürecin geri kalanı normal kuruluma oldukça benzer, ancak:

* dosyaları XOOPS dağıtımından kopyalamak yerine mevcut siteden kopyalayacaksınız
* Yükleyiciyi çalıştırmak yerine önceden doldurulmuş bir veritabanını içe aktaracaksınız
* yükleyicide yanıtları girmek yerine dosyalarda ve veritabanında önceki yanıtları değiştireceksiniz

## Mevcut Site Dosyalarını Kopyalayın

Mevcut sitenizdeki dosyaların tam kopyasını, bunları düzenleyebileceğiniz yerel makinenize alın. Uzak bir ana bilgisayarla çalışıyorsanız dosyaları kopyalamak için FTP'yi kullanabilirsiniz. Site yerel makinenizde çalışıyor olsa bile çalışmak için bir kopyaya ihtiyacınız vardır; bu durumda sitenin dizinlerinin başka bir kopyasını almanız yeterlidir.

and/or yeniden adlandırılmış olsalar bile _xoops_data_ ve _xoops_lib_ dizinlerini eklemeyi unutmamak önemlidir.

İşleri daha sorunsuz hale getirmek için önbelleği ve Smarty derlenmiş template dosyalarını kopyanızdan kaldırmalısınız. Bu dosyalar yeni ortamınızda yeniden oluşturulacak ve silinmediği takdirde eski yanlış bilgilerin korunmasıyla ilgili sorunlara neden olabilir. Bunu yapmak için, bu dizinlerin üçünde de _index.html_ dışındaki tüm dosyaları silin:

* _xoops_data_/caches/smarty_cache
* _xoops_data_/caches/smarty_compile
* _xoops_data_/caches/xoops_cache

> **Not:** `smarty_compile`'nin temizlenmesi özellikle bir siteyi XOOPS 2.7.0'a veya bu sürümden taşırken önemlidir. XOOPS 2.7.0, Smarty 4 kullanır ve Smarty 4 derlenmiş template, Smarty 3 derlenmiş şablonla değiştirilemez. Eski derlenmiş dosyaları yerinde bırakmak, yeni sitede ilk sayfa yüklemesinde template hatalarına neden olur.

### `xoops_lib` ve Oluşturucu Bağımlılıkları

XOOPS 2.7.0, PHP bağımlılıklarını `xoops_lib/` içindeki Composer aracılığıyla yönetir. `xoops_lib/vendor/` dizini, XOOPS'nin çalışma zamanında ihtiyaç duyduğu üçüncü taraf kitaplıklarını içerir (Smarty 4, PHPMailer, HTMLPurifier, vb.). Bir siteyi taşırken, `xoops_lib/` ağacının tamamını — `vendor/` dahil — yeni ana bilgisayara kopyalamanız gerekir. `composer.json`'yi özelleştiren ve hedefte Composer'ın mevcut olduğu bir geliştirici değilseniz, hedef ana bilgisayarda `vendor/`'yi yeniden oluşturmaya çalışmayın.

## Yeni Ortamı Kurun

[Ön Hazırlıklar](../installation/preparations/) bölümünde anlatılanların aynıları burada da geçerlidir. Burada, taşıdığınız site için ihtiyaç duyacağınız barındırmanın mevcut olduğunu varsayacağız.

### Anahtar Bilgiler (mainfile.php ve secure.php)

Bir siteyi başarıyla taşımak, mutlak dosya ve yol adlarına, URLs'ye, database parametrelerine ve erişim kimlik bilgilerine yapılan tüm referansların değiştirilmesini içerir.Sitenizin web kökündeki `mainfile.php` ve sitenizin (yeniden adlandırıldı: PH000032¤ yeri değiştirildi) _xoops_data_ dizinindeki `data/secure.php` adlı iki dosya, sitenizin URL, ana dosya sisteminde nerede olduğu ve veritabanına nasıl bağlandığı gibi temel parametrelerini tanımlar.

Hem eski sistemdeki değerlerin ne olduğunu, hem de yeni sistemde ne olacağını bilmeniz gerekecek.

#### anadosya.php

| İsim | mainfile.php dosyasındaki Eski Değer | mainfile.php'de Yeni Değer |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH |  |  |
| XOOPS_PATH |  |  |
| XOOPS_VAR_PATH |  |  |
| XOOPS_URL |  |  |
| XOOPS_COOKIE_DOMAIN |  |  |

Editörünüzde _mainfile.php_ dosyasını açın. Yukarıdaki grafikte gösterilen tanımların değerlerini eski değerlerden yeni siteye uygun değerlere değiştirin.

Daha sonraki adımlarda başka yerlerde de benzer değişiklikler yapmamız gerekeceğinden eski ve yeni değerleri not edin.

Örnek olarak, bir siteyi yerel bilgisayarınızdan ticari bir barındırma hizmetine taşıyorsanız değerleriniz şöyle görünebilir:

| İsim | mainfile.php dosyasındaki Eski Değer | mainfile.php'de Yeni Değer |
| :--- | :--- | :--- |
| XOOPS_ROOT_PATH | c:/wamp/xoopscore27/htdocs | /home8/example/public_html |
| XOOPS_PATH | c:/wamp/xoopscore27/htdocs/xoops_lib | /home8/example/private/xoops_lib |
| XOOPS_VAR_PATH | c:/wamp/xoopscore27/htdocs/xoops_data | /home8/example/private/xoops_data |
| XOOPS_URL | http://localhost/xoops | https://example.com |
| XOOPS_COOKIE_DOMAIN | yerel ana bilgisayar | example.com |

_mainfile.php_ dosyasını değiştirdikten sonra kaydedin.

Diğer bazı dosyaların URL'nize ve hatta yollarınıza sabit kodlanmış referanslar içermesi mümkündür. Bu durum özelleştirilmiş temalarda ve menülerde daha olasıdır, ancak emin olmak için editörünüzle tüm dosyalar arasında arama yapabilirsiniz.

Düzenleyicinizde, kopyanızdaki dosyalarda eski XOOPS_URL değerini arayarak bir arama yapın ve bunu yeni değerle değiştirin.

Eski XOOPS_ROOT_PATH değeri için de aynısını yapın ve tüm oluşumları yeni değerle değiştirin.

Notlarınızı saklayın, çünkü daha sonra veritabanını taşırken bunları tekrar kullanmak zorunda kalacağız.

#### data/secure.php

| İsim | data/secure.php'deki Eski Değer | data/secure.php'da Yeni Değer |
| :--- | :--- | :--- |
| XOOPS_DB_HOST |  |  |
| XOOPS_DB_USER |  |  |
| XOOPS_DB_PASS |  |  |
| XOOPS_DB_NAME |  |  |

Editörünüzde yeniden adlandırılan and/or yeri değiştirilen _xoops_data_ dizinindeki _data/secure.php_ dosyasını açın. Yukarıdaki grafikte gösterilen tanımların değerlerini eski değerlerden yeni siteye uygun değerlere değiştirin.

#### Diğer Dosyalar

Siteniz taşındığında dikkat edilmesi gereken başka dosyalar da olabilir. Bazı yaygın örnekler, alan adına bağlı olabilecek çeşitli hizmetlere yönelik API anahtarlarıdır; örneğin:

* Google Haritalar
* Yeniden yakalama2
* Beğen butonları
* Bağlantı paylaşımı and/or Shareaholic veya AddThis gibi reklamlar

Eski alan adına yapılan bağlantılar genellikle hizmet tarafındaki kaydın bir parçası olduğundan, bu tür ilişkilendirmelerin değiştirilmesi kolaylıkla otomatikleştirilemez. Bazı durumlarda bu, hizmetle ilişkili alan adının eklenmesi veya değiştirilmesi anlamına gelebilir.

### Dosyaları Yeni Siteye Kopyalayın

Şimdi değiştirdiğiniz dosyalarınızı yeni sitenize kopyalayın. Teknikler, [Kurulum](../installation/installation/) sırasında, yani FTP kullanılarak kullanılanlarla aynıdır.

## Mevcut Site Veritabanını Kopyalayın

### Veritabanını Eski Sunucudan Yedekleyin

Bu adım için _phpMyAdmin_ kullanılması önemle tavsiye edilir. Mevcut siteniz için _phpMyAdmin_'de oturum açın, veritabanınızı seçin ve _Export_'u seçin.

Varsayılan ayarlar genellikle iyidir, bu nedenle _Quick_'in "Dışa aktarma yöntemi"ni ve _SQL_'nin "Format"ını seçmeniz yeterlidir.

database yedeğini indirmek için _Go_ düğmesini kullanın.

![Exporting a Database with phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)Veritabanınızda XOOPS veya modüllerine ait olmayan ve NOT'nin taşınması gereken tablolar varsa, _Custom_'un "Dışa aktarma yöntemini" seçip veritabanınızda yalnızca XOOPS ile ilgili tabloları seçmelisiniz. (Bunlar kurulum sırasında belirttiğiniz "önek" ile başlar. database önekinizi `xoops_data/data/secure.php` dosyasında arayabilirsiniz.)

### Veritabanını Yeni Sunucuya Geri Yükleme

Yeni ana makinenizde, yeni veritabanınızı kullanarak, _phpMyAdmin_'deki (veya gerekirse _bigdump_) _Import_ sekmesi gibi [tools](../tools/tools.md) kullanarak veritabanını geri yükleyin.

### URLs Güncellemesi ve Veritabanındaki Yollar

Veritabanınızdaki sitenizdeki kaynaklara yönelik tüm http bağlantılarını güncelleyin. Bu çok büyük bir çaba gerektirebilir ve bunu kolaylaştıracak bir [araç](../tools/tools.md) vardır.

Interconnect/it'nin bu konuda yardımcı olabilecek Search-Replace-DB adında bir ürünü var. Yerleşik Wordpress ve Drupal ortamlarının farkındalığıyla birlikte gelir. Bu araç bu haliyle çok yararlı olabilir, ancak XOOPS'nuzun farkında olduğunda daha da iyidir. XOOPS uyumlu sürümünü şu adreste bulabilirsiniz: [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb)

Bu yardımcı programı sitenize indirip geçici olarak yüklemek için README.md dosyasındaki talimatları izleyin. Daha önce XOOPS_URL tanımını değiştirmiştik. Bu aracı çalıştırdığınızda, orijinal XOOPS_URL tanımını yeni tanımla değiştirmek istiyorsunuz; yani [http://localhost/xoops](http://localhost/xoops) öğesini [https://example.com](https://example.com) ile değiştirin.

![Using Seach and Replace DB](/xoops-docs/2.7/img/installation/srdb-01.png)

Eski ve yeni URLs numaranızı girin ve prova seçeneğini seçin. Değişiklikleri gözden geçirin ve her şey yolunda görünüyorsa canlı çalıştırma seçeneğini tercih edin. Bu adım, içeriğinizdeki sitenize URL yönlendiren yapılandırma öğelerini ve bağlantıları yakalayacaktır.

![Reviewing Changes in SRDB](/xoops-docs/2.7/img/installation/srdb-02.png)

XOOPS_ROOT_PATH için eski ve yeni değerlerinizi kullanarak işlemi tekrarlayın.

#### SRDB Olmadan Alternatif Yaklaşım

Bu adımı srdb aracı olmadan gerçekleştirmenin başka bir yolu da veritabanınızın dökümünü yapmak, dökümü bir metin düzenleyicide düzenlemek, URLs ve yolları değiştirmek ve ardından veritabanını düzenlenmiş dökümünüzden yeniden yüklemek olacaktır. Evet, bu süreç yeterince kapsayıcıdır ve insanları Ara-Değiştir-DB gibi özel araçlar oluşturmaya motive edecek kadar risk taşır.

## Taşınan Sitenizi Deneyin

Bu noktada siteniz yeni ortamında yayına hazır olmalıdır!

Elbette her zaman sorunlar olabilir. Sorularınızı [xoops.org Forumlarına](https://xoops.org/modules/newbb/index.php) göndermekten çekinmeyin.