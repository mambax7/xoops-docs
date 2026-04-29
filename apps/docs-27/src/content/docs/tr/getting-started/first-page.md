---
title: "İlk Sayfanızı Oluşturma"
description: "Biçimlendirme, medya yerleştirme ve yayınlama seçenekleri de dahil olmak üzere XOOPS'de içerik oluşturmaya ve yayınlamaya ilişkin adım adım kılavuz"
---
# XOOPS'de İlk Sayfanızı Oluşturma

XOOPS'de ilk içeriğinizi nasıl oluşturacağınızı, biçimlendireceğinizi ve yayınlayacağınızı öğrenin.

## XOOPS İçeriğini Anlamak

### Page/Post nedir?

XOOPS'de içerik modules aracılığıyla yönetilir. En yaygın içerik türleri şunlardır:

| Tür | Açıklama | Kullanım Örneği |
|---|---|---|
| **Sayfa** | Statik içerik | Hakkımızda, İletişim, Hizmetler |
| **Post/Article** | Zaman damgalı içerik | Haberler, Blog yazıları |
| **Kategori** | İçerik organizasyonu | Grupla ilgili içerik |
| **Yorum** | user geribildirimi | Ziyaretçi etkileşimine izin ver |

Bu kılavuz, XOOPS' varsayılan içerik modülünü kullanarak temel bir page/article oluşturmayı kapsar.

## İçerik Düzenleyiciye Erişim

### Yönetici Panelinden

1. Yönetici paneline giriş yapın: `http://your-domain.com/xoops/admin/`
2. **İçerik > Sayfalar**'a (veya içerik modülünüze) gidin
3. "Yeni Sayfa Ekle" veya "Yeni Gönderi"ye tıklayın

### Ön Uç (Etkinse)

XOOPS cihazınız ön uç içerik oluşturmaya izin verecek şekilde yapılandırılmışsa:

1. Kayıtlı user olarak oturum açın
2. Profilinize gidin
3. "İçerik Gönder" seçeneğini arayın
4. Aşağıdaki adımların aynısını izleyin

## İçerik Düzenleyici Arayüzü

İçerik düzenleyici şunları içerir:
```
┌─────────────────────────────────────┐
│ Content Editor                      │
├─────────────────────────────────────┤
│                                     │
│ Title: [________________]           │
│                                     │
│ Category: [Dropdown]                │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Enter your content here...      │ │
│ │                                 │ │
│ │ You can use HTML tags here      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta): [____________]  │
│                                     │
│ [Publish] [Save Draft] [Preview]   │
│                                     │
└─────────────────────────────────────┘
```
## Adım Adım Kılavuz: İlk Sayfanızı Oluşturma

### 1. Adım: İçerik Düzenleyiciye Erişim

1. Yönetici panelinde **İçerik > Sayfalar**'a tıklayın
2. **"Yeni Sayfa Ekle"** veya **"Oluştur"** seçeneğini tıklayın
3. İçerik düzenleyiciyi göreceksiniz

### Adım 2: Sayfa Başlığını Girin

"Başlık" alanına sayfa adınızı girin:
```
Title: Welcome to Our Website
```
Başlıklar için en iyi uygulamalar:
- Açık ve açıklayıcı
- Mümkünse anahtar kelimeleri ekleyin
- 50-60 karakter ideal
- ALL CAPS'den kaçının (okunması zor)
- Spesifik olun ("Sayfa 1" değil)

### 3. Adım: Kategoriyi Seçin

Bu içeriğin nerede düzenleneceğini seçin:
```
Category: [Dropdown ▼]
```
Seçenekler şunları içerebilir:
- Genel
- Haberler
- Blog
- Duyurular
- Hizmetler

Kategoriler mevcut değilse yöneticiden bunları oluşturmasını isteyin.

### 4. Adım: İçeriğinizi Yazın

İçerik düzenleyici alanına tıklayın ve metninizi yazın.

#### Temel Metin Biçimlendirmesi

Düzenleyici araç çubuğunu kullanın:

| Düğme | Eylem | Sonuç |
|---|---|---|
| **B** | Kalın | **Kalın metin** |
| *ben* | İtalik | *İtalik metin* |
| <u>U</u> | Altı çizili | <u>Altı çizili metin</u> |

