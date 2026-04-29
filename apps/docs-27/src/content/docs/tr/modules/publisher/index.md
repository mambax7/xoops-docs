---
title: "Publisher Modülü"
description: "XOOPS için Publisher haberleri ve blog modülüne ilişkin eksiksiz belgeler"
---
> XOOPS CMS için önde gelen haber ve blog yayınlama modülü.

---

## Genel Bakış

Publisher, SmartSection'dan en zengin özelliklere sahip blog ve haber çözümü haline gelen XOOPS için eksiksiz içerik yönetimi modülüdür. Tam editoryal iş akışı desteğiyle içerik oluşturmak, düzenlemek ve yayınlamak için kapsamlı araçlar sağlar.

**Gereksinimler:**
- XOOPS 2.5.10+
- PHP 7,1+ (PHP 8.x önerilir)

---

## 🌟 Temel Özellikler

### İçerik Yönetimi
- **Kategoriler ve Alt Kategoriler** - Hiyerarşik içerik organizasyonu
- **Zengin Metin Düzenleme** - Çoklu WYSIWYG düzenleyicileri desteklenir
- **Dosya Ekleri** - Makalelere dosya ekleyin
- **Resim Yönetimi** - Sayfa ve kategori resimleri
- **Dosya Sarma** - Dosyaları makale olarak sarma

### Yayınlama İş Akışı
- **Planlanmış Yayınlama** - Gelecekteki yayınlanma tarihlerini ayarlayın
- **Son Kullanma Tarihleri** - İçeriğin otomatik olarak sona ermesi
- **Denetleme** - Editoryal onay iş akışı
- **Taslak Yönetimi** - Devam eden çalışmayı kaydedin

### Ekran ve templates
- **Dört Temel template** - Çoklu ekran düzenleri
- **Özel templates** - Kendi tasarımlarınızı yaratın
- **SEO Optimizasyon** - Arama motoru dostu URLs
- **Duyarlı Tasarım** - Mobil kullanıma hazır çıktı

### user Etkileşimi
- **Derecelendirmeler** - Makale derecelendirme sistemi
- **Yorumlar** - Okuyucu tartışmaları
- **Sosyal Paylaşım** - Sosyal ağlarda paylaşın

### permissions
- **Gönderim Kontrolü** - Kimler makale gönderebilir?
- **Alan Düzeyinde permissions** - Form alanlarını gruba göre kontrol edin
- **Kategori İzinleri** - Kategori başına erişim kontrolü
- **Denetleme Hakları** - Genel denetleme ayarları

---

## 🗂️ Bölüm İçeriği

### Kullanım Kılavuzu
- Kurulum Kılavuzu
- Temel Yapılandırma
- Makale Oluşturma
- Kategorileri Yönetme
- İzinlerin Ayarlanması

### Geliştirici Kılavuzu
- Yayıncıyı Genişletme
- Özel templates Oluşturma
- API Referans
- hooks ve Etkinlikler

---

## 🚀 Hızlı Başlangıç

### 1. Kurulum
```bash
# Download from GitHub
git clone https://github.com/XoopsModules25x/publisher.git

# Copy to modules directory
cp -r publisher /path/to/xoops/htdocs/modules/
```
Daha sonra XOOPS Yönetici → modules → Yükle aracılığıyla yükleyin.

### 2. İlk Kategorinizi Oluşturun

1. **Yönetici → Publisher → Kategoriler**'e gidin
2. **Kategori Ekle**'yi tıklayın
3. Doldurun:
   - **İsim**: Haberler
   - **Açıklama**: En son haberler ve güncellemeler
   - **Resim**: Kategori resmini yükle
4. Kaydet

### 3. İlk Makalenizi Oluşturun

1. **Yönetici → Publisher → Makaleler**'e gidin
2. **Makale Ekle**'yi tıklayın
3. Doldurun:
   - **Başlık**: Sitemize Hoş Geldiniz
   - **Kategori**: Haberler
   - **İçerik**: Makale içeriğiniz
4. **Durum**'u ayarlayın: Yayınlandı
5. Kaydet

---

## ⚙️ Yapılandırma Seçenekleri

### Genel Ayarlar

| Ayar | Açıklama | Varsayılan |
|-----------|------------|------------|
| Editör | WYSIWYG düzenleyicinin kullanılması | XOOPS Varsayılan |
| Sayfa başına öğe | Sayfa başına gösterilen makaleler | 10 |
| İçerik kırıntısını göster | Gezinme izini görüntüle | Evet |
| Derecelendirmelere izin ver | Makale derecelendirmelerini etkinleştirin | Evet |
| Yorumlara izin ver | Makale yorumlarını etkinleştir | Evet |

### SEO Ayarlar

| Ayar | Açıklama | Varsayılan |
|-----------|------------|------------|
| SEO URLs | Dostu etkinleştirin URLs | Hayır |
| URL yeniden yazma | Apache mod_rewrite | Yok |
| Meta anahtar kelimeler | Anahtar kelimeleri otomatik oluştur | Evet |

### İzin Matrisi

| İzin | İsimsiz | Kayıtlı | Editör | Yönetici |
|------------|-----------|------------|-----------|-------|
| Makaleleri görüntüle | ✓ | ✓ | ✓ | ✓ |
| Makaleleri gönder | ✗ | ✓ | ✓ | ✓ |
| Kendi makalelerini düzenle | ✗ | ✓ | ✓ | ✓ |
| Tüm makaleleri düzenle | ✗ | ✗ | ✓ | ✓ |
| Makaleleri onayla | ✗ | ✗ | ✓ | ✓ |
| Kategorileri yönet | ✗ | ✗ | ✗ | ✓ |

---

## 📦 module Yapısı
```
modules/publisher/
├── admin/                  # Admin interface
│   ├── index.php
│   ├── category.php
│   ├── item.php
│   └── menu.php
├── class/                  # PHP classes
│   ├── Category.php
│   ├── CategoryHandler.php
│   ├── Item.php
│   ├── ItemHandler.php
│   └── Helper.php
├── include/                # Include files
│   ├── common.php
│   └── functions.php
├── templates/              # Smarty templates
│   ├── publisher_index.tpl
│   ├── publisher_item.tpl
│   └── publisher_category.tpl
├── language/               # Translations
│   └── english/
├── sql/                    # Database schema
│   └── mysql.sql
├── xoops_version.php       # Module info
└── index.php               # Module entry
```
---

## 🔄 Göç

### SmartSection'dan

Publisher yerleşik bir geçiş aracı içerir:

1. **Yönetici → Publisher → İçe Aktarma**'ya gidin
2. Kaynak olarak **SmartSection**'ı seçin
3. İçe aktarma seçeneklerini seçin:
   - Kategoriler
   - Makaleler
   - Yorumlar
4. **İçe Aktar**'a tıklayın

### Haber Modülünden

1. **Yönetici → Publisher → İçe Aktarma**'ya gidin
2. Kaynak olarak **Haberler**'i seçin
3. Harita kategorileri
4. **İçe Aktar**'a tıklayın

---

## 🔗 İlgili Belgeler

- module Geliştirme Kılavuzu
- Smarty template oluşturma
- XMF Çerçeve

---

## 📚 Kaynaklar

- [GitHub Deposu](https://github.com/XoopsModules25x/publisher)
- [Sorun Takibi](https://github.com/XoopsModules25x/publisher/issues)
- [Orijinal Eğitim](https://xoops.gitbook.io/publisher-tutorial/)

---

#xoops #Publisher #module #blog #haberler #cms #içerik yönetimi