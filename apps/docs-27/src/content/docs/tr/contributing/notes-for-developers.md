---
title: "Geliştiriciler için Notlar"
---
XOOPS'nun geliştirme amaçlı kullanıma yönelik gerçek kurulumu daha önce açıklanan normal kuruluma benzer olsa da, geliştiriciye hazır bir sistem oluştururken önemli farklılıklar vardır.

Geliştirici kurulumundaki büyük bir fark, geliştirici kurulumunun yalnızca _htdocs_ dizininin içeriğine odaklanmak yerine tüm dosyaları tutması ve git'i kullanarak bunları kaynak kodu kontrolü altında tutmasıdır.

Diğer bir fark ise, geliştirme sisteminize açık internet üzerinden (yani, bir yönlendiricinin arkasında olduğu gibi özel bir ağ üzerinden) doğrudan erişilemediği sürece, _xoops_data_ ve _xoops_lib_ dizinlerinin genellikle yeniden adlandırılmadan yerinde kalabilmesidir.

Çoğu geliştirici, kaynak koduna, bir web sunucusu yığınına ve kod ve veritabanıyla çalışmak için gereken tüm araçlara sahip olan bir _localhost_ sistemi üzerinde çalışır.

Daha fazla bilgiyi [Ticaret Araçları](../tools/tools.md) bölümünde bulabilirsiniz.

## Git ve Sanal Konaklar

Çoğu geliştirici, mevcut kaynaklarla güncel kalabilmek ve değişikliklere yukarı yöndeki [GitHub'daki [XOOPS/XoopsCore27 deposuna](https://github.com/XOOPS/XoopsCore27) katkıda bulunabilmek ister. Bu, bir sürüm arşivi indirmek yerine, XOOPS'nin bir kopyasını [çatallamak](PH000003¤) isteyeceğiniz ve bu depoyu geliştirici kutunuza [klonlamak](https://help.github.com/categories/bootcamp/) için **git**'i kullanmak isteyeceğiniz anlamına gelir.

Deponun belirli bir yapısı olduğundan, dosyaları _htdocs_ dizininden web sunucunuza _kopyalamak yerine, web sunucunuzu yerel olarak klonlanmış deponuz içindeki htdocs klasörüne yönlendirmek daha iyidir. Bunu başarmak için genellikle git kontrollü kaynak kodumuza işaret eden yeni bir _Sanal Ana Bilgisayar_ veya _vhost_ oluştururuz.

Bir [WAMP](http://www.wampserver.com/) ortamında, varsayılan [localhost](http://localhost/) sayfasının _Tools_ bölümünde buraya yönlendiren _Sanal Ana Bilgisayar Ekle_ bağlantısı vardır:

![WAMP Add Virtual Host](/xoops-docs/2.7/img/installation/wamp-vhost-03.png)

Bunu kullanarak, doğrudan (hala) git kontrollü deponuza düşecek bir VirtualHost girişi ayarlayabilirsiniz.

İşte `wamp64/bin/apache/apache2.x.xx/conf/extra/httpd-vhosts.conf`'deki örnek giriş
```text
<VirtualHost *:80>
    ServerName xoops.localhost
    DocumentRoot "c:/users/username/documents/github/xoopscore27/htdocs"
    <Directory  "c:/users/username/documents/github/xoopscore27/htdocs/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require local
    </Directory>
</VirtualHost>
```
Ayrıca `Windows/System32/drivers/etc/hosts`'ye bir giriş eklemeniz gerekebilir:
```text
127.0.0.1    xoops.localhost
```
Artık basit bir URL ile deponuzu sağlam tutarken ve web sunucusunu htdocs dizini içinde tutarken test için `http://xoops.localhost/` üzerine kurulum yapabilirsiniz. Ayrıca, yerel XOOPS kopyanızı, dosyaları yeniden yüklemenize veya kopyalamanıza gerek kalmadan istediğiniz zaman en son ana sürüme güncelleyebilirsiniz. Ayrıca GitHub aracılığıyla XOOPS'ye katkıda bulunmak için kodda geliştirmeler ve düzeltmeler yapabilirsiniz.

## Composer Bağımlılıkları

XOOPS 2.7.0, PHP bağımlılıklarını yönetmek için [Composer](https://getcomposer.org/) kullanır. Bağımlılık ağacı kaynak deposunun içindeki `htdocs/xoops_lib/`'de bulunur:

* `composer.dist.json` sürümle birlikte gönderilen bağımlılıkların ana listesidir.
* `composer.json`, gerekirse geliştirme ortamınız için özelleştirebileceğiniz yerel kopyadır.
* `composer.lock` tam sürümleri sabitler, böylece yüklemeler tekrarlanabilir.
* `vendor/` yüklü kütüphaneleri içerir (Smarty 4, PHPMailer, HTMLPurifier, firebase/php-jwt, monolog, symfony/var-dumper, xoops/xmf, xoops/regdom, ve diğerleri).

XOOPS 2.7.0'ın yeni bir git klonu için repo kökünden başlayarak şunu çalıştırın:
```text
cd htdocs/xoops_lib
composer install
```
Repo kökünde `composer.json` bulunmadığını unutmayın; proje `htdocs/xoops_lib/` altında yaşar, bu nedenle Composer'ı çalıştırmadan önce bu dizine `cd` girmelisiniz.

Serbest bırakılan tarball'lar `vendor/` önceden doldurulmuş olarak gönderilir, ancak git klonları gelmeyebilir. Geliştirme yüklemelerinde `vendor/`'yi olduğu gibi tutun — XOOPS, bağımlılıklarını çalışma zamanında oradan yükleyecektir.

[XMF (XOOPS module Çerçevesi)](https://github.com/XOOPS/xmf) kitaplığı 2.7.0'da Composer bağımlılığı olarak gelir; böylece herhangi bir ek kurulum gerekmeden module kodunuzda `Xmf\Request`, `Xmf\Database\TableLoad` ve ilgili sınıfları kullanabilirsiniz.

## DebugBar Modülü

XOOPS 2.7.0, Symfony VarDumper'ı temel alan bir **DebugBar** modülü sunar. Oluşturulan sayfalara istek, database ve template bilgilerini açığa çıkaran bir hata ayıklama araç çubuğu ekler. Geliştirme ve hazırlama sitelerindeki modules yönetici alanından yükleyin. İstediğinizi bilmediğiniz sürece, halka açık bir üretim sahasında kurulu halde bırakmayın.