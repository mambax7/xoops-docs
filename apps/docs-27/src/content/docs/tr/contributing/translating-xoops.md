---
title: "Ek 3: XOOPS'yi Yerel Dile Çevirme"
---
XOOPS 2.7.0 yalnızca İngilizce dil dosyalarıyla birlikte gelir. Diğer dillere çeviriler topluluk tarafından sağlanır ve GitHub ve çeşitli yerel XOOPS destek siteleri aracılığıyla dağıtılır.

## Mevcut çevirileri nerede bulabilirim?

- **GitHub** — topluluk çevirileri, [XOOPS organizasyonu](https://github.com/XOOPS) altında ve bireysel katkıda bulunanların hesaplarında ayrı depolar olarak giderek daha fazla yayınlanmaktadır. Güncel paketler için GitHub'ta `xoops-language-<your-language>`'yi arayın veya XOOPS organizasyonuna göz atın.
- **Yerel XOOPS destek siteleri** — birçok bölgesel XOOPS topluluğu çevirileri kendi sitelerinde yayınlar. [https://xoops.org](https://xoops.org) adresini ziyaret edin ve yerel topluluklara olan bağlantıları takip edin.
- **module çevirileri** — bireysel topluluk modüllerinin çevirileri genellikle ¤PH000003 GitHub organizasyonunda modülün yanında bulunur (addaki `25x` tarihidir; buradaki modules hem XOOPS 2.5.x hem de 2.7.x için korunur).

Diliniz için bir çeviri zaten mevcutsa, dil dizinlerini XOOPS kurulumunuza bırakın (aşağıdaki "Çeviri nasıl kurulur" bölümüne bakın).

## Neyin çevrilmesi gerekiyor

XOOPS 2.7.0, dil dosyalarını onları tüketen kodun yanında tutar. Tam bir çeviri şu konumların tümünü kapsar:

- **Core** — `htdocs/language/english/` — her sayfa tarafından kullanılan site geneli sabitler (oturum açma, yaygın hatalar, tarihler, posta şablonları vb.).
- **Yükleyici** — `htdocs/install/language/english/` — kurulum sihirbazı tarafından gösterilen dizeler. Yerelleştirilmiş bir yükleme deneyimi istiyorsanız, yükleyiciyi çalıştırmadan *önce* bunları çevirin.
- **Sistem modülü** — `htdocs/modules/system/language/english/` — açık ara en büyük set; yönetici Kontrol Panelinin tamamını kapsar.
- **Paketlenmiş modules** — `htdocs/modules/pm/language/english/`, `htdocs/modules/profile/language/english/`, `htdocs/modules/protector/language/english/` ve `htdocs/modules/debugbar/language/english/`'nin her biri.
- **themes** — bir avuç theme kendi dil dosyalarını gönderir; `htdocs/themes/<theme>/language/`'nin mevcut olup olmadığını kontrol edin.

"Yalnızca Core" çeviri, minimum yararlı birimdir ve yukarıdaki ilk iki madde işaretine karşılık gelir.

## Nasıl tercüme edilir

1. Yanındaki `english/` dizinini kopyalayın ve kopyayı kendi dilinize göre yeniden adlandırın. Dizin adı dilin küçük harfli İngilizce adı olmalıdır (`spanish`, `german`, `french`, `japanese`, `arabic`, vb.).   
```
   htdocs/language/english/    →    htdocs/language/spanish/
   
```
2. Her `.php` dosyasını yeni dizinde açın ve `define()` çağrılarının içindeki **string değerlerini** çevirin. Sabit adlarını **değiştirmeyin**; bunlara Core boyunca PHP kodundan başvurulur.   
```php
   // Before:
   define('_CM_COMDELETED',  'Comment(s) deleted.');
   define('_CM_COMDELETENG', 'Could not delete comment.');
   define('_CM_DELETESELECT', 'Delete all its child comments?');

   // After (Spanish):
   define('_CM_COMDELETED',  'Comentario(s) eliminado(s).');
   define('_CM_COMDELETENG', 'No se pudo eliminar el comentario.');
   define('_CM_DELETESELECT', '¿Eliminar también todos sus comentarios secundarios?');
   
```
3. **Her dosyayı UTF-8 *olmadan* BOM olarak kaydedin.** XOOPS 2.7.0, `utf8mb4`'yi uçtan uca (database, oturumlar, çıktı) kullanır ve dosyaları bayt sırası işaretiyle reddeder. Notepad++'da bu **"UTF-8"** seçeneğidir, *değil* "UTF-8-BOM". VS Code'da bu varsayılandır; durum çubuğundaki kodlamayı onaylamanız yeterlidir.

4. Her dosyanın üst kısmındaki dili ve karakter kümesi meta verilerini dilinizle eşleşecek şekilde güncelleyin:   
```php
   // _LANGCODE: es
   // _CHARSET : UTF-8
   // Translator: Your Name
   
```
`_LANGCODE` dilinizin [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) kodu olmalıdır. `_CHARSET`, XOOPS 2.7.0'da her zaman `UTF-8`'dir — artık ISO-8859-1 çeşidi yoktur.

5. Kurulumcu, Sistem modülü ve ihtiyacınız olan tüm paket modules için aynı işlemi tekrarlayın.

## Çeviri nasıl yüklenir

Eğer tamamlanmış bir çeviriyi dizin ağacı olarak aldıysanız:

1. Her `<language>/` dizinini, XOOPS kurulumunuzda eşleşen `language/english/` üst dizinine kopyalayın. Örneğin, `language/spanish/`'yi ¤PH000007'ye, `install/language/spanish/`'yi `htdocs/install/language/`'ye vb. kopyalayın.
2. Dosya sahipliğinin ve izinlerinin web sunucusu tarafından okunabildiğinden emin olun.
3. Yükleme sırasında yeni dili seçin (sihirbaz mevcut diller için `htdocs/language/`'yi tarar) veya mevcut bir sitede **Yönetim → Sistem → Tercihler → Genel Ayarlar** bölümünde dili değiştirin.

## Çevirinizi geri paylaşıyorum

Lütfen çevirinizle topluluğa katkıda bulunun.

1. Bir GitHub deposu oluşturun (veya diliniz için varsa mevcut bir dil deposunu çatallayın).
2. `xoops-language-<language-code>` gibi anlaşılır bir ad kullanın (örn. `xoops-language-es`, `xoops-language-pt-br`).
3. Dosyaların kopyalandıkları yerle aynı hizada olması için XOOPS dizin yapısını deponuza yansıtın:   
```
   xoops-language-es/
   ├── language/spanish/(files).php
   ├── install/language/spanish/(files).php
   └── modules/system/language/spanish/(files).php
   
```
4. `README.md` belgesini ekleyin:
   - Dil adı ve ISO kodu
   - XOOPS sürüm uyumluluğu (örn. `XOOPS 2.7.0+`)
   - Çevirmen ve krediler
   - Çevirinin yalnızca Core mi yoksa paket modülleri mi kapsadığı
5. GitHub'da ilgili module/core deposuna karşı bir çekme isteği açın veya topluluğun bulabilmesi için [https://xoops.org](https://xoops.org) üzerinde bir duyuru yayınlayın.

> **Not**
>
> Diliniz tarih veya takvim formatına ilişkin temel değişiklikler gerektiriyorsa bu değişiklikleri pakete de ekleyin. Sağdan sola yazılan diller (Arapça, İbranice, Farsça, Urduca) XOOPS 2.7.0'da kullanıma hazırdır — RTL desteği bu sürüme eklenmiştir ve bireysel themes bunu otomatik olarak alır.