---
title: "database Yapılandırması"
---
Bu sayfa XOOPS'nın kullanacağı veritabanına ilişkin bilgileri toplar.

İstenilen bilgileri girdikten ve sorunları düzelttikten sonra devam etmek için "Devam Et" düğmesini seçin.

![XOOPS Installer Database Configuration](/xoops-docs/2.7/img/installation/installer-06.png)

## Bu Adımda Toplanan Veriler

### database

#### database adı

XOOPS'in kullanması gereken ana bilgisayardaki veritabanının adı. Önceki adımda girilen database kullanıcısının bu veritabanındaki tüm ayrıcalıklara sahip olması gerekir. Yükleyici, mevcut değilse bu veritabanını oluşturmaya çalışacaktır.

#### Tablo öneki

Bu önek XOOPS tarafından oluşturulan tüm yeni tabloların adlarına eklenecektir. Bu, veritabanının diğer uygulamalarla paylaşılması durumunda ad çakışmalarının önlenmesine yardımcı olur. Benzersiz bir önek, tablo adlarının tahmin edilmesini de zorlaştırır ve bu da güvenlik avantajları sağlar. Emin değilseniz varsayılanı koruyun

#### database karakter seti

Yükleyicinin varsayılan ayarı, emoji ve ek karakterler de dahil olmak üzere tüm Unicode aralığını destekleyen `utf8mb4`'dir. Burada farklı bir karakter seti seçebilirsiniz, ancak `utf8mb4` hemen hemen tüm diller ve yerel ayarlar için önerilir ve değiştirmek için özel bir nedeniniz olmadığı sürece olduğu gibi bırakılmalıdır.

#### database harmanlama

Harmanlama alanı varsayılan olarak boş bırakılır. Boş olduğunda, MySQL yukarıda seçilmiş olan karakter seti için varsayılan harmanlamayı uygular (`utf8mb4` için bu, MySQL sürümüne bağlı olarak genellikle `utf8mb4_general_ci` veya `utf8mb4_0900_ai_ci`'dir). Belirli bir harmanlamaya ihtiyacınız varsa (örneğin mevcut bir veritabanıyla eşleştirmek için) buradan seçin. Aksi takdirde boş bırakmak önerilen seçimdir.