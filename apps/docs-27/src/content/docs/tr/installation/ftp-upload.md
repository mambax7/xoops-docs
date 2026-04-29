---
title: "Ek 2: XOOPS'yi FTP aracılığıyla yükleme"
---
Bu ekte XOOPS 2.7.0'ın FTP veya SFTP kullanılarak uzak bir ana bilgisayara dağıtılması açıklanmaktadır. Herhangi bir kontrol paneli (cPanel, Plesk, DirectAdmin vb.) aynı temel adımları ortaya çıkaracaktır.

## 1. Veritabanını hazırlayın

Sunucunuzun kontrol paneli aracılığıyla:

1. XOOPS için yeni bir MySQL database oluşturun.
2. Güçlü bir parolaya sahip bir database kullanıcısı oluşturun.
3. Kullanıcıya yeni oluşturulan veritabanında tam ayrıcalıklar verin.
4. database adını, user adını, şifreyi ve ana bilgisayarı kaydedin; bunları XOOPS yükleyicisine gireceksiniz.

> **İpucu**
>
> Modern kontrol panelleri sizin için güçlü şifreler üretir. Uygulama şifreyi `xoops_data/data/secure.php`'de sakladığından, sık sık yazmanıza gerek yoktur; uzun, rastgele oluşturulmuş bir değer tercih edin.

## 2. Yönetici posta kutusu oluşturun

Site yönetimi bildirimlerini alacak bir e-posta posta kutusu oluşturun. XOOPS yükleyicisi, web yöneticisi hesabı kurulumu sırasında bu adresi sorar ve `FILTER_VALIDATE_EMAIL` ile doğrular.

## 3. Dosyaları yükleyin

XOOPS 2.7.0, üçüncü taraf bağımlılıkları `xoops_lib/vendor/`'ye önceden yüklenmiş olarak gelir (Composer paketleri, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF ve daha fazlası). Bu, `xoops_lib/`'yi 2.5.x'e göre önemli ölçüde daha büyük yapar; onlarca megabayt bekliyoruz.

**`xoops_lib/vendor/` içindeki dosyaları seçerek atlamayın.** Composer satıcı ağacındaki dosyaların atlanması, otomatik yüklemeyi bozar ve yükleme başarısız olur.

Yükleme yapısı (`public_html`'nin belge kökü olduğu varsayılarak):

1. `xoops_data/` ve `xoops_lib/` **içine değil** `public_html`'nin yanına yükleyin. Bunları web kökünün dışına yerleştirmek 2.7.0 için önerilen güvenlik duruşudur.   
```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← upload here
   └── xoops_lib/      ← upload here
   
```
![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. `htdocs/` dağıtım dizininin kalan içeriğini `public_html/`'ye yükleyin.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Barındırıcınız belge kökü dışındaki dizinlere izin vermiyorsa**
>
> `xoops_data/` ve `xoops_lib/` **inside** `public_html/`'yi yükleyin ve **bunları bariz olmayan adlarla yeniden adlandırın** (örneğin `xdata_8f3k2/` ve `xlib_7h2m1/`). Yükleyici XOOPS Veri Yolu ve XOOPS Kütüphane Yolu istediğinde, yeniden adlandırılmış yolları gireceksiniz.

## 4. Yazılabilir dizinleri yazılabilir hale getirin

FTP istemcisinin CHMOD iletişim kutusu (veya SSH) aracılığıyla, Bölüm 2'de listelenen dizinleri web sunucusu tarafından yazılabilir hale getirin. Çoğu paylaşılan ana bilgisayarda, dizinlerde `0775` ve `mainfile.php`'de `0664` yeterlidir. Ana makineniz PHP'yi FTP kullanıcısı dışında bir user altında çalıştırıyorsa, kurulum sırasında `0777` kabul edilebilir, ancak kurulum tamamlandıktan sonra izinleri sıkılaştırın.

## 5. Yükleyiciyi başlatın

Tarayıcınızı sitenin herkese açık URL sayfasına yönlendirin. Tüm dosyalar yerindeyse, XOOPS Kurulum Sihirbazı başlar ve bu kılavuzun geri kalanını [Bölüm 2](chapter-2-introduction.md)'den itibaren takip edebilirsiniz.