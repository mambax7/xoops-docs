---
title: Hızlı Başlangıç
description: XOOPS 2.7'yi 5 dakikadan kısa sürede çalıştırın.
---
## Gereksinimler

| Bileşen | Asgari | Önerilen |
|---------------|----------------|---------------|
| PHP | 8.2 | 8.4+ |
| MySQL | 5.7 | 8.0+ |
| MariaDB | 10.4 | 10.11+ |
| Web sunucusu | Apache 2.4 / Nginx 1.20 | En son kararlı |

## İndir

En son sürümü [GitHub Releases](https://github.com/XOOPS/XoopsCore27/releases) adresinden indirin.
```bash
# Or clone directly
git clone https://github.com/XOOPS/XoopsCore27.git mysite
cd mysite
```
## Kurulum Adımları

1. **Dosyaları** web sunucunuzun belge köküne yükleyin (ör. `public_html/`).
2. **Bir MySQL database** ve bu veritabanında tam ayrıcalıklara sahip bir user oluşturun.
3. **Tarayıcınızı açın** ve alan adınıza gidin; XOOPS yükleyicisi otomatik olarak başlar.
4. **5 adımlı sihirbazı izleyin**; yolları yapılandırır, tablolar oluşturur ve yönetici hesabınızı ayarlar.
5. **İstendiğinde `install/` klasörünü silin**. Bu güvenlik açısından zorunludur.

## Kurulumu Doğrulayın

Kurulumdan sonra şu adresi ziyaret edin:

- **Ön sayfa:** `https://yourdomain.com/`
- **Yönetici paneli:** `https://yourdomain.com/xoops_data/` *(kurulum sırasında seçtiğiniz yol)*

## Sonraki Adımlar

- [Tam Kurulum Kılavuzu](./installation/) — sunucu yapılandırması, permissions, sorun giderme
- [module Rehberi](./module-guide/introduction/) — ilk modülünüzü oluşturun
- [theme Kılavuzu](./theme-guide/introduction/) — bir theme oluşturun veya özelleştirin