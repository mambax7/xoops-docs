---
title: "E-postayı Yapılandır"
---
![XOOPS Email Configuration](/xoops-docs/2.7/img/installation/xoops-04-email-setup.png)

XOOPS, bir kaydı doğrulamak veya şifreyi sıfırlamak gibi birçok kritik user etkileşimi için e-postaya güvenir. Bu nedenle doğru ayarlanması önemlidir.

Site e-postasını yapılandırmak bazı durumlarda çok kolay olabilir, bazılarında ise sinir bozucu derecede zor olabilir.

Kurulumunuzun başarılı olmasına yardımcı olacak bazı ipuçlarını burada bulabilirsiniz.

## E-posta Teslim Yöntemi

Yapılandırmanın bu bölümünde 4 olası değer vardır

* **PHP Mail()** - eğer varsa en kolay yol. Sistemin _sendmail_ programına bağlıdır.
* **sendmail** - Endüstriyel güç seçeneği, ancak genellikle diğer yazılımlardaki zayıflıklardan yararlanılarak SPAM hedeflenir.
* **SMTP** - Basit Posta Aktarım Protokolü, güvenlik endişeleri ve kötüye kullanım potansiyeli nedeniyle genellikle yeni barındırma hesaplarında mevcut değildir. Büyük ölçüde SMTP Auth ile değiştirildi.
* **SMTP Yetki** - SMTP Yetkilendirme ile genellikle düz SMTP yerine tercih edilir. Bu durumda XOOPS daha güvenli bir şekilde doğrudan posta sunucusuna bağlanır.

## SMTP Ana Bilgisayarlar

SMTP'yi "Auth" ile veya "Auth" olmadan kullanmanız gerekiyorsa, burada bir sunucu adı belirtmeniz gerekecektir. Bu ad, basit bir ana bilgisayar adı veya IP adresi olabileceği gibi ek bağlantı noktası ve protokol bilgilerini de içerebilir. En basit durum, web sunucusuyla aynı makinede çalışan bir SMTP (kimlik doğrulama yok) sunucusu için `localhost` olabilir.

SMTP user adı ve SMTP şifresi, SMTP Yetkilendirme kullanılırken her zaman gereklidir. TLS veya SSL'nin yanı sıra XOOPS yapılandırma alanında SMTP Ana Bilgisayarlar'da bir bağlantı noktası belirtmek mümkündür.

Bu, Gmail'in SMTP: `tls://smtp.gmail.com:587`'sine bağlanmak için kullanılabilir.

SSL kullanan başka bir örnek: `ssl://mail.example.com:465`

## Sorun Giderme İpuçları

Bazen işler umduğumuz kadar düzgün gitmez. İşte yardımcı olabilecek bazı öneri ve kaynaklar.

### Barındırma sağlayıcınızın belgelerini kontrol edin

Bir sağlayıcıyla hosting hizmeti kurduğunuzda, e-posta sunucularına nasıl erişileceği konusunda bilgi sağlamalıdır. XOOPS sisteminiz için e-postayı yapılandırırken bunun kullanılabilir olmasını istiyorsunuz.

### XOOPS PHPMailer'yi kullanır

XOOPS e-posta göndermek için [PHPMailer](https://github.com/PHPMailer/PHPMailer) kitaplığını kullanır. Wiki'deki [sorun giderme](https://github.com/PHPMailer/PHPMailer/wiki/Troubleshooting) bölümü bazı bilgiler sunar.