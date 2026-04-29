---
title: "MVC XOOPS'deki desen"
description: "XOOPS modüllerinde Model-View-Controller mimarisi uygulaması"
---
<span class="version-badge version-xmf">XMF Gerekli</span> <span class="version-badge version-40x">4.0.x Yerel</span>

:::note[Bunun doğru model olup olmadığından emin değil misiniz?]
MVC ve daha basit modellerin ne zaman kullanılacağı konusunda rehberlik için [Bir Veri Erişim Modeli Seçme](../Choosing-Data-Access-Pattern.md) konusuna bakın.
:::

:::dikkat[Açıklama: XOOPS Mimari]
**Standard XOOPS 2.5.x** uses a **Page Controller** pattern (also called Transaction Script), not MVC. Eski modules, doğrudan içerme, global nesneler (`$xoopsUser`, `$xoopsDB`) ve işleyici tabanlı veri erişimi ile `index.php`'yi kullanır.

**XOOPS 2.5.x**'te MVC'yi kullanmak için, yönlendirme ve denetleyici desteği sağlayan **XMF Çerçevesine** ihtiyacınız vardır.

**XOOPS 4.0**, PSR-15 ara yazılımı ve uygun yönlendirmeyle MVC'yi yerel olarak destekleyecektir.

Ayrıca bakınız: [Güncel XOOPS Mimari](../../02-Core-Concepts/Architecture/XOOPS-Architecture.md)
:::

Model-View-Controller (MVC) modeli, XOOPS modüllerindeki endişeleri ayırmak için temel bir mimari modeldir. Bu model, bir uygulamayı birbirine bağlı üç bileşene böler.

## MVC Açıklama

### Modeli
**Model**, uygulamanızın verilerini ve iş mantığını temsil eder. Bu:
- Veri kalıcılığını yönetir
- İş kurallarını uygular
- Verileri doğrular
-database ile iletişim kurar
- user arayüzünden bağımsızdır

### Görüntüle
**Görünüm**, verilerin kullanıcıya sunulmasından sorumludur. Bu:
- HTML şablonlarını işler
- Model verilerini görüntüler
- user arayüzü sunumunu yönetir
- user eylemlerini denetleyiciye gönderir
- Minimal mantık içermeli

### Denetleyici
**Denetleyici**, Model ile Görünüm arasındaki user etkileşimlerini ve koordinatları yönetir. It:
- user isteklerini alır
- Giriş verilerini işler
- Model yöntemlerini çağırır
- Uygun görünümleri seçer
- Uygulama akışını yönetir

## XOOPS Uygulama

XOOPS'de, MVC modeli, template desteği sağlayan Smarty motoruyla birlikte işleyiciler ve templates kullanılarak uygulanır.

### Temel Model Yapısı
```php
<?php
class UserModel
{
    private $db;
    
    public function getUserById($id)
    {
        // Database query implementation
    }
    
    public function createUser($data)
    {
        // Create user implementation
    }
}
?>
```
### Denetleyici Uygulaması
```php
<?php
class UserController
{
    private $model;
    
    public function listAction()
    {
        $users = $this->model->getAllUsers();
        return ['users' => $users];
    }
}
?>
```
### Şablonu Görüntüle
```smarty
{foreach from=$users item=user}
    <div>{$user.username|escape}</div>
{/foreach}
```
## En İyi Uygulamalar

- Modellerde iş mantığını koruyun
- Sunumu Görünümlerde tut  
- routing/coordination'yi Denetleyicilerde tutun
- Kaygıları katmanlar arasında karıştırmayın
- Denetleyici seviyesindeki tüm girişleri doğrulayın

## İlgili Belgeler

Ayrıca bakınız:
- Gelişmiş veri erişimi için [Depo Deseni](../Patterns/Repository-Pattern.md)
- İş mantığı soyutlaması için [Servis Katmanı](../Patterns/Service-Layer.md)
- Proje yapısı için [Kod-Organizasyon](../Best-Practices/Code-Organization.md)
- MVC test stratejileri için [Test ediliyor](../Best-Practices/Testing.md)

---

Etiketler: #mvc #desenler #mimari #module geliştirme #tasarım-desenleri