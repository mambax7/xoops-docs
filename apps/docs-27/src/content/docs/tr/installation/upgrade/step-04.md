---
title: "Yükseltmeden Sonra"
---
## Sistem Modülünü Güncelleyin

Gerekli tüm yamalar uygulandıktan sonra _Devam_ seçildiğinde **sistem** modülünü güncellemek için her şey ayarlanacaktır. Bu çok önemli bir adımdır ve yükseltmeyi düzgün bir şekilde tamamlamak için gereklidir.

![XOOPS Update System Module](/xoops-docs/2.7/img/installation/upgrade-06-update-system-module.png)

Sistem modülünün güncellemesini gerçekleştirmek için _Update_ seçeneğini seçin.

## Diğer XOOPS Verilen Modülleri Güncelleyin

XOOPS üç opsiyonel modülle birlikte gelir - pm (Özel Mesajlaşma), profil (user Profili) ve koruyucu (Koruyucu) Kurulu olan bu modüllerden herhangi birinde güncelleme yapmalısınız.

![XOOPS Update Other Modules](/xoops-docs/2.7/img/installation/upgrade-07-update-modules.png)

## Diğer Modülleri Güncelleyin

Artık güncellenen XOOPS'nız altında modüllerin daha iyi çalışmasını sağlayacak diğer modüllerde güncellemeler olması muhtemeldir. Uygun module güncellemelerini araştırmalı ve uygulamalısınız.

## Yeni Çerez Sağlamlaştırma Tercihlerini İnceleyin

XOOPS 2.7.0 yükseltmesi, oturum çerezlerinin nasıl yayınlandığını kontrol eden iki yeni tercih ekler:

* **`session_cookie_samesite`** — SameSite çerez özelliğini kontrol eder. `Lax` çoğu site için güvenli bir varsayılandır. Siteniz çapraz köken navigasyonuna dayanmıyorsa maksimum koruma için `Strict` kullanın. `None` yalnızca ihtiyacınız olduğunu biliyorsanız uygundur.
* **`session_cookie_secure`** — etkinleştirildiğinde, oturum çerezi yalnızca HTTPS bağlantıları üzerinden gönderilir. Siteniz HTTPS üzerinde çalışıyorsa bunu açın.

Bu ayarları Sistem Seçenekleri → Tercihler → Genel Ayarlar altında inceleyebilirsiniz.

## Özel Temaları Doğrulayın

Siteniz özel bir theme kullanıyorsa sayfaların doğru şekilde oluşturulduğunu doğrulamak için ön uç ve yönetici alanını inceleyin. Smarty 4'e yükseltme, ön kontrol taraması başarılı olsa bile özel şablonları etkileyebilir. Oluşturma sorunlarıyla karşılaşırsanız [Sorun Giderme](ustep-03.md) sayfasını tekrar ziyaret edin.

## Kurulum ve Yükseltme Dosyalarını Temizleyin

Güvenlik için, yükseltmenin çalıştığı onaylandıktan sonra bu dizinleri web kökünüzden kaldırın:

* `upgrade/` — yükseltme iş akışı dizini
* `install/` — mevcutsa, `install/` olarak veya yeniden adlandırılmış `installremove*` dizini olarak

Bunları yerinde bırakmak, yükseltme ve kurulum komut dosyalarının sitenize ulaşabilen herkese açık hale gelmesine neden olur.

## Sitenizi Açın

_Sitenizi kapatın_ tavsiyesine uyduysanız, düzgün çalıştığını belirledikten sonra sitenizi tekrar açmalısınız.