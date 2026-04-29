---
title: "Yükseltme Hazırlıkları"
---
## Siteyi Kapat

XOOPS yükseltme işlemine başlamadan önce "Siteniz kapatılsın mı?" seçeneğini ayarlamalısınız. Tercihler'deki öğeyi _Evet_ olarak değiştirin -&gt; Sistem Seçenekleri -&gt; Yönetim Menüsünde Genel Ayarlar sayfası.

Bu, kullanıcıların yükseltme sırasında bozuk bir siteyle karşılaşmasını önler. Ayrıca daha sorunsuz bir yükseltme sağlamak için kaynaklara yönelik çekişmeyi minimumda tutar.

Ziyaretçileriniz hatalar ve bozuk bir site yerine şunun gibi bir şey görecek:

![Site Closed on Mobile](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Yedekleme

Site dosyalarınızın tam yedeğini almadan önce tüm önbellekler için XOOPS yönetim _Bakım_ bölümünü kullanarak _önbellek klasörünü temizlemek_ iyi bir fikirdir. Site kapalıyken, bir geri yükleme gerekiyorsa eski oturumların bunun bir parçası olmaması için _Oturum tablosunu boşaltın_ kullanılması da önerilir.

### Dosyalar

Dosya yedeklemesi FTP ile tüm dosyaların yerel makinenize kopyalanmasıyla yapılabilir. Sunucuya doğrudan kabuk erişiminiz varsa, orada bir kopya (veya arşiv kopyası) oluşturmak çok daha hızlı olabilir.

### database

database yedeklemesi yapmak için XOOPS yönetim _Bakım_ bölümündeki yerleşik işlevleri kullanabilirsiniz. Varsa, _phpMyAdmin_'deki _Export_ işlevlerini de kullanabilirsiniz. Kabuk erişiminiz varsa veritabanınızın dökümünü almak için _mysql_ komutunu kullanabilirsiniz.

Veritabanınızı yedekleme ve geri yükleme konusunda akıcı olmak önemli bir web yöneticisi becerisidir. Kurulumunuza uygun olarak bu işlemler hakkında daha fazla bilgi edinmek için kullanabileceğiniz [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php) gibi birçok çevrimiçi kaynak vardır.

![phpMyAdmin Export](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Yeni Dosyaları Siteye Kopyalayın

Yeni dosyaları sitenize kopyalamak, kurulum sırasındaki [Hazırlıklar](../../installation/preparations/) adımıyla hemen hemen aynıdır. _xoops_data_ ve _xoops_lib_ dizinlerini kurulum sırasında taşındıkları yere kopyalamalısınız. Ardından, dağıtımın _htdocs_ dizininin geri kalan içeriğini (sonraki bölümde ele alınan birkaç istisna dışında) web kökünüzdeki mevcut dosya ve dizinlerin üzerine kopyalayın.

XOOPS 2.7.0'da, yeni bir dağıtımın mevcut bir sitenin üstüne kopyalanması **`mainfile.php` veya `xoops_data/data/secure.php` gibi **mevcut yapılandırma dosyalarının üzerine yazılmaz**. Bu, önceki sürümlere göre hoş bir değişikliktir, ancak başlamadan önce yine de tam bir yedekleme yapmalısınız.

Dağıtımdan _upgrade_ dizininin tamamını web kökünüze kopyalayın ve orada bir _upgrade_ dizini oluşturun.

## Smarty 4 Ön Kontrol Kontrolünü çalıştırın

Ana `/upgrade/` iş akışını başlatmadan önce, `upgrade/` dizininde gönderilen ön kontrol tarayıcısını çalıştırmalısınız. Mevcut temalarınızı ve module şablonlarınızı Smarty 4 uyumluluk sorunları açısından inceler ve bunların çoğunu otomatik olarak onarabilir.

1. Tarayıcınızı _your-site-url_/upgrade/preflight.php'ye yönlendirin
2. Yönetici hesabıyla oturum açın
3. Taramayı çalıştırın ve raporu inceleyin
4. Sunulan otomatik onarımları uygulayın veya işaretli şablonları manuel olarak düzeltin
5. Temizlenene kadar taramayı yeniden çalıştırın
6. Ancak bundan sonra ana yükseltmeye devam edin

Tam bir açıklama için [Ön Kontrol Kontrolü](preflight.md) sayfasına bakın.

### Kopyalamak istemeyebileceğiniz şeyler

_install_ dizinini çalışan bir XOOPS sistemine yeniden kopyalamamalısınız. Kurulum klasörünü XOOPS kurulumunuzda bırakmak, sisteminizi olası güvenlik sorunlarına maruz bırakır. Yükleyici onu rastgele yeniden adlandırır, ancak onu silmeli ve başka bir yere kopyalamadığınızdan emin olmalısınız.

Sitenizi özelleştirmek için düzenlediğiniz bazı dosyalar var ve bunları korumak isteyeceksiniz. Yaygın özelleştirmelerin bir listesini burada bulabilirsiniz.* _xoops_data/configs/xoopsconfig.php_ site kurulduğundan bu yana değiştirilmişse
* siteniz için özelleştirilmişse _themes_ içindeki tüm dizinler. Bu durumda yararlı güncellemeleri belirlemek için dosyaları karşılaştırmak isteyebilirsiniz.
* _class/captcha/_ içerisinde site kurulduğundan beri değiştirilmişse "config" ile başlayan herhangi bir dosya
* _class/textsanitizer_'deki tüm özelleştirmeler
* _class/xoopseditor_'deki tüm özelleştirmeler

Yükseltme sonrasında bir şeyin yanlışlıkla üzerine yazıldığını fark ederseniz paniğe kapılmayın; tam yedeklemeyle başlamanızın nedeni budur. _(Yedekleme yaptınız değil mi?)_

## mainfile.php'yi kontrol edin (Pre-2.5'ten yükseltme XOOPS)

Bu adım yalnızca eski bir XOOPS sürümünden (2.3 veya daha eski) yükseltme yapıyorsanız geçerlidir. Eğer XOOPS 2.5.x'ten yükseltme yapıyorsanız bu bölümü atlayabilirsiniz.

XOOPS'nin eski sürümleri, Koruyucu modülünü etkinleştirmek için `mainfile.php`'de bazı manuel değişikliklerin yapılmasını gerektiriyordu. Web kökünüzde `mainfile.php` adında bir dosyanız olmalıdır. Bu dosyayı editörünüzde açın ve şu satırları arayın:
```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```
Ve
```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```
Bu satırları bulursanız kaldırın ve devam etmeden önce dosyayı kaydedin.