#### HTML kullanarak

XOOPS, güvenli HTML etiketlerine izin verir. Yaygın örnekler:
```html
<!-- Paragraphs -->
<p>This is a paragraph.</p>

<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>

<!-- Lists -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Bold and Italic -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Line breaks -->
<br>

<!-- Horizontal rule -->
<hr>
```
#### Güvenli HTML Örnekler

**Önerilen etiketler:**
- Paragraflar: `<p>`, `<br>`
- Başlıklar: `<h1>` ila `<h6>`
- Metin: `<strong>`, `<em>`, `<u>`
- Listeler: `<ul>`, `<ol>`, `<li>`
- Bağlantılar: `<a href="">`
- Blok alıntılar: `<blockquote>`
- Tablolar: `<table>`, `<tr>`, `<td>`

**Bu etiketlerden kaçının** (güvenlik nedeniyle devre dışı bırakılabilir):
- Komut dosyaları: `<script>`
- Stiller: `<style>`
- Iframe'ler: `<iframe>` (yapılandırılmadıysa)
- Formlar: `<form>`, `<input>`

### Adım 5: Resim Ekle

#### Seçenek 1: Resim Ekle URL

Düzenleyiciyi kullanma:

1. **Resim Ekle** düğmesini tıklayın (resim simgesi)
2. Resmi girin URL: `https://example.com/image.jpg`
3. Alternatif metni girin: "Resmin açıklaması"
4. "Ekle"ye tıklayın

HTML eşdeğeri:
```html
<img src="https://example.com/image.jpg" alt="Description">
```
#### Seçenek 2: Resim Yükle

1. Önce resmi XOOPS'ye yükleyin:
   - **İçerik > Medya Yöneticisi**'ne gidin
   - Resminizi yükleyin
   - Resmi kopyalayın URL

2. İçerik düzenleyicide URL (yukarıdaki adımlar) kullanarak ekleyin

#### Resimle İlgili En İyi Uygulamalar

- Uygun dosya boyutlarını kullanın (görüntüleri optimize edin)
- Açıklayıcı dosya adları kullanın
- Her zaman alternatif metni dahil et (erişilebilirlik)
- Desteklenen formatlar: JPG, PNG, GIF, WebP
- Önerilen genişlik: İçerik için 600-800 piksel

### Adım 6: Medyayı Yerleştirin

#### YouTube'dan Video Yerleştirin
```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```
`VIDEO_ID`'yi YouTube video kimliğiyle değiştirin.

