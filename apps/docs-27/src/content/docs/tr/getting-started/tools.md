---
title: "Ticaret Araçları"
---
XOOPS web sitesini özelleştirmek ve sürdürmek için XOOPS dışında yapılması gereken veya orada daha kolay yapılması gereken birçok şey vardır.

Bu, XOOPS web yöneticilerinin yararlı bulduğu belirli araçlara yönelik bazı önerilerin yanı sıra, mevcut olmasını isteyebileceğiniz araç türlerinin bir listesidir.

## Editörler

Editörler oldukça kişisel bir seçimdir ve insanlar en sevdikleri konu hakkında oldukça tutkulu olabilirler. Pek çok olasılıktan sadece birkaçını sunacağız.

XOOPS kullanımı için, bazı yapılandırma seçeneklerini ayarlayacak ve siteniz için bir temayı özelleştirecek bir düzenleyiciye ihtiyacınız olacaktır. Bu kullanımlar için, aynı anda birden fazla dosyayla çalışabilen, birçok dosyada arama yapabilen ve değiştirebilen ve sözdizimi vurgulaması sağlayabilen bir düzenleyiciye sahip olmak çok yararlı olabilir. Çok basit, gösterişten uzak bir düzenleyici kullanabilirsiniz, ancak bazı görevleri yerine getirmek için çok daha fazla çalışacaksınız.

_JetBrains_'den **PhpStorm**, PHP web geliştirme için özel olarak tasarlanmış bir IDE'dir (entegre geliştirme ortamı). _JetBrains_, XOOPS'ye sponsorluk konusunda çok yardımcı oldu ve ürünleri birçok geliştiricinin favorisi. Ticari bir üründür ve bazı yeni web yöneticileri için maliyet engelleyici olabilir, ancak zamandan tasarruf sağlaması onu deneyimli geliştiriciler için çekici kılmaktadır.

**Visual Studio Code**, Microsoft'un ücretsiz, çok platformlu bir kaynak kodu düzenleyicisidir. HTML, JavaScript ve PHP gibi temel web teknolojilerini yerleşik olarak veya uzantılar aracılığıyla destekler; bu da onu XOOPS kullanımına çok uygun hale getirir.

**Notepad++** Windows için bu kategoride sadık kullanıcılara sahip, ücretsiz, zaman ödüllü bir yarışmacıdır.

**Meld** bir düzenleyici değildir ancak farklılıklar gösteren metin dosyalarını karşılaştırır ve değişiklikleri seçici olarak birleştirmeye ve küçük düzenlemeler yapmaya olanak tanır. Yapılandırma dosyalarını, theme şablonlarını ve elbette PHP kodunu karşılaştırırken çok faydalıdır.

