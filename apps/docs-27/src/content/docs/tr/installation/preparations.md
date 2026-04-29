---
title: "phpinfo"
---
Bu adım isteğe bağlıdır, ancak sizi saatlerce süren hayal kırıklığından kolayca kurtarabilir.

Hosting sisteminin kurulum öncesi testi olarak, çok küçük ama kullanışlı bir PHP betiği yerel olarak oluşturulur ve hedef sisteme yüklenir.

PHP betiği yalnızca bir satırdan oluşur:
```php
<?php phpinfo();
```
Bir metin düzenleyici kullanarak, bu tek satırla _info.php_ adında bir dosya oluşturun.

Daha sonra bu dosyayı web kökünüze yükleyin.

![Filezilla info.php Upload](/xoops-docs/2.7/img/installation/filezilla-01-info.png)

Komut dosyanıza tarayıcınızda açarak, yani `http://example.com/info.php`'ye erişerek erişin. Her şey düzgün çalışıyorsa şunun gibi bir sayfa görmelisiniz:

![phpinfo() Example](/xoops-docs/2.7/img/installation/php-info.png)

Not: Bazı barındırma hizmetleri, güvenlik önlemi olarak _phpinfo()_ işlevini devre dışı bırakabilir. Böyle bir durumda genellikle bu yönde bir mesaj alırsınız.

Komut dosyasının çıktısı sorun gidermede kullanışlı olabilir; bu nedenle bir kopyasını kaydetmeyi düşünün.

Test işe yararsa, kuruluma devam etmeniz iyi olur. _info.php_ betiğini silmeli ve kuruluma devam etmelisiniz.

Test başarısız olursa nedenini araştırın! Bu basit testin çalışmasını engelleyen sorun ne olursa olsun, **gerçek** bir kurulumun çalışmasını da engelleyecektir.