---
title: "XOOPS'deki Hizmet Katmanı Modeli"
description: "İş mantığı soyutlaması ve bağımlılık ekleme"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::note[Bunun doğru model olup olmadığından emin değil misiniz?]
İşleyicileri, depoları, hizmetleri ve CQRS'yi karşılaştıran bir karar ağacı için bkz. [Bir Veri Erişim Modeli Seçme](../Choosing-Data-Access-Pattern.md).
:::

:::ipucu[Bugün ve Yarın Çalışıyor]
Hizmet Katmanı modeli **hem XOOPS 2.5.x hem de XOOPS 4.0.x**'te çalışır. Kavramlar evrenseldir; yalnızca söz dizimi farklıdır:

| Özellik | XOOPS 2.5.x | XOOPS 4.0 |
|-----------|------------|------------|
| PHP Versiyon | 7.4+ | 8.2+ |
| Yapıcı Enjeksiyonu | ✅ Manuel kablolama | ✅ Konteyner otomatik kablolaması |
| Yazılan Özellikler | `@var` docblock'lar | Yerel tür bildirimleri |
| Salt Okunur Özellikler | ❌ Mevcut değil | ✅ `readonly` anahtar kelime |

Aşağıdaki kod örneklerinde PHP 8.2+ sözdizimi kullanılmaktadır. 2.5.x için `readonly`'yi çıkarın ve geleneksel özellik bildirimlerini kullanın.
:::

Hizmet Katmanı Kalıbı, iş mantığını özel hizmet sınıflarında kapsülleyerek denetleyiciler ve veri erişim katmanları arasında net bir ayrım sağlar. Bu model kodun yeniden kullanılabilirliğini, test edilebilirliğini ve sürdürülebilirliğini destekler.

## Hizmet Katmanı Konsepti

### Amaç
Hizmet Katmanı:
- Etki alanı iş mantığını içerir
- Birden fazla depoyu koordine eder
- Karmaşık işlemleri yönetir
- İşlemleri yönetir
- Doğrulama ve yetkilendirme işlemlerini gerçekleştirir
- Kontrolörlere üst düzey işlemler sağlar

### Faydaları
- Birden fazla denetleyicide yeniden kullanılabilir iş mantığı
- İzole olarak test edilmesi kolaydır
- Merkezi iş kuralı uygulaması
- Endişelerin net bir şekilde ayrılması
- Basitleştirilmiş denetleyici kodu

## Bağımlılık Enjeksiyonu
```php
<?php
// Service with injected dependencies
class UserService
{
    private $userRepository;
    private $emailService;
    
    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }
    
    public function registerUser($username, $email, $password)
    {
        // Validate
        $this->validate($username, $email, $password);
        
        // Create user
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);
        
        // Save
        $userId = $this->userRepository->save($user);
        
        // Send welcome email
        $this->emailService->sendWelcome($email, $username);
        
        return $userId;
    }
    
    private function validate($username, $email, $password)
    {
        $errors = [];
        
        if (strlen($username) < 3) {
            $errors['username'] = 'Username too short';
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email';
        }
        
        if (strlen($password) < 6) {
            $errors['password'] = 'Password too short';
        }
        
        if (!empty($errors)) {
            throw new ValidationException('Invalid input', $errors);
        }
    }
}
?>
```
## Servis Konteyneri
```php
<?php
class ServiceContainer
{
    private $services = [];
    
    public function __construct($db)
    {
        // Register repositories
        $this->services['userRepository'] = new UserRepository($db);
        
        // Register services
        $this->services['userService'] = new UserService(
            $this->services['userRepository']
        );
    }
    
    public function get($name)
    {
        if (!isset($this->services[$name])) {
            throw new \InvalidArgumentException("Service not found: $name");
        }
        return $this->services[$name];
    }
}
?>
```
## Denetleyicilerde Kullanım
```php
<?php
class UserController
{
    private $userService;
    
    public function __construct(ServiceContainer $container)
    {
        $this->userService = $container->get('userService');
    }
    
    public function registerAction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return [];
        }
        
        try {
            $userId = $this->userService->registerUser(
                $_POST['username'],
                $_POST['email'],
                $_POST['password']
            );
            
            return [
                'success' => true,
                'userId' => $userId,
            ];
        } catch (ValidationException $e) {
            return [
                'success' => false,
                'errors' => $e->getErrors(),
            ];
        }
    }
}
?>
```
## En İyi Uygulamalar

- Her hizmet bir alan sorununu ele alır
- Hizmetler uygulamalara değil arayüzlere bağlıdır
- Bağımlılıklar için yapıcı enjeksiyonunu kullanın
- Hizmetler tek başına test edilebilir olmalıdır
- Etki alanına özgü istisnalar atın
- Hizmetler HTTP talep ayrıntılarına bağlı olmamalıdır
- Hizmetleri odaklı ve uyumlu tutun

## İlgili Belgeler

Ayrıca bakınız:
- Denetleyici entegrasyonu için [MVC-Pattern](../Patterns/MVC-Pattern.md)
- Veri erişimi için [Depo Deseni](../Patterns/Repository-Pattern.md)
- Veri aktarım nesneleri için [DTO-Pattern](DTO-Pattern.md)
- Servis testi için [Test Ediliyor](../Best-Practices/Testing.md)

---

Etiketler: #hizmet katmanı #iş mantığı #bağımlılık enjeksiyonu #tasarım desenleri