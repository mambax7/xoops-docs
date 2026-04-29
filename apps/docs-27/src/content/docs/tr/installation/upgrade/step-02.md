---
title: "Yükseltme Çalıştırılıyor"
---
Ana yükselticiyi çalıştırmadan önce [Ön Kontrol Kontrolü](preflight.md) işlemini tamamladığınızdan emin olun. Yükseltme user arayüzü, ön kontrolün en az bir kez çalıştırılmasını gerektirir ve çalıştırmadıysanız sizi oraya yönlendirecektir.

Tarayıcınızı sitenizin _upgrade_ dizinine yönlendirerek yükseltme işlemini başlatın:
```text
http://example.com/upgrade/
```
Bu şunun gibi bir sayfa göstermelidir:

![XOOPS Upgrade Startup](/xoops-docs/2.7/img/installation/upgrade-01.png)

Devam etmek için "Devam Et" düğmesini seçin.

Her "Devam" başka bir yama boyunca ilerler. Tüm yamalar uygulanana ve Sistem Modülü Güncelleme sayfası sunulana kadar devam edin.

![XOOPS Upgrade Applied Patch](/xoops-docs/2.7/img/installation/upgrade-05-applied.png)

## 2.5.11 → 2.7.0 Yükseltmesi Neleri Uygulanır?

XOOPS 2.5.11'den 2.7.0'a yükseltme yaparken, yükseltici aşağıdaki yamaları uygular. Neyin değiştirildiğini onaylayabilmeniz için her biri sihirbazda ayrı bir adım olarak sunulur:

1. **Eski paketteki PHPMailer'yi kaldırın.** Koruyucu modülün içindeki PHPMailer paketindeki kopyası silinir. PHPMailer artık `xoops_lib/vendor/`'deki Composer aracılığıyla sağlanıyor.
2. **Eski HTMLPurifier klasörünü kaldırın.** Benzer şekilde, Koruyucu module içindeki eski HTMLPurifier klasörü de silinir. HTMLPurifier artık Composer aracılığıyla sağlanıyor.
3. **`tokens` tablosunu oluşturun.** Genel kapsamlı belirteç depolama için yeni bir `tokens` tablosu eklenir. Tabloda belirteç kimliği, user kimliği, kapsam, karma ve issued/expires/used zaman damgaları için sütunlar bulunur ve XOOPS 2.7.0'daki belirteç tabanlı özellikler tarafından kullanılır.
4. **Genişlet `bannerclient.passwd`.** `bannerclient.passwd` sütunu, eski dar sütun yerine modern parola karmalarını (bcrypt, argon2) depolayabilmesi için `VARCHAR(255)` olarak genişletilir.
5. **Oturum çerez tercihlerini ekleyin.** İki yeni tercih eklendi: `session_cookie_samesite` (SameSite çerez özelliği için) ve `session_cookie_secure` (yalnızca HTTPS çerezlerini zorunlu kılmak için). Yükseltme tamamlandıktan sonra bunların nasıl inceleneceğini öğrenmek için [Yükseltme Sonrası](ustep-04.md) bölümüne bakın.

Bu adımların hiçbiri içerik verilerinize dokunmaz. Kullanıcılarınıza, gönderilerinize, resimlerinize ve module verilerinize dokunulmaz.

## Dil Seçimi

Ana XOOPS dağıtımı İngilizce desteğiyle birlikte gelir. Ek yerel ayarlar için destek [XOOPS Yerel destek siteleri](https://xoops.org/modules/xoopspartners/) tarafından sağlanır. Bu destek, özelleştirilmiş bir dağıtım veya ana dağıtıma eklenecek ek dosyalar şeklinde gelebilir.

XOOPS çeviriler [transifex](https://www.transifex.com/xoops/public/) üzerinde tutulur

XOOPS Yükselticinizin ek dil desteği varsa üst menülerdeki dil simgesini seçip farklı bir dil seçerek dili değiştirebilirsiniz.

![XOOPS Upgrade Language](/xoops-docs/2.7/img/installation/upgrade-02-change-language.png)