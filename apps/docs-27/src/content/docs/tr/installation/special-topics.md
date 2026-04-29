---
title: "Özel Konular"
---
Bazı özel sistem yazılımı kombinasyonlarının çalışması bazı ek yapılandırmalar gerektirebilir
 XOOPS ile. Bilinen sorunların bazı ayrıntılarını ve bunlarla baş etmeye yönelik yönergeleri burada bulabilirsiniz.

## SELinux Ortamları

Kurulum, yükseltme ve normal çalışma sırasında belirli dosya ve dizinlerin yazılabilir olması gerekir
XOOPS. Geleneksel bir Linux ortamında bu, aşağıdakilerin sağlanmasıyla gerçekleştirilir:
web sunucusunun altında çalıştığı sistem kullanıcısının XOOPS dizinlerinde izinleri vardır, genellikle 
bu dizinler için uygun grubu ayarlama.

SELinux özellikli sistemler (CentOS ve RHEL gibi) ek bir güvenlik bağlamına sahiptir;
bir işlemin dosya sistemini değiştirme yeteneğini kısıtlayabilir. Bu sistemler gerektirebilir 
XOOPS'nin düzgün çalışması için güvenlik bağlamında değişiklik yapar.

XOOPS normal çalışma sırasında belirli dizinlere serbestçe yazabilmeyi bekler. 
Ayrıca XOOPS kurulumu ve yükseltmeleri sırasında bazı dosyaların da yazılabilir olması gerekir.
 
Normal çalışma sırasında XOOPS, dosya yazabilmeyi ve alt dizinler oluşturabilmeyi bekler 
bu dizinlerde:

- `uploads` ana XOOPS web kökünde
- `xoops_data` kurulum sırasında nereye taşınırsa taşınsın

Bir yükleme veya yükseltme işlemi sırasında XOOPS'nin bu dosyaya yazması gerekecektir:

- `mainfile.php` ana XOOPS web kökünde

Tipik bir CentOS Apache tabanlı sistem için güvenlik içeriği değişiklikleri şu şekilde olabilir: 
şu komutlarla gerçekleştirilir:
```
chcon -Rv --type=httpd_sys_rw_content_t /path/to/web/root/uploads/
chcon -Rv --type=httpd_sys_rw_content_t /path/to/xoops_data/
```
Mainfile.php'yi aşağıdakilerle yazılabilir hale getirebilirsiniz:
```
chcon -v --type=httpd_sys_rw_content_t /path/to/web/root/mainfile.php
```
Not: Kurulum sırasında *extras* dizininden boş bir mainfile.php dosyasını kopyalayabilirsiniz.

Ayrıca httpd'nin posta göndermesine de izin vermelisiniz:
```
setsebool -P httpd_can_sendmail=1
```
İhtiyaç duyabileceğiniz diğer ayarlar şunları içerir:

httpd'nin ağ bağlantıları yapmasına, yani rss beslemelerini almasına veya API çağrıları yapmasına izin verin:
```
setsebool -P httpd_can_network_connect 1
```
Bir veritabanına ağ bağlantısını şununla etkinleştirin:
```
setsebool -P httpd_can_network_connect_db=1
```
Daha fazla bilgi için sistem belgelerinize başvurun and/or sistem yöneticisi.

## Smarty 4 ve Özel themes

XOOPS 2.7.0, template oluşturma motorunu Smarty 3'ten **Smarty 4**'e yükseltti. Smarty 4 daha katıdır
Smarty 3'ten daha fazla template söz dizimi ve eski şablonlarda tolere edilen birkaç kalıp hakkında
artık hatalara neden olacaktır. Yalnızca temaları kullanarak XOOPS 2.7.0'ın yeni bir kopyasını yüklüyorsanız
ve sürümle birlikte gönderilen modules için endişelenecek bir şey yok; gönderilen her template
Smarty 4 uyumluluğu için güncellendi.

Bu endişe şu durumlarda geçerlidir:

- özel temalara sahip mevcut bir XOOPS 2.5.x sitesini yükseltmek veya
- XOOPS 2.7.0'a özel themes veya eski üçüncü taraf modüllerin yüklenmesi.

Canlı trafiği yükseltilmiş bir siteye geçirmeden önce, birlikte gönderilen ön kontrol tarayıcısını çalıştırın.
`/upgrade/` dizini. `/themes/` ve `/modules/`'yi tarar ve Smarty 4 uyumsuzluk arar
ve çoğunu otomatik olarak onarabilir. Bkz.
Ayrıntılar için [Ön Kontrol Kontrolü](../upgrading/upgrade/preflight.md) sayfasına bakın.

Bir yükleme veya yükseltme sonrasında template hataları ile karşılaşırsanız:

1. `/upgrade/preflight.php`'yi yeniden çalıştırın ve bildirilen sorunları giderin.
2. `index.html` dışındaki her şeyi kaldırarak derlenmiş template önbelleğini temizleyin.
   `xoops_data/caches/smarty_compile/`.
3. Sorunu onaylamak için geçici olarak `xbootstrap5` veya `default` gibi gönderilen bir temaya geçin.
   site genelinden ziyade temaya özgüdür.
4. Siteyi üretime döndürmeden önce tüm özel theme veya module şablonu değişikliklerini doğrulayın.