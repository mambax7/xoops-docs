---
title: "Sorun giderme"
---
## Smarty 4 template Hatası

XOOPS 2.5.x'ten 2.7.0'a yükseltme yaparken en yaygın sorun sınıfı Smarty 4 template uyumsuzluğudur. [Ön Kontrol Kontrolünü](preflight.md) atladıysanız veya tamamlamadıysanız, yükseltme sonrasında ön uçta veya yönetici alanında template hataları görebilirsiniz.

Kurtarmak için:

1. **Ön kontrol tarayıcısını `/upgrade/preflight.php` adresinden yeniden çalıştırın**. Sunduğu otomatik onarımları uygulayın veya işaretli şablonları manuel olarak düzeltin.
2. **Derlenmiş template önbelleğini temizleyin.** `index.html` dışındaki her şeyi `xoops_data/caches/smarty_compile/`'den kaldırın. Smarty 3 derlenmiş template Smarty 4 ile uyumlu değildir ve eski dosyalar kafa karıştırıcı hatalara neden olabilir.
3. **Geçici olarak gönderilen bir temaya geçin.** Yönetici alanından aktif theme olarak `xbootstrap5` veya `default`'yi seçin. Bu, sorunun özel bir temayla mı sınırlı olduğunu yoksa site genelinde mi olduğunu doğrulayacaktır.
4. **Üretim trafiğini tekrar açmadan önce tüm özel temaları ve module şablonlarını doğrulayın**. `{php}` blokları, kullanımdan kaldırılmış değiştiriciler veya standart dışı sınırlayıcı sözdizimi kullanan şablonlara özellikle dikkat edin; bunlar en yaygın Smarty 4 kırılmalarıdır.

Ayrıca [Özel Konular](../../installation/specialtopics.md) bölümündeki Smarty 4 bölümüne bakın.

## İzin Sorunları

XOOPS Yükseltmesi'nin daha önce salt okunur hale getirilmiş dosyalara yazması gerekebilir. Eğer durum buysa, şöyle bir mesaj göreceksiniz:

![XOOPS Upgrade Make Writable Error](/xoops-docs/2.7/img/installation/upgrade-03-make-writable.png)

Çözüm izinleri değiştirmektir. Doğrudan erişiminiz yoksa FTP kullanarak izinleri değiştirebilirsiniz. İşte FileZilla kullanan bir örnek:

![FileZilla Change Permission](/xoops-docs/2.7/img/installation/upgrade-04-change-permissions.png)

## Hata Ayıklama Çıkışı

Yükseltmeyi başlatmak için kullanılan URL'ye bir hata ayıklama parametresi ekleyerek kaydedicide ekstra hata ayıklama çıkışını etkinleştirebilirsiniz:
```text
http://example.com/upgrade/?debug=1
```

