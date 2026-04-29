---
title: "XOOPS'deki Depo Modeli"
description: "Veri erişimi soyutlama katmanı uygulaması"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Bunun doğru model olup olmadığından emin değil misiniz?]
İşleyicileri, depoları, hizmetleri ve CQRS'yi karşılaştıran bir karar ağacı için bkz. [Bir Veri Erişim Modeli Seçme](../Choosing-Data-Access-Pattern.md).
:::

:::ipucu[Bugün ve Yarın Çalışıyor]
Depo modeli **hem XOOPS 2.5.x hem de XOOPS 4.0.x**'te çalışır. 2.5.x'te, soyutlamanın avantajlarından yararlanmak için mevcut `XoopsPersistableObjectHandler`'nizi bir Repository sınıfına sarın:

| Yaklaşım | XOOPS 2.5.x | XOOPS 4.0 |
|----------|----------------|------------|
| Doğrudan işleyici erişimi | `xoops_getModuleHandler()` | DI konteyneri aracılığıyla |
| Depo sarmalayıcı | ✅ Önerilen | ✅ Yerel desen |
| Modellerle test etme | ✅ Manuel DI ile | ✅ Konteyner otomatik kablolaması |

Modüllerinizi XOOPS 4.0 geçişine hazırlamak için **Repository modeliyle bugün başlayın**.
:::

Depo Modeli, database işlemlerini soyutlayan ve verilere erişim için temiz bir arayüz sağlayan bir veri erişim modelidir. İş mantığı ve veri eşleme katmanları arasında aracı görevi görür.

## Depo Konsepti

Depo Modeli şunları sağlar:
- database uygulama ayrıntılarının soyutlanması
- Birim testi için kolay alay etme
- Merkezi veri erişim mantığı
- İş mantığını etkilemeden veritabanını değiştirme esnekliği
- Uygulama genelinde yeniden kullanılabilir veri erişim mantığı

## Depolar Ne Zaman Kullanılmalı

**Depoları şu durumlarda kullanın:**
- Uygulama katmanları arasında veri aktarımı
- database uygulamasını değiştirme ihtiyacı
- Taklitlerle test edilebilir kod yazma
- Veri erişim kalıplarının soyutlanması

## Uygulama Modeli
```php
<?php
// Define repository interface
interface UserRepositoryInterface
{
    public function find($id);
    public function findAll($limit = null, $offset = 0);
    public function findBy(array $criteria);
    public function save($entity);
    public function update($id, $entity);
    public function delete($id);
}

// Implement repository
class UserRepository implements UserRepositoryInterface
{
    private $db;
    
    public function __construct($connection)
    {
        $this->db = $connection;
    }
    
    public function find($id)
    {
        // Implementation
    }
    
    public function save($entity)
    {
        // Implementation
    }
}
?>
```
## Hizmetlerde Kullanım
```php
<?php
class UserService
{
    private $userRepository;
    
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Check if user exists
        if ($this->userRepository->findByUsername($username)) {
            throw new \InvalidArgumentException('Username exists');
        }
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        return $this->userRepository->save($user);
    }
}
?>
```
## En İyi Uygulamalar

- Depo sözleşmelerini tanımlamak için arayüzleri kullanın
- Her depo bir varlık tipini yönetir
- İş mantığını depolarda değil hizmetlerde tutun
- Veri eşleme için varlık nesnelerini kullanın
- Geçersiz işlemler için uygun istisnalar atın

## İlgili Belgeler

Ayrıca bakınız:
- Denetleyici entegrasyonu için [MVC-Pattern](../Patterns/MVC-Pattern.md)
- Hizmet uygulaması için [Hizmet Katmanı](../Patterns/Service-Layer.md)
- Veri aktarım nesneleri için [DTO-Pattern](DTO-Pattern.md)
- Depo testi için [Test ediliyor](../Best-Practices/Testing.md)

---

Etiketler: #depo deseni #veri erişimi #tasarım desenleri #module geliştirme