| İsim | Bağlantı | Lisans | Platformu |
| :--- | :--- | :--- | :--- |
| PhpStorm | [https://www.jetbrains.com/phpstorm/](https://www.jetbrains.com/phpstorm/) | Ticari | Herhangi biri |
| Visual Studio Kodu | [https://code.visualstudio.com/](https://code.visualstudio.com/) | MIT | Herhangi biri |
| Not Defteri++ | [https://notepad-plus-plus.org/](https://notepad-plus-plus.org/) | GPL | Kazan |
| Birleştirme | [https://meldmerge.org/](https://meldmerge.org/) | GPL | Herhangi biri |

## FTP İstemci

Dosya Aktarım Protokolü (FTP,) veya bunun bir çeşidi, dosyaları bir bilgisayardan diğerine taşımak için kullanılır. Çoğu XOOPS kurulumunda, XOOPS dağıtımından gelen dosyaları sitenin dağıtılacağı ana bilgisayar sistemine taşımak için bir FTP istemcisine ihtiyaç vardır.

**FileZilla** çoğu platformda kullanılabilen ücretsiz ve güçlü bir FTP İstemcisidir. Platformlar arası tutarlılık, bu kitaptaki FTP örneklerinin tercih edilmesini sağladı.

**PuTTY** ücretsiz bir SSH istemcisidir; bir sunucuya Shell erişimi için kullanışlıdır ve SCP ile dosya aktarım yetenekleri sağlar.

**WinSCP**, Windows sistemleri için bir FTP/SFTP/SCP istemcisidir.

| İsim | Bağlantı | Lisans | Platformu |
| :--- | :--- | :--- | :--- |
| FileZilla | [https://filezilla-project.org/](https://filezilla-project.org/) | GPL | Herhangi biri |
| PuTTY | [https://www.chiark.greenend.org.uk/~sgtatham/putty/](https://www.chiark.greenend.org.uk/~sgtatham/putty/) | BSD | Kazan/*nix |
| WinSCP | [https://winscp.net/eng/index.php](https://winscp.net/eng/index.php) | GPL | Windows |

## MySQL/MariaDB

database sitenizin tüm içeriğini, sitenizi özelleştiren yapılandırmaları, sitenizin kullanıcıları hakkındaki bilgileri ve daha fazlasını içerir. Bu bilgilerin korunması ve sürdürülmesi, özellikle veritabanıyla ilgilenen bazı ekstra araçlarla daha kolay olabilir.**phpMyAdmin**, tek seferlik yedeklemeler yapmak da dahil olmak üzere MySQL veritabanlarıyla çalışmak için kullanılan en popüler web tabanlı araçtır.

**BigDump** sınırlı barındırma hesapları için bir lütuftur; zaman aşımı ve boyut kısıtlamalarından kaçınarak büyük database yedekleme dökümlerinin geri yüklenmesine yardımcı olur.

**srdb**, XOOPS için Arama Değiştirme DB'si, interconnect/it.'den [Arama ve Değiştirme DB'si](https://github.com/interconnectit/Search-Replace-DB)'nin XOOPS uyarlamasıdır. Bir siteyi taşırken MySQL verilerindeki URLs ve dosya sistemi referanslarını değiştirmek özellikle yararlıdır.

| İsim | Bağlantı | Lisans | Platformu |
| :--- | :--- | :--- | :--- |
| phpMyAdmin | [https://www.phpmyadmin.net/](https://www.phpmyadmin.net/) | GPL | Herhangi biri |
| Büyük Döküm | [http://www.ozerov.de/bigdump/](http://www.ozerov.de/bigdump/) | GPL | Herhangi biri |
| srdb | [https://github.com/geekwright/srdb](https://github.com/geekwright/srdb) | GPL3 | Herhangi biri |

## Geliştirici Yığınları

Ubuntu gibi bazı platformlarda XOOPS'yi çalıştırmak için gereken tüm yığın yerleşik olarak bulunurken, diğerlerinin bazı eklemelere ihtiyacı vardır.

**WAMP** ve **Uniform Server Zero**, Windows için hepsi bir arada yığınlardır.

**XAMPP**, Apache Friends'in hepsi bir arada yığını, birden fazla platform için mevcuttur.

**bitnami**, sanal makine ve konteyner görüntüleri de dahil olmak üzere çok çeşitli önceden oluşturulmuş uygulama yığınları sunar. Teklifleri, uygulamaları (XOOPS dahil) veya çeşitli web teknolojilerini hızlı bir şekilde denemek için değerli bir kaynak olabilir. Üretime uygun olabileceği gibi geliştirme amaçlı kullanıma da uygun olabilirler.

**Docker**, özel ortamları uygulamak amacıyla kapsayıcılar oluşturmak ve çalıştırmak için kullanılan bir uygulama kapsayıcı platformudur. 

**Devilbox** kolayca yapılandırılabilen Docker tabanlı bir geliştirme yığınıdır. Tüm yığın bileşenleri için geniş bir sürüm yelpazesi sunar ve geliştiricilerin tekrarlanabilir ve paylaşılabilir bir ortamda test yapmasına olanak tanır. 

| İsim | Bağlantı | Lisans | Platformu |
| :--- | :--- | :--- | :--- |
| WAMP | [http://www.wampserver.com/](http://www.wampserver.com/) | Çoklu | Kazan |
| Tekdüzen Sunucu Sıfır | [http://www.uniformserver.com/](http://www.uniformserver.com/) | Çoklu | Kazan |
| XAMPP | [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html) | Çoklu | Herhangi biri |
| bitnami | [https://bitnami.com/](https://bitnami.com/) | Çoklu | Herhangi biri |
| Docker | [https://www.docker.com/](https://www.docker.com/) | Çoklu | Herhangi biri |
| Şeytan Kutusu | [http://devilbox.org/](http://devilbox.org/) | MIT | Herhangi biri |