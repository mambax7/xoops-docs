---
title: "Ön Kontrol Kontrolü"
---
XOOPS 2.7.0, template oluşturma motorunu Smarty 3'ten Smarty 4'e yükseltti. Smarty 4, template söz dizimi konusunda Smarty 3'e göre daha katıdır ve bazı özel temaların ve module şablonlarının XOOPS üzerinde düzgün çalışabilmesi için önce ayarlanması gerekebilir. 2.7.0.

Ana yükselticiyi çalıştırmadan önce bu sorunları tanımlamaya ve onarmaya yardımcı olmak için, XOOPS 2.7.0, `upgrade/` dizininde bir **ön kontrol tarayıcısı** ile birlikte gelir. Ana yükseltme iş akışının devam etmenize izin vermesi için ön kontrol tarayıcısını en az bir kez çalıştırmalısınız.

## Tarayıcı Ne Yapar?

Ön kontrol tarayıcısı, bilinen Smarty 4 uyumsuzlukları bulmak için mevcut temalarınızı ve module şablonlarınızı gözden geçirir. Şunları yapabilir:

* **Tarayın** `themes/` ve `modules/` dizinlerinizi, değişiklik gerektirebilecek `.tpl` ve `.html` template dosyaları için tarayın**
* **Sorunları dosyaya ve sorun türüne göre gruplandırarak bildirin**
* **İstediğiniz zaman birçok yaygın sorunu otomatik olarak onarır**

Her sorun otomatik olarak onarılamaz. Bazı şablonların, özellikle Smarty 4'te doğrudan eşdeğeri olmayan eski Smarty 3 deyimlerini kullanıyorlarsa manuel düzenlemeye ihtiyacı olacaktır.

## Tarayıcıyı Çalıştırma

1. `upgrade/` dağıtım dizinini sitenizin web köküne kopyalayın ([Yükseltme Hazırlıkları](ustep-01.md) adımının bir parçası olarak henüz yapmadıysanız).
2. Tarayıcınızı ön kontrole yönlendirin URL:   
```text
   http://example.com/upgrade/preflight.php
   
```
3. İstendiğinde yönetici hesabıyla oturum açın.
4. Tarayıcı üç kontrolün bulunduğu bir form sunar:
   * **template dizini** — hem `themes/` hem de `modules/`'yi taramak için boş bırakın. Taramayı tek bir dizine daraltmak için `/themes/mytheme/` gibi bir yol girin.
   * **template uzantısı** — hem `.tpl` hem de `.html` dosyalarını taramak için boş bırakın. Taramayı daraltmak için tek bir uzantı girin.
   * **Otomatik düzeltmeyi dene** — tarayıcının nasıl düzeltileceğini bildiği sorunları onarmasını istiyorsanız bu kutuyu işaretleyin. Salt okunur bir tarama için işaretlemeden bırakın.
5. **Çalıştır** düğmesine basın. Tarayıcı seçilen dizinlerde gezinir ve bulduğu her sorunu rapor eder.

## Sonuçları Yorumlama

Tarama raporu incelediği her dosyayı ve bulduğu her sorunu listeler. Her sayı girişi size şunları anlatır:

* Hangi dosya sorunu içeriyor
* Hangi Smarty 4 kuralını ihlal ediyor
* Tarayıcının bunu otomatik olarak onarıp onaramayacağı

Taramayı _Otomatik düzeltmeyi dene_ etkinken çalıştırdıysanız, rapor ayrıca hangi dosyaların yeniden yazıldığını da doğrulayacaktır.

## Sorunları Manuel Olarak Düzeltme

Tarayıcının otomatik olarak onaramadığı sorunlar için işaretlenen template dosyasını bir düzenleyicide açın ve gerekli değişiklikleri yapın. Yaygın Smarty 4 uyumsuzluk şunları içerir:

* `{php} ... {/php}` blokları (Smarty 4'te artık desteklenmemektedir)
* Kullanımdan kaldırılan değiştiriciler ve işlev çağrıları
* Boşluğa duyarlı sınırlayıcı kullanımı
* Smarty 4'te değişen kayıt zamanı eklenti varsayımları

Şablonları düzenlemek konusunda rahat değilseniz, en güvenli yaklaşım, gönderilen bir temaya (`xbootstrap5`, `default`, `xswatch5` vb.) geçmek ve yükseltme tamamlandıktan sonra özel temayla ayrı ayrı ilgilenmektir.

## Temizlenene Kadar Yeniden Çalıştırılıyor

Otomatik veya manuel düzeltmeler yaptıktan sonra ön kontrol tarayıcısını yeniden çalıştırın. Tarama, kalan sorun olmadığını bildirene kadar işlemi tekrarlayın.

Tarama temizlendikten sonra, tarayıcı arayüzündeki **Tarayıcıdan Çık** düğmesine basarak ön kontrol oturumunu sonlandırabilirsiniz. Bu, ön kontrolün tamamlandığını işaretler ve `/upgrade/` adresindeki ana yükselticinin ilerlemesine olanak tanır.

## Yükseltmeye Devam Ediyoruz

Ön kontrol tamamlandıktan sonra ana yükselticiyi şu adreste başlatabilirsiniz:
```text
http://example.com/upgrade/
```
Sonraki adımlar için [Yükseltme Çalıştırılıyor](ustep-02.md) konusuna bakın.

## Ön Kontrolü Atlarsanız

Ön kontrolün atlanması kesinlikle önerilmez, ancak yükseltme işlemini çalıştırmadan yaptıysanız ve şimdi template hataları görüyorsanız, [Sorun Giderme](ustep-03.md) bölümünün Smarty 4 template Hataları bölümüne bakın. Bu olaydan sonra ön kontrolü çalıştırabilir ve kurtarmak için `xoops_data/caches/smarty_compile/` işaretini temizleyebilirsiniz.