**YouTube video kimliğini bulmak için:**
1. Videoyu YouTube'da açın
2. URL: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Kimliği kopyalayın (`v=`'den sonraki karakterler)

#### Vimeo'dan Video Göm
```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```
### Adım 7: Meta Açıklama Ekle

"Açıklama" alanına kısa bir özet ekleyin:
```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```
**Meta açıklamayla ilgili en iyi uygulamalar:**
- 150-160 karakter
- Ana anahtar kelimeleri ekleyin
- İçeriği doğru bir şekilde özetlemeli
- Arama motoru sonuçlarında kullanılır
- İlgi çekici hale getirin (users bunu görür)

### Adım 8: Yayınlama Seçeneklerini Yapılandırın

#### Yayınlama Durumu

Yayın durumunu seçin:
```
Status: ☑ Published
```
Seçenekler:
- **Yayınlandı:** Herkese açık
- **Taslak:** Yalnızca yöneticiler görebilir
- **İncelenmeyi Bekliyor:** Onay bekleniyor
- **Arşivlendi:** Gizli ama saklanıyor

#### Görünürlük

Bu içeriği kimlerin görebileceğini ayarlayın:
```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```
#### Yayın Tarihi

İçeriğin ne zaman görünür olacağını ayarlayın:
```
Publish Date: [Date Picker] [Time]
```
Hemen yayınlamak için "Şimdi" olarak bırakın.

#### Yorumlara İzin Ver

Ziyaretçi yorumlarını etkinleştirin veya devre dışı bırakın:
```
Allow Comments: ☑ Yes
```
Etkinleştirilirse ziyaretçiler geri bildirim ekleyebilir.

### Adım 9: İçeriğinizi Kaydedin

Çoklu kaydetme seçenekleri:
```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```
- **Şimdi Yayınla:** Hemen görünür yap
- **Taslak olarak kaydet:** Şimdilik gizli kal
- **Program:** Gelecekte yayınla date/time
- **Önizleme:** Kaydetmeden önce nasıl göründüğüne bakın

Seçiminizi tıklayın:
```
Click [Publish Now]
```
### Adım 10: Sayfanızı Doğrulayın

Yayınladıktan sonra içeriğinizi doğrulayın:

1. Web sitenizin ana sayfasına gidin
2. İçerik alanınıza gidin
3. Yeni oluşturduğunuz sayfayı arayın
4. Görüntülemek için tıklayın
5. Kontrol edin:
   - [ ] İçerik doğru şekilde görüntüleniyor
   - [ ] Görüntüler görünür
   - [ ] Biçimlendirme iyi görünüyor
   - [ ] Bağlantılar çalışıyor
   - [ ] Başlık ve açıklama doğru

## Örnek: Sayfayı Tamamla

### Başlık
```
Getting Started with XOOPS
```
### İçerik
```html
<h2>Welcome to XOOPS</h2>

<p>XOOPS is a powerful and flexible open-source
content management system. It allows you to build
dynamic websites with minimal technical knowledge.</p>

<h3>Key Features</h3>

<ul>
  <li>Easy content management</li>
  <li>User registration and management</li>
  <li>Module system for extensibility</li>
  <li>Flexible theming system</li>
  <li>Built-in security features</li>
</ul>

<h3>Getting Started</h3>

<p>Here are the first steps to get your XOOPS site
running:</p>

<ol>
  <li>Configure basic settings</li>
  <li>Create your first page</li>
  <li>Set up user accounts</li>
  <li>Install additional modules</li>
  <li>Customize appearance</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://xoops.org/">xoops.org</a></p>
```
### Meta Açıklama
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```
## Gelişmiş İçerik Özellikleri

### WYSIWYG Düzenleyiciyi Kullanma

Zengin metin düzenleyici yüklüyse:
```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```
Metni HTML olmadan biçimlendirmek için düğmeleri tıklayın.

### Kod Blokları Ekleme

Kod örneklerini görüntüle:
```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```
### Tablo Oluşturma

Verileri tablolarda düzenleyin:
```html
<table border="1" cellpadding="5">
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Easy to customize</td>
  </tr>
  <tr>
    <td>Powerful</td>
    <td>Full-featured CMS</td>
  </tr>
</table>
```
### Satır İçi Alıntılar

Önemli metni vurgulayın:
```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```
## SEO İçerik İçin En İyi Uygulamalar

İçeriğinizi arama motorları için optimize edin:

### Başlık
- Ana anahtar kelimeyi ekleyin
- 50-60 karakter
- Sayfa başına benzersiz

### Meta Açıklama
- Anahtar kelimeyi doğal bir şekilde ekleyin
- 150-160 karakter
- İlgi çekici ve doğru

### İçerik
- Doğal bir şekilde yazın, anahtar kelime doldurmaktan kaçının
- Başlıkları (h2, h3) uygun şekilde kullanın
- Diğer sayfalara dahili bağlantılar ekleyin
- Tüm görsellerde alternatif metin kullanın
- Makaleler için 300'den fazla kelimeyi hedefleyin

### URL Yapı
- URLs'yı kısa ve açıklayıcı tutun
- Kelimeleri ayırmak için kısa çizgi kullanın
- Özel karakterlerden kaçının
- Örnek: `/about-our-company`

## İçeriğinizi Yönetme

### Mevcut Sayfayı Düzenle

1. **İçerik > Sayfalar**'a gidin
2. Listede sayfanızı bulun
3. **Düzenle**'yi veya sayfa başlığını tıklayın
4. Değişiklik yapın
5. **Güncelle**'ye tıklayın

### Sayfayı Sil

1. **İçerik > Sayfalar**'a gidin
2. Sayfanızı bulun
3. **Sil**'i tıklayın
4. Silme işlemini onaylayın

### Yayın Durumunu Değiştir

1. **İçerik > Sayfalar**'a gidin
2. Sayfayı bulun ve **Düzenle**'yi tıklayın
3. Açılır menüde durumu değiştirin
4. **Güncelle**'ye tıklayın

## İçerik Oluşturma Sorunlarını Giderme

### İçerik Görünmüyor

**Belirti:** Yayınlanan sayfa web sitesinde görünmüyor

**Çözüm:**
1. Yayın durumunu kontrol edin: "Yayınlandı" olmalıdır
2. Yayınlanma tarihini kontrol edin: Güncel veya geçmiş olmalıdır
3. Görünürlüğü kontrol edin: "Herkese Açık" olmalıdır
4. Önbelleği temizleyin: Yönetici > Araçlar > Önbelleği Temizle
5. İzinleri kontrol edin: user grubunun erişime sahip olması gerekir

### Biçimlendirme Çalışmıyor

**Belirti:** HTML etiketleri veya biçimlendirmesi metin olarak görünüyor

**Çözüm:**
1. module ayarlarında HTML'nin etkin olduğunu doğrulayın
2. Doğru HTML sözdizimini kullanın
3. Tüm etiketleri kapatın: `<p>Text</p>`
4. Yalnızca izin verilen etiketleri kullanın
5. HTML varlıklarını kullanın: `<` için `&lt;`, `&` için `&amp;`

### Resimler Görüntülenmiyor

**Belirti:** Görüntülerde kırık simge görünüyor

**Çözüm:**
1. URL görselinin doğru olduğunu doğrulayın
2. Resim dosyasının mevcut olup olmadığını kontrol edin
3. Resim üzerinde uygun izinleri doğrulayın
4. Bunun yerine resmi XOOPS adresine yüklemeyi deneyin
5. Harici engellemeyi kontrol edin (CORS gerekebilir)

### Karakter Kodlama Sorunları

**Belirti:** Özel karakterler anlamsız görünüyor

**Çözüm:**
1. Dosyayı UTF-8 kodlaması olarak kaydedin
2. Sayfa karakter kümesinin UTF-8 olduğundan emin olun
3. HTML başlığına ekleyin: `<meta charset="UTF-8">`
4. Word'den kopyalayıp yapıştırmaktan kaçının (düz metin kullanın)

## İçerik İş Akışı En İyi Uygulamaları

### Önerilen Süreç

1. **Önce Düzenleyici'ye yazın:** Yönetici içerik düzenleyicisini kullanın
2. **Yayınlamadan Önce Önizleme:** Önizleme düğmesini tıklayın
3. **Meta Veri Ekle:** Başlığı, açıklamayı ve etiketleri tamamlayın
4. **Önce Taslak Olarak Kaydet:** İşinizi kaybetmemek için taslak olarak kaydedin
5. **Son İnceleme:** Yayınlamadan önce tekrar okuyun
6. **Yayınla:** Hazır olduğunuzda Yayınla'yı tıklayın
7. **Doğrulayın:** Canlı siteden kontrol edin
8. **Gerekirse düzenleyin:** Düzeltmeleri hızla yapın

### Sürüm Kontrolü

Her zaman yedekleri saklayın:

1. **Büyük Değişikliklerden Önce:** Yeni sürüm veya yedek olarak kaydedin
2. **Eski İçeriği Arşivleyin:** Yayınlanmamış sürümleri saklayın
3. **Taslaklarınıza Tarih Verin:** Açık bir ad kullanın: "Page-Draft-2025-01-28"

## Birden Fazla Sayfa Yayınlama

Bir içerik stratejisi oluşturun:
```
Homepage
├── About Us
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```
Bu yapıyı takip edecek sayfalar oluşturun.

## Sonraki Adımlar

İlk sayfanızı oluşturduktan sonra:

1. user hesaplarını ayarlayın
2. Ek modülleri yükleyin
3. Yönetici özelliklerini keşfedin
4. Ayarları yapılandırın
5. Performans ayarlarıyla optimizasyon yapın

---

**Etiketler:** #içerik oluşturma #sayfalar #yayıncılık #editör

**İlgili Makaleler:**
- Yönetici Paneline Genel Bakış
- Kullanıcıları Yönetme
- Modüllerin Kurulumu
- ../Configuration/Basic-Configuration